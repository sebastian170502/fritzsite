# Fritz's Forge - Quick Reference

## 🚀 Quick Commands

```bash
# Development
npm run dev                    # Start dev server
npx prisma studio             # Open database admin

# Testing
npm run build                  # Test production build
stripe listen --forward-to localhost:3000/api/webhook  # Test webhooks

# Database
npx prisma db push            # Apply schema changes
npx prisma migrate dev        # Create migration
npx prisma generate           # Regenerate Prisma Client
```

## 📁 Key Files

| File                                | Purpose               |
| ----------------------------------- | --------------------- |
| `src/app/api/checkout/route.ts`     | Stripe checkout       |
| `src/app/api/webhook/route.ts`      | Stock management      |
| `src/app/api/custom-order/route.ts` | Custom orders         |
| `src/lib/helpers.ts`                | Shared utilities      |
| `prisma/schema.prisma`              | Database schema       |
| `.env.local`                        | Environment variables |

## 🔑 Environment Variables

```env
DATABASE_URL="file:./dev.db"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_URL="http://localhost:3000"
```

## 🎯 Testing Checklist

- [ ] Homepage loads with videos
- [ ] Shop displays products  
- [ ] Product detail shows gallery
- [ ] Add to cart works
- [ ] Checkout redirects to Stripe
- [ ] Payment completes (use 4242...)
- [ ] Success page shows
- [ ] Stock decrements
- [ ] Custom order submits

## 🛠️ Common Tasks

### Add a Product
1. Run `npx prisma studio`
2. Go to Product table
3. Click "Add record"
4. Fill in: name, slug, description, price, stock
5. For images: `["image1.jpg", "image2.jpg"]`
6. Save

### Test Checkout
1. Add product to cart
2. Click checkout
3. Use test card: `4242 4242 4242 4242`
4. Check Prisma Studio - stock should decrease

### Debug Webhooks
```bash
# Terminal 1: Start webhook listener
stripe listen --forward-to localhost:3000/api/webhook

# Terminal 2: View webhook logs
stripe logs tail

# Terminal 3: Trigger test event
stripe trigger checkout.session.completed
```

## 📧 Stripe Test Cards

| Card                  | Result                  |
| --------------------- | ----------------------- |
| `4242 4242 4242 4242` | Success                 |
| `4000 0000 0000 9995` | Declined                |
| `4000 0025 0000 3155` | Requires authentication |

## 🐛 Troubleshooting

| Issue                 | Solution                                 |
| --------------------- | ---------------------------------------- |
| Build fails           | Check Stripe keys in .env.local          |
| Images not loading    | Verify JSON format in database           |
| Checkout doesn't work | Check STRIPE_SECRET_KEY                  |
| Stock not decreasing  | Run stripe webhook listener              |
| Database error        | `rm prisma/dev.db && npx prisma db push` |

## 📱 Browser Testing

Test on:
- [ ] Chrome (desktop)
- [ ] Safari (desktop)
- [ ] Firefox (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (iOS)

## 🚀 Deploy to Vercel

```bash
# 1. Push to GitHub
git add .
git commit -m "Production ready"
git push

# 2. Import in Vercel
# Visit vercel.com → Import → Select repo

# 3. Add environment variables in Vercel dashboard

# 4. Deploy
```

## 📊 Performance Goals

- Lighthouse Performance: > 90
- First Contentful Paint: < 1.8s
- Time to Interactive: < 3.8s
- Bundle size: < 200KB (gzipped)

## 🔒 Security

- [x] Environment variables not in git
- [x] Webhook signature verification
- [x] Input validation on forms
- [x] CSRF protection (Next.js handles)
- [x] SQL injection protection (Prisma handles)

## 📞 Support Resources

- Next.js: https://nextjs.org/docs
- Stripe: https://stripe.com/docs
- Prisma: https://prisma.io/docs
- Tailwind: https://tailwindcss.com/docs

---

**Need help?** Check SETUP_GUIDE.md for detailed instructions.
