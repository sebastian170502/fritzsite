"use client";

import { useEffect } from "react";
import { trackProductView } from "@/lib/analytics";

interface ProductAnalyticsProps {
  product: {
    id: string;
    name: string;
    category?: string;
    price: number;
  };
}

/**
 * Component to track product view
 */
export function ProductAnalytics({ product }: ProductAnalyticsProps) {
  useEffect(() => {
    trackProductView({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      brand: "FritzForge",
    });
  }, [product]);

  return null;
}
