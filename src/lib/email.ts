import { Resend } from 'resend'

// Lazy initialization to avoid build-time errors when API key is not available
let resendClient: Resend | null = null

function getResendClient(): Resend | null {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY not configured')
        return null
    }

    if (!resendClient) {
        resendClient = new Resend(process.env.RESEND_API_KEY)
    }

    return resendClient
}

export interface CustomOrderEmail {
    name: string
    email: string
    phone: string
    orderType: 'scratch' | 'modify'
    material?: string
    bladeWidth?: string
    bladeLength?: string
    handleLength?: string
    productId?: string
    modifications?: string
    additionalNotes?: string
    orderId: string
}

export async function sendCustomOrderEmail(orderData: CustomOrderEmail) {
    const resend = getResendClient()

    if (!resend) {
        console.warn('Email service not configured - skipping admin notification')
        return { success: false, error: 'Email service not configured' }
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Fritz\'s Forge <orders@fritzforge.com>',
            to: process.env.ADMIN_EMAIL || 'admin@fritzforge.com',
            replyTo: orderData.email,
            subject: `New Custom Order Request - ${orderData.orderType === 'scratch' ? 'From Scratch' : 'Modify Existing'}`,
            html: generateOrderEmailHTML(orderData),
        })

        if (error) {
            console.error('Failed to send order email:', error)
            return { success: false, error }
        }

        return { success: true, data }
    } catch (error) {
        console.error('Email service error:', error)
        return { success: false, error }
    }
}

export async function sendCustomerConfirmationEmail(
    customerEmail: string,
    orderId: string,
    orderType: string
) {
    const resend = getResendClient()

    if (!resend) {
        console.warn('Email service not configured - skipping customer confirmation')
        return { success: false, error: 'Email service not configured' }
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Fritz\'s Forge <orders@fritzforge.com>',
            to: customerEmail,
            subject: 'Custom Order Request Received - Fritz\'s Forge',
            html: generateConfirmationEmailHTML(orderId, orderType),
        })

        if (error) {
            console.error('Failed to send confirmation email:', error)
            return { success: false, error }
        }

        return { success: true, data }
    } catch (error) {
        console.error('Email service error:', error)
        return { success: false, error }
    }
}

function generateOrderEmailHTML(order: CustomOrderEmail): string {
    const isFromScratch = order.orderType === 'scratch'

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0F0F10; color: #E8E5DB; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .field { margin: 15px 0; }
          .label { font-weight: bold; color: #666; }
          .value { margin-top: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔨 New Custom Order Request</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Order ID:</div>
              <div class="value"><strong>${order.orderId}</strong></div>
            </div>
            
            <div class="field">
              <div class="label">Order Type:</div>
              <div class="value">${isFromScratch ? '🎨 From Scratch' : '🔧 Modify Existing Product'}</div>
            </div>
            
            <div class="field">
              <div class="label">Customer Name:</div>
              <div class="value">${order.name}</div>
            </div>
            
            <div class="field">
              <div class="label">Customer Email:</div>
              <div class="value"><a href="mailto:${order.email}">${order.email}</a></div>
            </div>
            
            ${order.phone ? `
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${order.phone}</div>
            </div>
            ` : ''}
            
            ${isFromScratch ? `
            <hr style="margin: 20px 0;">
            <h3>Product Specifications</h3>
            
            ${order.material ? `
            <div class="field">
              <div class="label">Material:</div>
              <div class="value">${order.material.replace(/-/g, ' ').toUpperCase()}</div>
            </div>
            ` : ''}
            
            ${order.bladeWidth || order.bladeLength || order.handleLength ? `
            <div class="field">
              <div class="label">Dimensions:</div>
              <div class="value">
                ${order.bladeWidth ? `Blade Width: ${order.bladeWidth}<br>` : ''}
                ${order.bladeLength ? `Blade Length: ${order.bladeLength}<br>` : ''}
                ${order.handleLength ? `Handle Length: ${order.handleLength}` : ''}
              </div>
            </div>
            ` : ''}
            ` : `
            <hr style="margin: 20px 0;">
            <h3>Modification Details</h3>
            
            ${order.productId ? `
            <div class="field">
              <div class="label">Product to Modify:</div>
              <div class="value">${order.productId}</div>
            </div>
            ` : ''}
            
            ${order.modifications ? `
            <div class="field">
              <div class="label">Requested Modifications:</div>
              <div class="value">${order.modifications}</div>
            </div>
            ` : ''}
            `}
            
            ${order.additionalNotes ? `
            <hr style="margin: 20px 0;">
            <div class="field">
              <div class="label">Additional Notes:</div>
              <div class="value">${order.additionalNotes}</div>
            </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>This order was submitted on ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
    </html>
  `
}

function generateConfirmationEmailHTML(orderId: string, orderType: string): string {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0F0F10; color: #E8E5DB; padding: 30px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .cta { background: #E8E5DB; color: #0F0F10; padding: 15px 30px; text-decoration: none; display: inline-block; margin: 20px 0; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚒️ Fritz's Forge</h1>
            <p>Thank You for Your Custom Order Request!</p>
          </div>
          <div class="content">
            <p>Dear Customer,</p>
            
            <p>We have received your custom order request and are excited to work with you!</p>
            
            <div style="background: #fff; padding: 15px; border-left: 4px solid #0F0F10; margin: 20px 0;">
              <strong>Order Reference:</strong> ${orderId}<br>
              <strong>Order Type:</strong> ${orderType === 'scratch' ? 'From Scratch' : 'Modify Existing Product'}
            </div>
            
            <h3>What Happens Next?</h3>
            <ol>
              <li>Our master craftsman will review your specifications</li>
              <li>We'll contact you within 24 hours to discuss details</li>
              <li>You'll receive a quote and estimated timeline</li>
              <li>Upon approval, we'll begin crafting your custom piece</li>
            </ol>
            
            <p><strong>Questions?</strong> Feel free to reply to this email or call us directly.</p>
            
            <p>Thank you for choosing Fritz's Forge!</p>
            
            <p style="margin-top: 30px;">
              <strong>The Fritz's Forge Team</strong><br>
              Master Blacksmiths<br>
              <a href="mailto:orders@fritzforge.com">orders@fritzforge.com</a>
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Fritz's Forge. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}
