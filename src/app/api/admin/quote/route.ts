
import { NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma";
import { Resend } from 'resend';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { orderId, price } = body;

        if (!orderId || !price) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Update Order in DB
        const updatedOrder = await prisma.customOrder.update({
            where: { id: orderId },
            data: {
                price: price,
                status: 'awaiting_payment'
            }
        });

        // Send Email to Customer
        // Note: Logic for checkout link generation needs to be implemented.
        // For MVP, we'll point to a generic checkout page with the ID as query param.
        const checkoutUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkout/custom/${updatedOrder.orderId}`; // Friendly ID

        const resend = new Resend(process.env.RESEND_API_KEY);
        
        await resend.emails.send({
            from: 'Fritz\'s Forge <orders@fritzsforge.com>',
            replyTo: 'fritzsforge@gmail.com',
            to: updatedOrder.email,
            subject: `Quote Ready for Custom Order #${updatedOrder.orderId}`,
            html: `
                <h1>Good news! Your custom order quote is ready.</h1>
                <p>We have reviewed your request for <strong>${updatedOrder.orderType === 'scratch' ? 'Custom Piece' : 'Modification'}</strong>.</p>
                <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <h2>Total Price: ${price} RON</h2>
                    <a href="${checkoutUrl}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Proceed to Payment</a>
                </div>
                <p>If you have any questions, simply reply to this email.</p>
            `,
        });

        return NextResponse.json({ success: true, order: updatedOrder });
    } catch (error) {
        console.error("Failed to process quote:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
