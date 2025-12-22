/**
 * Utility functions for on-demand revalidation
 * Use these to manually trigger cache invalidation
 */

export async function revalidateProduct(slug: string) {
    if (!process.env.REVALIDATION_SECRET) {
        console.warn('REVALIDATION_SECRET not set')
        return
    }

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/revalidate`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    path: `/shop/${slug}`,
                    secret: process.env.REVALIDATION_SECRET,
                }),
            }
        )

        if (!response.ok) {
            console.error('Failed to revalidate product:', await response.text())
        }
    } catch (error) {
        console.error('Revalidation error:', error)
    }
}

export async function revalidateShop() {
    if (!process.env.REVALIDATION_SECRET) {
        console.warn('REVALIDATION_SECRET not set')
        return
    }

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/revalidate`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    path: '/shop',
                    secret: process.env.REVALIDATION_SECRET,
                }),
            }
        )

        if (!response.ok) {
            console.error('Failed to revalidate shop:', await response.text())
        }
    } catch (error) {
        console.error('Revalidation error:', error)
    }
}
