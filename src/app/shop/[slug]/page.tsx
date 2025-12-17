
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProductDisplay } from "@/components/products/product-display"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Await params for Next.js 15+ compatibility
  const slug = (await params).slug

  const product = await prisma.product.findUnique({
    where: { slug },
  })

  if (!product) {
    notFound()
  }

  // Parse images helper
  let images: string[] = []
  try {
    images = JSON.parse(product.images)
  } catch {
    images = ["/placeholder.jpg"]
  }
  if (!images.length) images = ["/placeholder.jpg"]

  const serializedProduct = {
    ...product,
    price: Number(product.price),
    images,
    stock: product.stock
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-32">
      <div className="container mx-auto px-4">
        <ProductDisplay product={serializedProduct} />
      </div>
    </div>
  )
}
