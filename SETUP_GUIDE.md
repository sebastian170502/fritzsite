# Fritz's Forge - Setup & Testing Guide

## 🚀 Quick Start

### 1. Initial Setup
```bash
# Clone and install
git clone https://github.com/sebastian170502/fritzsite.git
cd fritzsite
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local and add your Stripe keys
```

### 2. Database Setup
```bash
# Initialize database
npx prisma db push

# (Optional) Seed with sample data
npx prisma db seed

# Open database admin panel
npx prisma studio
# Visit http://localhost:5555 to manage products
```

### 3. Run Development Server
```bash
npm run dev
# Visit http://localhost:3000
```

---

## 🔑 Environment Variables

### Required Variables
```env
# Database (SQLite for development)
DATABASE_URL="file:./dev.db"

# Stripe (Get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_URL="http://localhost:3000"

# Stripe Webhooks (for stock management)
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Setting Up Stripe Webhooks (Local Development)

1. Install Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

4. Copy the webhook signing secret to `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET="whsec_xxx"
   ```

---

## 🧪 Testing Checklist

### Core Features
- [ ] **Homepage**
  - [ ] Videos load and autoplay
  - [ ] Split-screen layout responsive
  - [ ] Navigation to Shop and Custom Order works

- [ ] **Shop Page**
  - [ ] Products load from database
  - [ ] Images display correctly
  - [ ] Prices shown in EUR and RON
  - [ ] Product cards clickable

- [ ] **Product Detail Page**
  - [ ] Image gallery with thumbnails
  - [ ] Price displays correctly
  - [ ] Stock status shows
  - [ ] Quantity selector works
  - [ ] Add to cart functions
  - [ ] Out of stock products can't be added

- [ ] **Shopping Cart**
  - [ ] Cart icon shows item count
  - [ ] Items display with images
  - [ ] Quantity can be updated
  - [ ] Items can be removed
  - [ ] Total calculates correctly
  - [ ] Checkout button initiates Stripe

- [ ] **Checkout Flow**
  - [ ] Redirects to Stripe
  - [ ] Test card works: `4242 4242 4242 4242`
  - [ ] Redirects to success page
  - [ ] Cart clears after purchase
  - [ ] Stock decrements (check Prisma Studio)

- [ ] **Custom Order Form**
  - [ ] Both tabs work (Scratch & Modify)
  - [ ] Form validation works
  - [ ] Email validation
  - [ ] Image upload previews
  - [ ] Form submission success
  - [ ] Loading states show

### Error Handling
- [ ] 404 page for invalid routes
- [ ] Error boundary for crashes
- [ ] Loading skeletons during data fetch
- [ ] Toast notifications for errors

---

## 🐛 Common Issues & Solutions

### Issue: Stripe Checkout Fails
**Solution**: Check that `STRIPE_SECRET_KEY` starts with `sk_test_` and is in `.env.local`

### Issue: Stock Not Decreasing
**Solution**: 
1. Ensure webhook is running: `stripe listen --forward-to localhost:3000/api/webhook`
2. Check `STRIPE_WEBHOOK_SECRET` is set correctly
3. Verify webhook logs: `stripe logs tail`

### Issue: Images Not Loading
**Solution**: 
1. Check images are in `/public` folder
2. Verify product.images in database is valid JSON array
3. Run: `npx ts-node scripts/check-images.ts`

### Issue: Database Connection Error
**Solution**:
```bash
# Reset database
rm prisma/dev.db
npx prisma db push
# Re-add products in Prisma Studio
```

---

## 📦 Production Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Environment Variables**
   Add in Vercel dashboard:
   - `DATABASE_URL` - Use PostgreSQL (e.g., Neon, Supabase)
   - `STRIPE_SECRET_KEY` - Production key
   - `STRIPE_WEBHOOK_SECRET` - Production webhook
   - `NEXT_PUBLIC_URL` - Your domain

4. **Setup Production Webhook**
   ```bash
   # In Stripe Dashboard > Developers > Webhooks
   # Add endpoint: https://yourdomain.com/api/webhook
   # Select event: checkout.session.completed
   ```

5. **Migrate to PostgreSQL**
   ```prisma
   // prisma/schema.prisma
   datasource db {
     provider = "postgresql" // Change from sqlite
     url      = env("DATABASE_URL")
   }
   ```

   ```bash
   npx prisma db push
   ```

---

## 🔒 Security Checklist

- [ ] `.env.local` in `.gitignore`
- [ ] Stripe webhook signature verification enabled
- [ ] CORS properly configured
- [ ] Rate limiting on API routes (consider implementing)
- [ ] Input validation on all forms
- [ ] SQL injection protected (Prisma handles this)

---

## 📊 Performance Optimization

### Image Optimization
```bash
# Convert images to WebP
npm install sharp
npx sharp-cli -i public/product.jpg -o public/product.webp --webp
```

### Video Optimization
- Compress videos: Use [HandBrake](https://handbrake.fr/)
- Target: < 5MB per video
- Format: MP4 (H.264 codec)

### Lighthouse Score Goals
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

---

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/sebastian170502/fritzsite/issues)
- **Stripe Docs**: [stripe.com/docs](https://stripe.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Docs**: [prisma.io/docs](https://www.prisma.io/docs)
