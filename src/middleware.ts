import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/security'

// Simple auth check for admin routes
// In production, use a proper auth solution like NextAuth.js
export async function middleware(request: NextRequest) {
    const response = NextResponse.next()

    // CSRF Protection for API routes with state-changing methods
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const method = request.method;

        // Only check CSRF for state-changing methods
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
            // Skip CSRF for public endpoints
            const publicEndpoints = [
                '/api/webhook', // Stripe webhook (has signature verification)
                '/api/auth/login',
                '/api/admin/login',
                '/api/customer/login',
                '/api/customer/signup',
                '/api/paypal/webhook', // PayPal webhook
            ];

            const isPublicEndpoint = publicEndpoints.some(endpoint =>
                request.nextUrl.pathname === endpoint
            );

            if (!isPublicEndpoint) {
                // Get CSRF token from header
                const csrfTokenHeader = request.headers.get('x-csrf-token');
                const sessionToken = request.cookies.get('csrf_token')?.value;

                // Validate CSRF token (simple comparison for now)
                if (!csrfTokenHeader || !sessionToken || csrfTokenHeader !== sessionToken) {
                    return NextResponse.json(
                        { error: 'Invalid CSRF token' },
                        { status: 403 }
                    );
                }
            }
        }
    }

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

    // Customer auth check
    if (request.nextUrl.pathname.startsWith('/customer') &&
        !request.nextUrl.pathname.startsWith('/customer/login')) {
        // Check for customer session cookie
        const customerSession = request.cookies.get('customer_session')

        // If not logged in, redirect to customer login
        if (!customerSession) {
            return NextResponse.redirect(new URL('/customer/login', request.url))
        }
    }

    // Redirect from customer login if already logged in
    if (request.nextUrl.pathname === '/customer/login') {
        const customerSession = request.cookies.get('customer_session')
        if (customerSession) {
            return NextResponse.redirect(new URL('/customer', request.url))
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
        '/customer/:path*',
        '/api/:path*',
    ],
}
