"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

/**
 * Enhanced 404 page with product suggestions
 */
export default function ProductNotFound() {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    // Fetch featured products as suggestions
    fetch("/api/search/popular")
      .then((res) => res.json())
      .then((data) => {
        if (data.popular) {
          // Get first 3 popular search terms
          setSuggestions(data.popular.slice(0, 3));
        }
      })
      .catch(() => {
        // Silently fail - suggestions are optional
      });
  }, []);

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <ShoppingBag className="h-20 w-20 text-muted-foreground/50" />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-semibold">Product Not Found</h2>
          <p className="text-muted-foreground">
            This product doesn't exist or is no longer available.
          </p>
        </div>

        {suggestions.length > 0 && (
          <div className="pt-4 space-y-3">
            <p className="text-sm font-medium">Try searching for:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((term, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/shop?q=${encodeURIComponent(term)}`)
                  }
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-center pt-4">
          <Button onClick={() => router.push("/shop")}>
            Browse All Products
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
