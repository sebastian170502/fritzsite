import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("customer_session");

        if (!sessionCookie) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const customerId = sessionCookie.value;

        // Fetch customer details to get email
        const customer = await prisma.customer.findUnique({
             where: { id: customerId }
        });

        if (!customer) {
             return NextResponse.json(
                 { error: "Customer not found" },
                 { status: 401 }
             );
        }

        console.log(`[API Orders] Fetching for: ${customer.email}`);

        // Fetch real orders from database
        const orders = await prisma.order.findMany({
            where: {
                customerEmail: customer.email
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        console.log(`[API Orders] Found ${orders.length} standard orders`);

        // Fetch custom orders
        const customOrders = await prisma.customOrder.findMany({
            where: {
                email: customer.email
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        console.log(`[API Orders] Found ${customOrders.length} custom orders`);

        // Format regular orders
        const formattedOrders = orders.map((order: any) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            date: order.createdAt.toISOString(),
            total: Number(order.total),
            status: order.status,
            items: JSON.parse(order.items),
            type: 'standard'
        }));

        // Format custom orders to match the list structure
        const formattedCustomOrders = customOrders.map((order: any) => {
            try {
                const details = JSON.parse(order.details);
                const itemName = order.orderType === 'modify' 
                    ? `Modified Product Request (ID: ${details.productId})`
                    : `Custom ${details.material ? details.material.replace('-', ' ') : 'Tool'} Request`;

                return {
                    id: order.id,
                    orderNumber: order.orderId,
                    date: order.createdAt.toISOString(),
                    total: 0, // Quote pending
                    status: order.status, // e.g. 'pending_quote'
                    items: [
                    {
                        name: itemName,
                        quantity: 1,
                        price: 0
                    }
                    ],
                    type: 'custom'
                };
            } catch (e) {
                console.error(`[API Orders] Failed to parse custom order ${order.id}`, e);
                return null;
            }
        }).filter(Boolean); // Remove failed parses

        // Combine and sort by date desc
        const allOrders = [...formattedOrders, ...formattedCustomOrders].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        console.log(`[API Orders] Returning ${allOrders.length} total orders`);

        return NextResponse.json(allOrders);
    } catch (error) {
        console.error("Orders fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
