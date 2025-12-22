import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple auth check for admin routes
// In production, use a proper auth solution like NextAuth.js
export function middleware(request: NextRequest) {
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

    return NextResponse.next()
}

export const config = {
    matcher: '/admin/:path*',
}
