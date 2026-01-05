import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const query = searchParams.get('q')?.trim()

        if (!query || query.length < 2) {
            return NextResponse.json({ suggestions: [] })
        }

        // Search products by name, description, category, and material
        // Note: SQLite is case-insensitive by default for LIKE queries
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { description: { contains: query } },
                    { category: { contains: query } },
                    { material: { contains: query } },
                ],
            },
            select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
                category: true,
                stock: true,
            },
            take: 8, // Limit to 8 suggestions
            orderBy: [
                { isFeatured: 'desc' }, // Featured products first
                { stock: 'desc' }, // In-stock products first
                { createdAt: 'desc' }, // Newest products
            ],
        })

        // Parse images and format results
        const suggestions = products.map((product: any) => {
            const images = typeof product.images === 'string'
                ? JSON.parse(product.images)
                : product.images

            return {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.price),
                imageUrl: (images && images.length > 0) ? images[0] : '/placeholder.jpg',
                category: product.category,
                inStock: product.stock > 0,
            }
        })

        return NextResponse.json({
            suggestions,
            count: suggestions.length,
        })
    } catch (error) {
        console.error('Search suggestions error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch suggestions' },
            { status: 500 }
        )
    }
}
