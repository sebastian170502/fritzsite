import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/products/ProductCard"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams
  const categoryFilter = resolvedSearchParams.category as string | undefined

  // Fetch unique categories directly from Product table
  // Since we replaced the Category relation with a String field
  const productsAll = await prisma.product.findMany({
    select: { category: true }
  })
  
  // Create a unique list of categories from existing products
  const uniqueCategories = Array.from(new Set(productsAll.map(p => p.category))).sort()

  // Fetch Products (filtered if category is present)
  // If category is "All" or undefined, fetch all.
  const whereClause = categoryFilter && categoryFilter !== "All" 
    ? { category: categoryFilter } 
    : {}

  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-12 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-medium">Our Collection</h1>
          <p className="text-muted-foreground max-w-2xl text-lg font-light">
            Timeless metalwork pieces designed to elevate your space.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
            <Button
                variant={!categoryFilter || categoryFilter === "All" ? "default" : "outline"}
                className="rounded-full"
                asChild
            >
                <Link href="/products">All</Link>
            </Button>
            
            {uniqueCategories.map((catString, idx) => (
                <Button
                    key={idx}
                    variant={categoryFilter === catString ? "default" : "outline"}
                    className="rounded-full capitalize"
                    asChild
                >
                    <Link href={`/products?category=${encodeURIComponent(catString)}`}>
                        {catString}
                    </Link>
                </Button>
            ))}
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
           <div className="text-center py-20">
             <p className="text-xl text-muted-foreground">No products found in this category.</p>
             <Button variant="link" asChild className="mt-4">
               <Link href="/products">View all products</Link>
             </Button>
           </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10">
            {products.map((product) => {
                let imageUrl = "/placeholder.jpg";
                if (product.images) {
                try {
                    const images = typeof product.images === 'string' 
                    ? JSON.parse(product.images) 
                    : product.images;
                    if (Array.isArray(images) && images.length > 0) imageUrl = images[0];
                } catch (e) {}
                }

                return (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    price={Number(product.price)}
                    category={product.category || "Uncategorized"}
                    imageUrl={imageUrl}
                />
                )
            })}
            </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
