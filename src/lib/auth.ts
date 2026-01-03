import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a password with a hash
 * @param password - Plain text password
 * @param hash - Hashed password
 * @returns True if password matches
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Generate a secure random token
 * @param length - Token length (default: 32)
 * @returns Random hex string
 */
export function generateToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
        token += chars[randomValues[i] % chars.length];
    }

    return token;
}

/**
 * Generate CSRF token
 * @returns CSRF token string
 */
export function generateCSRFToken(): string {
    return generateToken(32);
}

/**
 * Validate CSRF token
 * @param token - Token to validate
 * @param sessionToken - Expected token from session
 * @returns True if valid
 */
export function validateCSRFToken(token: string | null, sessionToken: string | null): boolean {
    if (!token || !sessionToken) return false;
    return token === sessionToken;
}
