
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from "@/lib/prisma"
import { sendCustomOrderEmail, sendCustomOrderPaidEmail } from '@/lib/email' // Reuse or create specialized email

function getStripe() {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not set')
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-11-17.clover' as any
    })
}

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get('stripe-signature') as string
    const stripe = getStripe()

    let event: Stripe.Event

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
             throw new Error("STRIPE_WEBHOOK_SECRET is missing");
        }
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (error: any) {
        console.error('Webhook signature verification failed:', error.message)
        return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Handle Custom Orders
        if (session.metadata?.custom_order_id) {
            await handleCustomOrderPayment(session)
        }
    }

    return NextResponse.json({ received: true })
}

async function handleCustomOrderPayment(session: Stripe.Checkout.Session) {
    const orderId = session.metadata?.custom_order_id
    const shippingAddressJson = session.metadata?.shipping_address_json

    if (!orderId) return

    try {
        console.log(`Processing custom order payment for ${orderId}`)

        await prisma.customOrder.update({
            where: { id: orderId },
            data: {
                status: 'paid',
                shippingAddress: shippingAddressJson || JSON.stringify((session as any).shipping_details || {}),
                stripeSessionId: session.id,
                // You might want to unset the Quote price lock or keep it for record
            }
        })
        
        // Send email to admin about payment
        const amount = String((session.amount_total || 0) / 100) + ' ' + (session.currency?.toUpperCase() || 'RON');
        const itemsDesc = `Custom Order #${orderId}`; // Can be more detailed if metadata has it
        
        await sendCustomOrderPaidEmail(orderId, session.customer_details?.email || session.customer_email || "", amount, itemsDesc);

        console.log(`Custom Order ${orderId} marked as PAID.`)
        
    } catch (error) {
        console.error('Failed to update custom order:', error)
    }
}
