import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { safeJSONParse } from "@/lib/json-utils";

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("customer_session");

        if (!sessionCookie) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const customerData = safeJSONParse(sessionCookie.value, { email: '' });

        // Fetch real orders from database
        const orders = await prisma.order.findMany({
            where: {
                customerEmail: customerData.email
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Format orders for frontend with safe JSON parsing
        const formattedOrders = orders.map((order: any) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            date: order.createdAt.toISOString(),
            total: Number(order.total),
            status: order.status,
            items: safeJSONParse(order.items, [])
        }));

        return NextResponse.json(formattedOrders);
    } catch (error) {
        console.error("Orders fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
