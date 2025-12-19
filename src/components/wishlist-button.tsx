"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    imageUrl: string;
  };
  variant?: "default" | "card";
  className?: string;
}

export function WishlistButton({
  product,
  variant = "default",
  className,
}: WishlistButtonProps) {
  const wishlist = useWishlist();
  const isInWishlist = wishlist.isInWishlist(product.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if inside a link
    e.stopPropagation();

    if (isInWishlist) {
      wishlist.removeItem(product.id);
      toast.success("Removed from wishlist");
    } else {
      wishlist.addItem(product);
      toast.success("Added to wishlist");
    }
  };

  if (variant === "card") {
    return (
      <button
        onClick={handleToggle}
        className={cn(
          "absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 transition-all hover:scale-110 hover:bg-background",
          isInWishlist && "bg-primary/10 border-primary/40",
          className
        )}
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            isInWishlist ? "fill-primary text-primary" : "text-muted-foreground"
          )}
        />
      </button>
    );
  }

  return (
    <Button
      onClick={handleToggle}
      variant={isInWishlist ? "default" : "outline"}
      className={cn("gap-2", className)}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          isInWishlist && "fill-current"
        )}
      />
      {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
    </Button>
  );
}
