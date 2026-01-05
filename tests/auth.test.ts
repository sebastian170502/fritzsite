import { describe, it, expect, beforeEach, vi } from 'vitest'
import { hashPassword, comparePassword, generateCSRFToken, validateCSRFToken } from '@/lib/auth'

describe('Authentication', () => {
    describe('Password Hashing', () => {
        it('should hash passwords securely', async () => {
            const password = 'TestPassword123!'
            const hash = await hashPassword(password)

            expect(hash).toBeDefined()
            expect(hash).not.toBe(password)
            expect(hash.length).toBeGreaterThan(20)
            expect(hash).toMatch(/^\$2[aby]\$/)  // bcrypt format
        })

        it('should generate different hashes for same password', async () => {
            const password = 'TestPassword123!'
            const hash1 = await hashPassword(password)
            const hash2 = await hashPassword(password)

            expect(hash1).not.toBe(hash2) // Different salts
        })

        it('should verify correct password', async () => {
            const password = 'TestPassword123!'
            const hash = await hashPassword(password)

            const isValid = await comparePassword(password, hash)
            expect(isValid).toBe(true)
        })

        it('should reject incorrect password', async () => {
            const password = 'TestPassword123!'
            const wrongPassword = 'WrongPassword456!'
            const hash = await hashPassword(password)

            const isValid = await comparePassword(wrongPassword, hash)
            expect(isValid).toBe(false)
        })

        it('should handle empty passwords', async () => {
            const password = ''
            const hash = await hashPassword(password)

            const isValid = await comparePassword('', hash)
            expect(isValid).toBe(true)

            const isInvalid = await comparePassword('notEmpty', hash)
            expect(isInvalid).toBe(false)
        })
    })

    describe('CSRF Token Generation', () => {
        it('should generate CSRF tokens', () => {
            const token = generateCSRFToken()

            expect(token).toBeDefined()
            expect(typeof token).toBe('string')
            expect(token.length).toBeGreaterThan(20)
        })

        it('should generate unique tokens', () => {
            const token1 = generateCSRFToken()
            const token2 = generateCSRFToken()

            expect(token1).not.toBe(token2)
        })

        it('should generate alphanumeric tokens', () => {
            const token = generateCSRFToken()
            expect(token).toMatch(/^[A-Za-z0-9]+$/)
        })
    })

    describe('CSRF Token Validation', () => {
        it('should validate matching tokens', () => {
            const token = 'test-csrf-token-123'
            const isValid = validateCSRFToken(token, token)

            expect(isValid).toBe(true)
        })

        it('should reject non-matching tokens', () => {
            const token = 'test-csrf-token-123'
            const wrongToken = 'different-token-456'
            const isValid = validateCSRFToken(wrongToken, token)

            expect(isValid).toBe(false)
        })

        it('should reject null tokens', () => {
            expect(validateCSRFToken(null, 'session-token')).toBe(false)
            expect(validateCSRFToken('token', null)).toBe(false)
            expect(validateCSRFToken(null, null)).toBe(false)
        })

        it('should reject empty tokens', () => {
            expect(validateCSRFToken('', 'session-token')).toBe(false)
            expect(validateCSRFToken('token', '')).toBe(false)
        })
    })
})
