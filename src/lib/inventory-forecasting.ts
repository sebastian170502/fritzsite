import { prisma } from './prisma';

interface ForecastResult {
    productId: string;
    productName: string;
    currentStock: number;
    averageDailySales: number;
    daysUntilStockout: number;
    recommendedReorderPoint: number;
    suggestedOrderQuantity: number;
    trend: 'increasing' | 'stable' | 'decreasing';
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Calculate sales velocity and forecast stock needs
 */
export async function calculateInventoryForecast(
    productId: string,
    daysToAnalyze: number = 30
): Promise<ForecastResult | null> {
    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: {
                id: true,
                name: true,
                stock: true,
            },
        });

        if (!product) return null;

        // Get orders from the analysis period
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysToAnalyze);

        const orders = await prisma.order.findMany({
            where: {
                createdAt: { gte: startDate },
            },
            select: {
                items: true,
                createdAt: true,
            },
        });

        // Calculate total quantity sold
        let totalSold = 0;
        const dailySales: Record<string, number> = {};

        orders.forEach((order: any) => {
            try {
                const items = JSON.parse(order.items as string);
                const orderDate = order.createdAt.toISOString().split('T')[0];

                items.forEach((item: any) => {
                    if (item.id === productId) {
                        totalSold += item.quantity;
                        dailySales[orderDate] = (dailySales[orderDate] || 0) + item.quantity;
                    }
                });
            } catch (e) {
                // Skip invalid JSON
            }
        });

        // Calculate average daily sales
        const averageDailySales = totalSold / daysToAnalyze;

        // Calculate days until stockout
        // Handle edge case: if no sales or zero stock
        let daysUntilStockout: number;
        if (product.stock === 0) {
            daysUntilStockout = 0;
        } else if (averageDailySales === 0 || !isFinite(averageDailySales)) {
            daysUntilStockout = 999; // Use large number instead of Infinity for calculations
        } else {
            daysUntilStockout = Math.floor(product.stock / averageDailySales);
        }

        // Determine trend (compare first half vs second half)
        const midpoint = daysToAnalyze / 2;
        const midDate = new Date();
        midDate.setDate(midDate.getDate() - midpoint);
        const midDateString = midDate.toISOString().split('T')[0];

        let firstHalfSales = 0;
        let secondHalfSales = 0;

        Object.entries(dailySales).forEach(([date, quantity]) => {
            if (date < midDateString) {
                firstHalfSales += quantity;
            } else {
                secondHalfSales += quantity;
            }
        });

        let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';
        const changePercent = firstHalfSales > 0
            ? ((secondHalfSales - firstHalfSales) / firstHalfSales) * 100
            : 0;

        if (changePercent > 20) trend = 'increasing';
        else if (changePercent < -20) trend = 'decreasing';

        // Calculate recommended reorder point (when to order more)
        // Typically set to cover lead time + safety stock
        const leadTimeDays = 7; // Assume 7 days lead time
        const safetyStockDays = 7; // 7 days safety buffer
        const recommendedReorderPoint = Math.ceil(
            averageDailySales * (leadTimeDays + safetyStockDays)
        );

        // Suggested order quantity (Economic Order Quantity simplified)
        // Order enough to last 30-60 days depending on trend
        const orderDays = trend === 'increasing' ? 60 : 30;
        const suggestedOrderQuantity = Math.ceil(averageDailySales * orderDays);

        // Determine risk level
        let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
        if (daysUntilStockout <= 3) riskLevel = 'critical';
        else if (daysUntilStockout <= 7) riskLevel = 'high';
        else if (daysUntilStockout <= 14) riskLevel = 'medium';

        return {
            productId: product.id,
            productName: product.name,
            currentStock: product.stock,
            averageDailySales: Math.round(averageDailySales * 100) / 100,
            daysUntilStockout,
            recommendedReorderPoint,
            suggestedOrderQuantity,
            trend,
            riskLevel,
        };
    } catch (error) {
        console.error('Error calculating inventory forecast:', error);
        return null;
    }
}

/**
 * Get forecast for all products with low stock or high risk
 */
export async function getInventoryForecasts(
    riskLevels?: ('low' | 'medium' | 'high' | 'critical')[],
    limit?: number
): Promise<ForecastResult[]> {
    try {
        const products = await prisma.product.findMany({
            where: {
                stock: { lte: 50 }, // Only check products with 50 or fewer items
            },
            select: {
                id: true,
            },
        });

        const forecasts: ForecastResult[] = [];

        for (const product of products) {
            const forecast = await calculateInventoryForecast(product.id);
            if (forecast) {
                if (!riskLevels || riskLevels.includes(forecast.riskLevel)) {
                    forecasts.push(forecast);
                }
            }
        }

        // Sort by risk level (critical first) then by days until stockout
        const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        forecasts.sort((a, b) => {
            const riskDiff = riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
            if (riskDiff !== 0) return riskDiff;
            return a.daysUntilStockout - b.daysUntilStockout;
        });

        return limit ? forecasts.slice(0, limit) : forecasts;
    } catch (error) {
        console.error('Error getting inventory forecasts:', error);
        return [];
    }
}

/**
 * Get quick inventory health summary
 */
export async function getInventoryHealthSummary() {
    try {
        const forecasts = await getInventoryForecasts();

        const summary = {
            total: forecasts.length,
            critical: forecasts.filter(f => f.riskLevel === 'critical').length,
            high: forecasts.filter(f => f.riskLevel === 'high').length,
            medium: forecasts.filter(f => f.riskLevel === 'medium').length,
            low: forecasts.filter(f => f.riskLevel === 'low').length,
            needsReorder: forecasts.filter(f =>
                f.currentStock <= f.recommendedReorderPoint
            ).length,
            averageDaysToStockout: forecasts.length > 0
                ? Math.round(
                    forecasts
                        .filter(f => f.daysUntilStockout < 365) // Exclude products with very high/no risk
                        .reduce((sum, f) => sum + f.daysUntilStockout, 0) /
                    Math.max(1, forecasts.filter(f => f.daysUntilStockout < 365).length)
                )
                : 0,
        };

        return summary;
    } catch (error) {
        console.error('Error getting inventory health summary:', error);
        return null;
    }
}
