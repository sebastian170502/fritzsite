"use client"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/hooks/use-cart"
import { toast } from "sonner"

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    imageUrl: string
    category?: string
  }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCartStore()

  const onAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
    })
    
    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart.`
    })
  }

  return (
    <Button 
      onClick={onAddToCart} 
      className="w-full rounded-full transition-all duration-300 opacity-90 hover:opacity-100 text-lg h-14" 
      size="lg"
    >
      Add to Cart
    </Button>
  )
}
