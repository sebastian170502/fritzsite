
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from "@/lib/prisma";
import { safeJSONParse } from '@/lib/json-utils';

function getStripe() {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not set')
    }

    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-11-17.clover' as any // Use latest or matching version from package
    })
}

export async function POST(req: Request) {
    try {
        const stripe = getStripe()
        const body = await req.json()
        const { orderId, shippingAddress } = body

        if (!orderId || !shippingAddress) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Fetch Order
        const order = await prisma.customOrder.findUnique({
            where: { id: orderId }
        })

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        if (!order.price) {
            return NextResponse.json({ error: 'Order has no price set' }, { status: 400 })
        }

        // Parse JSON fields once for efficiency and safety
        const orderDetails = safeJSONParse(order.details, {})
        const orderImages = safeJSONParse(order.images, [])

        // Create Stripe Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: order.currency.toLowerCase(),
                    product_data: {
                        name: `Custom Order #${order.orderId}`,
                        description: `Custom commission (${orderDetails.orderType || 'custom'})`,
                        images: orderImages[0] ? [orderImages[0]] : [],
                    },
                    unit_amount: Math.round(Number(order.price) * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/custom/${order.orderId}?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/custom/${order.orderId}?canceled=true`,
            customer_email: order.email,
            metadata: {
                custom_order_id: order.id,
                custom_order_friendly_id: order.orderId,
                shipping_address_json: JSON.stringify(shippingAddress)
            }
        })

        // Save session ID for ref
        await prisma.customOrder.update({
            where: { id: order.id },
            data: { stripeSessionId: session.id }
        });

        return NextResponse.json({ url: session.url, sessionId: session.id })
    } catch (error: any) {
        console.error('Checkout error:', error)
        return NextResponse.json(
            { error: error?.message || 'Failed to create checkout session' },
            { status: 500 }
        )
    }
}
