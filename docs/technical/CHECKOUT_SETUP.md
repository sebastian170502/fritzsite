# Checkout Setup Instructions

## Current Status

The checkout system is **working** with a fallback mode. Here's what you need to know:

## How It Works Now

1. **Without Stripe**: The checkout page collects customer information and simulates an order
2. **With Stripe**: Full payment processing through Stripe Checkout

## Testing the Checkout

1. Add products to your cart from the shop
2. Click "Proceed to Checkout" in the cart
3. Fill in the shipping information form
4. Click "Complete Order"
5. You'll be redirected to a success page

## Setting Up Stripe (Optional)

If you want to accept real payments, you'll need to set up Stripe:

### 1. Create a Stripe Account

- Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
- Sign up for a free account
- You'll start in "Test Mode" which is perfect for development

### 2. Get Your API Keys

- Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
- Click on "Developers" in the left sidebar
- Click on "API keys"
- You'll see two keys:
  - **Publishable key** (starts with `pk_test_...`)
  - **Secret key** (starts with `sk_test_...`) - Click "Reveal test key"

### 3. Update Your Environment File

Edit your `.env.local` file and replace the placeholder keys:

\`\`\`env
# Replace this line
STRIPE_SECRET_KEY="sk_test_your_secret_key_here"

# With your actual secret key
STRIPE_SECRET_KEY="sk_test_51ABC123..."
\`\`\`

### 4. Enable Stripe in the App

Add this line to your `.env.local`:

\`\`\`env
NEXT_PUBLIC_STRIPE_ENABLED="true"
\`\`\`

### 5. Restart Your Server

Stop the server (Ctrl+C) and restart it:

\`\`\`bash
npm run dev
\`\`\`

## Webhook Setup (For Production)

For production, you'll also need to set up webhooks:

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
5. Copy the webhook secret (starts with `whsec_...`)
6. Add it to `.env.local`:

\`\`\`env
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
\`\`\`

## Testing with Stripe Test Cards

When Stripe is enabled, you can use these test card numbers:

- **Successful payment**: `4242 4242 4242 4242`
- **Declined payment**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any postal code.

## Currency

The checkout is currently set to Romanian Lei (RON). To change the currency:

Edit `/src/app/api/checkout/route.ts`:

\`\`\`typescript
currency: 'ron',  // Change to 'usd', 'eur', etc.
\`\`\`

## Support

If you encounter any issues:

1. Check that your `.env.local` file exists and has the correct keys
2. Restart your development server
3. Check the browser console for error messages
4. Check the terminal for server errors

## Demo Mode Notice

When running without Stripe configuration, the checkout will:
- Collect customer information
- Simulate order processing
- Show success page
- Clear the cart
- Not actually charge any payment

This is perfect for:
- Development and testing
- Demonstrating the UI/UX
- Getting customer information
- Processing orders manually later
