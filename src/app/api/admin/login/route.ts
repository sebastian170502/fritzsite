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

        // For backward compatibility, support plain password in dev
        if (!ADMIN_PASSWORD_HASH && process.env.NODE_ENV !== 'production') {
            const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'fritzforge2024'

            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
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
        } else if (ADMIN_PASSWORD_HASH) {
            // Production: use bcrypt
            if (username === ADMIN_USERNAME && await comparePassword(password, ADMIN_PASSWORD_HASH)) {
                const cookieStore = await cookies()
                const csrfToken = generateCSRFToken()

                const isProduction = String(process.env.NODE_ENV) === 'production'

                cookieStore.set('admin_session', 'authenticated', {
                    httpOnly: true,
                    secure: isProduction,
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24,
                })

                cookieStore.set('csrf_token', csrfToken, {
                    httpOnly: true,
                    secure: isProduction,
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24,
                })

                return NextResponse.json({ success: true, csrfToken })
            }
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
