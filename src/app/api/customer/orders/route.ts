import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { safeJSONParse } from "@/lib/json-utils";

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
        const formattedOrders = orders.map((order: any) => {
            let shippingAddr = { address: '', city: '', postalCode: '', country: '' };
            try {
                if (order.shippingAddress) {
                    shippingAddr = JSON.parse(order.shippingAddress);
                }
            } catch (e) {
                console.error("Failed to parse shipping address for order", order.id);
            }

            return {
                id: order.id,
                orderNumber: order.orderNumber,
                date: order.createdAt.toISOString(),
                createdAt: order.createdAt.toISOString(),
                total: Number(order.total),
                subtotal: Number(order.subtotal),
                shipping: Number(order.shipping),
                tax: Number(order.tax),
                status: order.status,
                paymentStatus: order.paymentStatus,
                items: JSON.parse(order.items),
                type: 'standard',
                customerName: order.customerName,
                customerEmail: order.customerEmail,
                customerPhone: order.customerPhone,
                shippingAddress: shippingAddr,
                trackingNumber: order.trackingNumber
            };
        });

        // Format custom orders to match the list structure
        const formattedCustomOrders = customOrders.map((order: any) => {
            try {
                const details = JSON.parse(order.details);
                const itemName = order.orderType === 'modify'
                    ? `Modified Product Request (ID: ${details.productId})`
                    : `Custom ${details.material ? details.material.replace('-', ' ') : 'Tool'} Request`;

                // Try to extract address from details or use placeholder
                const shippingAddr = {
                    address: order.shippingAddress || '',
                    city: '',
                    postalCode: '',
                    country: ''
                };

                return {
                    id: order.id,
                    orderNumber: order.orderId || order.id.substring(0, 8),
                    date: order.createdAt.toISOString(),
                    createdAt: order.createdAt.toISOString(),
                    total: order.price ? Number(order.price) : 0,
                    subtotal: order.price ? Number(order.price) : 0,
                    shipping: 0,
                    tax: 0,
                    status: order.status,
                    paymentStatus: 'pending', // Custom orders are usually pending initially
                    items: [
                        {
                            name: itemName,
                            quantity: 1,
                            price: order.price ? Number(order.price) : 0,
                            imageUrl: details.images?.[0] || null
                        }
                    ],
                    type: 'custom',
                    customerName: customer.name,
                    customerEmail: customer.email,
                    customerPhone: customer.phone,
                    shippingAddress: shippingAddr,
                    trackingNumber: null
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
