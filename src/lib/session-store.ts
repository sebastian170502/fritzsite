/**
 * Server-side Session Store
 * 
 * Provides secure server-side session management with Redis or database persistence.
 * Replaces client-only JWT approach with httpOnly cookies + server validation.
 */

import { Redis } from '@upstash/redis'
import { prisma } from './prisma'
import { SESSION_CONFIG } from './constants'

// Initialize Redis (optional, falls back to database)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null

export interface SessionData {
    userId: string
    email: string
    role: 'admin' | 'customer'
    createdAt: number
    lastActivity: number
    ipAddress?: string
    userAgent?: string
}

/**
 * Create a new session
 */
export async function createSession(
    sessionId: string,
    data: Omit<SessionData, 'createdAt' | 'lastActivity'>
): Promise<void> {
    const now = Date.now()
    const sessionData: SessionData = {
        ...data,
        createdAt: now,
        lastActivity: now,
    }

    const maxAge = SESSION_CONFIG.MAX_AGE * 1000 // Convert to milliseconds

    // Store in Redis if available
    if (redis) {
        try {
            await redis.set(`session:${sessionId}`, JSON.stringify(sessionData), {
                px: maxAge,
            })
            return
        } catch (error) {
            console.warn('Redis session storage failed, falling back to database:', error)
        }
    }

    // Fallback: Store in database
    const expiresAt = new Date(now + maxAge)

    // Note: You'll need to add a Session model to your Prisma schema:
    // model Session {
    //   id          String   @id
    //   data        String   // JSON stringified SessionData
    //   expiresAt   DateTime
    //   createdAt   DateTime @default(now())
    //   updatedAt   DateTime @updatedAt
    // }

    // Commented out until Prisma schema is updated:
    // await prisma.session.upsert({
    //   where: { id: sessionId },
    //   create: {
    //     id: sessionId,
    //     data: JSON.stringify(sessionData),
    //     expiresAt,
    //   },
    //   update: {
    //     data: JSON.stringify(sessionData),
    //     expiresAt,
    //   },
    // })

    console.warn('Database session storage not implemented yet. Add Session model to Prisma schema.')
}

/**
 * Get session data
 */
export async function getSession(sessionId: string): Promise<SessionData | null> {
    // Try Redis first
    if (redis) {
        try {
            const data = await redis.get<string>(`session:${sessionId}`)
            if (data) {
                return JSON.parse(data) as SessionData
            }
        } catch (error) {
            console.warn('Redis session retrieval failed:', error)
        }
    }

    // Fallback: Database lookup
    // Commented out until Prisma schema is updated:
    // const session = await prisma.session.findUnique({
    //   where: { id: sessionId },
    // })

    // if (session && session.expiresAt > new Date()) {
    //   return JSON.parse(session.data) as SessionData
    // }

    return null
}

/**
 * Update session activity timestamp
 */
export async function updateSessionActivity(sessionId: string): Promise<void> {
    const session = await getSession(sessionId)
    if (!session) return

    session.lastActivity = Date.now()

    if (redis) {
        try {
            const maxAge = SESSION_CONFIG.MAX_AGE * 1000
            await redis.set(`session:${sessionId}`, JSON.stringify(session), {
                px: maxAge,
            })
            return
        } catch (error) {
            console.warn('Redis session update failed:', error)
        }
    }

    // Fallback: Database update
    // await prisma.session.update({
    //   where: { id: sessionId },
    //   data: {
    //     data: JSON.stringify(session),
    //     expiresAt: new Date(Date.now() + SESSION_CONFIG.MAX_AGE * 1000),
    //   },
    // })
}

/**
 * Delete a session (logout)
 */
export async function deleteSession(sessionId: string): Promise<void> {
    if (redis) {
        try {
            await redis.del(`session:${sessionId}`)
            return
        } catch (error) {
            console.warn('Redis session deletion failed:', error)
        }
    }

    // Fallback: Database deletion
    // await prisma.session.delete({
    //   where: { id: sessionId },
    // })
}

/**
 * Clean up expired sessions (for database storage)
 */
export async function cleanupExpiredSessions(): Promise<void> {
    // Only needed for database storage
    if (!redis) {
        // await prisma.session.deleteMany({
        //   where: {
        //     expiresAt: {
        //       lt: new Date(),
        //     },
        //   },
        // })
    }
}

/**
 * Validate session and check for expiration/inactivity
 */
export async function validateSession(sessionId: string): Promise<SessionData | null> {
    const session = await getSession(sessionId)

    if (!session) return null

    const now = Date.now()
    const sessionAge = now - session.createdAt
    const inactivityTime = now - session.lastActivity

    // Check if session expired (absolute timeout)
    if (sessionAge > SESSION_CONFIG.MAX_AGE * 1000) {
        await deleteSession(sessionId)
        return null
    }

    // Check if session inactive too long (sliding timeout)
    const inactivityLimit = SESSION_CONFIG.INACTIVITY_LIMIT * 1000
    if (inactivityLimit > 0 && inactivityTime > inactivityLimit) {
        await deleteSession(sessionId)
        return null
    }

    // Update last activity
    await updateSessionActivity(sessionId)

    return session
}
