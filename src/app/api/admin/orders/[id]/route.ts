import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { safeJSONParse } from "@/lib/json-utils";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const adminSession = cookieStore.get("admin_session");

        if (!adminSession) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const order = await prisma.order.findUnique({
            where: { id },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        const formattedOrder = {
            ...order,
            items: safeJSONParse(order.items, []),
            shippingAddress: safeJSONParse(order.shippingAddress, {}),
            total: Number(order.total),
            subtotal: Number(order.subtotal),
            shipping: Number(order.shipping),
            tax: Number(order.tax),
        };

        return NextResponse.json(formattedOrder);
    } catch (error) {
        console.error("Failed to fetch order:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const adminSession = cookieStore.get("admin_session");

        if (!adminSession) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const data = await request.json();
        const updateData: any = {};

        if (data.status) updateData.status = data.status;
        if (data.paymentStatus) updateData.paymentStatus = data.paymentStatus;
        if (data.trackingNumber !== undefined) updateData.trackingNumber = data.trackingNumber;
        if (data.courierName !== undefined) updateData.courierName = data.courierName;
        if (data.trackingUrl !== undefined) updateData.trackingUrl = data.trackingUrl;
        if (data.notes !== undefined) updateData.notes = data.notes;

        const order = await prisma.order.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error("Failed to update order:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const adminSession = cookieStore.get("admin_session");

        if (!adminSession) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await prisma.order.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete order:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
