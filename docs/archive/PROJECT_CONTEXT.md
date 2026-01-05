# PROJECT CONTEXT & AI INSTRUCTIONS

**Project Name:** Fritz Ironworks
**Description:** A premium, international e-commerce site for handmade metalwork.

## 1. Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **State Management:** Zustand (`use-cart.ts`)
- **Database:** Prisma + SQLite (`dev.db`)
- **Payments:** Stripe (Test Mode) -> Currency: RON
- **Icons:** Lucide React

## 2. Design System: "Industrial Heat"

- **Mood:** Dark, Raw, Forged, "Industrial Minimalism".
- **Color Palette (defined in `globals.css`):**
  - `Background`: #0F0F10 (Deep Charcoal/Black)
  - `Foreground`: #F5F5F0 (Off-White/Paper)
  - `Primary`: #E65100 (Rust Orange/Molten Metal)
  - `Secondary`: #27272A (Dark Industrial Grey)
  - `Border`: #3F3F46 (Steel Grey)
- **Typography:**
  - **Headings:** Playfair Display (`font-heading`) -> **BOLD & UPPERCASE**
  - **Body:** Inter (`font-body`)
- **UI Elements:**
  - **Buttons:** Rounded (`rounded-full`), uppercase, tracking-widest.
  - **Components:** High contrast, dark mode aesthetics.

## 3. Key Components & Architecture

- **Navbar:** Sticky, Backdrop blur. Includes Logo ("Fritz Ironworks"), English Navigation, Language Selector (Globe Icon), Cart Trigger.
  - **Hero Section (`app/page.tsx`):**
  - structure: Full-screen Video (`/hero-video.mp4`) + Dark Overlay.
  - content: "Handcrafted with soul", Buttons ("Custom Project", "Shop Collection").
- **Products Catalog (`app/products/page.tsx`):**
  - **Server Component**: Fetches products & categories from DB.
  - **Features**: Filter by Category (via URL params), Responsive Grid.
- **Atelier Section (`app/page.tsx`):**
  - structure: Split-screen (Text Left/Right + Video `/atelier-video.mp4`).
- **Product Page (`app/products/[slug]/page.tsx`):**
  - **Server Component** for fetching data.
  - **Client Component** (`AddToCartButton`) for interactivity.
- **Cart:** Implemented as a Side Sheet (`components/cart-sheet.tsx`).

## 4. Conventions

- **Language:** English is the PRIMARY language for all UI text.
- **Currency:** Display prices in RON (check `Intl.NumberFormat`).
- **Images:** Handle JSON parsing for Prisma SQLite compatibility.
- **Routing:**
  - `/custom`: Custom Orders page (Tabs: Modify vs Scratch).
  - `/success`: Stripe success page (w/ Confetti).

## 5. Development Status

- **Server:** Runs on `localhost:3000`.
- **Database Studio:** Runs on `localhost:5555`.
- **Assets:** Videos must be in `/public`.

---

_Copy this content at the start of a new chat to provide full context._
