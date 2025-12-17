import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/products/ProductCard"


export default async function ShopPage() {
  // Fetch all products ordered by newest
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Helper to parse images safely
  const getImageUrl = (product: any) => {
    let imageUrl = "/placeholder.jpg";
    if (product.images) {
      try {
        const images = typeof product.images === 'string' 
          ? JSON.parse(product.images) 
          : product.images;
        if (Array.isArray(images) && images.length > 0) {
          imageUrl = images[0];
        }
      } catch (e) {}
    }
    return imageUrl;
  };

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

      <main className="flex-1 container mx-auto px-4 pb-32 -mt-10 relative z-20">
        {/* Product Grid */}
        {products.length === 0 ? (
           <div className="text-center py-20 border border-border/20 rounded-xl bg-card/50">
             <p className="text-xl text-muted-foreground">No products found in the catalog.</p>
           </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    price={Number(product.price)}
                    imageUrl={getImageUrl(product)}
                />
            ))}
            </div>
        )}
      </main>
    </div>
  )
}
