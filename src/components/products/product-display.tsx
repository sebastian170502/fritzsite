"use client";

import * as React from "react";
import Image from "next/image";
import { useCartStore } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatEUR, formatRON } from "@/lib/helpers";
import { WishlistButton } from "@/components/wishlist-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewForm } from "@/components/products/review-form";
import { ReviewList } from "@/components/products/review-list";
import { ProductRating } from "@/components/products/product-rating";

interface ProductDisplayProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    stock: number;
    reviews?: Array<{
      id: string;
      rating: number;
    }>;
  };
}

export function ProductDisplay({ product }: ProductDisplayProps) {
  const [selectedImage, setSelectedImage] = React.useState(
    product.images[0] || "/placeholder.jpg"
  );
  const [quantity, setQuantity] = React.useState(1);
  const [refreshReviews, setRefreshReviews] = React.useState(0);
  const { addItem } = useCartStore();

  // Calculate average rating
  const averageRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : 0;
  const reviewCount = product.reviews?.length || 0;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const uniqueNew = prev + delta;
      // Prevent going below 1
      if (uniqueNew < 1) return 1;
      // Prevent going above stock
      if (uniqueNew > product.stock) return product.stock;
      return uniqueNew;
    });
  };

  const handleAddToCart = () => {
    // Double check stock
    if (quantity > product.stock) {
      toast.error("Not enough stock available");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        imageUrl: product.images[0] || "/placeholder.jpg",
      });
    }
    toast.success(`Added ${quantity} x ${product.name} to cart`);
  };

  const isOutOfStock = product.stock <= 0;

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
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-2xl font-bold uppercase tracking-widest border-2 border-white px-6 py-3">
                Out of Stock
              </span>
            </div>
          )}
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
                <Image
                  src={img}
                  alt="thumbnail"
                  fill
                  className="object-cover"
                />
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
          <div className="flex items-baseline gap-4 group cursor-default">
            <span className="text-3xl font-bold text-white">
              {formatEUR(product.price)}
            </span>
            <span className="text-xl text-muted-foreground font-light">
              ({formatRON(product.price)})
            </span>
          </div>

          {/* Stock Status Label */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isOutOfStock ? "bg-destructive" : "bg-green-500"
              )}
            />
            <span
              className={cn(
                "text-sm font-medium uppercase tracking-wide",
                isOutOfStock ? "text-destructive" : "text-green-500"
              )}
            >
              {isOutOfStock ? "Out of Stock" : `${product.stock} in stock`}
            </span>
          </div>
        </div>

        <div className="prose prose-invert prose-lg text-muted-foreground/90">
          <p>{product.description}</p>
        </div>

        <div className="pt-8 border-t border-border/10 space-y-6">
          {/* Quantity */}
          <div className="flex items-center gap-6">
            <span className="text-sm uppercase tracking-widest text-muted-foreground">
              Quantity
            </span>
            <div className="flex items-center gap-4 bg-secondary/30 rounded-full p-1 border border-border/10">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-secondary"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || isOutOfStock}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-mono text-lg">
                {isOutOfStock ? 0 : quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-secondary"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock || isOutOfStock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {quantity >= product.stock && !isOutOfStock && (
              <span className="text-xs text-amber-500 font-medium">
                Max Limit Reached
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="flex-1 text-lg h-14 rounded-full"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
            <WishlistButton
              product={{
                id: product.id,
                name: product.name,
                slug: "",
                price: product.price,
                imageUrl: product.images[0] || "/placeholder.jpg",
              }}
              className="h-14 px-8 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container mx-auto px-4 mt-16">
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="reviews">Reviews ({reviewCount})</TabsTrigger>
            <TabsTrigger value="write">Write a Review</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="mt-6">
            <div className="max-w-4xl">
              <ReviewList productId={product.id} key={refreshReviews} />
            </div>
          </TabsContent>

          <TabsContent value="write" className="mt-6">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-heading font-bold mb-6">
                Write a Review
              </h3>
              <ReviewForm
                productId={product.id}
                onSuccess={() => {
                  toast.success(
                    "Review submitted! It will appear after approval."
                  );
                  setRefreshReviews((prev) => prev + 1);
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
