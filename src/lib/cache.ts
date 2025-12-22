/**
 * Simple in-memory cache for Prisma queries
 * Use this for frequently accessed, rarely changed data
 */

interface CacheEntry<T> {
    data: T
    timestamp: number
    ttl: number
}

class SimpleCache {
    private cache: Map<string, CacheEntry<any>> = new Map()

    /**
     * Get cached data or fetch from database
     */
    async get<T>(
        key: string,
        fetcher: () => Promise<T>,
        ttl: number = 300000 // 5 minutes default
    ): Promise<T> {
        const cached = this.cache.get(key)

        // Return cached data if still valid
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
            console.log(`✅ Cache hit: ${key}`)
            return cached.data as T
        }

        // Fetch fresh data
        console.log(`🔄 Cache miss: ${key} - fetching...`)
        const data = await fetcher()

        // Store in cache
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl,
        })

        return data
    }

    /**
     * Invalidate specific cache key
     */
    invalidate(key: string) {
        this.cache.delete(key)
        console.log(`🗑️  Cache invalidated: ${key}`)
    }

    /**
     * Invalidate all cache keys matching pattern
     */
    invalidatePattern(pattern: RegExp) {
        let count = 0
        for (const key of this.cache.keys()) {
            if (pattern.test(key)) {
                this.cache.delete(key)
                count++
            }
        }
        console.log(`🗑️  Cache invalidated ${count} keys matching pattern`)
    }

    /**
     * Clear all cache
     */
    clear() {
        this.cache.clear()
        console.log(`🗑️  Cache cleared`)
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        }
    }
}

// Export singleton instance
export const cache = new SimpleCache()

/**
 * Cache helper functions for common queries
 */

// Cache all products for 5 minutes
export const cacheProducts = () =>
    cache.get('products:all', async () => {
        const { prisma } = await import('./prisma')
        return prisma.product.findMany()
    }, 300000)

// Cache featured products for 10 minutes
export const cacheFeaturedProducts = () =>
    cache.get('products:featured', async () => {
        const { prisma } = await import('./prisma')
        return prisma.product.findMany({
            where: { isFeatured: true },
            take: 10,
        })
    }, 600000)

// Cache product by slug for 5 minutes
export const cacheProduct = (slug: string) =>
    cache.get(`product:${slug}`, async () => {
        const { prisma } = await import('./prisma')
        return prisma.product.findUnique({
            where: { slug },
            include: {
                reviews: {
                    where: { approved: true },
                    take: 10,
                },
            },
        })
    }, 300000)

// Invalidate product cache when updated
export const invalidateProductCache = (slug?: string) => {
    if (slug) {
        cache.invalidate(`product:${slug}`)
    }
    cache.invalidatePattern(/^products:/)
}
