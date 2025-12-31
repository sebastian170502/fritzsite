
import { NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const customOrders = await prisma.customOrder.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                customer: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        const formattedOrders = customOrders.map((order: any) => ({
            ...order,
            details: JSON.parse(order.details),
            // images is already a string but let's parse it if needed or send as is.
            // In schema, images is String (JSON). Frontend expects array.
            images: JSON.parse(order.images) 
        }));

        return NextResponse.json(formattedOrders);
    } catch (error) {
        console.error("Failed to fetch custom orders:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
