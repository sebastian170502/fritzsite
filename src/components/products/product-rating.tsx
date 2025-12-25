"use client";

import { Star } from "lucide-react";

interface ProductRatingProps {
  rating: number;
  reviewCount: number;
  className?: string;
}

export function ProductRating({
  rating,
  reviewCount,
  className = "",
}: ProductRatingProps) {
  if (reviewCount === 0) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(rating)
                ? "fill-yellow-500 text-yellow-500"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {rating.toFixed(1)} ({reviewCount})
      </span>
    </div>
  );
}
