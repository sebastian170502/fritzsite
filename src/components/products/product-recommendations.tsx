"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string;
  stock: number;
}

interface ProductRecommendationsProps {
  productId?: string;
  type?: "collaborative" | "category" | "trending" | "personalized";
  customerEmail?: string;
  limit?: number;
  title?: string;
}

export default function ProductRecommendations({
  productId,
  type = "collaborative",
  customerEmail,
  limit = 4,
  title,
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const params = new URLSearchParams({
          type,
          limit: limit.toString(),
        });

        if (productId) params.append("productId", productId);
        if (customerEmail) params.append("customerEmail", customerEmail);

        const response = await fetch(`/api/recommendations?${params}`);
        if (!response.ok) throw new Error("Failed to fetch recommendations");

        const data = await response.json();
        setRecommendations(data.recommendations);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [productId, type, customerEmail, limit]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">
          {title || "You May Also Like"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(limit)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  const getDefaultTitle = () => {
    switch (type) {
      case "trending":
        return "Trending Now";
      case "personalized":
        return "Recommended For You";
      case "category":
        return "Similar Products";
      default:
        return "You May Also Like";
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">{title || getDefaultTitle()}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product) => {
          const images = JSON.parse(product.images as string);
          const firstImage = images[0] || "/placeholder.jpg";

          return (
            <Card
              key={product.id}
              className="group hover:shadow-lg transition-shadow"
            >
              <Link href={`/shop/${product.slug}`}>
                <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src={firstImage}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Only {product.stock} left
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Out of Stock
                    </div>
                  )}
                </div>
              </Link>
              <CardContent className="p-4 space-y-3">
                <Link href={`/shop/${product.slug}`}>
                  <h4 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
                    {product.name}
                  </h4>
                </Link>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">
                    €{Number(product.price).toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    disabled={product.stock === 0}
                  >
                    <Link href={`/shop/${product.slug}`}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
