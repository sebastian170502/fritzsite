import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const subscribeSchema = z.object({
    email: z.string().email('Invalid email address'),
    productId: z.string().min(1, 'Product ID is required'),
})

// Subscribe to stock notifications
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, productId } = subscribeSchema.parse(body)

        // Check if product exists and is out of stock
        const product = await prisma.product.findUnique({
            where: { id: productId },
        })

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        if (product.stock > 0) {
            return NextResponse.json(
                { error: 'Product is currently in stock' },
                { status: 400 }
            )
        }

        // Create or update stock notification
        const notification = await prisma.stockNotification.upsert({
            where: {
                email_productId: {
                    email,
                    productId,
                },
            },
            update: {
                notified: false,
                notifiedAt: null,
            },
            create: {
                email,
                productId,
            },
        })

        return NextResponse.json({
            success: true,
            message: 'You will be notified when this product is back in stock',
            notification: {
                id: notification.id,
                email: notification.email,
            },
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            )
        }

        console.error('Failed to create stock notification:', error)
        return NextResponse.json(
            { error: 'Failed to create notification' },
            { status: 500 }
        )
    }
}

// Get notification status for an email/product combination
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const email = searchParams.get('email')
        const productId = searchParams.get('productId')

        if (!email || !productId) {
            return NextResponse.json(
                { error: 'Email and productId are required' },
                { status: 400 }
            )
        }

        const notification = await prisma.stockNotification.findUnique({
            where: {
                email_productId: {
                    email,
                    productId,
                },
            },
        })

        return NextResponse.json({
            subscribed: !!notification && !notification.notified,
            notified: notification?.notified || false,
        })
    } catch (error) {
        console.error('Failed to fetch notification status:', error)
        return NextResponse.json(
            { error: 'Failed to fetch status' },
            { status: 500 }
        )
    }
}
