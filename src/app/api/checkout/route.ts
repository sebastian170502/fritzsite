import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { logError, isValidationError } from '@/lib/error-handling'

// Initialize Stripe only when needed to avoid build-time errors
function getStripe() {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not set')
    }

    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-11-17.clover'
    })
}

export async function POST(req: Request) {
    try {
        const stripe = getStripe()
        const { items } = await req.json()

        // Validation
        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'No items in cart' },
                { status: 400 }
            )
        }

        // Validate item structure
        for (const item of items) {
            if (!item.name || !item.price || !item.quantity) {
                return NextResponse.json(
                    { error: 'Invalid item format' },
                    { status: 400 }
                )
            }
            
            if (item.quantity < 1 || item.price < 0) {
                return NextResponse.json(
                    { error: 'Invalid item quantity or price' },
                    { status: 400 }
                )
            }
        }

        const lineItems = items.map((item: any) => ({
            price_data: {
                currency: 'ron',
                product_data: {
                    name: item.name,
                    images: item.imageUrl ? [item.imageUrl] : [],
                },
                unit_amount: Math.round(item.price * 100), // RON in cents
            },
            quantity: item.quantity,
        }))

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/shop`,
            metadata: {
                orderItems: JSON.stringify(items.map((item: any) => ({
                    id: item.id,
                    quantity: item.quantity
                })))
            }
        })

        return NextResponse.json({ url: session.url })
    } catch (error: any) {
        // Log error with context
        logError({
            error: error instanceof Error ? error : new Error(String(error)),
            context: {
                endpoint: '/api/checkout',
                method: 'POST',
            },
            severity: 'high',
        })

        // Return appropriate error response
        if (isValidationError(error)) {
            return NextResponse.json(
                { error: 'Invalid request data' },
                { status: 400 }
            )
        }

        if (error?.type === 'StripeInvalidRequestError') {
            return NextResponse.json(
                { error: 'Payment processing error. Please try again.' },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Error creating checkout session. Please try again.' },
            { status: 500 }
        )
    }
}
