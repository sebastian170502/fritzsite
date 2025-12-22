import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ShopClient } from "@/components/shop-client";
import { getFirstProductImage } from "@/lib/helpers";

export const metadata: Metadata = {
  title: "Shop - Hand-Forged Metalwork | Fritz's Forge",
  description:
    "Browse our collection of hand-forged artifacts. Premium metalwork crafted with traditional blacksmithing techniques.",
};

// Enable ISR with 300 second (5 min) revalidation for shop page
export const revalidate = 300;

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Serialize products for client component
  const serializedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    imageUrl: getFirstProductImage(product.images),
    description: product.description,
    material: product.material || undefined,
    category: product.category || undefined,
    stock: product.stock,
  }));

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      {/* Visual Header Section (Mirrored from Custom Order) */}
      <section className="relative w-full bg-secondary text-secondary-foreground">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
          {/* Video Section (Left Side) */}
          <div className="relative min-h-[300px] md:min-h-full order-1 border-r border-border/20">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/shop-video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
          </div>

          {/* Text Content (Right Side) */}
          <div className="flex flex-col justify-center p-12 md:p-24 order-2 relative">
            <h1 className="text-3xl md:text-5xl font-heading font-bold mb-6 leading-tight tracking-tighter uppercase text-white">
              Shop
            </h1>
            <p className="text-muted-foreground/80 max-w-xl text-lg mb-8 font-light">
              Browse our collection of hand-forged artifacts.
            </p>
          </div>
        </div>

        {/* Gradient Transition */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none z-10" />
      </section>

      <ShopClient products={serializedProducts} />
    </div>
  );
}
