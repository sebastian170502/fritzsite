/**
 * Wishlist Component
 * Displays customer's saved/wishlist items
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

interface WishlistSectionProps {
  items: WishlistItem[];
  onRemoveItem: (id: string) => void;
}

export function WishlistSection({ items, onRemoveItem }: WishlistSectionProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
        <Button asChild>
          <Link href="/shop">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="group relative overflow-hidden">
          <Link href={`/shop/${item.slug}`}>
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
          </Link>

          <div className="p-4">
            <h3 className="font-semibold text-sm mb-2 line-clamp-2">
              {item.name}
            </h3>
            <p className="text-lg font-bold">€{item.price.toFixed(2)}</p>

            <div className="flex gap-2 mt-3">
              <Button asChild size="sm" className="flex-1">
                <Link href={`/shop/${item.slug}`}>View Product</Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onRemoveItem(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
