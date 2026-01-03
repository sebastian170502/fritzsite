import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public code?: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export class ValidationError extends ApiError {
    constructor(message: string, details?: unknown) {
        super(message, 400, 'VALIDATION_ERROR', details);
        this.name = 'ValidationError';
    }
}

export class AuthenticationError extends ApiError {
    constructor(message: string = 'Authentication required') {
        super(message, 401, 'AUTHENTICATION_ERROR');
        this.name = 'AuthenticationError';
    }
}

export class AuthorizationError extends ApiError {
    constructor(message: string = 'Insufficient permissions') {
        super(message, 403, 'AUTHORIZATION_ERROR');
        this.name = 'AuthorizationError';
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string = 'Resource not found') {
        super(message, 404, 'NOT_FOUND_ERROR');
        this.name = 'NotFoundError';
    }
}

export class RateLimitError extends ApiError {
    constructor(retryAfter?: number) {
        super('Too many requests', 429, 'RATE_LIMIT_ERROR', { retryAfter });
        this.name = 'RateLimitError';
    }
}

// Standardized error response handler
export function handleApiError(error: unknown): NextResponse {
    // Log error for monitoring (replace with your logging service)
    console.error('[API Error]', {
        error,
        timestamp: new Date().toISOString(),
        stack: error instanceof Error ? error.stack : undefined,
    });

    // Handle known API errors
    if (error instanceof ApiError) {
        const response: Record<string, unknown> = {
            error: error.message,
            code: error.code,
        };

        if (error.details) {
            response.details = error.details;
        }

        const headers: Record<string, string> = {};

        // Add retry-after header for rate limit errors
        if (error instanceof RateLimitError && error.details) {
            const retryAfter = (error.details as { retryAfter?: number }).retryAfter;
            if (retryAfter) {
                headers['Retry-After'] = String(retryAfter);
            }
        }

        return NextResponse.json(response, {
            status: error.statusCode,
            headers
        });
    }

    // Handle Zod validation errors
    if (error instanceof ZodError) {
        return NextResponse.json(
            {
                error: 'Validation failed',
                code: 'VALIDATION_ERROR',
                details: error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                })),
            },
            { status: 400 }
        );
    }

    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
        const prismaError = error as { code: string; meta?: unknown };

        if (prismaError.code === 'P2002') {
            return NextResponse.json(
                { error: 'A record with this information already exists', code: 'DUPLICATE_ERROR' },
                { status: 409 }
            );
        }

        if (prismaError.code === 'P2025') {
            return NextResponse.json(
                { error: 'Record not found', code: 'NOT_FOUND_ERROR' },
                { status: 404 }
            );
        }
    }

    // Generic error (don't expose internal details)
    return NextResponse.json(
        {
            error: 'Internal server error',
            code: 'INTERNAL_ERROR',
            // Only include error message in development
            ...(process.env.NODE_ENV === 'development' && {
                details: error instanceof Error ? error.message : String(error)
            })
        },
        { status: 500 }
    );
}

// Type guard for API errors
export function isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
}

// Helper to throw API errors
export function throwApiError(
    message: string,
    statusCode: number = 500,
    code?: string
): never {
    throw new ApiError(message, statusCode, code);
}
