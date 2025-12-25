import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

// Initialize Stripe only when needed
function getStripe() {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not set')
    }

    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-11-17.clover'
    })
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
    try {
        const stripe = getStripe()
        const body = await req.text()
        const signature = (await headers()).get('stripe-signature')

        if (!signature) {
            return NextResponse.json(
                { error: 'No signature' },
                { status: 400 }
            )
        }

        let event: Stripe.Event

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
        } catch (err) {
            console.error('Webhook signature verification failed:', err)
            return NextResponse.json(
                { error: 'Webhook signature verification failed' },
                { status: 400 }
            )
        }

        // Handle the checkout.session.completed event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session

            // Create order in database
            if (session.metadata) {
                try {
                    const items = JSON.parse(session.metadata.orderItems || '[]');
                    const shippingAddress = JSON.parse(session.metadata.shippingAddress || '{}');

                    // Calculate totals
                    const subtotal = items.reduce((sum: number, item: any) =>
                        sum + (item.price * item.quantity), 0
                    );
                    const shipping = 0; // Free shipping for now
                    const tax = 0; // Tax calculation can be added later
                    const total = subtotal + shipping + tax;

                    // Generate order number
                    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

                    // Create order
                    const order = await prisma.order.create({
                        data: {
                            orderNumber,
                            customerEmail: session.metadata.customerEmail || session.customer_email || '',
                            customerName: session.metadata.customerName || '',
                            customerPhone: session.metadata.customerPhone,
                            shippingAddress: JSON.stringify(shippingAddress),
                            items: JSON.stringify(items),
                            subtotal,
                            shipping,
                            tax,
                            total,
                            status: 'processing',
                            paymentStatus: 'paid',
                            paymentMethod: 'stripe',
                            stripeSessionId: session.id,
                        },
                    });

                    console.log(`Order created: ${order.orderNumber}`);

                    // Send order confirmation email
                    try {
                        await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders/confirm`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                orderId: order.orderNumber,
                                customerName: order.customerName,
                                customerEmail: order.customerEmail,
                                items: items,
                                total: total,
                                shipping_address: shippingAddress,
                            }),
                        });
                        console.log(`Order confirmation email sent for: ${order.orderNumber}`);
                    } catch (emailError) {
                        console.error('Error sending order confirmation email:', emailError);
                    }

                    // Decrement stock for purchased items
                    for (const item of items) {
                        await prisma.product.update({
                            where: { id: item.id },
                            data: {
                                stock: {
                                    decrement: item.quantity
                                }
                            }
                        });
                    }

                    console.log(`Stock updated for order: ${order.orderNumber}`);
                } catch (error) {
                    console.error('Error processing order:', error);
                }
            }
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('Webhook error:', error)
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        )
    }
}
