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

            // Decrement stock for purchased items
            if (session.metadata?.orderItems) {
                try {
                    const items = JSON.parse(session.metadata.orderItems)

                    for (const item of items) {
                        await prisma.product.update({
                            where: { id: item.id },
                            data: {
                                stock: {
                                    decrement: item.quantity
                                }
                            }
                        })
                    }

                    console.log(`Stock updated for order: ${session.id}`)
                } catch (error) {
                    console.error('Error updating stock:', error)
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
