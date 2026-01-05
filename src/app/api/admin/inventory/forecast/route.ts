import { NextRequest, NextResponse } from 'next/server';
import { calculateInventoryForecast, getInventoryForecasts, getInventoryHealthSummary } from '@/lib/inventory-forecasting';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const productId = searchParams.get('productId');
        const riskLevels = searchParams.get('riskLevels');
        const limit = searchParams.get('limit');
        const summary = searchParams.get('summary');

        // Return summary
        if (summary === 'true') {
            const summaryData = await getInventoryHealthSummary();
            return NextResponse.json(summaryData);
        }

        // Return single product forecast
        if (productId) {
            const forecast = await calculateInventoryForecast(productId);
            if (!forecast) {
                return NextResponse.json(
                    { error: 'Product not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json(forecast);
        }

        // Return filtered forecasts
        const riskFilter = riskLevels
            ? riskLevels.split(',') as ('low' | 'medium' | 'high' | 'critical')[]
            : undefined;

        const limitNum = limit ? parseInt(limit, 10) : undefined;

        const forecasts = await getInventoryForecasts(riskFilter, limitNum);

        return NextResponse.json({
            forecasts,
            count: forecasts.length,
        });
    } catch (error) {
        console.error('Error in forecast API:', error);
        return NextResponse.json(
            { error: 'Failed to generate forecasts' },
            { status: 500 }
        );
    }
}
