export const SESSION_CONFIG = {
    MAX_AGE: 60 * 60 * 24, // 24 hours in seconds
    INACTIVITY_LIMIT: 60 * 60 * 2, // 2 hours of inactivity
    ADMIN_COOKIE_NAME: 'admin_session',
    CUSTOMER_COOKIE_NAME: 'customer_session',
    CSRF_COOKIE_NAME: 'csrf_token',
} as const;

export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    ADMIN_PAGE_SIZE: 20,
} as const;

export const RATE_LIMITS = {
    LOGIN: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        MAX_REQUESTS: 5,
    },
    CHECKOUT: {
        WINDOW_MS: 60 * 1000, // 1 minute
        MAX_REQUESTS: 5,
    },
    ADMIN: {
        WINDOW_MS: 60 * 1000, // 1 minute
        MAX_REQUESTS: 20,
    },
    GENERAL: {
        WINDOW_MS: 60 * 1000, // 1 minute
        MAX_REQUESTS: 60,
    },
    SEARCH: {
        WINDOW_MS: 60 * 1000, // 1 minute
        MAX_REQUESTS: 30,
    },
} as const;

export const PRODUCT_LIMITS = {
    SEARCH_RESULTS: 10,
    RECOMMENDATIONS: 6,
    TRENDING: 8,
    POPULAR: 10,
    RELATED: 4,
} as const;

export const STOCK_THRESHOLDS = {
    LOW_STOCK: 5,
    OUT_OF_STOCK: 0,
} as const;

export const ORDER_STATUSES = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
} as const;

export const CACHE_TTL = {
    PRODUCTS: 300, // 5 minutes
    ORDERS: 60, // 1 minute
    ANALYTICS: 600, // 10 minutes
    SEARCH: 180, // 3 minutes
} as const;

export const IMAGE_CONSTRAINTS = {
    MAX_SIZE_MB: 5,
    MAX_SIZE_BYTES: 5 * 1024 * 1024,
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    DIMENSIONS: {
        PRODUCT: { width: 800, height: 800 },
        THUMBNAIL: { width: 200, height: 200 },
    },
} as const;

export const VALIDATION = {
    PASSWORD_MIN_LENGTH: 8,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 2000,
    PHONE_REGEX: /^\+?[0-9]\d{1,14}$/,
    POSTAL_CODE_MIN_LENGTH: 3,
} as const;

export const DEFAULTS = {
    CURRENCY: 'EUR',
    LOCALE: 'en-US',
    COUNTRY: 'Romania',
    PLACEHOLDER_IMAGE: '/placeholder.jpg',
} as const;
