import { prisma } from './prisma';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string;
    category: string;
    material: string;
    stock: number;
}

/**
 * Get product recommendations based on collaborative filtering
 * Recommends products frequently bought by customers who also bought the given product
 */
export async function getCollaborativeRecommendations(
    productId: string,
    limit: number = 4
): Promise<Product[]> {
    try {
        // Get orders that contain the current product
        const ordersWithProduct = await prisma.order.findMany({
            where: {
                items: {
                    contains: productId,
                },
            },
            select: {
                items: true,
            },
        });

        // Count frequency of other products bought together
        const productFrequency: Record<string, number> = {};

        ordersWithProduct.forEach((order: any) => {
            try {
                const items = JSON.parse(order.items as string);
                items.forEach((item: any) => {
                    if (item.id !== productId) {
                        productFrequency[item.id] = (productFrequency[item.id] || 0) + 1;
                    }
                });
            } catch (e) {
                // Skip invalid JSON
            }
        });

        // Sort by frequency and get top product IDs
        const recommendedIds = Object.entries(productFrequency)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([id]) => id);

        if (recommendedIds.length === 0) {
            // Fallback to category-based recommendations
            return getCategoryRecommendations(productId, limit);
        }

        // Fetch the recommended products
        const recommendations = await prisma.product.findMany({
            where: {
                id: { in: recommendedIds },
                stock: { gt: 0 },
            },
            take: limit,
        });

        return recommendations as Product[];
    } catch (error) {
        console.error('Error getting collaborative recommendations:', error);
        return [];
    }
}

/**
 * Get recommendations based on product category and material
 */
export async function getCategoryRecommendations(
    productId: string,
    limit: number = 4
): Promise<Product[]> {
    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { category: true, material: true },
        });

        if (!product) return [];

        const recommendations = await prisma.product.findMany({
            where: {
                id: { not: productId },
                stock: { gt: 0 },
                OR: [
                    { category: product.category },
                    { material: product.material },
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });

        return recommendations as Product[];
    } catch (error) {
        console.error('Error getting category recommendations:', error);
        return [];
    }
}

/**
 * Get trending/popular products based on recent orders
 */
export async function getTrendingProducts(limit: number = 4): Promise<Product[]> {
    try {
        // Get orders from the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentOrders = await prisma.order.findMany({
            where: {
                createdAt: { gte: thirtyDaysAgo },
            },
            select: {
                items: true,
            },
        });

        // Count product frequency
        const productFrequency: Record<string, number> = {};

        recentOrders.forEach((order: any) => {
            try {
                const items = JSON.parse(order.items as string);
                items.forEach((item: any) => {
                    productFrequency[item.id] = (productFrequency[item.id] || 0) + item.quantity;
                });
            } catch (e) {
                // Skip invalid JSON
            }
        });

        // Get top trending product IDs
        const trendingIds = Object.entries(productFrequency)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([id]) => id);

        if (trendingIds.length === 0) {
            // Fallback to newest products
            return prisma.product.findMany({
                where: { stock: { gt: 0 } },
                orderBy: { createdAt: 'desc' },
                take: limit,
            }) as Promise<Product[]>;
        }

        const trending = await prisma.product.findMany({
            where: {
                id: { in: trendingIds },
                stock: { gt: 0 },
            },
        });

        return trending as Product[];
    } catch (error) {
        console.error('Error getting trending products:', error);
        return [];
    }
}

/**
 * Get personalized recommendations for a customer based on their order history
 */
export async function getPersonalizedRecommendations(
    customerEmail: string,
    limit: number = 4
): Promise<Product[]> {
    try {
        // Get customer's order history
        const customerOrders = await prisma.order.findMany({
            where: { customerEmail },
            select: { items: true },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });

        // Extract categories and materials from purchased items
        const purchasedProductIds: string[] = [];
        const categoryFrequency: Record<string, number> = {};
        const materialFrequency: Record<string, number> = {};

        for (const order of customerOrders) {
            try {
                const items = JSON.parse(order.items as string);
                for (const item of items) {
                    purchasedProductIds.push(item.id);

                    // Get product details to extract category/material
                    const product = await prisma.product.findUnique({
                        where: { id: item.id },
                        select: { category: true, material: true },
                    });

                    if (product) {
                        categoryFrequency[product.category] = (categoryFrequency[product.category] || 0) + 1;
                        materialFrequency[product.material] = (materialFrequency[product.material] || 0) + 1;
                    }
                }
            } catch (e) {
                // Skip invalid JSON
            }
        }

        // Get most preferred category and material
        const preferredCategory = Object.entries(categoryFrequency)
            .sort(([, a], [, b]) => b - a)[0]?.[0];
        const preferredMaterial = Object.entries(materialFrequency)
            .sort(([, a], [, b]) => b - a)[0]?.[0];

        // Find products matching preferences that haven't been purchased
        const recommendations = await prisma.product.findMany({
            where: {
                id: { notIn: purchasedProductIds },
                stock: { gt: 0 },
                OR: [
                    { category: preferredCategory },
                    { material: preferredMaterial },
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });

        return recommendations as Product[];
    } catch (error) {
        console.error('Error getting personalized recommendations:', error);
        return [];
    }
}

/**
 * Get "Frequently Bought Together" recommendations
 */
export async function getFrequentlyBoughtTogether(
    productId: string,
    limit: number = 3
): Promise<Product[]> {
    // This is similar to collaborative filtering but focuses on products
    // bought in the same order
    return getCollaborativeRecommendations(productId, limit);
}
