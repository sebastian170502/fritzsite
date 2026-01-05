import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidateProduct, revalidateShop } from '@/lib/revalidate'
import { notifyStockAvailable } from '@/lib/stock-notifications'
import { safeJSONParse } from '@/lib/json-utils'

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
                    ? safeJSONParse(product.images, [])
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

        // Validate price if provided
        if (data.price !== undefined && data.price < 0) {
            return NextResponse.json(
                { error: 'Price must be a positive number' },
                { status: 400 }
            )
        }

        // Get previous stock level to check if it was out of stock
        const previousProduct = await prisma.product.findUnique({
            where: { id },
            select: { stock: true, slug: true },
        })

        // Convert images array to JSON string for SQLite
        const productData = {
            ...data,
            images: JSON.stringify(data.images || []),
        }

        const product = await prisma.product.update({
            where: { id },
            data: productData,
        })

        // Send stock notifications if product was out of stock and now in stock
        if (previousProduct && previousProduct.stock === 0 && product.stock > 0) {
            // Parse images for notification email
            const images = typeof product.images === 'string'
                ? JSON.parse(product.images)
                : product.images
            const imageUrl = images[0] || '/placeholder.jpg'

            // Send notifications asynchronously (don't wait)
            notifyStockAvailable({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.price),
                imageUrl,
            }).catch(error => {
                console.error('Failed to send stock notifications:', error)
            })
        }

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
