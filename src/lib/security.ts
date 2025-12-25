/**
 * Security utilities for rate limiting, input sanitization, and validation
 */

interface RateLimitConfig {
    windowMs: number  // Time window in milliseconds
    maxRequests: number  // Maximum requests per window
}

interface RateLimitEntry {
    count: number
    resetTime: number
}

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * Rate limiter using sliding window
 */
export function rateLimit(identifier: string, config: RateLimitConfig): {
    success: boolean
    remaining: number
    resetTime: number
} {
    const now = Date.now()
    const entry = rateLimitStore.get(identifier)

    // Clean up expired entries periodically
    if (Math.random() < 0.01) {
        const entries = Array.from(rateLimitStore.entries())
        for (const [key, value] of entries) {
            if (value.resetTime < now) {
                rateLimitStore.delete(key)
            }
        }
    }

    if (!entry || entry.resetTime < now) {
        // Create new entry
        const newEntry = {
            count: 1,
            resetTime: now + config.windowMs
        }
        rateLimitStore.set(identifier, newEntry)
        return {
            success: true,
            remaining: config.maxRequests - 1,
            resetTime: newEntry.resetTime
        }
    }

    if (entry.count < config.maxRequests) {
        // Increment count
        entry.count++
        rateLimitStore.set(identifier, entry)
        return {
            success: true,
            remaining: config.maxRequests - entry.count,
            resetTime: entry.resetTime
        }
    }

    // Rate limit exceeded
    return {
        success: false,
        remaining: 0,
        resetTime: entry.resetTime
    }
}

/**
 * Get client IP from request
 */
export function getClientIp(request: Request): string {
    // Check various headers for real IP
    const forwarded = request.headers.get('x-forwarded-for')
    if (forwarded) {
        return forwarded.split(',')[0].trim()
    }

    const realIp = request.headers.get('x-real-ip')
    if (realIp) {
        return realIp
    }

    // Fallback
    return 'unknown'
}

/**
 * Sanitize HTML input to prevent XSS
 */
export function sanitizeHtml(input: string): string {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
}

/**
 * Sanitize string for safe database insertion
 */
export function sanitizeString(input: string): string {
    // Remove null bytes and control characters
    return input.replace(/[\x00-\x1F\x7F]/g, '').trim()
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
}

/**
 * Validate phone number (Romanian format)
 */
export function isValidPhone(phone: string): boolean {
    // Romanian phone: +40 or 0, followed by 9 digits
    const phoneRegex = /^(\+40|0)[0-9]{9}$/
    return phoneRegex.test(phone.replace(/[\s-]/g, ''))
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Validate content length
 */
export function validateContentLength(content: string, maxLength: number): boolean {
    return content.length <= maxLength
}

/**
 * Check for SQL injection patterns
 */
export function containsSqlInjection(input: string): boolean {
    const sqlPatterns = [
        /(\bOR\b|\bAND\b).*=.*\b/i,
        /UNION.*SELECT/i,
        /DROP.*TABLE/i,
        /INSERT.*INTO/i,
        /DELETE.*FROM/i,
        /UPDATE.*SET/i,
        /--/,
        /;.*--/,
        /\/\*.*\*\//
    ]

    return sqlPatterns.some(pattern => pattern.test(input))
}

/**
 * Validate price value
 */
export function isValidPrice(price: number): boolean {
    return !isNaN(price) && price >= 0 && price <= 1000000 && Number.isFinite(price)
}

/**
 * Validate quantity
 */
export function isValidQuantity(quantity: number): boolean {
    return Number.isInteger(quantity) && quantity > 0 && quantity <= 1000
}

/**
 * Hash sensitive data (for logging/tracking without exposing real values)
 */
export async function hashSensitiveData(data: string): Promise<string> {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')
}
