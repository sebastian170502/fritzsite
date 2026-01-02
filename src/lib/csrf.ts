import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateCSRFToken } from '@/lib/auth';

/**
 * CSRF Protection Middleware
 * Validates CSRF token for state-changing requests (POST, PUT, DELETE, PATCH)
 */
export async function validateCSRF(request: Request): Promise<boolean> {
    const method = request.method;

    // Only check CSRF for state-changing methods
    if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
        return true;
    }

    // Skip CSRF for public endpoints
    const url = new URL(request.url);
    const publicEndpoints = [
        '/api/webhook', // Stripe webhook
        '/api/auth/login',
        '/api/admin/login',
        '/api/customer/login',
        '/api/customer/signup',
    ];

    if (publicEndpoints.some(endpoint => url.pathname === endpoint)) {
        return true;
    }

    // Get CSRF token from header or body
    const csrfTokenHeader = request.headers.get('x-csrf-token');

    // Get session CSRF token
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('csrf_token')?.value;

    return validateCSRFToken(csrfTokenHeader, sessionToken || null);
}

/**
 * Create CSRF error response
 */
export function createCSRFErrorResponse(): NextResponse {
    return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
    );
}
