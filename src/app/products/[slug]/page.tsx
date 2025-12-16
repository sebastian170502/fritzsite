import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProductGallery } from '@/components/products/ProductGallery'
import { AddToCartButton } from '@/components/products/add-to-cart-button'
import { Badge } from '@/components/ui/badge'

// Next.js 15 App Router - Type for dynamic params
type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
  })

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} | Handmade Shop`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    }
  })

  if (!product) {
    notFound()
  }

  // Parse images from JSON string (SQLite workaround) - Improved Logic
  let images: string[] = []
  
  if (product.images) {
    try {
        const rawImages = typeof product.images === 'string' 
            ? JSON.parse(product.images) 
            : product.images;
        
        if (Array.isArray(rawImages) && rawImages.length > 0) {
            images = rawImages;
        } else {
            // Check if it parsed but empty or not array
             images = [`https://placehold.co/600x600/f5ebe0/5d4037?text=${encodeURIComponent(product.name)}`]
        }
    } catch (e) {
        images = [`https://placehold.co/600x600/f5ebe0/5d4037?text=${encodeURIComponent(product.name)}`]
    }
  } else {
     images = [`https://placehold.co/600x600/f5ebe0/5d4037?text=${encodeURIComponent(product.name)}`]
  }
  
  const mainImage = images[0]

  return (
    <main className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
        {/* Left: Image Gallery */}
        <div className="relative">
           <ProductGallery images={images} productName={product.name} />
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
              {product.category && (
                <Badge variant="secondary" className="mb-4 text-xs tracking-widest uppercase rounded-full px-3 py-1">
                  {product.category.name}
                </Badge>
              )}
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-4 tracking-tight">
                {product.name}
              </h1>
              
              <p className="text-3xl font-medium text-primary">
                {new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(Number(product.price))}
              </p>
          </div>

          <div className="prose prose-stone max-w-none text-muted-foreground text-lg leading-relaxed font-light">
            <p>{product.description}</p>
          </div>

          <div className="pt-6 border-t flex flex-col gap-6">
            <AddToCartButton 
                product={{
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    imageUrl: mainImage,
                    category: product.category?.name
                }}
            />
          </div>
          
          <div className="bg-secondary/20 rounded-xl p-6 mt-8 space-y-4">
            <h3 className="font-semibold uppercase text-xs tracking-wider">Product Details</h3>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li>Handcrafted uniquely for you</li>
              <li>Premium sustainable materials</li>
              <li>{product.stock > 0 ? `In Stock: ${product.stock} items` : 'Made to order (2-3 weeks)'}</li>
              <li>Free shipping on all orders over 500 RON</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
