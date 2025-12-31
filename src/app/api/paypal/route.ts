import { NextRequest, NextResponse } from 'next/server';

// PayPal SDK configuration
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
const PAYPAL_API_BASE = process.env.NODE_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

/**
 * Get PayPal access token
 */
async function getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return data.access_token;
}

/**
 * Create PayPal order
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, currency = 'EUR', orderId, description } = body;

        if (!amount || !orderId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const accessToken = await getAccessToken();

        const orderData = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    reference_id: orderId,
                    description: description || `Order ${orderId}`,
                    amount: {
                        currency_code: currency,
                        value: amount.toFixed(2),
                    },
                },
            ],
            application_context: {
                brand_name: "Fritz's Forge",
                landing_page: 'NO_PREFERENCE',
                user_action: 'PAY_NOW',
                return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?paypal=true&orderId=${orderId}`,
                cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop?paypal_cancelled=true`,
            },
        };

        const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('PayPal order creation failed:', data);
            return NextResponse.json(
                { error: 'Failed to create PayPal order', details: data },
                { status: response.status }
            );
        }

        return NextResponse.json({
            id: data.id,
            status: data.status,
            links: data.links,
        });
    } catch (error) {
        console.error('Error creating PayPal order:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Capture PayPal order payment
 */
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json(
                { error: 'Missing orderId' },
                { status: 400 }
            );
        }

        const accessToken = await getAccessToken();

        const response = await fetch(
            `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('PayPal capture failed:', data);
            return NextResponse.json(
                { error: 'Failed to capture payment', details: data },
                { status: response.status }
            );
        }

        return NextResponse.json({
            id: data.id,
            status: data.status,
            payer: data.payer,
            purchase_units: data.purchase_units,
        });
    } catch (error) {
        console.error('Error capturing PayPal payment:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
