/**
 * Error logging and tracking utilities
 */

interface ErrorLogOptions {
    error: Error
    context?: Record<string, any>
    severity?: 'low' | 'medium' | 'high' | 'critical'
    userId?: string
}

/**
 * Log error to console or external service
 */
export function logError({ error, context, severity = 'medium', userId }: ErrorLogOptions) {
    const errorData = {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        severity,
        context,
        userId,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.error('Error logged:', errorData)
    }

    // In production, send to error tracking service (Sentry, etc.)
    if (process.env.NODE_ENV === 'production') {
        // TODO: Send to Sentry, LogRocket, or other error tracking service
        // Example: Sentry.captureException(error, { extra: errorData })
    }

    return errorData
}

/**
 * Format error message for user display
 */
export function formatErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message
    }
    if (typeof error === 'string') {
        return error
    }
    return 'An unexpected error occurred'
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
    if (error instanceof TypeError && error.message.includes('fetch')) {
        return true
    }
    return false
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
    if (error instanceof Error && error.message.includes('validation')) {
        return true
    }
    return false
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    let lastError: Error | undefined

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn()
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error))

            if (attempt < maxRetries - 1) {
                const delay = baseDelay * Math.pow(2, attempt)
                await new Promise(resolve => setTimeout(resolve, delay))
            }
        }
    }

    throw lastError
}
