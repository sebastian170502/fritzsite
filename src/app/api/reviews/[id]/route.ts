import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const data = await req.json()

        // Update helpful/notHelpful counts
        if (data.action === 'helpful') {
            const review = await prisma.review.update({
                where: { id },
                data: { helpful: { increment: 1 } },
            })
            return NextResponse.json(review)
        }

        if (data.action === 'notHelpful') {
            const review = await prisma.review.update({
                where: { id },
                data: { notHelpful: { increment: 1 } },
            })
            return NextResponse.json(review)
        }

        return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
        )
    } catch (error) {
        console.error('Failed to update review:', error)
        return NextResponse.json(
            { error: 'Failed to update review' },
            { status: 500 }
        )
    }
}
