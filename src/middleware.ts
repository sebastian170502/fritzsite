import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/security'

// Simple auth check for admin routes
// In production, use a proper auth solution like NextAuth.js
export function middleware(request: NextRequest) {
    const response = NextResponse.next()

    // Security headers
    response.headers.set('X-DNS-Prefetch-Control', 'on')
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
    response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=()'
    )

    // Admin auth check
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Check for admin session cookie
        const adminSession = request.cookies.get('admin_session')

        // If not logged in, redirect to admin login
        if (!adminSession && request.nextUrl.pathname !== '/admin/login') {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        // If logged in and trying to access login page, redirect to dashboard
        if (adminSession && request.nextUrl.pathname === '/admin/login') {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
    }

    // Rate limiting for API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const ip = getClientIp(request)
        const pathname = request.nextUrl.pathname

        // Different limits for different endpoints
        let config = { windowMs: 60000, maxRequests: 60 } // Default: 60 req/min

        if (pathname.includes('/api/checkout')) {
            config = { windowMs: 60000, maxRequests: 5 } // 5 req/min for checkout
        } else if (pathname.includes('/api/admin')) {
            config = { windowMs: 60000, maxRequests: 20 } // 20 req/min for admin
        } else if (pathname.includes('/api/custom-order')) {
            config = { windowMs: 300000, maxRequests: 3 } // 3 req/5min for custom orders
        }

        const rateLimitResult = rateLimit(`${ip}:${pathname}`, config)

        if (!rateLimitResult.success) {
            return NextResponse.json(
                {
                    error: 'Too many requests',
                    message: 'Please try again later',
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
                        'X-RateLimit-Limit': String(config.maxRequests),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': String(rateLimitResult.resetTime),
                    },
                }
            )
        }

        // Add rate limit headers
        response.headers.set('X-RateLimit-Limit', String(config.maxRequests))
        response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining))
        response.headers.set('X-RateLimit-Reset', String(rateLimitResult.resetTime))
    }

    return response
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/:path*',
    ],
}
