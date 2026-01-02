import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidateShop } from '@/lib/revalidate'

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
        })

        // Parse images from JSON string if stored as string in SQLite
        const productsWithImages = products.map((product: any) => ({
            ...product,
            images:
                typeof product.images === 'string'
                    ? JSON.parse(product.images)
                    : product.images,
        }))

        return NextResponse.json(productsWithImages)
    } catch (error) {
        console.error('Failed to fetch products:', error)
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json()

        // Validate required fields
        if (!data.name || !data.slug || data.price === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: name, slug, price' },
                { status: 400 }
            )
        }

        if (data.price < 0) {
            return NextResponse.json(
                { error: 'Price must be a positive number' },
                { status: 400 }
            )
        }

        // Convert images array to JSON string for SQLite
        const productData = {
            ...data,
            images: JSON.stringify(data.images || []),
        }

        const product = await prisma.product.create({
            data: productData,
        })

        return NextResponse.json(product, { status: 201 })
    } catch (error) {
        console.error('Failed to create product:', error)
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        )
    }
}
