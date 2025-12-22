import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const productId = searchParams.get('productId')

        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            )
        }

        const reviews = await prisma.review.findMany({
            where: {
                productId,
                approved: true, // Only show approved reviews
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json(reviews)
    } catch (error) {
        console.error('Failed to fetch reviews:', error)
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json()

        // Validate required fields
        if (!data.productId || !data.customerName || !data.email || !data.rating || !data.comment) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Validate rating range
        if (data.rating < 1 || data.rating > 5) {
            return NextResponse.json(
                { error: 'Rating must be between 1 and 5' },
                { status: 400 }
            )
        }

        // Create review
        const review = await prisma.review.create({
            data: {
                productId: data.productId,
                customerName: data.customerName,
                email: data.email,
                rating: data.rating,
                title: data.title || '',
                comment: data.comment,
                images: data.images ? JSON.stringify(data.images) : null,
                verified: false,
                approved: false, // Requires admin approval
            },
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Review submitted successfully. It will be visible after admin approval.',
                review
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Failed to create review:', error)
        return NextResponse.json(
            { error: 'Failed to submit review' },
            { status: 500 }
        )
    }
}
