/**
 * Email templates for transactional emails
 * Refactored to use reusable components
 */

import {
  type OrderItem,
  type OrderDetails,
  emailWrapper,
  greeting,
  orderHeader,
  orderItemsList,
  orderTotal,
  shippingAddress,
  ctaButton,
  trackingNumber,
  simpleItemsList,
  reviewCard,
  formatPrice,
  plainTextWrapper,
} from './email-components'

/**
 * Order confirmation email template
 */
export function orderConfirmationTemplate(order: OrderDetails): string {
  const content = `
    <div class="content">
      <h2 style="color: #1e293b; margin-top: 0;">Mulțumim pentru Comandă!</h2>
      ${greeting(order.customerName, 'Am primit comanda ta și o procesăm în acest moment. Vei primi o notificare când comanda va fi expediată.')}

      <div class="order-details">
        ${orderHeader(order.orderId, order.orderDate)}

        <div style="margin-top: 30px;">
          <h3 style="color: #1e293b; margin-top: 0;">Produse Comandate</h3>
          ${orderItemsList(order.items)}
          ${orderTotal(order.total)}
        </div>

        ${order.shippingAddress ? shippingAddress(order.shippingAddress) : ''}
      </div>

      <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
        Dacă ai întrebări despre comandă, nu ezita să ne contactezi.
      </p>

      ${ctaButton(process.env.NEXT_PUBLIC_URL + '/shop', 'Continuă Cumpărăturile')}
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
  const deliveryInfo = order.estimatedDelivery
    ? `<p style="color: #64748b; font-size: 16px; line-height: 1.6;"><strong>Livrare Estimată:</strong> ${order.estimatedDelivery}</p>`
    : ''

  const content = `
    <div class="content">
      <h2 style="color: #1e293b; margin-top: 0;">📦 Comanda Ta A Fost Expediată!</h2>
      ${greeting(order.customerName, `Vestea bună! Comanda ta #${order.orderId} a fost expediată și este în drum spre tine.`)}

      ${order.trackingNumber ? trackingNumber(order.trackingNumber) : ''}
      ${deliveryInfo}

      <div style="margin: 30px 0;">
        <h3 style="color: #1e293b;">Produse Expediate</h3>
        ${simpleItemsList(order.items)}
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
  const content = `
    <div class="content">
      <h2 style="color: #1e293b; margin-top: 0;">⭐ Cum a fost Experiența Ta?</h2>
      ${greeting(order.customerName, 'Sperăm că ești mulțumit de produsele comandate! Opinia ta contează foarte mult pentru noi și ne ajută să îmbunătățim în continuare.')}

      <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
        <strong>Comanda #${order.orderId}</strong>
      </p>

      ${order.items.map(item => reviewCard(item)).join('')}

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
  const items = order.items
    .map(
      item =>
        `${item.name} - Cantitate: ${item.quantity} × ${formatPrice(item.price)} RON = ${formatPrice(item.quantity * item.price)} RON`
    )
    .join('\n')

  const shipping = order.shippingAddress
    ? `
Adresa de Livrare:
${order.shippingAddress.address}
${order.shippingAddress.city}, ${order.shippingAddress.postalCode}
`
    : ''

  const content = `
Confirmare Comandă

Bună ${order.customerName},

Am primit comanda ta și o procesăm în acest moment.

Număr Comandă: ${order.orderId}
Data Comandă: ${order.orderDate}

Produse Comandate:
${items}

Total: ${formatPrice(order.total)} RON

${shipping}

Vei primi o notificare când comanda va fi expediată.

Mulțumim pentru comandă!
  `

  return plainTextWrapper(content)
}
