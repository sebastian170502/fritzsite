# Stock Notifications Documentation

## Overview

The Stock Notifications feature allows customers to subscribe to email alerts when out-of-stock products become available again. This improves customer experience and helps recover lost sales from inventory issues.

## Table of Contents

1. [Features](#features)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [UI Components](#ui-components)
5. [Email Notifications](#email-notifications)
6. [Admin Integration](#admin-integration)
7. [Configuration](#configuration)
8. [Usage Examples](#usage-examples)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## Features

✅ **Customer Subscriptions**: Email-based notifications for out-of-stock products
✅ **Automatic Notifications**: Sent when stock changes from 0 to available
✅ **One-Time Notifications**: Each subscription sends only one email
✅ **Beautiful Email Design**: Professional, branded HTML emails
✅ **No Spam**: Unsubscribe after notification is sent
✅ **Duplicate Prevention**: One subscription per email/product combination
✅ **Admin Integration**: Automatic triggering when stock is updated
✅ **Error Handling**: Graceful degradation if email service unavailable

---

## Database Schema

### StockNotification Model

```prisma
model StockNotification {
  id          String   @id @default(uuid())
  email       String
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  notified    Boolean  @default(false)
  createdAt   DateTime @default(now())
  notifiedAt  DateTime?

  @@unique([email, productId])
  @@index([productId, notified])
}
```

### Fields

- **id**: Unique identifier (UUID)
- **email**: Customer's email address
- **productId**: Reference to Product
- **product**: Product relation (cascade delete)
- **notified**: Whether notification has been sent
- **createdAt**: Subscription timestamp
- **notifiedAt**: Notification sent timestamp

### Indexes

- **Unique constraint**: `[email, productId]` - Prevents duplicate subscriptions
- **Composite index**: `[productId, notified]` - Optimizes queries for pending notifications

---

## API Endpoints

### POST /api/stock-notifications

Subscribe to stock notifications for a product.

**Request Body:**
```json
{
  "email": "customer@example.com",
  "productId": "product-uuid"
}
```

**Validation:**
- Email must be valid format
- Product ID is required
- Product must exist
- Product must be out of stock (stock === 0)

**Success Response (201):**
```json
{
  "success": true,
  "message": "You will be notified when this product is back in stock",
  "notification": {
    "id": "notification-uuid",
    "email": "customer@example.com"
  }
}
```

**Error Responses:**
- **400**: Invalid email, product in stock, validation errors
- **404**: Product not found
- **500**: Server error

**Features:**
- Upsert operation: Updates existing subscription if present
- Resets `notified` flag if customer re-subscribes
- Prevents subscriptions for in-stock products

---

### GET /api/stock-notifications

Get subscription status for an email/product combination.

**Query Parameters:**
- `email` (required): Customer email
- `productId` (required): Product ID

**Success Response (200):**
```json
{
  "subscribed": true,
  "notified": false
}
```

**Use Cases:**
- Check if customer is already subscribed
- Display subscription status in UI
- Prevent duplicate subscription attempts

---

### DELETE /api/stock-notifications/[id]

Unsubscribe from stock notifications.

**Path Parameters:**
- `id`: Notification ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Unsubscribed from stock notifications"
}
```

**Use Cases:**
- Customer-initiated unsubscribe
- Cleanup after notification sent
- Admin management

---

## UI Components

### StockNotifyForm Component

Located: `src/components/products/stock-notify-form.tsx`

**Features:**
- Email input with validation
- Loading states with spinner
- Success confirmation message
- Error handling with toasts
- Responsive design

**Props:**
```typescript
interface StockNotifyFormProps {
  productId: string
  productName: string
}
```

**States:**
1. **Default**: Email form with CTA
2. **Loading**: Disabled input with spinner
3. **Subscribed**: Success message with checkmark

**Usage:**
```tsx
import { StockNotifyForm } from '@/components/products/stock-notify-form'

<StockNotifyForm
  productId={product.id}
  productName={product.name}
/>
```

**Design:**
- Amber/yellow theme for notifications
- Bell icon for visual recognition
- Clear privacy message
- Inline validation

---

### Product Display Integration

The form automatically appears on product pages when stock is 0:

```tsx
{isOutOfStock && (
  <StockNotifyForm
    productId={product.id}
    productName={product.name}
  />
)}
```

**Placement:**
- Below "Add to Cart" button
- Only visible when out of stock
- Part of product detail layout

---

## Email Notifications

### Email Service

Located: `src/lib/stock-notifications.ts`

**Function: `notifyStockAvailable(product)`**

Sends emails to all pending subscribers when product stock is updated.

**Parameters:**
```typescript
interface ProductInfo {
  id: string
  name: string
  slug: string
  price: number
  imageUrl: string
}
```

**Process:**
1. Check if RESEND_API_KEY is configured
2. Query all pending notifications (`notified: false`)
3. Send individual emails with product details
4. Mark notifications as sent
5. Return count of sent/failed emails

**Rate Limiting:**
- 100ms delay between emails
- Prevents API rate limits
- Handles batch processing

### Email Template

Professional HTML email with:
- **Header**: Gradient background with "Good News!" message
- **Product Image**: Centered, responsive image
- **Product Details**: Name and price prominently displayed
- **CTA Button**: "View Product" link to product page
- **Urgency Message**: Limited quantity notice
- **Footer**: Brand information and unsubscribe note

**Design Features:**
- Responsive layout (600px max width)
- Mobile-friendly
- Dark/light compatible colors
- Professional typography
- Clear call-to-action

### Email Subject

```
{Product Name} is back in stock! 🔨
```

**From Address:**
```
RESEND_FROM_EMAIL (env) or notifications@fritzforge.com
```

---

## Admin Integration

### Automatic Triggering

Stock notifications are automatically sent when admin updates product stock:

**Location:** `src/app/api/admin/products/[id]/route.ts`

**Logic:**
```typescript
// Get previous stock level
const previousProduct = await prisma.product.findUnique({
  where: { id },
  select: { stock: true, slug: true },
})

// Update product
const product = await prisma.product.update({ ... })

// Send notifications if stock went from 0 to > 0
if (previousProduct.stock === 0 && product.stock > 0) {
  await notifyStockAvailable({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    imageUrl: images[0],
  })
}
```

**Trigger Conditions:**
- Previous stock was exactly 0
- New stock is greater than 0
- Notifications sent asynchronously (non-blocking)

### Admin Workflow

1. Customer subscribes when product is out of stock
2. Admin restocks product (sets stock > 0)
3. System detects stock change
4. Notifications automatically sent
5. Customers receive email
6. Subscriptions marked as notified

**Error Handling:**
- Email failures logged but don't block product update
- Notifications attempted even if some fail
- Graceful degradation if email service unavailable

---

## Configuration

### Environment Variables

Add to `.env`:

```bash
# Required for email notifications
RESEND_API_KEY="re_your_api_key_here"

# Email sender address (optional, defaults to notifications@fritzforge.com)
RESEND_FROM_EMAIL="notifications@yourdomain.com"

# Public URL for product links in emails
NEXT_PUBLIC_URL="https://yourdomain.com"
```

### Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Verify your sending domain
3. Create API key
4. Add to `.env` file
5. Configure `RESEND_FROM_EMAIL` with verified address

### Without Resend

If `RESEND_API_KEY` is not configured:
- Subscriptions still work
- Notifications are skipped with warning log
- Feature degrades gracefully
- No errors thrown

---

## Usage Examples

### Example 1: Customer Subscribes

**User Action:**
1. Visit product page (out of stock)
2. See stock notification form
3. Enter email address
4. Click "Notify Me"

**System Response:**
```
✅ You'll be notified when this item is back in stock!
```

**Database:**
```sql
INSERT INTO StockNotification (email, productId, notified)
VALUES ('customer@example.com', 'product-123', false)
```

---

### Example 2: Admin Restocks Product

**Admin Action:**
1. Go to admin dashboard
2. Edit product
3. Change stock from 0 to 10
4. Save product

**System Response:**
1. Update product stock
2. Detect stock change (0 → 10)
3. Query pending notifications
4. Send emails to subscribers
5. Mark notifications as sent

**Console Log:**
```
Sending 5 stock notifications for Damascus Steel Knife
Stock notifications complete: 5 sent, 0 failed
```

---

### Example 3: Customer Receives Email

**Email Received:**
```
Subject: Damascus Steel Knife is back in stock! 🔨
From: notifications@fritzforge.com
```

**Email Content:**
- Product image
- Product name
- Price: €299.00
- "View Product" button
- Urgency message

**Customer Action:**
- Clicks "View Product"
- Redirected to product page
- Adds to cart
- Completes purchase

---

### Example 4: Programmatic Notification

```typescript
import { notifyStockAvailable } from '@/lib/stock-notifications'

// Manual trigger (e.g., from webhook, cron job, etc.)
const result = await notifyStockAvailable({
  id: 'product-123',
  name: 'Damascus Steel Knife',
  slug: 'damascus-steel-knife',
  price: 299.00,
  imageUrl: 'https://example.com/image.jpg',
})

console.log(`Sent: ${result.sent}, Failed: ${result.failed}`)
```

---

## Testing

### Manual Testing

**Test Subscription:**
```bash
curl -X POST http://localhost:3000/api/stock-notifications \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "productId": "your-product-id"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "You will be notified when this product is back in stock",
  "notification": {
    "id": "...",
    "email": "test@example.com"
  }
}
```

**Test Notification:**
1. Create test product with stock = 0
2. Subscribe with your email
3. Update product stock to > 0 via admin
4. Check email inbox

### Database Queries

**View Pending Notifications:**
```sql
SELECT * FROM StockNotification WHERE notified = false;
```

**View Sent Notifications:**
```sql
SELECT * FROM StockNotification WHERE notified = true;
```

**Count Subscriptions by Product:**
```sql
SELECT productId, COUNT(*) as subscribers
FROM StockNotification
WHERE notified = false
GROUP BY productId;
```

### Email Testing

Use [Resend's test mode](https://resend.com/docs/dashboard/testing) to test emails without sending:

1. Use test API key
2. Emails logged in dashboard
3. Verify template rendering
4. Check links and images

---

## Troubleshooting

### Issue: Emails Not Sending

**Causes:**
- Missing RESEND_API_KEY
- Invalid API key
- Unverified sending domain
- Rate limits exceeded

**Solutions:**
1. Check `.env` for RESEND_API_KEY
2. Verify API key is active in Resend dashboard
3. Confirm sending domain is verified
4. Check Resend dashboard for error logs

**Debugging:**
```bash
# Check environment variable
echo $RESEND_API_KEY

# View server logs
npm run dev

# Look for:
RESEND_API_KEY not configured, skipping stock notifications
Failed to send notification to [email]: [error]
```

---

### Issue: Duplicate Subscriptions

**Cause:** Missing unique constraint

**Solution:**
Already handled by database schema:
```prisma
@@unique([email, productId])
```

If issue persists:
```bash
npx prisma db push --force-reset
```

---

### Issue: Notifications Sent for In-Stock Products

**Cause:** API validation not working

**Check:**
```typescript
if (product.stock > 0) {
  return NextResponse.json(
    { error: 'Product is currently in stock' },
    { status: 400 }
  )
}
```

**Prevention:**
- Subscription form only shows when `isOutOfStock === true`
- API validates stock level
- UI prevents subscriptions for available products

---

### Issue: Email Links Broken

**Cause:** Missing or incorrect NEXT_PUBLIC_URL

**Solution:**
```bash
# In .env
NEXT_PUBLIC_URL="https://yourdomain.com"

# No trailing slash!
```

**Verify:**
Check email HTML for correct links:
```html
<a href="https://yourdomain.com/shop/product-slug">
```

---

### Issue: Form Not Showing

**Checklist:**
1. Product stock is 0
2. Component imported correctly
3. `isOutOfStock` condition working
4. No JavaScript errors in console

**Debug:**
```tsx
console.log('Out of stock:', isOutOfStock)
console.log('Stock level:', product.stock)
```

---

## Best Practices

### For Customers

1. **Subscribe Early**: Sign up as soon as you see out of stock
2. **Use Valid Email**: Ensure email address is correct
3. **Check Spam**: Notification may go to spam folder
4. **Act Fast**: Limited quantities sell quickly

### For Admins

1. **Restock in Batches**: Update multiple products at once
2. **Monitor Subscribers**: Check pending notifications count
3. **Verify Emails**: Test notifications before major restocks
4. **Clear Old Notifications**: Periodically cleanup sent notifications

### For Developers

1. **Rate Limiting**: Keep 100ms delay between emails
2. **Error Logging**: Monitor email send failures
3. **Database Indexes**: Ensure indexes are created
4. **Email Templates**: Test on multiple email clients
5. **Async Processing**: Don't block product updates

---

## Future Enhancements

Potential improvements:

1. **SMS Notifications**: Add phone number support
2. **Push Notifications**: Web push API integration
3. **Waitlist Priority**: First subscribers get priority
4. **Batch Emails**: Send in larger batches for efficiency
5. **Analytics Dashboard**: Track subscription/conversion rates
6. **Customizable Templates**: Admin-editable email templates
7. **Multi-Product Subscriptions**: Subscribe to multiple products at once
8. **Notification Preferences**: Choose notification channels
9. **Stock Alerts**: Notify when stock is low (not just 0)
10. **Pre-Order System**: Convert notifications to pre-orders

---

## Metrics to Track

Monitor these KPIs:

1. **Subscription Rate**: % of out-of-stock views that subscribe
2. **Conversion Rate**: % of notified customers who purchase
3. **Email Open Rate**: Tracking pixel in emails
4. **Click-Through Rate**: Link clicks in emails
5. **Time to Purchase**: Notification to purchase time
6. **Notification Count**: Daily/weekly sent notifications
7. **Failed Emails**: Track and fix invalid addresses
8. **Revenue Recovery**: Sales attributed to notifications

---

## Summary

The Stock Notifications feature provides:

✅ **Automated System**: No manual notification management
✅ **Customer Value**: Never miss restocked items
✅ **Sales Recovery**: Capture demand during stockouts
✅ **Professional Emails**: Branded, beautiful notifications
✅ **Developer Friendly**: Simple API, easy integration
✅ **Reliable**: Error handling and graceful degradation
✅ **Scalable**: Handles high volumes with rate limiting

This feature helps convert lost sales into successful transactions by maintaining customer engagement even when products are temporarily unavailable.
