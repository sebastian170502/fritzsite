import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST as checkoutHandler } from '@/app/api/checkout/route'
import { POST as webhookHandler } from '@/app/api/webhook/route'

// Set up test environment variables
process.env.STRIPE_SECRET_KEY = 'sk_test_mock_key_for_testing'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_mock_secret_for_testing'
process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000'

// Mock Stripe - must be at top level for Vitest hoisting
vi.mock('stripe', () => {
    return {
        default: class MockStripe {
            checkout = {
                sessions: {
                    create: vi.fn().mockResolvedValue({
                        id: 'cs_test_123',
                        url: 'https://checkout.stripe.com/test',
                    }),
                },
            }
            webhooks = {
                constructEvent: vi.fn().mockImplementation((body, signature, secret) => {
                    return {
                        type: 'checkout.session.completed',
                        data: {
                            object: {
                                id: 'cs_test_123',
                                customer_email: 'test@example.com',
                                metadata: {
                                    customerName: 'Test Customer',
                                    customerEmail: 'test@example.com',
                                    customerPhone: '+1234567890',
                                    shippingAddress: JSON.stringify({
                                        address: '123 Test St',
                                        city: 'Test City',
                                        postalCode: '12345',
                                    }),
                                    orderItems: JSON.stringify([
                                        {
                                            id: 'product-1',
                                            name: 'Test Product',
                                            price: 29.99,
                                            quantity: 2,
                                        },
                                    ]),
                                },
                            },
                        },
                    }
                }),
            }
        },
    }
})

// Mock Next.js headers
let mockHeaders: Map<string, string> = new Map()
vi.mock('next/headers', () => ({
    headers: vi.fn(() => Promise.resolve(mockHeaders)),
}))

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    prisma: {
        order: {
            create: vi.fn().mockResolvedValue({
                id: 'order-123',
                orderNumber: 'ORD-12345',
                customerEmail: 'test@example.com',
                total: 59.98,
            }),
        },
        product: {
            findUnique: vi.fn().mockResolvedValue({
                id: 'product-1',
                stock: 10,
            }),
            update: vi.fn().mockResolvedValue({
                id: 'product-1',
                stock: 8,
            }),
        },
    },
}))

describe('Checkout Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        process.env.STRIPE_SECRET_KEY = 'sk_test_123'
        process.env.NEXT_PUBLIC_URL = 'http://localhost:3000'
    })

    describe('Checkout API', () => {
        it('should create checkout session with valid items', async () => {
            const request = new Request('http://localhost:3000/api/checkout', {
                method: 'POST',
                body: JSON.stringify({
                    items: [
                        {
                            id: 'product-1',
                            name: 'Test Product',
                            price: 29.99,
                            quantity: 2,
                            imageUrl: 'https://example.com/product.jpg',
                        },
                    ],
                    customerInfo: {
                        name: 'Test Customer',
                        email: 'test@example.com',
                        phone: '+1234567890',
                        address: '123 Test St',
                        city: 'Test City',
                        postalCode: '12345',
                    },
                }),
            })

            const response = await checkoutHandler(request)
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data.url).toBeDefined()
            expect(data.sessionId).toBeDefined()
        })

        it('should reject checkout with empty cart', async () => {
            const request = new Request('http://localhost:3000/api/checkout', {
                method: 'POST',
                body: JSON.stringify({
                    items: [],
                    customerInfo: {
                        name: 'Test Customer',
                        email: 'test@example.com',
                    },
                }),
            })

            const response = await checkoutHandler(request)
            const data = await response.json()

            expect(response.status).toBe(400)
            expect(data.error).toBe('No items in cart')
        })

        it('should reject checkout without customer info', async () => {
            const request = new Request('http://localhost:3000/api/checkout', {
                method: 'POST',
                body: JSON.stringify({
                    items: [
                        {
                            id: 'product-1',
                            name: 'Test Product',
                            price: 29.99,
                            quantity: 1,
                        },
                    ],
                    customerInfo: {},
                }),
            })

            const response = await checkoutHandler(request)
            const data = await response.json()

            expect(response.status).toBe(400)
            // With Zod validation, it returns "Validation failed"
            expect(data.error).toMatch(/Validation failed|Customer information is required/i)
        })

        it('should reject items with negative quantity', async () => {
            const request = new Request('http://localhost:3000/api/checkout', {
                method: 'POST',
                body: JSON.stringify({
                    items: [
                        {
                            id: 'product-1',
                            name: 'Test Product',
                            price: 29.99,
                            quantity: -1,
                        },
                    ],
                    customerInfo: {
                        name: 'Test Customer',
                        email: 'test@example.com',
                    },
                }),
            })

            const response = await checkoutHandler(request)
            const data = await response.json()

            expect(response.status).toBe(400)
            expect(data.error).toBe('Invalid item quantity or price')
        })

        it('should reject items with negative price', async () => {
            const request = new Request('http://localhost:3000/api/checkout', {
                method: 'POST',
                body: JSON.stringify({
                    items: [
                        {
                            id: 'product-1',
                            name: 'Test Product',
                            price: -10,
                            quantity: 1,
                        },
                    ],
                    customerInfo: {
                        name: 'Test Customer',
                        email: 'test@example.com',
                    },
                }),
            })

            const response = await checkoutHandler(request)
            const data = await response.json()

            expect(response.status).toBe(400)
            expect(data.error).toBe('Invalid item quantity or price')
        })
    })

    describe('Webhook Handler', () => {
        it('should process successful checkout', async () => {
            // Set the stripe-signature header in the mock
            mockHeaders = new Map([['stripe-signature', 'test-signature']])

            const request = new Request('http://localhost:3000/api/webhook', {
                method: 'POST',
                headers: {
                    'stripe-signature': 'test-signature',
                },
                body: JSON.stringify({
                    type: 'checkout.session.completed',
                    data: {
                        object: {
                            id: 'cs_test_123',
                        },
                    },
                }),
            })

            process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_123'

            const response = await webhookHandler(request)
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data.received).toBe(true)
        })

        it('should reject webhook without signature', async () => {
            // Clear the headers to simulate no signature
            mockHeaders = new Map()

            const request = new Request('http://localhost:3000/api/webhook', {
                method: 'POST',
                body: JSON.stringify({
                    type: 'checkout.session.completed',
                }),
            })

            const response = await webhookHandler(request)
            const data = await response.json()

            expect(response.status).toBe(400)
            expect(data.error).toBe('No signature')
        })
    })
})
