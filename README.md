# Fritz's Forge ⚒️

A premium, international e-commerce site for handmade metalwork, featuring a rugged "Industrial Heat" aesthetic.

## 🚀 Features

### 🏠 Home Page

- **Split Screen Design**: Interactive "Giant Buttons" layout.
  - **Left**: Custom Order (Video Background: `hero-video.mp4`)
  - **Right**: Shop (Video Background: `shop-video.mp4` with Glossy Overlay)
- **Immersive Experience**: Full-screen visuals, smooth transitions, and distinct typography.

### 🛍️ Shop & Products

- **Catalog**: Dynamic product listing fetched from database.
- **Currency**: Prices displayed in Euro (€).
- **Backend**: integrated with **Prisma SQLite** for managing products and inventory.

### 🎨 Custom Order Design Studio

- **Interactive Form**:
  - "Start from Scratch" vs "Modify from Shop" tabs.
  - **Dynamic Inputs**: 3-Column Dropdowns for dimensions (Blade Width, Blade Length, Handle Length).
  - **Visual Aids**: Image placeholder regarding dimensions guide.
  - **Fluid Transitions**: Gradient fade-in from the video header to the form.
  - **Materials**: Options include Carbon Steel, Stainless Steel, and Wrought Iron.

### 🔧 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Shadcn UI
- **Database**: [Prisma](https://www.prisma.io/) + SQLite
- **State Management**: Zustand
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
   # Initialize SQLite database
   npx prisma db push

   # Open Prisma Studio (to manage products)
   npx prisma studio
   ```

4. **Add Media**

   - Place your video files (`hero-video.mp4`, `shop-video.mp4`) and images (`dimensions-guide.png`) in the `/public` folder.
   - _Note: Large video files are excluded from GitHub to save space._

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📂 Project Structure

- `/src/app`: App Router pages (`page.tsx`, `shop/page.tsx`, `custom/page.tsx`).
- `/src/components`: UI components (`Navbar`, `Footer`, `CustomOrderForm`).
- `/prisma`: Database schema and SQLite file (`dev.db`).
- `/public`: Static assets (images, videos).

## ✨ Recent Updates

- Implemented **Git LFS** strategy for large media.
- Refactored **Custom Order Form** with detailed inputs and placeholders.
- Updated **Footer** to be fixed/sticky with click-to-copy functionality.
- Rebranded to **Fritz's Forge**.

---

_Handcrafted with code and soul._
