import { NextRequest, NextResponse } from 'next/server';
import {
    getCollaborativeRecommendations,
    getCategoryRecommendations,
    getTrendingProducts,
    getPersonalizedRecommendations,
} from '@/lib/recommendations';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const productId = searchParams.get('productId');
        const type = searchParams.get('type') || 'collaborative';
        const customerEmail = searchParams.get('customerEmail');
        const limit = parseInt(searchParams.get('limit') || '4');

        let recommendations;

        switch (type) {
            case 'collaborative':
                if (!productId) {
                    return NextResponse.json(
                        { error: 'productId is required for collaborative recommendations' },
                        { status: 400 }
                    );
                }
                recommendations = await getCollaborativeRecommendations(productId, limit);
                break;

            case 'category':
                if (!productId) {
                    return NextResponse.json(
                        { error: 'productId is required for category recommendations' },
                        { status: 400 }
                    );
                }
                recommendations = await getCategoryRecommendations(productId, limit);
                break;

            case 'trending':
                recommendations = await getTrendingProducts(limit);
                break;

            case 'personalized':
                if (!customerEmail) {
                    return NextResponse.json(
                        { error: 'customerEmail is required for personalized recommendations' },
                        { status: 400 }
                    );
                }
                recommendations = await getPersonalizedRecommendations(customerEmail, limit);
                break;

            default:
                return NextResponse.json(
                    { error: 'Invalid recommendation type' },
                    { status: 400 }
                );
        }

        return NextResponse.json({
            recommendations,
            type,
            count: recommendations.length,
        });
    } catch (error) {
        console.error('Recommendations API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch recommendations' },
            { status: 500 }
        );
    }
}
