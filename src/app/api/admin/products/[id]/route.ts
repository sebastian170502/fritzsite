import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidateProduct, revalidateShop } from '@/lib/revalidate'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const product = await prisma.product.findUnique({
            where: { id },
        })

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        // Parse images from JSON string if needed
        return NextResponse.json({
            ...product,
            images:
                typeof product.images === 'string'
                    ? JSON.parse(product.images)
                    : product.images,
        })
    } catch (error) {
        console.error('Failed to fetch product:', error)
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        )
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const data = await req.json()

        // Convert images array to JSON string for SQLite
        const productData = {
            ...data,
            images: JSON.stringify(data.images || []),
        }

        const product = await prisma.product.update({
            where: { id },
            data: productData,
        })

        // Revalidate product page and shop page
        await revalidateProduct(product.slug)
        await revalidateShop()

        return NextResponse.json(product)
    } catch (error) {
        console.error('Failed to update product:', error)
        return NextResponse.json(
            { error: 'Failed to update product' },
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
        const product = await prisma.product.findUnique({ where: { id } })
        
        await prisma.product.delete({
            where: { id },
        })

        // Revalidate shop page after deletion
        if (product) {
            await revalidateProduct(product.slug)
            await revalidateShop()
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to delete product:', error)
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        )
    }
}
