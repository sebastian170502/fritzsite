import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { trackCustomOrder } from '@/lib/analytics'

/**
 * Webhook handler for Stripe checkout completion
 * This endpoint is called by Stripe when a payment is successful
 */
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { session_id, customer_email, customer_name, items, total, shipping_address } = body

        // Verify webhook (in production, verify Stripe signature)
        // For now, we'll accept any request with valid data

        if (!session_id || !customer_email || !items) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Generate order ID
        const orderId = `ORD-${Date.now()}`

        // Store order in database (future feature)
        // await prisma.order.create({ ... })

        // Send order confirmation email
        const emailResult = await sendOrderConfirmationEmail({
            orderId,
            customerName: customer_name || 'Valued Customer',
            customerEmail: customer_email,
            items,
            total,
            shippingAddress: shipping_address
        })

        if (!emailResult.success) {
            console.error('Failed to send order confirmation:', emailResult.error)
        }

        return NextResponse.json({
            success: true,
            orderId,
            emailSent: emailResult.success
        })
    } catch (error) {
        console.error('Order confirmation error:', error)
        return NextResponse.json(
            { error: 'Failed to process order confirmation' },
            { status: 500 }
        )
    }
}
