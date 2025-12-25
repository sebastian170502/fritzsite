import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const data = await req.json()

        const review = await prisma.review.update({
            where: { id },
            data: {
                approved: data.approved,
            },
        })

        return NextResponse.json(review)
    } catch (error) {
        console.error('Failed to update review:', error)
        return NextResponse.json(
            { error: 'Failed to update review' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await prisma.review.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to delete review:', error)
        return NextResponse.json(
            { error: 'Failed to delete review' },
            { status: 500 }
        )
    }
}
