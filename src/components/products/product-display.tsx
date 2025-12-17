"use client"

import * as React from "react"
import Image from "next/image"
import { useCartStore } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ProductDisplayProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    images: string[]
  }
}

export function ProductDisplay({ product }: ProductDisplayProps) {
  const [selectedImage, setSelectedImage] = React.useState(product.images[0] || "/placeholder.jpg")
  const [quantity, setQuantity] = React.useState(1)
  const { addItem } = useCartStore()

  // Currency Helpers
  const formatEUR = (val: number) => 
    new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(val)
  
  const formatRON = (val: number) => 
    new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(val * 5)

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta))
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            imageUrl: product.images[0] || "/placeholder.jpg",
        })
    }
    toast.success(`Added ${quantity} x ${product.name} to cart`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
      {/* LEFT - Image Gallery */}
      <div className="space-y-6">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/10 bg-zinc-900/50">
          <Image
            src={selectedImage}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={cn(
                  "relative w-20 h-20 rounded-lg overflow-hidden border transition-all flex-shrink-0",
                  selectedImage === img 
                    ? "border-primary ring-2 ring-primary/20" 
                    : "border-border/20 hover:border-border/50"
                )}
              >
                <Image src={img} alt="thumbnail" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT - Product Info */}
      <div className="flex flex-col space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tight text-foreground">
            {product.name}
          </h1>
          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold text-primary">
              {formatEUR(product.price)}
            </span>
            <span className="text-xl text-muted-foreground font-light">
              ({formatRON(product.price)})
            </span>
          </div>
        </div>

        <div className="prose prose-invert prose-lg text-muted-foreground/90">
          <p>{product.description}</p>
        </div>

        <div className="pt-8 border-t border-border/10 space-y-6">
          {/* Quantity */}
          <div className="flex items-center gap-6">
            <span className="text-sm uppercase tracking-widest text-muted-foreground">Quantity</span>
            <div className="flex items-center gap-4 bg-secondary/30 rounded-full p-1 border border-border/10">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-secondary"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-mono text-lg">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-secondary"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <Button 
            size="lg" 
            className="w-full md:w-auto min-w-[200px] text-lg h-14 rounded-full"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
