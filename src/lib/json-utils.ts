/**
 * Safely parse JSON with fallback value
 * @param jsonString - The JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed value or fallback
 */
export function safeJSONParse<T>(jsonString: string | null | undefined, fallback: T): T {
    if (!jsonString) return fallback;

    try {
        return JSON.parse(jsonString) as T;
    } catch (error) {
        console.error('JSON parse error:', error);
        return fallback;
    }
}

/**
 * Safely stringify JSON with fallback
 * @param value - Value to stringify
 * @param fallback - Fallback string if stringify fails
 * @returns JSON string or fallback
 */
export function safeJSONStringify(value: any, fallback: string = '{}'): string {
    try {
        return JSON.stringify(value);
    } catch (error) {
        console.error('JSON stringify error:', error);
        return fallback;
    }
}
