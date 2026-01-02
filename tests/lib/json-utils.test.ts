import { describe, it, expect } from 'vitest'
import { safeJSONParse, safeJSONStringify } from '@/lib/json-utils'

describe('JSON Utilities', () => {
    describe('safeJSONParse', () => {
        it('should parse valid JSON string', () => {
            const jsonString = '{"name": "Test", "price": 29.99}'
            const result = safeJSONParse(jsonString, {})
            expect(result.name).toBe('Test')
            expect(result.price).toBe(29.99)
        })

        it('should return fallback for invalid JSON', () => {
            const invalidJson = '{invalid json}'
            const fallback = { default: true }
            const result = safeJSONParse(invalidJson, fallback)
            expect(result).toEqual(fallback)
        })

        it('should handle null input', () => {
            const result = safeJSONParse(null as any, { empty: true })
            expect(result).toEqual({ empty: true })
        })

        it('should handle empty string', () => {
            const result = safeJSONParse('', { empty: true })
            expect(result).toEqual({ empty: true })
        })

        it('should parse arrays', () => {
            const jsonString = '[1, 2, 3, 4, 5]'
            const result = safeJSONParse<number[]>(jsonString, [])
            expect(result).toEqual([1, 2, 3, 4, 5])
        })

        it('should parse nested objects', () => {
            const jsonString = '{"user": {"name": "John", "age": 30}}'
            const result = safeJSONParse(jsonString, {})
            expect(result.user.name).toBe('John')
            expect(result.user.age).toBe(30)
        })

        it('should handle malformed JSON with fallback', () => {
            const malformed = '{"name": "Test", price: 29.99}' // Missing quotes
            const fallback = { error: true }
            const result = safeJSONParse(malformed, fallback)
            expect(result).toEqual(fallback)
        })
    })

    describe('safeJSONStringify', () => {
        it('should stringify valid object', () => {
            const obj = { name: 'Test', price: 29.99 }
            const result = safeJSONStringify(obj, '{}')
            expect(result).toBe('{"name":"Test","price":29.99}')
        })

        it('should return fallback for circular references', () => {
            const obj: any = { name: 'Test' }
            obj.self = obj // Create circular reference
            const fallback = '{}'
            const result = safeJSONStringify(obj, fallback)
            expect(result).toBe(fallback)
        })

        it('should handle null value', () => {
            const result = safeJSONStringify(null, '{}')
            expect(result).toBe('null')
        })

        it('should handle undefined with fallback', () => {
            const result = safeJSONStringify(undefined, '{}')
            expect(result).toBeDefined()
        })

        it('should stringify arrays', () => {
            const arr = [1, 2, 3, 4, 5]
            const result = safeJSONStringify(arr, '[]')
            expect(result).toBe('[1,2,3,4,5]')
        })

        it('should stringify nested objects', () => {
            const obj = { user: { name: 'John', age: 30 } }
            const result = safeJSONStringify(obj, '{}')
            expect(result).toContain('"name":"John"')
            expect(result).toContain('"age":30')
        })
    })
})
