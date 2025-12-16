"use client"

import * as React from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/hooks/use-cart"
import { toast } from "sonner"

interface ProductCardProps {
  id: string
  name: string
  price: number
  imageUrl: string
  slug: string
}

export function ProductCard({ id, name, price, imageUrl, slug }: ProductCardProps) {
  const { addItem } = useCartStore()

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value)
  }

  const onAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addItem({
      id,
      name,
      price,
      imageUrl,
    })
  }

  return (
    <Card className="group overflow-hidden border border-border/50 shadow-md bg-card hover:shadow-xl transition-all duration-300">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary/20">
          <Image 
            src={imageUrl} 
            alt={name} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Quick Add Overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 px-1">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium line-clamp-1 group-hover:text-primary transition-colors">
              {name}
            </CardTitle>
          </div>
          <p className="font-semibold text-lg text-primary">
            {formatPrice(price)}
          </p>
        </div>
        <CardDescription className="sr-only">Product details for {name}</CardDescription>
      </CardContent>

      <CardFooter className="p-0 px-1 mt-2">
        <Button 
          onClick={onAddToCart} 
          className="w-full rounded-full transition-all duration-300 opacity-90 hover:opacity-100" 
          size="lg"
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
