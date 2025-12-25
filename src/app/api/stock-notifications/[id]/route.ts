import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Unsubscribe from stock notifications
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        await prisma.stockNotification.delete({
            where: { id },
        })

        return NextResponse.json({
            success: true,
            message: 'Unsubscribed from stock notifications',
        })
    } catch (error) {
        console.error('Failed to delete stock notification:', error)
        return NextResponse.json(
            { error: 'Failed to unsubscribe' },
            { status: 500 }
        )
    }
}
