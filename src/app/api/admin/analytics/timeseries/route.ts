import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const daysParam = parseInt(searchParams.get('days') || '30');

        // Validate days parameter
        if (isNaN(daysParam) || daysParam < 1 || daysParam > 365) {
            return NextResponse.json(
                { error: 'Invalid days parameter. Must be between 1 and 365.' },
                { status: 400 }
            );
        }

        const days = daysParam;

        // Calculate start date
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Fetch orders within the date range
        const orders = await prisma.order.findMany({
            where: {
                createdAt: { gte: startDate },
            },
            select: {
                id: true,
                total: true,
                items: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        // Group data by date
        const dataByDate: Record<string, { revenue: number; orders: number; products: number }> = {};

        // Initialize all dates in the range
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (days - i - 1));
            const dateStr = date.toISOString().split('T')[0];
            dataByDate[dateStr] = { revenue: 0, orders: 0, products: 0 };
        }

        // Aggregate order data
        orders.forEach((order: any) => {
            const dateStr = order.createdAt.toISOString().split('T')[0];

            if (dataByDate[dateStr]) {
                dataByDate[dateStr].revenue += Number(order.total);
                dataByDate[dateStr].orders += 1;

                // Count products
                try {
                    const items = JSON.parse(order.items as string);
                    const productCount = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
                    dataByDate[dateStr].products += productCount;
                } catch (e) {
                    // Skip invalid JSON
                }
            }
        });

        // Convert to array and format
        const data = Object.entries(dataByDate).map(([date, values]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            revenue: Math.round(values.revenue * 100) / 100,
            orders: values.orders,
            products: values.products,
        }));

        return NextResponse.json({
            data,
            period: days,
            summary: {
                totalRevenue: data.reduce((sum, d) => sum + d.revenue, 0),
                totalOrders: data.reduce((sum, d) => sum + d.orders, 0),
                totalProducts: data.reduce((sum, d) => sum + d.products, 0),
                avgDailyRevenue: days > 0 ? data.reduce((sum, d) => sum + d.revenue, 0) / days : 0,
                avgDailyOrders: days > 0 ? data.reduce((sum, d) => sum + d.orders, 0) / days : 0,
            },
        });
    } catch (error) {
        console.error('Error fetching time-series analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics data' },
            { status: 500 }
        );
    }
}
