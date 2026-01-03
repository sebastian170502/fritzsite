import { NextResponse } from 'next/server'
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
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

        // Get customer ID from session if authenticated
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("customer_session");
        let customerId = null;

        if (sessionCookie) {
            // Verify session is valid by checking if customer exists (optional but safer)
            // For speed we can just trust the ID if we assume the cookie is secure enough for now, 
            // but consistency check is better.
            customerId = sessionCookie.value;
        }

        // Validate customer ID if present
        if (customerId) {
            const customerExists = await prisma.customer.findUnique({
                where: { id: customerId }
            });
            if (!customerExists) {
                console.warn(`Customer ID ${customerId} from cookie not found in DB. converting to guest order.`);
                customerId = null;
            }
        }

        // Generate friendly order ID
        const orderId = `CO-${Date.now()}`

        // Save to Database
        const customOrder = await prisma.customOrder.create({
            data: {
                orderId,
                email: sanitizedData.email,
                name: sanitizedData.name,
                phone: sanitizedData.phone,
                customerId: customerId,
                orderType: sanitizedData.orderType,
                // Store all other form fields as JSON in 'details'
                details: JSON.stringify({
                    material: formData.material,
                    bladeWidth: formData.bladeWidth,
                    bladeLength: formData.bladeLength,
                    handleLength: formData.handleLength,
                    productId: formData.productId,
                    modifications: formData.modifications,
                    description: sanitizedData.description,
                    additionalNotes: formData.additionalNotes
                }),
                // Store images array as JSON
                images: JSON.stringify(formData.images || []),
                status: 'pending_quote'
            }
        });

        // Log the order (backup)
        console.log('Custom Order Saved:', {
            id: customOrder.id,
            orderId: customOrder.orderId,
            email: customOrder.email
        })

        // Send email to admin
        const adminEmailResult = await sendCustomOrderEmail({
            ...sanitizedData,
            orderId,
        })

        if (!adminEmailResult.success) {
            console.error('Failed to send admin notification:', adminEmailResult.error)
            // Continue anyway
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
        console.error('API Error detailed:', error);
        logError({
            error: error instanceof Error ? error : new Error(String(error)),
            context: {
                endpoint: '/api/custom-order',
                method: 'POST',
            },
            severity: 'high',
        })

        return NextResponse.json(
            { error: `Failed to submit custom order: ${error.message || String(error)}` },
            { status: 500 }
        )
    }
}
