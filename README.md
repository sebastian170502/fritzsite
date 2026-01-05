# 🔨 Fritz's Forge

**Version 2.0.0** | [Changelog](CHANGELOG.md) | [API Docs](API_DOCUMENTATION.md)

Production-ready e-commerce platform for handmade metalwork. Built with Next.js 15, TypeScript, and Prisma.

---

## ✨ Features

- 🛒 **E-commerce** - Product catalog, cart, checkout (Stripe), wishlist
- 🎨 **Custom Orders** - Interactive design studio for custom metalwork
- 👨‍💼 **Admin Panel** - Product/order/review management, analytics
- 📊 **Analytics** - Google Analytics 4 with e-commerce tracking
- 📧 **Emails** - Professional transactional emails (Resend)
- 🔒 **Security** - Rate limiting, bcrypt auth, server-side sessions
- 🔍 **SEO** - Structured data, sitemap, meta tags
- ⚡ **Performance** - Database indexes, query caching, optimized images

---

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/sebastian170502/fritzsite.git
cd fritzsite
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Setup database
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Admin Access**: `/admin/login` (use credentials from .env)

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript 5
- **Database**: Prisma ORM + SQLite (dev) / PostgreSQL (prod)
- **Styling**: Tailwind CSS + shadcn/ui
- **Validation**: Zod + React Hook Form
- **State**: Zustand (cart)
- **Payments**: Stripe
- **Email**: Resend
- **Testing**: Vitest (288 tests)

---

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── api/         # API endpoints
│   ├── admin/       # Admin dashboard
│   ├── shop/        # Product pages
│   └── custom/      # Custom orders
├── components/      # React components
├── lib/             # Utilities & config
└── middleware.ts    # Security & rate limiting
```

---

## 📚 Documentation

**Essential**
- [Quick Start](QUICK_START.md) - 5-minute setup
- [Deployment](DEPLOYMENT.md) - Production deployment
- [API Reference](API_DOCUMENTATION.md) - All endpoints
- [Changelog](CHANGELOG.md) - Version history

**Technical** (see `docs/technical/`)
- Security improvements & setup
- Component architecture
- Email system
- Checkout & email setup

**Archive** (see `docs/archive/`)
- Historical reviews and reports

---

## 🔧 Environment Variables

### Required
```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_URL="http://localhost:3000"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="$2b$10$..."  # Use scripts/migrate-admin-password.ts
SESSION_SECRET="64-char-random-string"
REVALIDATION_SECRET="your_secret_key"
```

### Optional
```env
# Payments
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Redis (for production)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Email
RESEND_API_KEY="re_..."
ADMIN_EMAIL="admin@fritzforge.com"

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-..."
```

---

## 🧪 Testing

```bash
npm test              # Run tests
npm run build         # Production build
npm start             # Start production server
```

**Status**: 288/288 tests passing ✅

---

## 📊 Latest Updates (v2.0.0 - Jan 2026)

- ✅ **Security**: Bcrypt auth, Redis rate limiting, server-side sessions
- ✅ **Architecture**: 8 reusable components, 63-64% size reduction
- ✅ **API Docs**: 34 endpoints with OpenAPI 3.0 + Swagger UI
- ✅ **Testing**: 288 tests, 100% passing

See [CHANGELOG.md](CHANGELOG.md) for complete details.

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/sebastian170502/fritzsite/issues)
- **Email**: fritzsforge@gmail.com
- **API Docs**: Visit `/api-docs` when running

---

**Built with ❤️ by Fritz's Forge**
