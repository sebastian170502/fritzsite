
import { NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        
        // Find by friendly orderId (e.g. CO-123456)
        const customOrder = await prisma.customOrder.findUnique({
            where: { orderId: id }
        });

        if (!customOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Only return necessary public info
        const safeOrder = {
            id: customOrder.id,
            orderId: customOrder.orderId,
            price: customOrder.price,
            currency: customOrder.currency,
            status: customOrder.status,
            name: customOrder.name,
            email: customOrder.email, // Needed for checkout prefill
            details: JSON.parse(customOrder.details),
            images: JSON.parse(customOrder.images)
        };

        return NextResponse.json(safeOrder);
    } catch (error) {
        console.error("Failed to fetch custom order:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
