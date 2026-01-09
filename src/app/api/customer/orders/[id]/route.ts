import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { safeJSONParse } from "@/lib/json-utils";

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("customer_session");

        if (!sessionCookie) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const customerId = sessionCookie.value;

        // Verify customer exists
        const customer = await prisma.customer.findUnique({
            where: { id: customerId }
        });

        if (!customer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 401 });
        }

        // Try finding standard order first
        const order = await prisma.order.findFirst({
            where: {
                id: id,
                customerEmail: customer.email
            }
        });

        if (order) {
            let shippingAddr = { address: '', city: '', postalCode: '', country: '' };
            try {
                if (order.shippingAddress) {
                    shippingAddr = JSON.parse(order.shippingAddress);
                }
            } catch (e) {
                console.error("Failed to parse shipping address", e);
            }

            return NextResponse.json({
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                trackingNumber: order.trackingNumber,
                courierName: order.courierName,
                trackingUrl: order.trackingUrl,
                shippingAddress: shippingAddr,
                items: safeJSONParse(order.items, [])
            });
        }

        // Try finding custom order
        const customOrder = await prisma.customOrder.findFirst({
            where: {
                id: id,
                email: customer.email
            }
        });

        if (customOrder) {
             let shippingAddr = { address: '', city: '', postalCode: '', country: '' };
            try {
                if (customOrder.shippingAddress) {
                    shippingAddr = JSON.parse(customOrder.shippingAddress);
                }
            } catch (e) {
                 console.error("Failed to parse shipping address", e);
            }
            
            const details = safeJSONParse(customOrder.details, {});
            const itemName = customOrder.orderType === 'modify'
                    ? `Modified Product Request (ID: ${details.productId})`
                    : `Custom ${details.material || 'Item'} Request`;

            return NextResponse.json({
                 id: customOrder.id,
                 orderNumber: customOrder.orderId,
                 status: customOrder.status,
                 trackingNumber: customOrder.trackingNumber,
                 courierName: customOrder.courierName,
                 trackingUrl: customOrder.trackingUrl,
                 shippingAddress: shippingAddr,
                 items: [
                     {
                         name: itemName,
                         quantity: 1,
                         price: Number(customOrder.price || 0),
                         imageUrl: customOrder.images ? safeJSONParse(customOrder.images, [])[0] : null
                     }
                 ]
            });
        }

        return NextResponse.json({ error: "Order not found" }, { status: 404 });

    } catch (error) {
        console.error("Order details fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
