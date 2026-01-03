import { describe, it, expect } from 'vitest'

describe('Utility Functions', () => {
    describe('Currency Formatting', () => {
        it('should format price with two decimals', () => {
            const price = 29.99
            const formatted = price.toFixed(2)
            expect(formatted).toBe('29.99')
        })

        it('should format large numbers with commas', () => {
            const price = 1234.56
            const formatted = price.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
            expect(formatted).toBe('1,234.56')
        })

        it('should handle zero price', () => {
            const price = 0
            const formatted = price.toFixed(2)
            expect(formatted).toBe('0.00')
        })

        it('should handle cents only', () => {
            const price = 0.99
            const formatted = price.toFixed(2)
            expect(formatted).toBe('0.99')
        })

        it('should round to nearest cent', () => {
            const price = 29.996
            const formatted = price.toFixed(2)
            expect(formatted).toBe('30.00')
        })
    })

    describe('Slug Generation', () => {
        it('should generate slug from text', () => {
            const text = 'Test Product Name'
            const slug = text.toLowerCase().replace(/\s+/g, '-')
            expect(slug).toBe('test-product-name')
        })

        it('should remove special characters', () => {
            const text = "Fritz's Hammer!"
            const slug = text
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
            expect(slug).toBe('fritzs-hammer')
        })

        it('should handle multiple spaces', () => {
            const text = 'Multiple   Spaces   Here'
            const slug = text.toLowerCase().replace(/\s+/g, '-')
            expect(slug).toBe('multiple-spaces-here')
        })

        it('should handle leading/trailing spaces', () => {
            const text = '  Trimmed Text  '
            const slug = text.trim().toLowerCase().replace(/\s+/g, '-')
            expect(slug).toBe('trimmed-text')
        })

        it('should handle empty string', () => {
            const text = ''
            const slug = text.toLowerCase().replace(/\s+/g, '-')
            expect(slug).toBe('')
        })
    })

    describe('Date Formatting', () => {
        it('should format date to readable string', () => {
            const date = new Date('2026-01-02')
            const formatted = date.toLocaleDateString('en-US')
            expect(formatted).toContain('2026')
        })

        it('should format date with time', () => {
            const date = new Date('2026-01-02T12:00:00')
            const formatted = date.toLocaleString('en-US')
            expect(formatted).toBeDefined()
        })

        it('should get time ago', () => {
            const now = new Date()
            const hourAgo = new Date(now.getTime() - 60 * 60 * 1000)
            const diff = Math.floor((now.getTime() - hourAgo.getTime()) / 1000 / 60)
            expect(diff).toBeGreaterThanOrEqual(59)
        })
    })

    describe('Email Validation', () => {
        it('should validate correct email', () => {
            const email = 'user@example.com'
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            expect(emailRegex.test(email)).toBe(true)
        })

        it('should reject invalid email', () => {
            const email = 'invalid-email'
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            expect(emailRegex.test(email)).toBe(false)
        })

        it('should reject email without @', () => {
            const email = 'userexample.com'
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            expect(emailRegex.test(email)).toBe(false)
        })

        it('should reject email without domain', () => {
            const email = 'user@'
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            expect(emailRegex.test(email)).toBe(false)
        })
    })

    describe('Phone Number Validation', () => {
        it('should validate US phone format', () => {
            const phone = '+1234567890'
            expect(phone.length).toBeGreaterThanOrEqual(10)
            expect(phone.startsWith('+')).toBe(true)
        })

        it('should validate international format', () => {
            const phone = '+441234567890'
            expect(phone.startsWith('+')).toBe(true)
        })

        it('should strip non-digits for validation', () => {
            const phone = '(123) 456-7890'
            const digits = phone.replace(/\D/g, '')
            expect(digits).toBe('1234567890')
            expect(digits.length).toBe(10)
        })
    })

    describe('Array Utilities', () => {
        it('should chunk array into groups', () => {
            const items = [1, 2, 3, 4, 5, 6, 7, 8]
            const chunkSize = 3
            const chunks: number[][] = []
            for (let i = 0; i < items.length; i += chunkSize) {
                chunks.push(items.slice(i, i + chunkSize))
            }
            expect(chunks.length).toBe(3)
            expect(chunks[0].length).toBe(3)
            expect(chunks[2].length).toBe(2)
        })

        it('should remove duplicates', () => {
            const items = [1, 2, 2, 3, 3, 3, 4]
            const unique = [...new Set(items)]
            expect(unique).toEqual([1, 2, 3, 4])
        })

        it('should shuffle array', () => {
            const items = [1, 2, 3, 4, 5]
            const shuffled = [...items].sort(() => Math.random() - 0.5)
            expect(shuffled.length).toBe(items.length)
        })
    })

    describe('String Utilities', () => {
        it('should truncate long text', () => {
            const text = 'This is a very long text that needs to be truncated'
            const maxLength = 20
            const truncated = text.length > maxLength
                ? text.substring(0, maxLength) + '...'
                : text
            expect(truncated.length).toBeLessThanOrEqual(maxLength + 3)
        })

        it('should capitalize first letter', () => {
            const text = 'hello world'
            const capitalized = text.charAt(0).toUpperCase() + text.slice(1)
            expect(capitalized).toBe('Hello world')
        })

        it('should convert to title case', () => {
            const text = 'hello world'
            const titleCase = text
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
            expect(titleCase).toBe('Hello World')
        })
    })
})
