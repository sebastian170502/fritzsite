import { NextResponse } from 'next/server'
import { sendCustomOrderEmail, sendCustomerConfirmationEmail } from '@/lib/email'

export async function POST(req: Request) {
    try {
        const formData = await req.json()

        // Validate required fields
        if (!formData.email || !formData.orderType) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Generate order ID
        const orderId = `CO-${Date.now()}`

        // Log the order (backup)
        console.log('Custom Order Received:', {
            orderId,
            email: formData.email,
            type: formData.orderType,
            timestamp: new Date().toISOString(),
        })

        // Send email to admin
        const adminEmailResult = await sendCustomOrderEmail({
            ...formData,
            orderId,
        })

        if (!adminEmailResult.success) {
            console.error('Failed to send admin notification:', adminEmailResult.error)
            // Continue anyway - don't fail the request if email fails
        }

        // Send confirmation to customer
        const customerEmailResult = await sendCustomerConfirmationEmail(
            formData.email,
            orderId,
            formData.orderType
        )

        if (!customerEmailResult.success) {
            console.error('Failed to send customer confirmation:', customerEmailResult.error)
        }

        return NextResponse.json({
            success: true,
            message: 'Custom order request received. Check your email for confirmation.',
            orderId,
            emailSent: adminEmailResult.success && customerEmailResult.success,
        })
    } catch (error) {
        console.error('Custom order error:', error)
        return NextResponse.json(
            { error: 'Failed to submit custom order' },
            { status: 500 }
        )
    }
}
