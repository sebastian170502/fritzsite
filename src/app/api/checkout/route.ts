import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { logError, isValidationError } from '@/lib/error-handling'
import { handleApiError, ValidationError } from '@/lib/api-errors'
import { checkoutFormSchema } from '@/lib/validation'
import { DEFAULTS } from '@/lib/constants'
import type { CartItem } from '@/types'

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
        const body = await req.json()
        const { items, customerInfo } = body

        // Validate customer info using Zod schema
        const validatedCustomer = checkoutFormSchema.parse(customerInfo)

        // Validate items
        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new ValidationError('No items in cart')
        }

        // Validate each item structure
        for (const item of items) {
            if (!item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
                throw new ValidationError('Invalid item format')
            }

            if (item.quantity < 1 || item.price < 0) {
                throw new ValidationError('Invalid item quantity or price')
            }
        }

        const lineItems = (items as CartItem[]).map((item) => ({
            price_data: {
                currency: DEFAULTS.CURRENCY.toLowerCase(),
                product_data: {
                    name: item.name,
                    images: item.imageUrl ? [item.imageUrl] : [],
                },
                unit_amount: Math.round(item.price * 100), // Convert to cents
            },
            quantity: item.quantity,
        }))

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout`,
            customer_email: validatedCustomer.email,
            metadata: {
                customerName: validatedCustomer.name,
                customerEmail: validatedCustomer.email,
                customerPhone: validatedCustomer.phone || '',
                shippingAddress: JSON.stringify({
                    address: validatedCustomer.address,
                    city: validatedCustomer.city,
                    postalCode: validatedCustomer.postalCode,
                }),
                orderItems: JSON.stringify(items.map((item: CartItem) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })))
            }
        })

        return NextResponse.json({ url: session.url, sessionId: session.id })
    } catch (error) {
        // Log error with context
        if (error instanceof Error) {
            logError({
                error,
                context: {
                    endpoint: '/api/checkout',
                    method: 'POST',
                },
                severity: 'high',
            })
        }

        // Use standardized error handling
        return handleApiError(error)

        // Return appropriate error response
        // Use standardized error handling
        return handleApiError(error)
    }
}
