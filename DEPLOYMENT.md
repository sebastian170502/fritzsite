# Deployment Guide - Fritz's Forge

Complete guide for deploying Fritz's Forge to production.

## Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] All environment variables set in production
- [ ] Secure passwords and secrets generated
- [ ] Database connection configured
- [ ] Email service configured (Resend)
- [ ] Payment gateway configured (Stripe)
- [ ] Analytics configured (Google Analytics)

### 2. Database Setup
- [ ] Production database created (PostgreSQL recommended)
- [ ] Prisma schema migrated
- [ ] Database seeded with initial products
- [ ] Backup strategy configured

### 3. Security Review
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Admin credentials changed from defaults
- [ ] CORS configured properly
- [ ] HTTPS enforced

### 4. Testing
- [ ] All features tested in staging
- [ ] Payment flow tested end-to-end
- [ ] Email delivery tested
- [ ] Analytics events verified
- [ ] Mobile responsive tested
- [ ] Error pages tested

## Deployment to Vercel

### Step 1: Prepare Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "chore: prepare for production deployment"
git push origin main
```

### Step 2: Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js configuration

### Step 3: Configure Environment Variables

Add these in Project Settings → Environment Variables:

**Required:**
```
DATABASE_URL=postgresql://user:password@host:5432/database
NEXT_PUBLIC_URL=https://yourdomain.com
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
REVALIDATION_SECRET=your_random_secret_key
```

**Optional (Stripe):**
```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_ENABLED=true
```

**Optional (Analytics):**
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Optional (Email):**
```
RESEND_API_KEY=re_...
ADMIN_EMAIL=orders@yourdomain.com
```

### Step 4: Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx tsx prisma/seed.ts
```

### Step 5: Deploy

Click "Deploy" in Vercel dashboard. Deployment takes ~2-3 minutes.

### Step 6: Configure Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning (~5 minutes)

## Database Setup (PostgreSQL)

### Using Vercel Postgres

```bash
# Create database
vercel postgres create

# Get connection string
vercel env pull

# Update DATABASE_URL in environment variables
```

### Using External Provider (Supabase, Railway, etc.)

1. Create PostgreSQL database
2. Get connection string
3. Update `DATABASE_URL` in Vercel
4. Run migrations:
```bash
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

## Email Configuration

### Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Add and verify your domain:
   - Add DNS records (MX, TXT, CNAME)
   - Verify domain ownership
3. Create API key
4. Add to Vercel environment variables:
   ```
   RESEND_API_KEY=re_...
   ADMIN_EMAIL=orders@yourdomain.com
   ```

### Email Templates Testing

Test emails in development:
```bash
# Send test order confirmation
curl -X POST http://localhost:3000/api/orders/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test_123",
    "customer_email": "test@example.com",
    "customer_name": "Test Customer",
    "items": [...],
    "total": 100
  }'
```

## Payment Setup (Stripe)

### Production Configuration

1. **Activate Stripe Account**
   - Complete business verification
   - Add bank account details
   - Enable payment methods

2. **Get Live API Keys**
   - Dashboard → Developers → API Keys
   - Copy "Secret key" (starts with `sk_live_`)
   - Add to Vercel: `STRIPE_SECRET_KEY=sk_live_...`

3. **Configure Webhooks**
   ```
   Endpoint URL: https://yourdomain.com/api/webhook
   Events to send:
   - checkout.session.completed
   - payment_intent.succeeded
   - payment_intent.payment_failed
   ```

4. **Test Payment Flow**
   - Use test card: 4242 4242 4242 4242
   - Verify order confirmation email
   - Check webhook delivery

## Analytics Setup

### Google Analytics 4

1. **Create GA4 Property**
   - Go to [analytics.google.com](https://analytics.google.com)
   - Create new property
   - Get Measurement ID (G-XXXXXXXXXX)

2. **Add to Environment**
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Verify Events**
   - Use GA4 DebugView
   - Test e-commerce events
   - Check real-time reports

## Performance Optimization

### 1. Image Optimization

Images are automatically optimized by Next.js Image component.

For external images, add domains to `next.config.ts`:
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'your-cdn.com',
    },
  ],
}
```

### 2. Caching Strategy

- Static pages: Cached at edge
- Dynamic pages: ISR with 60s revalidation
- API routes: Custom cache headers

### 3. Database Optimization

- Connection pooling enabled
- Query caching (5-10 min)
- Database indexes on key fields

## Monitoring & Logging

### Vercel Analytics

Enable in Project Settings → Analytics:
- Web Vitals tracking
- Real User Monitoring
- Performance insights

### Error Tracking (Sentry - Optional)

```bash
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard -i nextjs
```

Add to `.env`:
```
SENTRY_DSN=https://...
SENTRY_ORG=your-org
SENTRY_PROJECT=fritzsite
```

## Security Hardening

### 1. Environment Variables

Never commit `.env.local` to git:
```bash
# Add to .gitignore (already included)
.env*.local
```

### 2. Rate Limiting

Already configured in middleware:
- Checkout: 5 req/min
- Admin: 20 req/min
- General: 60 req/min

### 3. Security Headers

All security headers are set in middleware:
- HSTS
- X-Frame-Options
- X-Content-Type-Options
- CSP (basic)

### 4. Admin Access

Change default credentials immediately:
```env
ADMIN_USERNAME=unique_username
ADMIN_PASSWORD=very_secure_password_here
```

Consider implementing:
- Two-factor authentication
- IP whitelisting
- Session management

## Backup Strategy

### Database Backups

**Automated (Recommended):**
- Enable automatic backups in your database provider
- Retention: 7-30 days

**Manual:**
```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Import database
psql $DATABASE_URL < backup.sql
```

### Application Backups

- Code: Versioned in Git
- Assets: Store in cloud storage (S3, Cloudinary)
- Database: Daily automated backups

## Maintenance

### Regular Tasks

**Weekly:**
- Review error logs
- Check email delivery rates
- Monitor conversion funnel

**Monthly:**
- Update dependencies
- Review security advisories
- Database optimization
- Backup verification

### Updates

```bash
# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Update Next.js
npm install next@latest react@latest react-dom@latest
```

## Rollback Procedure

### Quick Rollback (Vercel)

1. Go to Deployments
2. Find last working deployment
3. Click "..." → Promote to Production
4. Rollback complete in ~30 seconds

### Database Rollback

```bash
# Restore from backup
psql $DATABASE_URL < backup.sql

# Or rollback migration
npx prisma migrate reset
```

## Troubleshooting

### Build Failures

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues

- Check DATABASE_URL format
- Verify SSL requirements
- Check connection pool limits
- Review firewall rules

### Email Delivery Issues

- Verify domain DNS records
- Check Resend API key
- Review email logs in Resend dashboard
- Test with different email providers

### Payment Issues

- Verify Stripe API keys (live vs test)
- Check webhook endpoint
- Review Stripe dashboard logs
- Test with different cards

## Support

For deployment issues:
- GitHub Issues: [repository]/issues
- Email: support@fritzforge.com
- Vercel Support: [vercel.com/support](https://vercel.com/support)

---

**Deployment Checklist Complete? 🚀**

Your Fritz's Forge e-commerce platform is ready for production!
