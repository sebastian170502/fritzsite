/**
 * Email Template Components
 * Reusable building blocks for email templates
 */

// ============= Types =============

export interface OrderItem {
  name: string
  quantity: number
  price: number
  imageUrl?: string
}

export interface Address {
  address: string
  city: string
  postalCode: string
  country?: string
}

export interface OrderDetails {
  orderId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  total: number
  shippingAddress?: Address
  orderDate: string
}

// ============= Constants =============

const BRAND_NAME = "Fritz's Forge"
const BRAND_TAGLINE = 'Handcrafted Metalwork'
const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

// ============= Styles =============

const styles = `
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #f5f5f5;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
  }
  .header {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    padding: 40px 20px;
    text-align: center;
  }
  .header h1 {
    color: #ffffff;
    margin: 0;
    font-size: 28px;
    font-weight: 700;
  }
  .content {
    padding: 40px 20px;
  }
  .order-details {
    background-color: #f8fafc;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
  }
  .order-item {
    display: flex;
    padding: 15px 0;
    border-bottom: 1px solid #e2e8f0;
  }
  .order-item:last-child {
    border-bottom: none;
  }
  .item-details {
    flex: 1;
  }
  .item-name {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 5px;
  }
  .item-price {
    color: #64748b;
    font-size: 14px;
  }
  .total-row {
    display: flex;
    justify-content: space-between;
    padding: 15px 0;
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    border-top: 2px solid #e2e8f0;
    margin-top: 15px;
  }
  .button {
    display: inline-block;
    background-color: #1e293b;
    color: #ffffff;
    text-decoration: none;
    padding: 14px 32px;
    border-radius: 6px;
    font-weight: 600;
    margin: 20px 0;
  }
  .footer {
    background-color: #f8fafc;
    padding: 30px 20px;
    text-align: center;
    color: #64748b;
    font-size: 14px;
  }
  .footer a {
    color: #1e293b;
    text-decoration: none;
  }
  .alert {
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    text-align: center;
  }
  .alert-success {
    background-color: #f0fdf4;
    border: 2px solid #86efac;
    color: #166534;
  }
  .card {
    background-color: #f8fafc;
    border-radius: 8px;
    padding: 15px;
    margin: 10px 0;
  }
`

// ============= Components =============

/**
 * Email header component
 */
export function emailHeader(): string {
  return `
    <div class="header">
      <h1>🔨 ${BRAND_NAME}</h1>
    </div>
  `
}

/**
 * Email footer component
 */
export function emailFooter(): string {
  return `
    <div class="footer">
      <p>${BRAND_NAME} - ${BRAND_TAGLINE}</p>
      <p>
        <a href="${BASE_URL}/shop">Browse Products</a> | 
        <a href="${BASE_URL}/custom">Custom Orders</a> | 
        <a href="${BASE_URL}">Visit Website</a>
      </p>
      <p style="margin-top: 20px; font-size: 12px;">
        You received this email because you made a purchase at ${BRAND_NAME}.
      </p>
    </div>
  `
}

/**
 * Base email wrapper with styles
 */
export function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${BRAND_NAME}</title>
  <style>${styles}</style>
</head>
<body>
  <div class="container">
    ${emailHeader()}
    ${content}
    ${emailFooter()}
  </div>
</body>
</html>
  `
}

/**
 * Greeting component
 */
export function greeting(name: string, message: string): string {
  return `
    <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
      Bună ${name},<br><br>
      ${message}
    </p>
  `
}

/**
 * Order items list component
 */
export function orderItemsList(items: OrderItem[]): string {
  return items
    .map(
      item => `
    <div class="order-item">
      <div class="item-details">
        <div class="item-name">${item.name}</div>
        <div class="item-price">Cantitate: ${item.quantity} × ${formatPrice(item.price)} RON</div>
      </div>
      <div style="font-weight: 600; color: #1e293b;">
        ${formatPrice(item.quantity * item.price)} RON
      </div>
    </div>
  `
    )
    .join('')
}

/**
 * Order total component
 */
export function orderTotal(total: number): string {
  return `
    <div class="total-row">
      <span>Total</span>
      <span>${formatPrice(total)} RON</span>
    </div>
  `
}

/**
 * Order header component (order number + date)
 */
export function orderHeader(orderId: string, orderDate: string): string {
  return `
    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
      <div>
        <strong style="color: #1e293b;">Număr Comandă</strong>
        <div style="color: #64748b; margin-top: 5px;">${orderId}</div>
      </div>
      <div style="text-align: right;">
        <strong style="color: #1e293b;">Data Comandă</strong>
        <div style="color: #64748b; margin-top: 5px;">${orderDate}</div>
      </div>
    </div>
  `
}

/**
 * Shipping address component
 */
export function shippingAddress(address: Address): string {
  return `
    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <h3 style="color: #1e293b; margin-top: 0;">Adresa de Livrare</h3>
      <p style="color: #64748b; margin: 5px 0;">${address.address}</p>
      <p style="color: #64748b; margin: 5px 0;">${address.city}, ${address.postalCode}</p>
    </div>
  `
}

/**
 * CTA button component
 */
export function ctaButton(url: string, text: string): string {
  return `
    <div style="text-align: center;">
      <a href="${url}" class="button">
        ${text}
      </a>
    </div>
  `
}

/**
 * Alert box component
 */
export function alertBox(message: string, type: 'success' | 'info' = 'success'): string {
  const className = type === 'success' ? 'alert-success' : 'alert-info'
  return `
    <div class="alert ${className}">
      <p style="margin: 0; font-weight: 600;">${message}</p>
    </div>
  `
}

/**
 * Tracking number display
 */
export function trackingNumber(number: string): string {
  return `
    <div style="background-color: #f0fdf4; border: 2px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
      <p style="color: #166534; margin: 0 0 10px 0; font-weight: 600;">Număr de Urmărire</p>
      <p style="color: #166534; font-size: 20px; font-weight: 700; margin: 0; letter-spacing: 1px;">
        ${number}
      </p>
    </div>
  `
}

/**
 * Simple list of items
 */
export function simpleItemsList(items: OrderItem[]): string {
  return `
    <ul style="padding-left: 20px;">
      ${items.map(item => `<li style="color: #64748b; margin: 5px 0;">${item.name} (x${item.quantity})</li>`).join('')}
    </ul>
  `
}

/**
 * Review card for a product
 */
export function reviewCard(item: OrderItem): string {
  return `
    <div class="card">
      <div style="font-weight: 600; color: #1e293b; margin-bottom: 10px;">${item.name}</div>
      <a href="${BASE_URL}/shop?review=${encodeURIComponent(item.name)}" 
         class="button" 
         style="display: inline-block; font-size: 14px; padding: 10px 20px;">
        Lasă o Recenzie
      </a>
    </div>
  `
}

// ============= Utilities =============

/**
 * Format price with 2 decimals
 */
export function formatPrice(price: number): string {
  return Number(price).toFixed(2)
}

/**
 * Generate plain text version of email
 */
export function plainTextWrapper(content: string): string {
  return `
${BRAND_NAME} - ${BRAND_TAGLINE}

${content}

---
${BRAND_NAME}
${BASE_URL}
  `.trim()
}
