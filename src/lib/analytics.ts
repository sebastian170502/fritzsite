/**
 * Analytics and tracking utilities for Google Analytics 4
 */

declare global {
    interface Window {
        gtag?: (...args: any[]) => void
        dataLayer?: any[]
    }
}

export interface AnalyticsEvent {
    action: string
    category?: string
    label?: string
    value?: number
    [key: string]: any
}

/**
 * Initialize Google Analytics
 */
export function initAnalytics(measurementId: string) {
    if (typeof window === 'undefined' || !measurementId) return

    // Load gtag script
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script1)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
        window.dataLayer?.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', measurementId, {
        page_path: window.location.pathname,
    })
}

/**
 * Track page view
 */
export function trackPageView(url: string, title?: string) {
    if (typeof window === 'undefined' || !window.gtag) return

    window.gtag('event', 'page_view', {
        page_path: url,
        page_title: title,
    })
}

/**
 * Track custom event
 */
export function trackEvent(event: AnalyticsEvent) {
    if (typeof window === 'undefined' || !window.gtag) return

    const { action, category, label, value, ...params } = event

    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value,
        ...params,
    })
}

/**
 * Track product view
 */
export function trackProductView(product: {
    id: string
    name: string
    category?: string
    price: number
    brand?: string
}) {
    trackEvent({
        action: 'view_item',
        items: [{
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            price: product.price,
            item_brand: product.brand || 'FritzForge',
        }]
    })
}

/**
 * Track add to cart
 */
export function trackAddToCart(product: {
    id: string
    name: string
    category?: string
    price: number
    quantity?: number
}) {
    if (!product) return
    trackEvent({
        action: 'add_to_cart',
        currency: 'RON',
        value: product.price * (product.quantity || 1),
        items: [{
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            price: product.price,
            quantity: product.quantity || 1,
        }]
    })
}

/**
 * Track remove from cart
 */
export function trackRemoveFromCart(product: {
    id: string
    name: string
    category?: string
    price: number
    quantity?: number
}) {
    trackEvent({
        action: 'remove_from_cart',
        currency: 'RON',
        value: product.price * (product.quantity || 1),
        items: [{
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            price: product.price,
            quantity: product.quantity || 1,
        }]
    })
}

/**
 * Track begin checkout
 */
export function trackBeginCheckout(items: Array<{
    id: string
    name: string
    category?: string
    price: number
    quantity: number
}>, totalValue: number) {
    trackEvent({
        action: 'begin_checkout',
        currency: 'RON',
        value: totalValue,
        items: items.map(item => ({
            item_id: item.id,
            item_name: item.name,
            item_category: item.category,
            price: item.price,
            quantity: item.quantity,
        }))
    })
}

/**
 * Track purchase
 */
export function trackPurchase(
    transactionId: string,
    items: Array<{
        id: string
        name: string
        category?: string
        price: number
        quantity: number
    }>,
    totalValue: number
) {
    if (!items) return
    trackEvent({
        action: 'purchase',
        transaction_id: transactionId,
        currency: 'RON',
        value: totalValue,
        items: items.map(item => ({
            item_id: item.id,
            item_name: item.name,
            item_category: item.category,
            price: item.price,
            quantity: item.quantity,
        }))
    })
}

/**
 * Track search
 */
export function trackSearch(searchTerm: string, resultsCount?: number) {
    trackEvent({
        action: 'search',
        search_term: searchTerm,
        results_count: resultsCount,
    })
}

/**
 * Track custom order request
 */
export function trackCustomOrder(orderType: string, orderId: string) {
    trackEvent({
        action: 'custom_order_request',
        category: 'engagement',
        label: orderType,
        custom_order_id: orderId,
    })
}

/**
 * Track newsletter signup
 */
export function trackNewsletterSignup(email: string) {
    trackEvent({
        action: 'newsletter_signup',
        category: 'engagement',
        label: 'footer',
    })
}

/**
 * Track external link click
 */
export function trackExternalLink(url: string, label?: string) {
    trackEvent({
        action: 'click',
        category: 'external_link',
        label: label || url,
        value: 1,
    })
}

/**
 * Track share
 */
export function trackShare(method: string, contentType: string, itemId?: string) {
    trackEvent({
        action: 'share',
        method,
        content_type: contentType,
        item_id: itemId,
    })
}

/**
 * Track filter usage
 */
export function trackFilter(filterType: string, filterValue: string) {
    trackEvent({
        action: 'filter',
        category: 'product_discovery',
        label: `${filterType}: ${filterValue}`,
    })
}

/**
 * Track error
 */
export function trackError(errorMessage: string, errorLocation: string) {
    trackEvent({
        action: 'exception',
        description: errorMessage,
        fatal: false,
        error_location: errorLocation,
    })
}
