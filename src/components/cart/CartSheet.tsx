"use client"

import * as React from "react"
import { ShoppingBag, X, Minus, Plus } from "lucide-react"
import Image from "next/image"
import { useCartStore } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function CartSheet() {
  const { items, removeItem, updateQuantity, total } = useCartStore()
  const [loading, setLoading] = React.useState(false)
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  const handleCheckout = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Checkout failed', data.error)
      }
    } catch (error) {
      console.error('An error occurred', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full">
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-auto py-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <ShoppingBag className="h-12 w-12 mb-4 opacity-20" />
              <p>Your cart is empty.</p>
              <p className="text-sm mt-2">Start adding some handmade treasures!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-md bg-secondary/20 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors ml-2"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mt-2">
                             <div className="flex items-center border rounded-full h-8 px-2 space-x-2">
                                <button 
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-1 hover:text-primary disabled:opacity-50"
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus className="h-3 w-3" />
                                </button>
                                <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                <button 
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-1 hover:text-primary"
                                >
                                    <Plus className="h-3 w-3" />
                                </button>
                             </div>
                             <p className="font-medium text-right">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
            <div className="border-t pt-6 bg-background">
                <div className="flex justify-between mb-4">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold text-lg">${total().toFixed(2)}</span>
                </div>
                <Button 
                    className="w-full rounded-full h-12 text-lg"
                    onClick={handleCheckout}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Checkout"}
                </Button>
            </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
