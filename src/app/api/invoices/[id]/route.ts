import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { generateInvoicePDF } from '@/lib/invoice-generator';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    
    // Check authentication (admin or customer)
    const adminSession = cookieStore.get('admin_session');
    const customerSession = cookieStore.get('customer_session');
    
    if (!adminSession && !customerSession) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Fetch order
    const order = await prisma.order.findUnique({
      where: { id },
    });
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // If customer session, verify they own the order
    if (customerSession && !adminSession) {
      try {
        const customerData = JSON.parse(customerSession.value);
        if (order.customerEmail !== customerData.email) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: 'Invalid session' },
          { status: 401 }
        );
      }
    }
    
    // Parse order data
    const items = JSON.parse(order.items as string);
    const shippingAddress = order.shippingAddress 
      ? JSON.parse(order.shippingAddress as string)
      : undefined;
    
    // Generate PDF
    const pdf = generateInvoicePDF({
      orderNumber: order.orderNumber,
      orderDate: order.createdAt.toISOString(),
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone || undefined,
      shippingAddress,
      items,
      subtotal: Number(order.subtotal),
      shipping: Number(order.shipping),
      tax: Number(order.tax),
      total: Number(order.total),
      paymentMethod: order.paymentMethod || undefined,
      paymentStatus: order.paymentStatus || undefined,
    });
    
    // Return PDF as response
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${order.orderNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Invoice generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}
