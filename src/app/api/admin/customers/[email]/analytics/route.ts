import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ email: string }> }
) {
    try {
        const { email } = await params;
        const decodedEmail = decodeURIComponent(email);

        // Fetch all orders for this customer
        const orders = await prisma.order.findMany({
            where: {
                customerEmail: decodedEmail,
            },
            select: {
                id: true,
                total: true,
                items: true,
                createdAt: true,
                status: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        if (orders.length === 0) {
            return NextResponse.json({
                error: 'No orders found for this customer',
            }, { status: 404 });
        }

        // Calculate metrics
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum: number, order: any) => sum + Number(order.total), 0);
        const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
        const lifetimeValue = totalSpent;

        const firstOrder = orders[0];
        const lastOrder = orders[orders.length - 1];
        const daysSinceLastOrder = Math.floor(
            (new Date().getTime() - lastOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Calculate RFM scores
        // Recency: 5 = ordered recently, 1 = long time ago
        let recencyScore = 5;
        if (daysSinceLastOrder > 180) recencyScore = 1;
        else if (daysSinceLastOrder > 90) recencyScore = 2;
        else if (daysSinceLastOrder > 60) recencyScore = 3;
        else if (daysSinceLastOrder > 30) recencyScore = 4;

        // Frequency: based on number of orders
        let frequencyScore = 1;
        if (totalOrders >= 20) frequencyScore = 5;
        else if (totalOrders >= 10) frequencyScore = 4;
        else if (totalOrders >= 5) frequencyScore = 3;
        else if (totalOrders >= 2) frequencyScore = 2;

        // Monetary: based on total spent
        let monetaryScore = 1;
        if (totalSpent >= 1000) monetaryScore = 5;
        else if (totalSpent >= 500) monetaryScore = 4;
        else if (totalSpent >= 250) monetaryScore = 3;
        else if (totalSpent >= 100) monetaryScore = 2;

        const rfmScore = recencyScore + frequencyScore + monetaryScore;

        // Determine segment
        let segment = 'New';
        if (rfmScore >= 13) segment = 'VIP';
        else if (rfmScore >= 10) segment = 'Loyal';
        else if (rfmScore >= 7) segment = 'Regular';
        else if (daysSinceLastOrder > 90 && totalOrders > 1) segment = 'At Risk';

        // Analyze category preferences
        const categoryStats: Record<string, { count: number; totalSpent: number }> = {};

        orders.forEach((order: any) => {
            try {
                const items = JSON.parse(order.items as string);
                items.forEach((item: any) => {
                    const category = item.category || 'Uncategorized';
                    if (!categoryStats[category]) {
                        categoryStats[category] = { count: 0, totalSpent: 0 };
                    }
                    categoryStats[category].count += 1;
                    categoryStats[category].totalSpent += Number(item.price) * item.quantity;
                });
            } catch (e) {
                // Skip invalid JSON
            }
        });

        const categoryPreferences = Object.entries(categoryStats)
            .map(([category, stats]) => ({
                category,
                count: stats.count,
                totalSpent: Math.round(stats.totalSpent * 100) / 100,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Format order history for timeline
        const orderHistory = orders.map((order: any) => {
            let itemCount = 0;
            try {
                const items = JSON.parse(order.items as string);
                itemCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
            } catch (e) {
                // Skip invalid JSON
            }

            return {
                date: order.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                total: Math.round(Number(order.total) * 100) / 100,
                itemCount,
            };
        });

        // Get customer info from first order
        let customerInfo = { email: decodedEmail, firstName: '', lastName: '' };
        try {
            const firstOrderData = JSON.parse(firstOrder.items as string);
            if (firstOrderData[0]?.customerName) {
                const [firstName, ...lastNameParts] = firstOrderData[0].customerName.split(' ');
                customerInfo = {
                    email: decodedEmail,
                    firstName: firstName || '',
                    lastName: lastNameParts.join(' ') || '',
                };
            }
        } catch (e) {
            // Use email only
        }

        return NextResponse.json({
            customer: customerInfo,
            metrics: {
                totalOrders,
                totalSpent: Math.round(totalSpent * 100) / 100,
                averageOrderValue: Math.round(averageOrderValue * 100) / 100,
                lifetimeValue: Math.round(lifetimeValue * 100) / 100,
                firstOrderDate: firstOrder.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                lastOrderDate: lastOrder.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                daysSinceLastOrder,
            },
            rfm: {
                recency: recencyScore,
                frequency: frequencyScore,
                monetary: monetaryScore,
                score: rfmScore,
                segment,
            },
            categoryPreferences,
            orderHistory,
        });
    } catch (error) {
        console.error('Error fetching customer analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch customer analytics' },
            { status: 500 }
        );
    }
}
