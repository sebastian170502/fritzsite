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
      <main className="flex-1 container mx-auto px-4 pt-16 pb-32">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16 text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight">
            Shop
          </h1>
          <div className="w-24 h-1 bg-primary rounded-full" />
          <p className="text-muted-foreground max-w-2xl text-lg font-light tracking-wide">
            Browse our complete catalog of hand-forged artifacts.
          </p>
        </div>

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
