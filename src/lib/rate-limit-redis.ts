/**
 * Redis-based Rate Limiting Middleware
 * 
 * Provides distributed rate limiting using Redis.
 * Falls back to in-memory rate limiting in development if Redis is unavailable.
 */

import { Redis } from '@upstash/redis'
import { RATE_LIMITS } from './constants'

// Initialize Redis client (only if credentials are provided)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null

// Fallback: In-memory rate limiting for development
const inMemoryStore = new Map<string, { count: number; resetTime: number }>()

interface RateLimitOptions {
    windowMs: number
    maxRequests: number
}

interface RateLimitResult {
    success: boolean
    remaining: number
    resetTime: number
}

/**
 * Redis-based rate limiting with automatic fallback to in-memory
 */
export async function rateLimitRedis(
    key: string,
    options: RateLimitOptions
): Promise<RateLimitResult> {
    const { windowMs, maxRequests } = options
    const now = Date.now()
    const resetTime = now + windowMs

    // Use Redis if available
    if (redis) {
        try {
            const redisKey = `ratelimit:${key}`

            // Get current count
            const current = await redis.get<number>(redisKey)

            if (current === null) {
                // First request - set counter with expiration
                await redis.set(redisKey, 1, { px: windowMs })
                return {
                    success: true,
                    remaining: maxRequests - 1,
                    resetTime,
                }
            }

            if (current >= maxRequests) {
                // Rate limit exceeded
                const ttl = await redis.pttl(redisKey)
                return {
                    success: false,
                    remaining: 0,
                    resetTime: now + (ttl > 0 ? ttl : windowMs),
                }
            }

            // Increment counter
            await redis.incr(redisKey)

            return {
                success: true,
                remaining: maxRequests - current - 1,
                resetTime,
            }
        } catch (error) {
            console.warn('Redis rate limiting failed, falling back to in-memory:', error)
            // Fall through to in-memory implementation
        }
    }

    // Fallback: In-memory rate limiting (development only)
    const record = inMemoryStore.get(key)

    if (!record || now > record.resetTime) {
        // New window
        inMemoryStore.set(key, { count: 1, resetTime })
        return {
            success: true,
            remaining: maxRequests - 1,
            resetTime,
        }
    }

    if (record.count >= maxRequests) {
        // Rate limit exceeded
        return {
            success: false,
            remaining: 0,
            resetTime: record.resetTime,
        }
    }

    // Increment counter
    record.count++
    inMemoryStore.set(key, record)

    return {
        success: true,
        remaining: maxRequests - record.count,
        resetTime: record.resetTime,
    }
}

/**
 * Middleware helper for API routes
 */
export async function applyRateLimit(
    request: Request,
    identifier: string,
    options?: RateLimitOptions
): Promise<Response | null> {
    const defaultOptions = options || {
        windowMs: RATE_LIMITS.API.WINDOW_MS,
        maxRequests: RATE_LIMITS.API.MAX_REQUESTS,
    }

    const result = await rateLimitRedis(identifier, defaultOptions)

    if (!result.success) {
        return new Response(
            JSON.stringify({
                error: 'Too many requests. Please try again later.',
                resetTime: new Date(result.resetTime).toISOString(),
            }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': String(Math.ceil((result.resetTime - Date.now()) / 1000)),
                    'X-RateLimit-Limit': String(defaultOptions.maxRequests),
                    'X-RateLimit-Remaining': String(result.remaining),
                    'X-RateLimit-Reset': String(result.resetTime),
                },
            }
        )
    }

    return null // No rate limit, continue processing
}

/**
 * Clean up expired in-memory entries (only for fallback)
 */
export function cleanupInMemoryStore() {
    const now = Date.now()
    for (const [key, record] of inMemoryStore.entries()) {
        if (now > record.resetTime) {
            inMemoryStore.delete(key)
        }
    }
}

// Auto-cleanup every 5 minutes (only in development when using in-memory)
if (!redis && process.env.NODE_ENV !== 'production') {
    setInterval(cleanupInMemoryStore, 5 * 60 * 1000)
}
