# Quick Start Guide - Fritz's Forge

Essential commands and configurations to get started quickly.

## 🚀 5-Minute Setup

```bash
# 1. Clone and install
git clone https://github.com/sebastian170502/fritzsite.git
cd fritzsite
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your details

# 3. Setup database
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts

# 4. Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📋 Essential Commands

### Development
```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
npm start            # Start production server
npm run type-check   # TypeScript validation
```

### Database
```bash
npx prisma studio    # Open database GUI
npx prisma db push   # Sync schema to database
npx prisma generate  # Generate Prisma client
npx tsx prisma/seed.ts  # Seed with sample data
```

### Deployment
```bash
git push origin main        # Push to GitHub
vercel --prod              # Deploy to Vercel
npx prisma migrate deploy  # Production migration
```

## 🔑 Environment Variables Quick Reference

### Minimal Setup (Development)
```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_URL="http://localhost:3000"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
REVALIDATION_SECRET="dev-secret"
```

### Full Setup (Production)
```env
# Database (Use PostgreSQL in production)
DATABASE_URL="postgresql://user:pass@host:5432/db"

# URLs
NEXT_PUBLIC_URL="https://fritzforge.com"

# Admin
ADMIN_USERNAME="your_username"
ADMIN_PASSWORD="very_secure_password"
REVALIDATION_SECRET="random_32_char_string"

# Payments (Optional)
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_ENABLED="true"

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Email (Optional)
RESEND_API_KEY="re_..."
ADMIN_EMAIL="orders@fritzforge.com"
```

## 🎯 Common Tasks

### Add a New Product
1. Open Prisma Studio: `npx prisma studio`
2. Navigate to Product table
3. Click "Add record"
4. Fill in details and save

**Or via Admin Dashboard:**
1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Login with credentials
3. Click "Add New Product"

### Test Checkout Flow
1. Add products to cart
2. Click "Checkout"
3. Fill in customer details
4. Use test card: `4242 4242 4242 4242`
5. Any future date, any CVV

### Send Test Email
```bash
curl -X POST http://localhost:3000/api/orders/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "test_123",
    "customerName": "Test Customer",
    "customerEmail": "test@example.com",
    "items": [{
      "name": "Test Product",
      "quantity": 1,
      "price": 100
    }],
    "total": 100,
    "shipping_address": {
      "line1": "123 Test St",
      "city": "Test City",
      "country": "RO"
    }
  }'
```

### Check Analytics
1. Open [GA4 DebugView](https://analytics.google.com/analytics/web/#/debugview)
2. In another tab, browse your site
3. See events in real-time

### Clear Cache
```bash
# Development
rm -rf .next node_modules
npm install
npm run dev

# Database cache (in-memory, auto-clears on restart)
# Just restart the dev server
```

## 🔧 Configuration Shortcuts

### Enable Stripe Payments
```env
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_ENABLED="true"
```
Restart dev server after adding.

### Enable Google Analytics
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```
Restart dev server. Events will start tracking immediately.

### Enable Email Notifications
```env
RESEND_API_KEY="re_..."
ADMIN_EMAIL="your@email.com"
```
Test with order confirmation API endpoint.

## 🐛 Quick Troubleshooting

### Build Fails
```bash
# Clear everything and reinstall
rm -rf .next node_modules
npm install
npm run build
```

### Database Issues
```bash
# Reset database
rm prisma/dev.db
npx prisma db push
npx tsx prisma/seed.ts
```

### Port Already in Use
```bash
# Find process on port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or use different port
PORT=3001 npm run dev
```

### Prisma Client Out of Sync
```bash
npx prisma generate
```

### TypeScript Errors
```bash
# Check all errors
npm run type-check

# Fix common issues
rm -rf .next
npm run build
```

## 📍 Important URLs

### Development
- **Homepage**: http://localhost:3000
- **Shop**: http://localhost:3000/shop
- **Admin**: http://localhost:3000/admin
- **Custom Orders**: http://localhost:3000/custom
- **Checkout**: http://localhost:3000/checkout
- **Database GUI**: http://localhost:5555 (Prisma Studio)

### API Endpoints
- **Search**: http://localhost:3000/api/search/suggestions
- **Checkout**: POST http://localhost:3000/api/checkout
- **Custom Order**: POST http://localhost:3000/api/custom-order
- **Reviews**: POST http://localhost:3000/api/reviews

### Admin API
- **Login**: POST http://localhost:3000/api/admin/login
- **Products**: http://localhost:3000/api/admin/products
- **Reviews**: http://localhost:3000/api/admin/reviews

## 🎨 Quick Customization

### Change Brand Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    DEFAULT: '#your-color',
    // ...
  }
}
```

### Update Site Info
Edit `src/lib/metadata.ts`:
```typescript
export const siteConfig = {
  name: "Your Shop Name",
  description: "Your description",
  // ...
}
```

### Modify Email Templates
Edit `src/lib/email-templates.ts` - All templates are in Romanian, customize as needed.

## 💡 Pro Tips

1. **Fast Development**: Use `npm run dev` with hot reload
2. **Database GUI**: Keep Prisma Studio open for quick data changes
3. **Test Cards**: Use Stripe test cards for checkout testing
4. **Debug Mode**: Enable GA4 DebugView for analytics testing
5. **Email Testing**: Use your own email first before customer emails

## 📞 Need Help?

- **Documentation**: See README.md for full details
- **Deployment**: See DEPLOYMENT.md for production guide
- **Issues**: Open GitHub issue
- **Email**: support@fritzforge.com

---

**Ready to build? Let's go! 🚀**
