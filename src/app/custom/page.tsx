import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CustomOrderForm } from "@/components/custom-order-form";

export const metadata: Metadata = {
  title: "Custom Order - Design Your Perfect Tool | Fritz's Forge",
  description:
    "Create personalized carbon steel, stainless steel, and wrought iron tools. Start from scratch or modify existing designs.",
};

import { cookies } from "next/headers";

export default async function CustomOrderPage() {
  // Fetch products from database to populate the dropdown
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Fetch current customer session
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("customer_session");
  let customer = null;

  if (sessionCookie) {
    customer = await prisma.customer.findUnique({
      where: { id: sessionCookie.value },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Visual Header Section (Moved from Home) */}
      <section className="relative w-full bg-secondary text-secondary-foreground">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
          {/* Video Section */}
          <div className="relative min-h-[300px] md:min-h-full order-1 border-r border-border/20">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/atelier-video.MP4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
          </div>

          {/* Text Content */}
          <div className="flex flex-col justify-center p-12 md:p-24 order-2 relative">
            <h1 className="text-3xl md:text-5xl font-heading font-bold mb-6 leading-tight tracking-tighter uppercase text-foreground">
              Custom Order
            </h1>
            <p className="text-muted-foreground/80 max-w-xl text-lg mb-8 font-light">
              Personalized carbon steel, stainless steel and wrought iron tools.
            </p>
          </div>
        </div>

        {/* Gradient Transition */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none z-10" />
      </section>

      <main className="container mx-auto px-4 pb-32 -mt-10 relative z-20">
        <CustomOrderForm products={products} customer={customer} />
      </main>
    </div>
  );
}
