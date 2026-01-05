# API Documentation

## Overview
This document provides detailed information about the Fritz Forge API endpoints, authentication, rate limiting, and best practices.

## Base URL
- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com`

## Interactive Documentation
Visit `/api-docs` for interactive Swagger UI documentation where you can test endpoints directly.

---

## Authentication

### Admin Authentication
Admin endpoints require session authentication via cookies.

**Login**: `POST /api/admin/login`

```json
{
  "username": "admin",
  "password": "your-password"
}
```

**Response**:
```json
{
  "success": true,
  "csrfToken": "abc123..."
}
```

**Rate Limit**: 5 attempts per 15 minutes per IP

### Customer Authentication
Customer endpoints use session cookies from email verification.

---

## Rate Limiting

All endpoints are rate-limited to prevent abuse:

| Endpoint Type   | Limit        | Window     |
| --------------- | ------------ | ---------- |
| Admin Login     | 5 requests   | 15 minutes |
| Product Listing | 100 requests | 1 minute   |
| Checkout        | 10 requests  | 1 minute   |
| Reviews         | 5 requests   | 1 minute   |
| Custom Orders   | 3 requests   | 5 minutes  |

**Headers**:
- `X-RateLimit-Limit`: Total requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Unix timestamp when limit resets

**Response (429 Too Many Requests)**:
```json
{
  "error": "Too many requests",
  "retryAfter": 900
}
```

---

## Products API

### Get All Products
`GET /api/products`

**Query Parameters**:
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `category` (string, optional) - Filter by category
- `search` (string, optional) - Search query

**Response**:
```json
[
  {
    "id": "uuid",
    "name": "Kitchen Knife",
    "slug": "kitchen-knife",
    "description": "Professional kitchen knife...",
    "price": 149.99,
    "stock": 5,
    "images": ["image1.jpg", "image2.jpg"],
    "material": "Damascus Steel",
    "category": "knives",
    "isFeatured": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### Get Featured Products
`GET /api/products/featured`

Returns products marked as featured for homepage display.

### Get Product by Slug
`GET /api/products/{slug}`

**Parameters**:
- `slug` (string) - Product URL slug

**Response**: Single product object (see above)

**Error Responses**:
- `404` - Product not found

---

## Orders API

### Create Checkout Session
`POST /api/checkout`

Creates a Stripe checkout session for purchasing products.

**Request Body**:
```json
{
  "items": [
    {
      "id": "product-uuid",
      "name": "Kitchen Knife",
      "price": 149.99,
      "quantity": 1,
      "image": "image.jpg"
    }
  ],
  "customerInfo": {
    "email": "customer@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "address": {
      "line1": "123 Main St",
      "line2": "Apt 4",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "US"
    }
  }
}
```

**Response**:
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

**Error Responses**:
- `400` - Invalid request body or out of stock
- `500` - Stripe API error

---

## Custom Orders API

### Submit Custom Order Request
`POST /api/custom-order`

**Request Body** (Scratch Order):
```json
{
  "email": "customer@example.com",
  "phone": "+1234567890",
  "orderType": "scratch",
  "material": "Damascus Steel",
  "bladeWidth": "2 inches",
  "bladeLength": "8 inches",
  "handleLength": "5 inches",
  "additionalNotes": "Special engravings...",
  "images": ["base64-image-data..."]
}
```

**Request Body** (Modify Existing):
```json
{
  "email": "customer@example.com",
  "phone": "+1234567890",
  "orderType": "modify",
  "productId": "product-uuid",
  "modifications": "Change handle material to walnut",
  "images": ["base64-image-data..."]
}
```

**Response**:
```json
{
  "success": true,
  "orderId": "order-uuid"
}
```

**Validation**:
- Email must be valid format
- Phone must be valid international format
- Images max 5 files, 5MB each
- Order type must be "scratch" or "modify"

---

## Reviews API

### Get Product Reviews
`GET /api/reviews?productId={uuid}`

**Query Parameters**:
- `productId` (string, required) - Product UUID

**Response**:
```json
[
  {
    "id": "review-uuid",
    "productId": "product-uuid",
    "customerName": "John Doe",
    "email": "john@example.com",
    "rating": 5,
    "title": "Excellent knife!",
    "comment": "Best purchase ever...",
    "verified": true,
    "approved": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### Create Product Review
`POST /api/reviews`

**Request Body**:
```json
{
  "productId": "product-uuid",
  "customerName": "John Doe",
  "email": "john@example.com",
  "rating": 5,
  "title": "Excellent knife!",
  "comment": "Best purchase ever..."
}
```

**Response**: Review object (see above)

**Validation**:
- Rating must be 1-5
- Email must be valid
- Comment required (min 10 characters)

---

## Admin API

### Admin Login
`POST /api/admin/login`

See [Authentication](#admin-authentication) section.

### Get All Products (Admin)
`GET /api/admin/products`

**Authentication**: Required

Returns all products including unpublished ones.

### Create Product
`POST /api/admin/products`

**Authentication**: Required

**Request Body**:
```json
{
  "name": "New Knife",
  "slug": "new-knife",
  "description": "Description...",
  "price": 199.99,
  "stock": 10,
  "images": ["image1.jpg"],
  "material": "Carbon Steel",
  "category": "knives",
  "isFeatured": false
}
```

### Update Product
`PATCH /api/admin/products/{id}`

**Authentication**: Required

Same body structure as create, all fields optional.

### Delete Product
`DELETE /api/admin/products/{id}`

**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "message": "Product deleted"
}
```

### Get All Orders (Admin)
`GET /api/admin/orders`

**Authentication**: Required

Returns all orders with customer details.

### Update Order Status
`PATCH /api/admin/orders/{id}`

**Authentication**: Required

**Request Body**:
```json
{
  "status": "processing",
  "trackingNumber": "1Z999AA10123456784"
}
```

**Status Values**:
- `pending` - Order received
- `processing` - Being prepared
- `shipped` - In transit
- `delivered` - Completed
- `cancelled` - Cancelled

---

## Customer API

### Customer Profile
`GET /api/customer/profile`

**Authentication**: Required

**Response**:
```json
{
  "id": "customer-uuid",
  "email": "customer@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### Get Customer Orders
`GET /api/customer/orders`

**Authentication**: Required

Returns orders for logged-in customer.

### Get Wishlist
`GET /api/customer/wishlist`

**Authentication**: Required

**Response**:
```json
[
  {
    "id": "wishlist-uuid",
    "productId": "product-uuid",
    "product": { /* Product object */ },
    "addedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### Add to Wishlist
`POST /api/customer/wishlist`

**Authentication**: Required

**Request Body**:
```json
{
  "productId": "product-uuid"
}
```

### Remove from Wishlist
`DELETE /api/customer/wishlist/{productId}`

**Authentication**: Required

---

## Search API

### Search Products
`GET /api/search?q={query}`

**Query Parameters**:
- `q` (string, required) - Search query
- `category` (string, optional) - Filter by category
- `minPrice` (number, optional) - Minimum price
- `maxPrice` (number, optional) - Maximum price

**Response**: Array of products matching query

---

## Analytics API

### Get Sales Statistics (Admin)
`GET /api/admin/analytics/sales`

**Authentication**: Required

**Query Parameters**:
- `startDate` (ISO date) - Start of period
- `endDate` (ISO date) - End of period

**Response**:
```json
{
  "totalRevenue": 15000.00,
  "totalOrders": 120,
  "averageOrderValue": 125.00,
  "topProducts": [
    {
      "id": "product-uuid",
      "name": "Kitchen Knife",
      "sales": 45,
      "revenue": 6749.55
    }
  ]
}
```

---

## Error Responses

All endpoints follow consistent error format:

```json
{
  "error": "Error message",
  "details": {
    "field": "Additional context"
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (login required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## Best Practices

### Pagination
Always use pagination for list endpoints:
```
GET /api/products?page=1&limit=20
```

### Error Handling
Always check response status and handle errors:
```typescript
const response = await fetch('/api/products');
if (!response.ok) {
  const error = await response.json();
  console.error('Error:', error.error);
}
```

### Rate Limiting
Monitor rate limit headers and implement exponential backoff:
```typescript
const remaining = response.headers.get('X-RateLimit-Remaining');
if (remaining && parseInt(remaining) < 5) {
  // Slow down requests
}
```

### Image Upload
For custom orders, convert images to base64 and ensure:
- Max 5 images per order
- Each image < 5MB
- Supported formats: JPG, PNG, WebP

---

## Webhooks

### Stripe Webhooks
`POST /api/webhooks/stripe`

Handles payment confirmations and order fulfillment.

**Events**:
- `checkout.session.completed` - Payment successful
- `charge.refunded` - Refund processed

---

## Testing

### Test Mode
Use Stripe test keys for testing payments:
- Test Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

### Sample API Calls

**Get Products**:
```bash
curl http://localhost:3000/api/products
```

**Create Review**:
```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "uuid",
    "customerName": "John",
    "email": "john@example.com",
    "rating": 5,
    "comment": "Great product!"
  }'
```

---

## Support

For API questions or issues:
- Email: fritzsforge@gmail.com
- Documentation: `/api-docs` (Swagger UI)
- Rate limit increases: Contact support

---

## Changelog

### Version 1.0.0 (2025-01-20)
- Initial API documentation
- 34 documented endpoints
- OpenAPI 3.0 specification
- Interactive Swagger UI
