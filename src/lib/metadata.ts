import { Metadata } from 'next'

export const siteConfig = {
    name: "Fritz's Forge",
    description: "Handcrafted metalwork and blacksmithing. Unique knives, tools, jewelry, and hardware forged with traditional techniques.",
    url: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
    ogImage: '/og-image.jpg',
    links: {
        github: 'https://github.com/sebastian170502/fritzsite',
    },
}

export function createMetadata({
    title,
    description,
    image,
    path = '',
    noIndex = false,
}: {
    title: string
    description?: string
    image?: string
    path?: string
    noIndex?: boolean
}): Metadata {
    const url = `${siteConfig.url}${path}`
    const ogImage = image || siteConfig.ogImage

    return {
        title: {
            default: title,
            template: `%s | ${siteConfig.name}`,
        },
        description: description || siteConfig.description,
        keywords: [
            'blacksmith',
            'handmade',
            'metalwork',
            'forge',
            'knives',
            'tools',
            'jewelry',
            'hardware',
            'handcrafted',
            'artisan',
        ],
        authors: [{ name: siteConfig.name }],
        creator: siteConfig.name,
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url,
            title,
            description: description || siteConfig.description,
            siteName: siteConfig.name,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: description || siteConfig.description,
            images: [ogImage],
        },
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
    }
}

/**
 * Generate JSON-LD structured data for a product
 */
export function generateProductJsonLd(product: {
    name: string
    description: string
    price: number
    images: string[]
    slug: string
    rating?: number
    reviewCount?: number
    inStock?: boolean
}) {
    const url = `${siteConfig.url}/shop/${product.slug}`
    const imageUrl = product.images[0]?.startsWith('http')
        ? product.images[0]
        : `${siteConfig.url}${product.images[0]}`

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: imageUrl,
        url,
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'RON',
            availability: product.inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            url,
        },
        ...(product.rating && product.reviewCount && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating,
                reviewCount: product.reviewCount,
            },
        }),
    }
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        description: siteConfig.description,
        sameAs: [
            siteConfig.links.github,
        ],
    }
}

/**
 * Generate JSON-LD breadcrumb list
 */
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${siteConfig.url}${item.url}`,
        })),
    }
}
