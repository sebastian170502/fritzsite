import { NextResponse } from 'next/server'

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

        // TODO: Send email notification to admin
        // For now, we'll just log the order
        console.log('Custom Order Received:', {
            email: formData.email,
            type: formData.orderType,
            timestamp: new Date().toISOString(),
            data: formData
        })

        // In production, you would:
        // 1. Store in database
        // 2. Send email to admin using nodemailer/resend
        // 3. Send confirmation email to customer
        // 4. Create a tracking ID

        return NextResponse.json({
            success: true,
            message: 'Custom order request received. We will contact you within 24 hours.',
            orderId: `CO-${Date.now()}`
        })
    } catch (error) {
        console.error('Custom order error:', error)
        return NextResponse.json(
            { error: 'Failed to submit custom order' },
            { status: 500 }
        )
    }
}
