"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/hooks/use-cart";

export function CartSheet() {
  const router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);
  const cart = useCartStore();
  const [loading, setLoading] = React.useState(false);

  // Prevent hydration error
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button variant="outline" size="icon" className="relative rounded-full">
        <ShoppingCart className="h-4 w-4" />
      </Button>
    );
  }

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full border-none bg-secondary/50 hover:bg-secondary"
          aria-label={`Shopping cart with ${itemCount} items`}
        >
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold animate-in zoom-in"
              aria-label={`${itemCount} items in cart`}
            >
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle>My Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />

        {cart.items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 pr-6">
            <div className="relative h-40 w-40 opacity-20">
              <ShoppingCart className="h-full w-full" />
            </div>
            <p className="text-xl font-medium text-muted-foreground">
              Your cart is empty
            </p>
            <Button variant="link" asChild className="text-primary">
              <Link href="/">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto pr-6 -mr-6 px-1">
              <div className="space-y-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-secondary/20">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-sm line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="flex flex-col items-end">
                          <p className="text-sm font-semibold text-primary">
                            {new Intl.NumberFormat("en-IE", {
                              style: "currency",
                              currency: "EUR",
                            }).format(item.price * item.quantity)}
                          </p>
                          <p className="text-xs text-muted-foreground mr-1">
                            (
                            {new Intl.NumberFormat("ro-RO", {
                              style: "currency",
                              currency: "RON",
                            }).format(item.price * item.quantity * 5)}
                            )
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-md h-8">
                          <button
                            onClick={() =>
                              cart.updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="px-2 h-full hover:bg-secondary transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <div className="px-2 text-sm font-medium min-w-[1.5rem] text-center">
                            {item.quantity}
                          </div>
                          <button
                            onClick={() =>
                              cart.updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-2 h-full hover:bg-secondary transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => cart.removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pr-6 pt-6">
              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-medium">Total</span>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-lg text-primary">
                      {new Intl.NumberFormat("en-IE", {
                        style: "currency",
                        currency: "EUR",
                      }).format(cart.total())}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      (
                      {new Intl.NumberFormat("ro-RO", {
                        style: "currency",
                        currency: "RON",
                      }).format(cart.total() * 5)}
                      )
                    </span>
                  </div>
                </div>
              </div>
              <Button
                className="w-full rounded-full h-12 text-lg font-medium"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? "Processing..." : "Proceed to Checkout"}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
