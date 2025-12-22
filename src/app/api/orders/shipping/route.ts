import { NextResponse } from 'next/server'
import { sendShippingNotification } from '@/lib/email'

/**
 * API endpoint to send shipping notifications
 * This would be called by admin when marking an order as shipped
 */
export async function POST(req: Request) {
    try {
        const { orderId, customerName, customerEmail, trackingNumber, estimatedDelivery, items } = await req.json()

        // Validate required fields
        if (!orderId || !customerEmail || !items || !customerName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Send shipping notification
        const result = await sendShippingNotification({
            orderId,
            customerName,
            customerEmail,
            trackingNumber,
            estimatedDelivery,
            items
        })

        if (!result.success) {
            return NextResponse.json(
                { error: 'Failed to send shipping notification' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Shipping notification sent successfully'
        })
    } catch (error) {
        console.error('Shipping notification error:', error)
        return NextResponse.json(
            { error: 'Failed to send shipping notification' },
            { status: 500 }
        )
    }
}
