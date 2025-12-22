/**
 * Shared helper functions used across the application
 */

/**
 * Safely parse product images from JSON string or array
 */
export function parseProductImages(images: any): string[] {
    if (!images) return ["/placeholder.jpg"]

    try {
        const parsed = typeof images === 'string' ? JSON.parse(images) : images
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed
        }
    } catch (e) {
        console.error('Failed to parse images:', e)
    }

    return ["/placeholder.jpg"]
}

/**
 * Get the first image URL from product images
 */
export function getFirstProductImage(images: any): string {
    const parsed = parseProductImages(images)
    return parsed[0]
}

/**
 * Currency conversion rate (EUR to RON)
 */
export const EUR_TO_RON = 5

/**
 * Format price in EUR
 */
export function formatEUR(amount: number): string {
    return new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount)
}

/**
 * Format price in RON
 */
export function formatRON(amountInEUR: number): string {
    return new Intl.NumberFormat('ro-RO', {
        style: 'currency',
        currency: 'RON'
    }).format(amountInEUR * EUR_TO_RON)
}

/**
 * Generate URL-friendly slug from string
 */
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}
