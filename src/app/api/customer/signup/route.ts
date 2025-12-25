import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json();

        // Check if customer already exists
        const existing = await prisma.customer.findUnique({
            where: { email },
        });

        if (existing) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            );
        }

        // In production, hash the password with bcrypt
        // For now, this is simplified
        const customer = await prisma.customer.create({
            data: {
                name,
                email,
                password, // In production: await bcrypt.hash(password, 10)
            },
        });

        // Create session cookie
        const cookieStore = await cookies();
        cookieStore.set("customer_session", customer.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return NextResponse.json({
            success: true,
            customer: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
            },
        });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
