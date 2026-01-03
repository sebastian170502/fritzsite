
import { NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, customerInfo } = body;

        if (!items || !customerInfo) {
            return NextResponse.json({ error: "Missing required data" }, { status: 400 });
        }

        // Calculate totals
        const subtotal = items.reduce((sum: number, item: any) => sum + (Number(item.price) * item.quantity), 0);
        const shipping = 0; // Free shipping logic
        const total = subtotal + shipping;

        // Generate a fake session ID for tracking
        const fakeSessionId = `SIMULATED_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        // Create Order in DB
        const order = await prisma.order.create({
            data: {
                orderNumber: `ORD-${Date.now()}`, // Simple order number generation
                customerEmail: customerInfo.email,
                customerName: customerInfo.name,
                customerPhone: customerInfo.phone,
                shippingAddress: JSON.stringify(customerInfo.shippingAddress),
                items: JSON.stringify(items),
                subtotal,
                shipping,
                tax: 0,
                total,
                status: 'processing', // Default status for paid/simulated orders
                paymentStatus: 'paid', // Mark as paid for simulation
                paymentMethod: 'card_simulated',
                stripeSessionId: fakeSessionId,
            }
        });

        // Try to link to a registered customer if exists (optional but good for "My Orders")
        try {
            const registeredCustomer = await prisma.customer.findUnique({
                where: { email: customerInfo.email }
            });
            if (registeredCustomer) {
                await prisma.order.update({
                    where: { id: order.id },
                    data: { customerId: registeredCustomer.id }
                });
            }
        } catch (e) {
            // Ignore if linking fails
        }

        return NextResponse.json({ success: true, orderId: order.orderNumber, sessionId: fakeSessionId });
    } catch (error) {
        console.error("Simulation error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
