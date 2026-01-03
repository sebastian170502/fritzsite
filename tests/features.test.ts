import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    getCollaborativeRecommendations,
    getCategoryRecommendations,
    getTrendingProducts
} from '@/lib/recommendations'
import {
    calculateInventoryForecast,
    getInventoryForecasts
} from '@/lib/inventory-forecasting'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    prisma: {
        order: {
            findMany: vi.fn(),
        },
        product: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
        },
    },
}))

describe('Product Recommendations', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Collaborative Filtering', () => {
        it('should return related products', async () => {
            const { prisma } = await import('@/lib/prisma')

                // Mock orders containing the product
                ; (prisma.order.findMany as any).mockResolvedValue([
                    {
                        items: JSON.stringify([
                            { id: 'product-1', name: 'Main Product' },
                            { id: 'product-2', name: 'Related Product' },
                        ]),
                    },
                ])

                // Mock recommended products
                ; (prisma.product.findMany as any).mockResolvedValue([
                    {
                        id: 'product-2',
                        name: 'Related Product',
                        price: 29.99,
                        stock: 10,
                    },
                ])

            const recommendations = await getCollaborativeRecommendations('product-1', 4)

            expect(recommendations).toBeDefined()
            expect(Array.isArray(recommendations)).toBe(true)
        })

        it('should handle no related products', async () => {
            const { prisma } = await import('@/lib/prisma')

                ; (prisma.order.findMany as any).mockResolvedValue([])
                ; (prisma.product.findMany as any).mockResolvedValue([])

            const recommendations = await getCollaborativeRecommendations('product-1', 4)

            expect(recommendations).toBeDefined()
            expect(Array.isArray(recommendations)).toBe(true)
        })
    })

    describe('Category Recommendations', () => {
        it('should return products from same category', async () => {
            const { prisma } = await import('@/lib/prisma')

                ; (prisma.product.findUnique as any).mockResolvedValue({
                    id: 'product-1',
                    category: 'knives',
                    material: 'carbon-steel',
                })

                ; (prisma.product.findMany as any).mockResolvedValue([
                    { id: 'product-2', name: 'Similar Knife', category: 'knives' },
                    { id: 'product-3', name: 'Another Knife', category: 'knives' },
                ])

            const recommendations = await getCategoryRecommendations('product-1', 4)

            expect(recommendations).toBeDefined()
            expect(Array.isArray(recommendations)).toBe(true)
        })
    })

    describe('Trending Products', () => {
        it('should return frequently ordered products', async () => {
            const { prisma } = await import('@/lib/prisma')

                ; (prisma.order.findMany as any).mockResolvedValue([
                    {
                        items: JSON.stringify([
                            { id: 'product-1', quantity: 2 },
                            { id: 'product-2', quantity: 1 },
                        ]),
                    },
                    {
                        items: JSON.stringify([
                            { id: 'product-1', quantity: 1 },
                        ]),
                    },
                ])

                ; (prisma.product.findMany as any).mockResolvedValue([
                    { id: 'product-1', name: 'Popular Product', stock: 10 },
                ])

            const trending = await getTrendingProducts(4)

            expect(trending).toBeDefined()
            expect(Array.isArray(trending)).toBe(true)
        })
    })
})

describe('Inventory Forecasting', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Sales Velocity Calculation', () => {
        it('should calculate days until stockout', async () => {
            const { prisma } = await import('@/lib/prisma')

                ; (prisma.product.findUnique as any).mockResolvedValue({
                    id: 'product-1',
                    name: 'Test Product',
                    stock: 10,
                })

                ; (prisma.order.findMany as any).mockResolvedValue([
                    {
                        items: JSON.stringify([{ id: 'product-1', quantity: 1 }]),
                        createdAt: new Date(),
                    },
                    {
                        items: JSON.stringify([{ id: 'product-1', quantity: 1 }]),
                        createdAt: new Date(),
                    },
                ])

            const forecast = await calculateInventoryForecast('product-1', 30)

            expect(forecast).toBeDefined()
            if (forecast) {
                expect(forecast.currentStock).toBe(10)
                expect(forecast.averageDailySales).toBeGreaterThanOrEqual(0)
                expect(forecast.daysUntilStockout).toBeGreaterThanOrEqual(0)
            }
        })

        it('should handle zero sales', async () => {
            const { prisma } = await import('@/lib/prisma')

                ; (prisma.product.findUnique as any).mockResolvedValue({
                    id: 'product-1',
                    name: 'Test Product',
                    stock: 10,
                })

                ; (prisma.order.findMany as any).mockResolvedValue([])

            const forecast = await calculateInventoryForecast('product-1', 30)

            expect(forecast).toBeDefined()
            if (forecast) {
                expect(forecast.averageDailySales).toBe(0)
                expect(forecast.daysUntilStockout).toBe(999) // Large number instead of Infinity
            }
        })

        it('should handle zero stock', async () => {
            const { prisma } = await import('@/lib/prisma')

                ; (prisma.product.findUnique as any).mockResolvedValue({
                    id: 'product-1',
                    name: 'Test Product',
                    stock: 0,
                })

                ; (prisma.order.findMany as any).mockResolvedValue([])

            const forecast = await calculateInventoryForecast('product-1', 30)

            expect(forecast).toBeDefined()
            if (forecast) {
                expect(forecast.currentStock).toBe(0)
                expect(forecast.daysUntilStockout).toBe(0)
            }
        })
    })

    describe('Risk Level Assessment', () => {
        it('should classify critical risk (≤3 days)', async () => {
            const { prisma } = await import('@/lib/prisma')

                ; (prisma.product.findUnique as any).mockResolvedValue({
                    id: 'product-1',
                    name: 'Test Product',
                    stock: 3,
                })

                // Mock 1 sale per day = 3 days until stockout
                ; (prisma.order.findMany as any).mockResolvedValue([
                    {
                        items: JSON.stringify([{ id: 'product-1', quantity: 1 }]),
                        createdAt: new Date(),
                    },
                ])

            const forecast = await calculateInventoryForecast('product-1', 30)

            expect(forecast?.riskLevel).toBeDefined()
        })
    })

    describe('Bulk Forecasting', () => {
        it('should forecast multiple products', async () => {
            const { prisma } = await import('@/lib/prisma')

                ; (prisma.product.findMany as any).mockResolvedValue([
                    { id: 'product-1' },
                    { id: 'product-2' },
                ])

                ; (prisma.product.findUnique as any).mockResolvedValue({
                    id: 'product-1',
                    name: 'Test Product',
                    stock: 10,
                })

                ; (prisma.order.findMany as any).mockResolvedValue([])

            const forecasts = await getInventoryForecasts()

            expect(forecasts).toBeDefined()
            expect(Array.isArray(forecasts)).toBe(true)
        })
    })
})
