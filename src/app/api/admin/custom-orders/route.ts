
import { NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma";
import { safeJSONParse } from '@/lib/json-utils';

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
            details: safeJSONParse(order.details, {}),
            images: safeJSONParse(order.images, [])
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
