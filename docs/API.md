# API Documentation

## Overview
This document provides comprehensive documentation for all API endpoints in Fritz's Forge e-commerce platform.

Base URL: `http://localhost:3000` (development) or your production domain

---

## Table of Contents
1. [Authentication](#authentication)
2. [Products](#products)
3. [Orders](#orders)
4. [Recommendations](#recommendations)
5. [Inventory](#inventory)
6. [Analytics](#analytics)
7. [Payments](#payments)

---

## Authentication

All admin endpoints require authentication via cookies:
- `admin_session` - Admin authentication cookie
- `customer_session` - Customer authentication cookie

---

## Products

### Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `category` (optional) - Filter by category
- `search` (optional) - Search by name or description
- `minPrice` (optional) - Minimum price filter
- `maxPrice` (optional) - Maximum price filter
- `inStock` (optional) - Filter in-stock items only (true/false)

**Response:**
```json
{
  "products": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "price": number,
      "stock": number,
      "category": "string",
      "material": "string",
      "images": ["string"],
      "createdAt": "ISO8601 date"
    }
  ],
  "count": number
}
```

---

## Orders

### Create Order
```http
POST /api/orders
```

**Request Body:**
```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "price": number,
      "quantity": number
    }
  ],
  "customerEmail": "string",
  "shippingAddress": {
    "name": "string",
    "address": "string",
    "city": "string",
    "postalCode": "string",
    "country": "string"
  },
  "paymentMethod": "stripe" | "paypal"
}
```

**Response:**
```json
{
  "orderId": "string",
  "status": "pending" | "processing" | "completed",
  "total": number,
  "paymentIntent": "string" // Stripe only
}
```

### Get Order by ID
```http
GET /api/orders/:id
```

**Authentication:** Required (admin or order owner)

**Response:**
```json
{
  "id": "string",
  "customerEmail": "string",
  "items": [...],
  "total": number,
  "status": "string",
  "paymentMethod": "string",
  "shippingAddress": {...},
  "createdAt": "ISO8601 date"
}
```

### Download Invoice
```http
GET /api/invoices/:id
```

**Authentication:** Required (admin or order owner)

**Response:** PDF file download

---

## Recommendations

### Get Product Recommendations
```http
GET /api/recommendations
```

**Query Parameters:**
- `type` (required) - Recommendation type: `collaborative`, `category`, `trending`, `personalized`
- `productId` (conditional) - Required for `collaborative` and `category` types
- `customerEmail` (conditional) - Required for `personalized` type
- `limit` (optional) - Number of recommendations (default: 4)

**Response:**
```json
{
  "recommendations": [
    {
      "id": "string",
      "name": "string",
      "price": number,
      "images": ["string"],
      "stock": number
    }
  ],
  "type": "string",
  "count": number
}
```

**Examples:**
```bash
# Collaborative filtering (frequently bought together)
GET /api/recommendations?type=collaborative&productId=abc123&limit=4

# Category-based recommendations
GET /api/recommendations?type=category&productId=abc123&limit=6

# Trending products
GET /api/recommendations?type=trending&limit=8

# Personalized for customer
GET /api/recommendations?type=personalized&customerEmail=user@example.com&limit=6
```

---

## Inventory (Admin Only)

### Get Inventory Forecasts
```http
GET /api/admin/inventory/forecast
```

**Authentication:** Required (admin)

**Query Parameters:**
- `productId` (optional) - Get forecast for specific product
- `riskLevels` (optional) - Filter by risk: `critical,high,medium,low` (comma-separated)
- `limit` (optional) - Limit results
- `summary` (optional) - Get summary only (true/false)

**Response:**
```json
{
  "forecasts": [
    {
      "productId": "string",
      "productName": "string",
      "currentStock": number,
      "averageDailySales": number,
      "daysUntilStockout": number,
      "recommendedReorderPoint": number,
      "suggestedOrderQuantity": number,
      "trend": "increasing" | "stable" | "decreasing",
      "riskLevel": "low" | "medium" | "high" | "critical"
    }
  ],
  "count": number
}
```

**Summary Response:**
```json
{
  "total": number,
  "critical": number,
  "high": number,
  "medium": number,
  "low": number,
  "needsReorder": number,
  "averageDaysToStockout": number
}
```

---

## Analytics (Admin Only)

### Get Time-Series Analytics
```http
GET /api/admin/analytics/timeseries
```

**Authentication:** Required (admin)

**Query Parameters:**
- `days` (optional) - Number of days to analyze (default: 30)

**Response:**
```json
{
  "data": [
    {
      "date": "string",
      "revenue": number,
      "orders": number,
      "products": number
    }
  ],
  "period": number,
  "summary": {
    "totalRevenue": number,
    "totalOrders": number,
    "totalProducts": number,
    "avgDailyRevenue": number,
    "avgDailyOrders": number
  }
}
```

### Get Customer Analytics
```http
GET /api/admin/customers/:email/analytics
```

**Authentication:** Required (admin)

**Response:**
```json
{
  "customer": {
    "email": "string",
    "firstName": "string",
    "lastName": "string"
  },
  "metrics": {
    "totalOrders": number,
    "totalSpent": number,
    "averageOrderValue": number,
    "lifetimeValue": number,
    "firstOrderDate": "string",
    "lastOrderDate": "string",
    "daysSinceLastOrder": number
  },
  "rfm": {
    "recency": number,
    "frequency": number,
    "monetary": number,
    "score": number,
    "segment": "VIP" | "Loyal" | "Regular" | "At Risk" | "New"
  },
  "categoryPreferences": [
    {
      "category": "string",
      "count": number,
      "totalSpent": number
    }
  ],
  "orderHistory": [
    {
      "date": "string",
      "total": number,
      "itemCount": number
    }
  ]
}
```

---

## Payments

### Create PayPal Order
```http
POST /api/paypal
```

**Request Body:**
```json
{
  "amount": number,
  "currency": "EUR",
  "orderId": "string",
  "description": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "status": "string",
  "links": [
    {
      "href": "string",
      "rel": "approve" | "capture",
      "method": "GET" | "POST"
    }
  ]
}
```

### Capture PayPal Payment
```http
PATCH /api/paypal
```

**Request Body:**
```json
{
  "orderId": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "status": "COMPLETED",
  "payer": {...},
  "purchase_units": [...]
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message description",
  "details": {} // Optional additional details
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production use.

---

## Authentication Flow

### Admin Login
1. POST credentials to `/api/auth/admin`
2. Receive `admin_session` cookie
3. Include cookie in subsequent requests

### Customer Session
1. Customer places order
2. Receive `customer_session` cookie
3. Use for order tracking and personalized features

---

## Best Practices

1. **Always validate input** - Check required fields and data types
2. **Use appropriate HTTP methods** - GET for reads, POST for creates, PATCH/PUT for updates
3. **Handle errors gracefully** - Check status codes and error messages
4. **Cache when possible** - Many endpoints support caching
5. **Use HTTPS in production** - Never send sensitive data over HTTP

---

## SDK Examples

### JavaScript/TypeScript
```typescript
// Get trending products
const response = await fetch('/api/recommendations?type=trending&limit=4');
const data = await response.json();
console.log(data.recommendations);

// Create order with Stripe
const order = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: cartItems,
    customerEmail: email,
    shippingAddress: address,
    paymentMethod: 'stripe'
  })
});

// Get inventory forecast (admin)
const forecast = await fetch('/api/admin/inventory/forecast?summary=true', {
  credentials: 'include' // Include cookies
});
```

### Python
```python
import requests

# Get product recommendations
response = requests.get(
    'http://localhost:3000/api/recommendations',
    params={'type': 'collaborative', 'productId': 'abc123', 'limit': 4}
)
recommendations = response.json()

# Get customer analytics (admin)
response = requests.get(
    'http://localhost:3000/api/admin/customers/user@example.com/analytics',
    cookies={'admin_session': 'your-session-token'}
)
analytics = response.json()
```

---

## Support

For questions or issues with the API, please contact the development team or open an issue in the repository.
