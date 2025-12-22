import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("customer_session");

        if (!sessionCookie) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // For now, return mock orders
        // In production, fetch from database with proper relations
        const orders = [
            {
                id: "1",
                orderNumber: "ORD-2024-001",
                date: new Date().toISOString(),
                total: 299.99,
                status: "delivered" as const,
                items: [
                    { name: "Damascus Steel Knife", quantity: 1, price: 299.99 },
                ],
            },
            {
                id: "2",
                orderNumber: "ORD-2024-002",
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                total: 149.99,
                status: "shipped" as const,
                items: [
                    { name: "Hand Forged Axe", quantity: 1, price: 149.99 },
                ],
            },
        ];

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Orders fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
