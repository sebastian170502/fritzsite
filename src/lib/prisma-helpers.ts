import { prisma } from './prisma'
import { Prisma } from '@prisma/client'

/**
 * Common select fields for product queries to reduce data transfer
 */
export const productSelectFields = {
    id: true,
    name: true,
    slug: true,
    description: true,
    price: true,
    stock: true,
    images: true,
    material: true,
    category: true,
    isFeatured: true,
    createdAt: true,
} as const

/**
 * Get products with optimized query and caching
 */
export async function getProducts(options: {
    category?: string
    featured?: boolean
    limit?: number
    offset?: number
    orderBy?: Prisma.ProductOrderByWithRelationInput
}) {
    const { category, featured, limit = 20, offset = 0, orderBy } = options

    const where: Prisma.ProductWhereInput = {
        ...(category && { category }),
        ...(featured !== undefined && { isFeatured: featured }),
    }

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            select: productSelectFields,
            take: limit,
            skip: offset,
            orderBy: orderBy || { createdAt: 'desc' },
        }),
        prisma.product.count({ where }),
    ])

    return { products, total, hasMore: offset + limit < total }
}

/**
 * Get product by slug with reviews (optimized)
 */
export async function getProductBySlug(slug: string) {
    return prisma.product.findUnique({
        where: { slug },
        include: {
            reviews: {
                where: { approved: true },
                orderBy: { createdAt: 'desc' },
                take: 10,
            },
            _count: {
                select: {
                    reviews: { where: { approved: true } },
                },
            },
        },
    })
}

/**
 * Batch get products by IDs (for cart items)
 */
export async function getProductsByIds(ids: string[]) {
    return prisma.product.findMany({
        where: {
            id: { in: ids },
        },
        select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            images: true,
        },
    })
}

/**
 * Search products with full-text search simulation
 */
export async function searchProducts(query: string, limit: number = 10) {
    const searchQuery = `%${query}%`

    return prisma.product.findMany({
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
        },
        take: limit,
        orderBy: [
            { isFeatured: 'desc' },
            { stock: 'desc' },
        ],
    })
}

/**
 * Get product statistics (for analytics)
 */
export async function getProductStats() {
    const [totalProducts, inStock, outOfStock, avgRating] = await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { stock: { gt: 0 } } }),
        prisma.product.count({ where: { stock: { lte: 0 } } }),
        prisma.review.aggregate({
            where: { approved: true },
            _avg: { rating: true },
        }),
    ])

    return {
        totalProducts,
        inStock,
        outOfStock,
        avgRating: avgRating._avg.rating || 0,
    }
}

/**
 * Soft delete helper (mark as archived instead of deleting)
 * Note: Requires adding 'archived' field to schema
 */
export async function archiveProduct(id: string) {
    // For now, just delete. Add archived field later if needed
    return prisma.product.delete({ where: { id } })
}

/**
 * Bulk operations helper
 */
export async function bulkUpdateStock(updates: { id: string; stock: number }[]) {
    return Promise.all(
        updates.map((update) =>
            prisma.product.update({
                where: { id: update.id },
                data: { stock: update.stock },
            })
        )
    )
}

/**
 * Transaction helper for complex operations
 */
export async function createOrderTransaction(items: { id: string; quantity: number }[]) {
    return prisma.$transaction(async (tx) => {
        // Verify stock availability
        const products = await tx.product.findMany({
            where: { id: { in: items.map((i) => i.id) } },
            select: { id: true, stock: true, name: true },
        })

        // Check if all items are in stock
        for (const item of items) {
            const product = products.find((p) => p.id === item.id)
            if (!product || product.stock < item.quantity) {
                throw new Error(`Product ${product?.name || item.id} is out of stock`)
            }
        }

        // Decrease stock for each item
        const updatePromises = items.map((item) =>
            tx.product.update({
                where: { id: item.id },
                data: { stock: { decrement: item.quantity } },
            })
        )

        return Promise.all(updatePromises)
    })
}
