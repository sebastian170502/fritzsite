"use client";

import * as React from "react";
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
  const [isMounted, setIsMounted] = React.useState(false);
  
  // Use selector to subscribe to state updates safely
  const isInWishlist = useWishlist((state) => 
    state.items.some((item) => item.id === product.id)
  );

  const wishlist = useWishlist(); // Still need full store for actions

  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  const showActive = isMounted && isInWishlist;

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
        suppressHydrationWarning
        className={cn(
          "absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 transition-all hover:scale-110 hover:bg-background",
          showActive && "bg-primary/10 border-primary/40",
          className
        )}
        aria-label={showActive ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            showActive ? "fill-primary text-primary" : "text-muted-foreground"
          )}
        />
      </button>
    );
  }

  return (
    <Button
      onClick={handleToggle}
      suppressHydrationWarning
      variant={showActive ? "default" : "outline"}
      className={cn("gap-2", className)}
      aria-label={showActive ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          showActive && "fill-current"
        )}
      />
      {showActive ? "In Wishlist" : "Add to Wishlist"}
    </Button>
  );
}
