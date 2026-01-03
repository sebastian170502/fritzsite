import { z } from 'zod';
import { VALIDATION } from './constants';

// Checkout validation
export const checkoutFormSchema = z.object({
    email: z.string().email('Invalid email address'),
    name: z.string()
        .min(VALIDATION.NAME_MIN_LENGTH, 'Name must be at least 2 characters')
        .max(VALIDATION.NAME_MAX_LENGTH, 'Name is too long'),
    phone: z.string()
        .regex(VALIDATION.PHONE_REGEX, 'Invalid phone number format')
        .optional(),
    address: z.string().min(5, 'Address must be at least 5 characters').optional(),
    city: z.string().min(2, 'City name is required').optional(),
    postalCode: z.string()
        .min(VALIDATION.POSTAL_CODE_MIN_LENGTH, 'Invalid postal code')
        .optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

// Custom order validation
export const customOrderSchema = z.object({
    orderType: z.enum(['modify', 'scratch']),
    productId: z.string().optional(),
    name: z.string()
        .min(VALIDATION.NAME_MIN_LENGTH, 'Name is required')
        .max(VALIDATION.NAME_MAX_LENGTH, 'Name is too long'),
    email: z.string().email('Invalid email address'),
    phone: z.string()
        .regex(VALIDATION.PHONE_REGEX, 'Invalid phone number'),
    material: z.string().optional(),
    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(VALIDATION.DESCRIPTION_MAX_LENGTH, 'Description is too long'),
    additionalNotes: z.string().optional(),
});

export type CustomOrderFormData = z.infer<typeof customOrderSchema>;

// Login validation
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(VALIDATION.PASSWORD_MIN_LENGTH, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Signup validation
export const signupSchema = z.object({
    name: z.string()
        .min(VALIDATION.NAME_MIN_LENGTH, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(VALIDATION.PASSWORD_MIN_LENGTH, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    phone: z.string()
        .regex(VALIDATION.PHONE_REGEX, 'Invalid phone number')
        .optional(),
});

export type SignupFormData = z.infer<typeof signupSchema>;

// Review validation
export const reviewSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
    comment: z.string()
        .min(10, 'Comment must be at least 10 characters')
        .max(1000, 'Comment is too long'),
    customerName: z.string().min(2, 'Name is required'),
    customerEmail: z.string().email('Invalid email address'),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

// Product creation/update validation (admin)
export const productSchema = z.object({
    name: z.string().min(2, 'Product name is required'),
    slug: z.string()
        .min(2, 'Slug is required')
        .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    description: z.string().min(10, 'Description is required'),
    price: z.number().positive('Price must be positive'),
    category: z.string().optional(),
    material: z.string().optional(),
    stock: z.number().int().min(0, 'Stock cannot be negative'),
    isFeatured: z.boolean().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Search query validation
export const searchQuerySchema = z.object({
    q: z.string().min(1, 'Search query is required').max(100, 'Query too long'),
    category: z.string().optional(),
    limit: z.number().int().positive().max(100).optional(),
});

export type SearchQueryData = z.infer<typeof searchQuerySchema>;

// Order update validation (admin)
export const orderUpdateSchema = z.object({
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
    trackingNumber: z.string().optional(),
    notes: z.string().max(500, 'Notes too long').optional(),
});

export type OrderUpdateData = z.infer<typeof orderUpdateSchema>;

// Helper function to validate and return typed data
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: true;
    data: T
} | {
    success: false;
    error: z.ZodError
} {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
}
