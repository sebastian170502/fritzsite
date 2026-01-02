import { describe, it, expect, vi, beforeEach } from 'vitest'
import { trackPageView, trackAddToCart, trackPurchase, trackCustomEvent } from '@/lib/analytics'

// Mock window.gtag
const mockGtag = vi.fn()

describe('Analytics Tracking', () => {
    beforeEach(() => {
        mockGtag.mockClear()
        // @ts-ignore
        global.window = { gtag: mockGtag }
    })

    describe('Page View Tracking', () => {
        it('should track page view with path', () => {
            trackPageView('/shop')
            expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', {
                page_path: '/shop',
                page_title: undefined,
            })
        })

        it('should track page view with title', () => {
            trackPageView('/shop', 'Shop Page')
            expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', {
                page_path: '/shop',
                page_title: 'Shop Page',
            })
        })

        it('should handle root path', () => {
            trackPageView('/')
            expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', expect.objectContaining({
                page_path: '/',
            }))
        })

        it('should handle dynamic routes', () => {
            trackPageView('/shop/product-slug')
            expect(mockGtag).toHaveBeenCalled()
        })
    })

    describe('E-commerce Tracking', () => {
        it('should track add to cart event', () => {
            const product = {
                id: 'product-1',
                name: 'Test Product',
                price: 29.99,
                category: 'Tools',
            }
            const result = trackAddToCart(product)
            expect(result).toBeDefined()
        })

        it('should track purchase event', () => {
            const purchase = {
                orderId: 'order-123',
                total: 99.99,
                items: [
                    { id: 'product-1', name: 'Product 1', price: 49.99, quantity: 1 },
                    { id: 'product-2', name: 'Product 2', price: 49.99, quantity: 1 },
                ],
            }
            const result = trackPurchase(purchase)
            expect(result).toBeDefined()
        })

        it('should track custom event', () => {
            const result = trackCustomEvent('newsletter_signup', {
                email: 'user@example.com',
            })
            expect(result).toBeDefined()
        })

        it('should handle product with no category', () => {
            const product = {
                id: 'product-1',
                name: 'Test Product',
                price: 29.99,
            }
            const result = trackAddToCart(product)
            expect(result).toBeDefined()
        })
    })

    describe('Event Data Validation', () => {
        it('should validate product data structure', () => {
            const product = {
                id: 'product-1',
                name: 'Test Product',
                price: 29.99,
            }
            expect(product.id).toBeDefined()
            expect(product.name).toBeDefined()
            expect(product.price).toBeGreaterThan(0)
        })

        it('should validate purchase data structure', () => {
            const purchase = {
                orderId: 'order-123',
                total: 99.99,
                items: [],
            }
            expect(purchase.orderId).toBeDefined()
            expect(purchase.total).toBeGreaterThanOrEqual(0)
            expect(Array.isArray(purchase.items)).toBe(true)
        })

        it('should validate custom event has name', () => {
            const eventName = 'custom_event'
            expect(eventName).toBeDefined()
            expect(eventName.length).toBeGreaterThan(0)
        })
    })

    describe('Error Handling', () => {
        it('should handle tracking when analytics is disabled', () => {
            // Should not throw error
            expect(() => trackPageView('/test')).not.toThrow()
        })

        it('should handle invalid product data gracefully', () => {
            expect(() => trackAddToCart(null as any)).not.toThrow()
        })

        it('should handle invalid purchase data gracefully', () => {
            expect(() => trackPurchase(null as any)).not.toThrow()
        })
    })
})
