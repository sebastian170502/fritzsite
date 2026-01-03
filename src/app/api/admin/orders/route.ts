import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { safeJSONParse } from "@/lib/json-utils";

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const adminSession = cookieStore.get("admin_session");

        if (!adminSession) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
        });

        // Parse JSON strings in items and shippingAddress with safe parsing
        const formattedOrders = orders.map((order: any) => ({
            ...order,
            items: safeJSONParse(order.items, []),
            shippingAddress: safeJSONParse(order.shippingAddress, {}),
            total: Number(order.total),
            subtotal: Number(order.subtotal),
            shipping: Number(order.shipping),
            tax: Number(order.tax),
        }));

        return NextResponse.json(formattedOrders);
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const adminSession = cookieStore.get("admin_session");

        if (!adminSession) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();

        const order = await prisma.order.create({
            data: {
                orderNumber: data.orderNumber,
                customerEmail: data.customerEmail,
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                shippingAddress: JSON.stringify(data.shippingAddress),
                items: JSON.stringify(data.items),
                subtotal: data.subtotal,
                shipping: data.shipping || 0,
                tax: data.tax || 0,
                total: data.total,
                status: data.status || "pending",
                paymentStatus: data.paymentStatus || "pending",
                paymentMethod: data.paymentMethod,
                stripeSessionId: data.stripeSessionId,
            },
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error("Failed to create order:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
