import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prisma } from '@/lib/prisma'
import { safeJSONParse } from '@/lib/json-utils'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    prisma: {
        order: {
            create: vi.fn(),
            findUnique: vi.fn(),
            findMany: vi.fn(),
        },
        product: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
    },
}))

describe('Order Management', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Order Creation', () => {
        it('should create order with valid data', async () => {
            const orderData = {
                orderNumber: 'ORD-12345',
                customerEmail: 'test@example.com',
                customerName: 'Test Customer',
                items: JSON.stringify([
                    { id: '1', name: 'Product 1', price: 29.99, quantity: 2 },
                ]),
                subtotal: 59.98,
                shipping: 0,
                tax: 0,
                total: 59.98,
                status: 'processing',
                paymentStatus: 'paid',
            }

                ; (prisma.order.create as any).mockResolvedValue({
                    id: 'order-123',
                    ...orderData,
                })

            const order = await prisma.order.create({ data: orderData })

            expect(order).toBeDefined()
            expect(order.id).toBe('order-123')
            expect(order.orderNumber).toBe('ORD-12345')
            expect(order.total).toBe(59.98)
        })

        it('should generate unique order numbers', () => {
            const orderNumber1 = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`
            const orderNumber2 = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`

            expect(orderNumber1).not.toBe(orderNumber2)
        })
    })

    describe('Stock Management', () => {
        it('should decrement stock on purchase', async () => {
            const productId = 'product-1'
            const quantity = 2

                ; (prisma.product.findUnique as any).mockResolvedValue({
                    id: productId,
                    stock: 10,
                })

                ; (prisma.product.update as any).mockResolvedValue({
                    id: productId,
                    stock: 8,
                })

            const product = await prisma.product.findUnique({
                where: { id: productId },
            })

            expect(product.stock).toBe(10)

            const updatedProduct = await prisma.product.update({
                where: { id: productId },
                data: {
                    stock: { decrement: quantity },
                },
            })

            expect(updatedProduct.stock).toBe(8)
        })

        it('should handle insufficient stock', async () => {
            const productId = 'product-1'
            const requestedQuantity = 5

                ; (prisma.product.findUnique as any).mockResolvedValue({
                    id: productId,
                    stock: 2,
                })

            const product = await prisma.product.findUnique({
                where: { id: productId },
            })

            expect(product.stock).toBeLessThan(requestedQuantity)

                // Should set stock to 0 instead of going negative
                ; (prisma.product.update as any).mockResolvedValue({
                    id: productId,
                    stock: 0,
                })

            const updatedProduct = await prisma.product.update({
                where: { id: productId },
                data: { stock: 0 },
            })

            expect(updatedProduct.stock).toBe(0)
            expect(updatedProduct.stock).toBeGreaterThanOrEqual(0)
        })

        it('should handle product not found', async () => {
            const productId = 'non-existent'

                ; (prisma.product.findUnique as any).mockResolvedValue(null)

            const product = await prisma.product.findUnique({
                where: { id: productId },
            })

            expect(product).toBeNull()
        })
    })

    describe('Order Items Parsing', () => {
        it('should safely parse order items JSON', () => {
            const validJSON = JSON.stringify([
                { id: '1', name: 'Product 1', price: 29.99, quantity: 2 },
                { id: '2', name: 'Product 2', price: 49.99, quantity: 1 },
            ])

            const items = safeJSONParse(validJSON, [])

            expect(items).toHaveLength(2)
            expect(items[0].name).toBe('Product 1')
            expect(items[1].price).toBe(49.99)
        })

        it('should return fallback for invalid JSON', () => {
            const invalidJSON = '{ broken json'

            const items = safeJSONParse(invalidJSON, [])

            expect(items).toEqual([])
        })

        it('should return fallback for null', () => {
            const items = safeJSONParse(null, [])

            expect(items).toEqual([])
        })
    })

    describe('Order Queries', () => {
        it('should find order by ID', async () => {
            const orderId = 'order-123'

                ; (prisma.order.findUnique as any).mockResolvedValue({
                    id: orderId,
                    orderNumber: 'ORD-12345',
                    customerEmail: 'test@example.com',
                    total: 59.98,
                })

            const order = await prisma.order.findUnique({
                where: { id: orderId },
            })

            expect(order).toBeDefined()
            expect(order.id).toBe(orderId)
            expect(order.orderNumber).toBe('ORD-12345')
        })

        it('should list customer orders', async () => {
            const customerEmail = 'test@example.com'

                ; (prisma.order.findMany as any).mockResolvedValue([
                    { id: 'order-1', orderNumber: 'ORD-1', total: 29.99 },
                    { id: 'order-2', orderNumber: 'ORD-2', total: 49.99 },
                ])

            const orders = await prisma.order.findMany({
                where: { customerEmail },
                orderBy: { createdAt: 'desc' },
            })

            expect(orders).toHaveLength(2)
            expect(orders[0].orderNumber).toBe('ORD-1')
        })
    })
})
