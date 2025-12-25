/**
 * Email templates for transactional emails
 */

interface OrderItem {
  name: string
  quantity: number
  price: number
  imageUrl?: string
}

interface OrderDetails {
  orderId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  total: number
  shippingAddress?: {
    address: string
    city: string
    postalCode: string
  }
  orderDate: string
}

/**
 * Base email template wrapper
 */
function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fritz's Forge</title>
  <style>
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔨 Fritz's Forge</h1>
    </div>
    ${content}
    <div class="footer">
      <p>Fritz's Forge - Handcrafted Metalwork</p>
      <p>
        <a href="${process.env.NEXT_PUBLIC_URL}/shop">Browse Products</a> | 
        <a href="${process.env.NEXT_PUBLIC_URL}/custom">Custom Orders</a> | 
        <a href="${process.env.NEXT_PUBLIC_URL}">Visit Website</a>
      </p>
      <p style="margin-top: 20px; font-size: 12px;">
        You received this email because you made a purchase at Fritz's Forge.
      </p>
    </div>
  </div>
</body>
</html>
  `
}

/**
 * Order confirmation email template
 */
export function orderConfirmationTemplate(order: OrderDetails): string {
  const itemsHtml = order.items.map(item => `
    <div class="order-item">
      <div class="item-details">
        <div class="item-name">${item.name}</div>
        <div class="item-price">Cantitate: ${item.quantity} × ${Number(item.price).toFixed(2)} RON</div>
      </div>
      <div style="font-weight: 600; color: #1e293b;">
        ${(item.quantity * Number(item.price)).toFixed(2)} RON
      </div>
    </div>
  `).join('')

  const shippingHtml = order.shippingAddress ? `
    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <h3 style="color: #1e293b; margin-top: 0;">Adresa de Livrare</h3>
      <p style="color: #64748b; margin: 5px 0;">${order.shippingAddress.address}</p>
      <p style="color: #64748b; margin: 5px 0;">${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</p>
    </div>
  ` : ''

  const content = `
    <div class="content">
      <h2 style="color: #1e293b; margin-top: 0;">Mulțumim pentru Comandă!</h2>
      <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
        Bună ${order.customerName},<br><br>
        Am primit comanda ta și o procesăm în acest moment. Vei primi o notificare când comanda va fi expediată.
      </p>

      <div class="order-details">
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
          <div>
            <strong style="color: #1e293b;">Număr Comandă</strong>
            <div style="color: #64748b; margin-top: 5px;">${order.orderId}</div>
          </div>
          <div style="text-align: right;">
            <strong style="color: #1e293b;">Data Comandă</strong>
            <div style="color: #64748b; margin-top: 5px;">${order.orderDate}</div>
          </div>
        </div>

        <div style="margin-top: 30px;">
          <h3 style="color: #1e293b; margin-top: 0;">Produse Comandate</h3>
          ${itemsHtml}
          <div class="total-row">
            <span>Total</span>
            <span>${Number(order.total).toFixed(2)} RON</span>
          </div>
        </div>

        ${shippingHtml}
      </div>

      <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
        Dacă ai întrebări despre comandă, nu ezita să ne contactezi.
      </p>

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_URL}/shop" class="button">
          Continuă Cumpărăturile
        </a>
      </div>
    </div>
  `

  return emailWrapper(content)
}

/**
 * Shipping notification email template
 */
export function shippingNotificationTemplate(order: {
  orderId: string
  customerName: string
  trackingNumber?: string
  estimatedDelivery?: string
  items: OrderItem[]
}): string {
  const trackingHtml = order.trackingNumber ? `
    <div style="background-color: #f0fdf4; border: 2px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
      <p style="color: #166534; margin: 0 0 10px 0; font-weight: 600;">Număr de Urmărire</p>
      <p style="color: #166534; font-size: 20px; font-weight: 700; margin: 0; letter-spacing: 1px;">
        ${order.trackingNumber}
      </p>
    </div>
  ` : ''

  const deliveryHtml = order.estimatedDelivery ? `
    <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
      <strong>Livrare Estimată:</strong> ${order.estimatedDelivery}
    </p>
  ` : ''

  const itemsList = order.items.map(item =>
    `<li style="color: #64748b; margin: 5px 0;">${item.name} (x${item.quantity})</li>`
  ).join('')

  const content = `
    <div class="content">
      <h2 style="color: #1e293b; margin-top: 0;">📦 Comanda Ta A Fost Expediată!</h2>
      <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
        Bună ${order.customerName},<br><br>
        Vestea bună! Comanda ta #${order.orderId} a fost expediată și este în drum spre tine.
      </p>

      ${trackingHtml}
      ${deliveryHtml}

      <div style="margin: 30px 0;">
        <h3 style="color: #1e293b;">Produse Expediate</h3>
        <ul style="padding-left: 20px;">
          ${itemsList}
        </ul>
      </div>

      <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
        Vei primi o notificare când coletul ajunge la destinație. Dacă ai întrebări, suntem aici să te ajutăm!
      </p>
    </div>
  `

  return emailWrapper(content)
}

/**
 * Review request email template
 */
export function reviewRequestTemplate(order: {
  orderId: string
  customerName: string
  items: OrderItem[]
}): string {
  const itemsList = order.items.map(item => `
    <div style="background-color: #f8fafc; border-radius: 8px; padding: 15px; margin: 10px 0;">
      <div style="font-weight: 600; color: #1e293b; margin-bottom: 10px;">${item.name}</div>
      <a href="${process.env.NEXT_PUBLIC_URL}/shop?review=${item.name}" 
         class="button" 
         style="display: inline-block; font-size: 14px; padding: 10px 20px;">
        Lasă o Recenzie
      </a>
    </div>
  `).join('')

  const content = `
    <div class="content">
      <h2 style="color: #1e293b; margin-top: 0;">⭐ Cum a fost Experiența Ta?</h2>
      <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
        Bună ${order.customerName},<br><br>
        Sperăm că ești mulțumit de produsele comandate! Opinia ta contează foarte mult pentru noi și ne ajută să îmbunătățim în continuare.
      </p>

      <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
        <strong>Comanda #${order.orderId}</strong>
      </p>

      ${itemsList}

      <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-top: 30px;">
        Recenziile tale ajută alți clienți să ia decizii informate și ne motivează să continuăm crearea de produse handmade de calitate.
      </p>

      <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
        Mulțumim pentru susținere! 🙏
      </p>
    </div>
  `

  return emailWrapper(content)
}

/**
 * Plain text version of order confirmation
 */
export function orderConfirmationText(order: OrderDetails): string {
  const items = order.items.map(item =>
    `${item.name} - Cantitate: ${item.quantity} × ${Number(item.price).toFixed(2)} RON = ${(item.quantity * Number(item.price)).toFixed(2)} RON`
  ).join('\n')

  const shipping = order.shippingAddress ? `
Adresa de Livrare:
${order.shippingAddress.address}
${order.shippingAddress.city}, ${order.shippingAddress.postalCode}
` : ''

  return `
Fritz's Forge - Confirmare Comandă

Bună ${order.customerName},

Am primit comanda ta și o procesăm în acest moment.

Număr Comandă: ${order.orderId}
Data Comandă: ${order.orderDate}

Produse Comandate:
${items}

Total: ${Number(order.total).toFixed(2)} RON

${shipping}

Vei primi o notificare când comanda va fi expediată.

Mulțumim pentru comandă!

Fritz's Forge - Handcrafted Metalwork
${process.env.NEXT_PUBLIC_URL}
  `
}
