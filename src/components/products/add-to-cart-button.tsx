"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/use-cart";
import { Loader2 } from "lucide-react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category?: string;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const onAddToCart = async () => {
    try {
      setIsLoading(true);

      // Simulate async validation (could check stock, etc.)
      await new Promise((resolve) => setTimeout(resolve, 200));

      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onAddToCart}
      disabled={isLoading}
      className="w-full rounded-full transition-all duration-300 opacity-90 hover:opacity-100 text-lg h-14"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : (
        "Add to Cart"
      )}
    </Button>
  );
}
