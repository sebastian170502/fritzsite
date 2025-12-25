import { NextResponse } from 'next/server'
import { sendReviewRequestEmail } from '@/lib/email'

/**
 * API endpoint to send review requests
 * This would be called by a cron job or admin action after delivery
 */
export async function POST(req: Request) {
    try {
        const { orderId, customerName, customerEmail, items } = await req.json()

        // Validate required fields
        if (!orderId || !customerEmail || !items || !customerName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Send review request
        const result = await sendReviewRequestEmail({
            orderId,
            customerName,
            customerEmail,
            items
        })

        if (!result.success) {
            return NextResponse.json(
                { error: 'Failed to send review request' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Review request sent successfully'
        })
    } catch (error) {
        console.error('Review request error:', error)
        return NextResponse.json(
            { error: 'Failed to send review request' },
            { status: 500 }
        )
    }
}
