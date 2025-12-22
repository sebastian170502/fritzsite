import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'

interface ProductInfo {
    id: string
    name: string
    slug: string
    price: number
    imageUrl: string
}

/**
 * Send stock notification emails to subscribers
 * Call this function when a product's stock is updated from 0 to > 0
 */
export async function notifyStockAvailable(product: ProductInfo) {
    try {
        // Skip if Resend API key is not configured
        if (!process.env.RESEND_API_KEY) {
            console.warn('RESEND_API_KEY not configured, skipping stock notifications')
            return { sent: 0, failed: 0 }
        }

        const resend = new Resend(process.env.RESEND_API_KEY)

        // Get all pending notifications for this product
        const notifications = await prisma.stockNotification.findMany({
            where: {
                productId: product.id,
                notified: false,
            },
        })

        if (notifications.length === 0) {
            console.log(`No pending notifications for product ${product.id}`)
            return { sent: 0, failed: 0 }
        }

        console.log(
            `Sending ${notifications.length} stock notifications for ${product.name}`
        )

        let sent = 0
        let failed = 0

        // Send emails in batches to avoid rate limits
        for (const notification of notifications) {
            try {
                const productUrl = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/shop/${product.slug}`

                await resend.emails.send({
                    from: process.env.RESEND_FROM_EMAIL || 'notifications@fritzforge.com',
                    to: notification.email,
                    subject: `${product.name} is back in stock! 🔨`,
                    html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Back in Stock</title>
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                
                <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
                  <h1 style="color: #f59e0b; margin: 0; font-size: 28px; font-weight: bold;">Good News!</h1>
                  <p style="color: #e5e5e5; margin: 10px 0 0; font-size: 16px;">The item you wanted is back in stock</p>
                </div>

                <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e5e5; border-top: none;">
                  
                  <div style="text-align: center; margin-bottom: 30px;">
                    <img 
                      src="${product.imageUrl}" 
                      alt="${product.name}"
                      style="max-width: 300px; width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
                    />
                  </div>

                  <h2 style="color: #1a1a1a; margin: 0 0 10px; font-size: 24px;">${product.name}</h2>
                  
                  <p style="font-size: 28px; font-weight: bold; color: #f59e0b; margin: 15px 0;">
                    €${product.price.toFixed(2)}
                  </p>

                  <p style="color: #666; margin: 20px 0;">
                    Great news! The product you requested a stock notification for is now available. 
                    This handcrafted item is in high demand and may sell out quickly.
                  </p>

                  <div style="margin: 30px 0; text-align: center;">
                    <a 
                      href="${productUrl}" 
                      style="display: inline-block; background: #f59e0b; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; transition: background 0.3s;"
                    >
                      View Product →
                    </a>
                  </div>

                  <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #92400e; font-size: 14px;">
                      <strong>⚡ Act Fast!</strong> Our handcrafted items are made in limited quantities and tend to sell out quickly.
                    </p>
                  </div>

                </div>

                <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 12px 12px; text-align: center;">
                  <h3 style="color: #1a1a1a; margin: 0 0 15px; font-size: 18px;">Fritz's Forge</h3>
                  <p style="color: #666; margin: 0 0 10px; font-size: 14px;">
                    Handcrafted metalwork, forged with tradition
                  </p>
                  <p style="color: #999; margin: 20px 0 0; font-size: 12px;">
                    You received this email because you subscribed to stock notifications for this product.
                    <br/>
                    No longer interested? Stock notifications are automatically disabled after this email.
                  </p>
                </div>

              </body>
            </html>
          `,
                })

                // Mark as notified
                await prisma.stockNotification.update({
                    where: { id: notification.id },
                    data: {
                        notified: true,
                        notifiedAt: new Date(),
                    },
                })

                sent++
            } catch (emailError) {
                console.error(
                    `Failed to send notification to ${notification.email}:`,
                    emailError
                )
                failed++
            }

            // Small delay to avoid rate limits
            await new Promise((resolve) => setTimeout(resolve, 100))
        }

        console.log(
            `Stock notifications complete: ${sent} sent, ${failed} failed`
        )

        return { sent, failed }
    } catch (error) {
        console.error('Error in notifyStockAvailable:', error)
        throw error
    }
}

/**
 * Get count of pending notifications for a product
 */
export async function getPendingNotificationCount(
    productId: string
): Promise<number> {
    return await prisma.stockNotification.count({
        where: {
            productId,
            notified: false,
        },
    })
}
