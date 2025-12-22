# Fritz's Forge ⚒️

A premium, international e-commerce site for handmade metalwork, featuring a rugged "Industrial Heat" aesthetic.

## 🚀 Features

### 🏠 Home Page

- **Fixed Viewport Experience**: Non-scrollable, immersive split-screen layout.
- **Split Screen Design**:
  - **Left**: Custom Order (Video Background: `hero-video.mp4`)
  - **Right**: Shop (Video Background: `shop-video.mp4`)
- **Aesthetic**:
  - Dark Mode compliant (White text on Dark overlays).
  - Minimalist layout with overlapping "Fixed" Header and Footer.
  - Centered navigation and balanced white space.

### 🛍️ Shop & Products

- **Catalog**: Dynamic product listing fetched from database (`/shop`).
- **Product Details**:
  - Dedicated page (`/shop/[slug]`) with Image Gallery and Thumbnails.
  - **Dual Currency**: Prices displayed in **EUR** (€) and **RON** (lei).
  - **Quantity Selector**: Add multiple items to cart.
- **Backend**: Integrated with **Prisma** (PostgreSQL/SQLite) for inventory management.

### 🎨 Custom Order Design Studio

- **Interactive Form**:
  - "Start from Scratch" vs "Modify from Shop" tabs.
  - **Dynamic Inputs**: 3-Column Dropdowns for dimensions (Blade Width, Blade Length, Handle Length).
  - **Visual Aids**: Dimensions guide image.
  - **Materials**: Options include Carbon Steel, Stainless Steel, and Wrought Iron.

### 🔧 Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Shadcn UI
  - **Theme**: Dark Mode (Industrial Grey/Black)
- **Database**: [Prisma](https://www.prisma.io/)
- **State Management**: Zustand (Cart, UI State)
- **Language**: TypeScript

## 🛠️ Setup & Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sebastian170502/fritzsite.git
   cd fritzsite
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Database Setup**

   ```bash
   # Initialize database
   npx prisma db push

   # Open Prisma Studio (to manage products)
   npx prisma studio
   ```

4. **Environment Variables**

   Copy `.env.example` to `.env.local` and fill in your keys:

   ```bash
   cp .env.example .env.local
   ```

   Get your Stripe keys from [dashboard.stripe.com](https://dashboard.stripe.com/test/apikeys)

5. **Add Media**

   - Place your video files (`hero-video.mp4`, `shop-video.mp4`) in the `/public` folder.
   - _Note: Git LFS recommended for large media files._

6. **Run Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📂 Project Structure

- `/src/app`: App Router pages (`page.tsx`, `shop/[slug]/page.tsx`, `custom/page.tsx`).
- `/src/components`: UI components (`Navbar`, `Footer`, `ProductDisplay`).
- `/scripts`: Utility scripts for image management (`assign-images.ts`, `refine-images.ts`).
- `/prisma`: Database schema.

## ✨ Recent Updates

- **Critical Fixes Applied (Dec 2024)**:
  - ✅ Stripe checkout API route implemented with webhook support
  - ✅ Custom order form submission with email integration
  - ✅ Error boundaries and 404 page added
  - ✅ Loading states for all async pages
  - ✅ SEO metadata with Open Graph tags
  - ✅ Shared helper functions for currency and image parsing
  - ✅ Stock management via Stripe webhooks
  - ✅ Environment variable configuration
- **Layout Overhaul**: Fixed Header and Footer (64px each) with non-scrollable Home Page.
- **Product Page**: Added detailed view with gallery and dual currency pricing.
- **Stock Management**: Inventory tracking with "Out of Stock" state and quantity limits.
- **Image Optimization**: Content management for product images (JPG conversion, caching fixes).
- **Custom Order**: Functional form with validation and API integration.
- **Media Refinements**: Updated Shop video and refined product imagery (e.g., proper Hammer cropping).
- **Theme**: Enforced Dark Mode with high-contrast White text.
- **Cart**: Functional shopping cart with quantity management and Stripe integration.
- **Code Stability**: Cleaned up legacy code, fixed Type errors, and hardened build process.

---

_Handcrafted with code and soul._
