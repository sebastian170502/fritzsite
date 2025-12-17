"use client"

import * as React from "react"
import Link from "next/link"
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
    <Link href={`/shop/${slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden border border-border/50 shadow-md bg-card hover:shadow-xl transition-all duration-300 flex flex-col">
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-t-xl bg-secondary/20">
            <Image 
              src={imageUrl} 
              alt={name} 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Quick Add Overlay - OPTIONAL: Could keep a quick add button here if desired, but user wanted simple presentation link */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 pt-4 p-4">
          <div className="flex flex-col justify-between h-full gap-2">
            <div>
              <CardTitle className="text-lg font-medium line-clamp-2 group-hover:text-primary transition-colors font-heading tracking-wide">
                {name}
              </CardTitle>
            </div>
            <p className="font-semibold text-lg text-primary mt-auto">
              {formatPrice(price)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
