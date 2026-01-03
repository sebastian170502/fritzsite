"use client";

import * as React from "react";

import { useWishlist } from "@/hooks/use-wishlist";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, X } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart";
import { toast } from "sonner";
import { formatEUR, formatRON } from "@/lib/helpers";

export default function WishlistPage() {
  const wishlist = useWishlist();
  const cart = useCartStore();

  const handleAddToCart = (item: (typeof wishlist.items)[0]) => {
    cart.addItem({
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      imageUrl: item.imageUrl,
    });
    toast.success("Added to cart");
  };

  const handleAddAllToCart = () => {
    let addedCount = 0;
    wishlist.items.forEach((item) => {
      if (!cart.items.some((cartItem) => cartItem.id === item.id)) {
        cart.addItem({
          id: item.id,
          name: item.name,
          slug: item.slug,
          price: item.price,
          imageUrl: item.imageUrl,
        });
        addedCount++;
      }
    });
    if (addedCount > 0) {
      toast.success(
        `Added ${addedCount} ${addedCount === 1 ? "item" : "items"} to cart`
      );
    } else {
      toast.info("All items are already in your cart");
    }
  };

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || wishlist.items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="relative h-40 w-40 mx-auto opacity-20">
              <Heart className="h-full w-full" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-heading font-bold">
                Your Wishlist is Empty
              </h1>
              <p className="text-lg text-muted-foreground">
                Start adding products you love to keep track of them for later.
              </p>
            </div>
            <Button asChild size="lg" className="gap-2">
              <Link href="/shop">
                <ShoppingCart className="h-5 w-5" />
                Browse Shop
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-heading font-bold mb-2">
                My Wishlist
              </h1>
              <p className="text-muted-foreground">
                {wishlist.items.length}{" "}
                {wishlist.items.length === 1 ? "item" : "items"} saved
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleAddAllToCart}
                className="gap-2 flex-1 sm:flex-none"
              >
                <ShoppingCart className="h-4 w-4" />
                Add All to Cart
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  wishlist.clearWishlist();
                  toast.success("Wishlist cleared");
                }}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Wishlist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.items.map((item) => (
              <Card
                key={item.id}
                className="group overflow-hidden border-border/40 hover:border-border hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm"
              >
                {/* Image */}
                <Link href={`/shop/${item.slug}`} className="block">
                  <div className="relative aspect-square overflow-hidden bg-secondary/20">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        wishlist.removeItem(item.id);
                        toast.success("Removed from wishlist");
                      }}
                      className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 transition-all hover:scale-110 hover:bg-background"
                      aria-label="Remove from wishlist"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <Link href={`/shop/${item.slug}`}>
                    <h3 className="font-heading font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </Link>

                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-primary">
                      {formatEUR(item.price)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatRON(item.price)}
                    </p>
                  </div>

                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="w-full gap-2"
                    disabled={cart.items.some(
                      (cartItem) => cartItem.id === item.id
                    )}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {cart.items.some((cartItem) => cartItem.id === item.id)
                      ? "In Cart"
                      : "Add to Cart"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
