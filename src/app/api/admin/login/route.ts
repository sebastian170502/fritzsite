import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { comparePassword, generateCSRFToken } from '@/lib/auth'
import { rateLimit, getClientIp } from '@/lib/security'

export async function POST(req: Request) {
    try {
        // Rate limiting for login attempts
        const clientIp = getClientIp(req)
        const rateLimitResult = rateLimit(`login:${clientIp}`, {
            windowMs: 15 * 60 * 1000, // 15 minutes
            maxRequests: 5 // 5 attempts per 15 min
        })

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Too many login attempts. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000))
                    }
                }
            )
        }

        const { username, password } = await req.json()

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password required' },
                { status: 400 }
            )
        }

        const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
        const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

        // Security: Enforce bcrypt in production, allow plain text in dev
        if (!ADMIN_PASSWORD_HASH && !ADMIN_PASSWORD) {
            console.error('CRITICAL: Neither ADMIN_PASSWORD_HASH nor ADMIN_PASSWORD is set.')
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            )
        }

        let passwordMatch = false

        if (ADMIN_PASSWORD_HASH) {
            // Use bcrypt comparison if hash is available
            passwordMatch = username === ADMIN_USERNAME && await comparePassword(password, ADMIN_PASSWORD_HASH)
        } else if (ADMIN_PASSWORD) {
            // Fallback to plain text comparison (dev only)
            console.warn('WARNING: Using plain text password comparison. Use bcrypt hash in production!')
            passwordMatch = username === ADMIN_USERNAME && password === ADMIN_PASSWORD
        }

        // Verify credentials
        if (passwordMatch) {
            const cookieStore = await cookies()
            const csrfToken = generateCSRFToken()

            const isProduction = String(process.env.NODE_ENV) === 'production'

            cookieStore.set('admin_session', 'authenticated', {
                httpOnly: true,
                secure: isProduction,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 24 hours
            })

            cookieStore.set('csrf_token', csrfToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24,
            })

            return NextResponse.json({ success: true, csrfToken })
        }

        return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
        )
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        )
    }
}
