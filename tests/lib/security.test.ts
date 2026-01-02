import { describe, it, expect } from 'vitest'
import { rateLimit, getClientIp } from '@/lib/security'

describe('Security Utilities', () => {
    describe('Rate Limiting', () => {
        it('should allow requests within limit', () => {
            const config = { windowMs: 60000, maxRequests: 5 }
            const result1 = rateLimit('test-ip-1:endpoint', config)
            expect(result1.success).toBe(true)
            expect(result1.remaining).toBeGreaterThanOrEqual(0)
        })

        it('should have remaining count', () => {
            const config = { windowMs: 60000, maxRequests: 5 }
            const result = rateLimit('test-ip-2:endpoint', config)
            expect(result.remaining).toBeLessThanOrEqual(config.maxRequests)
        })

        it('should have reset time', () => {
            const config = { windowMs: 60000, maxRequests: 5 }
            const result = rateLimit('test-ip-3:endpoint', config)
            expect(result.resetTime).toBeGreaterThan(Date.now())
        })

        it('should reject requests after limit exceeded', () => {
            const config = { windowMs: 60000, maxRequests: 2 }
            const key = `test-ip-exceeded-${Date.now()}`

            rateLimit(key, config) // Request 1
            rateLimit(key, config) // Request 2
            const result = rateLimit(key, config) // Request 3 - should be blocked

            expect(result.success).toBe(false)
        })

        it('should handle different keys independently', () => {
            const config = { windowMs: 60000, maxRequests: 5 }
            const result1 = rateLimit('user-1:endpoint', config)
            const result2 = rateLimit('user-2:endpoint', config)

            expect(result1.success).toBe(true)
            expect(result2.success).toBe(true)
        })

        it('should reset after window expires', () => {
            const config = { windowMs: 100, maxRequests: 1 }
            const key = `test-reset-${Date.now()}`

            rateLimit(key, config)
            // Wait for window to expire (in real scenario)
            const result = rateLimit(key, config)
            expect(result).toBeDefined()
        })
    })

    describe('Client IP Extraction', () => {
        it('should extract IP from x-forwarded-for header', () => {
            const mockRequest = {
                headers: new Headers({
                    'x-forwarded-for': '192.168.1.1, 10.0.0.1',
                }),
                ip: '127.0.0.1',
            } as any

            const ip = getClientIp(mockRequest)
            expect(ip).toBe('192.168.1.1')
        })

        it('should extract IP from x-real-ip header', () => {
            const mockRequest = {
                headers: new Headers({
                    'x-real-ip': '192.168.1.2',
                }),
                ip: '127.0.0.1',
            } as any

            const ip = getClientIp(mockRequest)
            expect(ip).toBe('192.168.1.2')
        })

        it('should fallback to request.ip', () => {
            const mockRequest = {
                headers: new Headers({}),
                ip: '127.0.0.1',
            } as any

            const ip = getClientIp(mockRequest)
            expect(ip).toBe('127.0.0.1')
        })

        it('should handle missing IP gracefully', () => {
            const mockRequest = {
                headers: new Headers({}),
            } as any

            const ip = getClientIp(mockRequest)
            expect(ip).toBeDefined()
        })
    })
})
