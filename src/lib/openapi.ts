/**
 * OpenAPI Specification
 * Documents all API endpoints with request/response schemas
 */

export const openApiSpec = {
    openapi: '3.0.0',
    info: {
        title: 'Fritz Forge API',
        version: '1.0.0',
        description: 'E-commerce API for handcrafted tools and custom orders',
        contact: {
            name: 'Fritz Forge',
            email: 'fritzsforge@gmail.com',
        },
    },
    servers: [
        {
            url: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
            description: 'API Server',
        },
    ],
    tags: [
        { name: 'Products', description: 'Product management endpoints' },
        { name: 'Orders', description: 'Order management endpoints' },
        { name: 'Custom Orders', description: 'Custom order requests' },
        { name: 'Reviews', description: 'Product review endpoints' },
        { name: 'Admin', description: 'Admin panel endpoints' },
        { name: 'Customer', description: 'Customer account endpoints' },
        { name: 'Search', description: 'Search and filtering endpoints' },
        { name: 'Analytics', description: 'Analytics and reporting' },
    ],
    paths: {
        '/api/products': {
            get: {
                tags: ['Products'],
                summary: 'Get all products',
                description: 'Retrieve a paginated list of products with optional filtering',
                parameters: [
                    {
                        name: 'page',
                        in: 'query',
                        schema: { type: 'integer', default: 1 },
                        description: 'Page number',
                    },
                    {
                        name: 'limit',
                        in: 'query',
                        schema: { type: 'integer', default: 10 },
                        description: 'Items per page',
                    },
                    {
                        name: 'category',
                        in: 'query',
                        schema: { type: 'string' },
                        description: 'Filter by category',
                    },
                    {
                        name: 'search',
                        in: 'query',
                        schema: { type: 'string' },
                        description: 'Search query',
                    },
                ],
                responses: {
                    200: {
                        description: 'List of products',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Product' },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/products/featured': {
            get: {
                tags: ['Products'],
                summary: 'Get featured products',
                description: 'Retrieve featured products for homepage display',
                responses: {
                    200: {
                        description: 'List of featured products',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Product' },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/products/{slug}': {
            get: {
                tags: ['Products'],
                summary: 'Get product by slug',
                parameters: [
                    {
                        name: 'slug',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        description: 'Product slug',
                    },
                ],
                responses: {
                    200: {
                        description: 'Product details',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Product' },
                            },
                        },
                    },
                    404: {
                        description: 'Product not found',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/api/checkout': {
            post: {
                tags: ['Orders'],
                summary: 'Create checkout session',
                description: 'Create a Stripe checkout session for cart items',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['items', 'customerInfo'],
                                properties: {
                                    items: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/CartItem' },
                                    },
                                    customerInfo: {
                                        $ref: '#/components/schemas/CustomerInfo',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Checkout session created',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        sessionId: { type: 'string' },
                                        url: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Validation error',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/api/custom-order': {
            post: {
                tags: ['Custom Orders'],
                summary: 'Submit custom order request',
                description: 'Create a custom order request (scratch or modify)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CustomOrderRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Custom order created',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        orderId: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Validation error',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/api/reviews': {
            get: {
                tags: ['Reviews'],
                summary: 'Get product reviews',
                parameters: [
                    {
                        name: 'productId',
                        in: 'query',
                        required: true,
                        schema: { type: 'string' },
                        description: 'Product ID',
                    },
                ],
                responses: {
                    200: {
                        description: 'List of reviews',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Review' },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['Reviews'],
                summary: 'Create product review',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ReviewInput' },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Review created',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Review' },
                            },
                        },
                    },
                },
            },
        },
        '/api/admin/login': {
            post: {
                tags: ['Admin'],
                summary: 'Admin login',
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['username', 'password'],
                                properties: {
                                    username: { type: 'string' },
                                    password: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Login successful',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        csrfToken: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Invalid credentials',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                    429: {
                        description: 'Too many login attempts',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/api/admin/products': {
            get: {
                tags: ['Admin'],
                summary: 'Get all products (admin)',
                security: [{ adminAuth: [] }],
                responses: {
                    200: {
                        description: 'List of products',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Product' },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['Admin'],
                summary: 'Create product',
                security: [{ adminAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ProductInput' },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Product created',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Product' },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        securitySchemes: {
            adminAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'admin_session',
                description: 'Admin session cookie',
            },
            customerAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'customer_session',
                description: 'Customer session cookie',
            },
        },
        schemas: {
            Product: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    slug: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number', format: 'float' },
                    stock: { type: 'integer' },
                    images: { type: 'array', items: { type: 'string' } },
                    material: { type: 'string', nullable: true },
                    category: { type: 'string', nullable: true },
                    isFeatured: { type: 'boolean' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
            CartItem: {
                type: 'object',
                required: ['id', 'name', 'price', 'quantity'],
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    price: { type: 'number' },
                    quantity: { type: 'integer', minimum: 1 },
                    image: { type: 'string' },
                },
            },
            CustomerInfo: {
                type: 'object',
                required: ['email', 'name', 'phone', 'address'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    name: { type: 'string' },
                    phone: { type: 'string' },
                    address: {
                        type: 'object',
                        required: ['line1', 'city', 'postalCode', 'country'],
                        properties: {
                            line1: { type: 'string' },
                            line2: { type: 'string' },
                            city: { type: 'string' },
                            state: { type: 'string' },
                            postalCode: { type: 'string' },
                            country: { type: 'string' },
                        },
                    },
                },
            },
            CustomOrderRequest: {
                type: 'object',
                required: ['email', 'phone', 'orderType'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    phone: { type: 'string' },
                    orderType: { type: 'string', enum: ['scratch', 'modify'] },
                    material: { type: 'string' },
                    bladeWidth: { type: 'string' },
                    bladeLength: { type: 'string' },
                    handleLength: { type: 'string' },
                    productId: { type: 'string' },
                    modifications: { type: 'string' },
                    additionalNotes: { type: 'string' },
                    images: { type: 'array', items: { type: 'string' } },
                },
            },
            Review: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    productId: { type: 'string', format: 'uuid' },
                    customerName: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    rating: { type: 'integer', minimum: 1, maximum: 5 },
                    title: { type: 'string' },
                    comment: { type: 'string' },
                    verified: { type: 'boolean' },
                    approved: { type: 'boolean' },
                    createdAt: { type: 'string', format: 'date-time' },
                },
            },
            ReviewInput: {
                type: 'object',
                required: ['productId', 'customerName', 'email', 'rating', 'comment'],
                properties: {
                    productId: { type: 'string' },
                    customerName: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    rating: { type: 'integer', minimum: 1, maximum: 5 },
                    title: { type: 'string' },
                    comment: { type: 'string' },
                },
            },
            ProductInput: {
                type: 'object',
                required: ['name', 'description', 'price', 'stock'],
                properties: {
                    name: { type: 'string' },
                    slug: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    stock: { type: 'integer' },
                    images: { type: 'array', items: { type: 'string' } },
                    material: { type: 'string' },
                    category: { type: 'string' },
                    isFeatured: { type: 'boolean' },
                },
            },
            Error: {
                type: 'object',
                properties: {
                    error: { type: 'string' },
                    details: { type: 'object' },
                    timestamp: { type: 'string', format: 'date-time' },
                },
            },
        },
    },
};
