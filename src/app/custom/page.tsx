import { prisma } from "@/lib/prisma"
import { CustomOrderForm } from "@/components/custom-order-form"

export default async function CustomOrderPage() {
  // Fetch products from database to populate the dropdown
  // We only need ID and Name for the selection list
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true
    },
    orderBy: {
      name: 'asc'
    }
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Visual Header Section (Moved from Home) */}
      <section className="w-full bg-secondary text-secondary-foreground border-b border-border/20 mb-12">
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
          <div className="flex flex-col justify-center p-12 md:p-24 order-2">
            <h1 className="text-3xl md:text-5xl font-heading font-bold mb-6 leading-tight tracking-tighter uppercase text-white">
              Custom Order
            </h1>
            <p className="text-lg md:text-xl font-light opacity-80 max-w-lg leading-relaxed font-body text-gray-300">
               Personalized forged steel, stainless steel and iron tools
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-20">
        <CustomOrderForm products={products} />
      </main>
    </div>
  )
}
