import { NextResponse } from 'next/server'

// In a production environment, these would come from analytics/database
// For now, we'll return popular search terms based on common categories
const POPULAR_SEARCHES = [
    'knife',
    'axe',
    'damascus',
    'steel',
    'forge',
    'carbon steel',
    'hand forged',
    'blacksmith',
]

export async function GET() {
    try {
        return NextResponse.json({
            popular: POPULAR_SEARCHES,
        })
    } catch (error) {
        console.error('Popular searches error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch popular searches' },
            { status: 500 }
        )
    }
}
