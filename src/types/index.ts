// Core product types
export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    description: string;
    images: string | string[];
    imageUrl?: string; // For parsed single image
    category?: string;
    material?: string;
    stock?: number;
    isFeatured?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Order related types
export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
    id: string;
    orderNumber: string;
    customerEmail: string;
    customerName: string;
    customerPhone?: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
    shippingAddress?: ShippingAddress;
}

export interface ShippingAddress {
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

// Cart types
export interface CartItem {
    id: string;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    imageUrl: string;
    category?: string;
}

// Customer types
export interface Customer {
    id: string;
    email: string;
    name: string;
    phone?: string;
    createdAt: Date;
}

// Review types
export interface Review {
    id: string;
    productId: string;
    customerEmail: string;
    customerName: string;
    rating: number;
    comment: string;
    approved: boolean;
    createdAt: Date;
}

// Analytics types
export interface AnalyticsEvent {
    event: string;
    category?: string;
    label?: string;
    value?: number;
}

export interface ProductAnalytics {
    productId: string;
    productName: string;
    category?: string;
    price: number;
    quantity: number;
}

// API Response types
export interface ApiResponse<T = unknown> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

// Form types
export interface CheckoutFormData {
    email: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
}

export interface CustomOrderFormData {
    orderType: 'modify' | 'scratch';
    productId?: string;
    name: string;
    email: string;
    phone: string;
    material?: string;
    description: string;
    additionalNotes?: string;
    referenceImages?: File[];
}

// Search types
export interface SearchSuggestion {
    id: string;
    name: string;
    slug: string;
    category?: string;
    price: number;
    imageUrl?: string;
}

// Admin types
export interface DashboardStats {
    totalProducts: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
}

// Prisma JSON field types
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];
