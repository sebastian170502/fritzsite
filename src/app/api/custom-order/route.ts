import { NextResponse } from 'next/server'
import { sendCustomOrderEmail, sendCustomerConfirmationEmail } from '@/lib/email'
import { 
  sanitizeString, 
  sanitizeHtml, 
  isValidEmail, 
  isValidPhone, 
  validateContentLength 
} from '@/lib/security'
import { logError } from '@/lib/error-handling'

export async function POST(req: Request) {
    try {
        const formData = await req.json()

        // Validate and sanitize inputs
        if (!formData.email || !formData.orderType) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Validate email
        if (!isValidEmail(formData.email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            )
        }

        // Validate phone if provided
        if (formData.phone && !isValidPhone(formData.phone)) {
            return NextResponse.json(
                { error: 'Invalid phone number' },
                { status: 400 }
            )
        }

        // Validate content length
        if (formData.description && !validateContentLength(formData.description, 5000)) {
            return NextResponse.json(
                { error: 'Description too long (max 5000 characters)' },
                { status: 400 }
            )
        }

        // Sanitize inputs
        const sanitizedData = {
            ...formData,
            email: sanitizeString(formData.email),
            name: formData.name ? sanitizeString(formData.name) : undefined,
            phone: formData.phone ? sanitizeString(formData.phone) : undefined,
            description: formData.description ? sanitizeHtml(formData.description) : undefined,
            orderType: sanitizeString(formData.orderType),
        }

        // Generate order ID
        const orderId = `CO-${Date.now()}`

        // Log the order (backup)
        console.log('Custom Order Received:', {
            orderId,
            email: sanitizedData.email,
            type: sanitizedData.orderType,
            timestamp: new Date().toISOString(),
        })

        // Send email to admin
        const adminEmailResult = await sendCustomOrderEmail({
            ...sanitizedData,
            orderId,
        })

        if (!adminEmailResult.success) {
            console.error('Failed to send admin notification:', adminEmailResult.error)
            // Continue anyway - don't fail the request if email fails
        }

        // Send confirmation to customer
        const customerEmailResult = await sendCustomerConfirmationEmail(
            sanitizedData.email,
            orderId,
            sanitizedData.orderType
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
    } catch (error: any) {
        logError({
            error: error instanceof Error ? error : new Error(String(error)),
            context: {
                endpoint: '/api/custom-order',
                method: 'POST',
            },
            severity: 'high',
        })

        return NextResponse.json(
            { error: 'Failed to submit custom order. Please try again.' },
            { status: 500 }
        )
    }
}
