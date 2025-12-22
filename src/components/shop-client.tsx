"use client";

import * as React from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { SearchBar } from "@/components/search-bar";
import { ProductFilters, FilterState } from "@/components/product-filters";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  description: string;
  material?: string;
  category?: string;
  stock?: number;
}

interface ShopClientProps {
  products: Product[];
}

export function ShopClient({ products }: ShopClientProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredProducts, setFilteredProducts] = React.useState(products);

  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    });

    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  return (
    <main className="flex-1 container mx-auto px-4 pb-32 -mt-10 relative z-20">
      {/* Search Bar */}
      <div className="flex justify-center mb-12">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search products by name..."
        />
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="mb-6 text-center">
          <p className="text-sm text-muted-foreground">
            Found {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 border border-border/20 rounded-xl bg-card/50">
          <p className="text-xl text-muted-foreground">
            {searchQuery
              ? `No products found matching "${searchQuery}"`
              : "No products found in the catalog."}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-primary hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              imageUrl={product.imageUrl}
            />
          ))}
        </div>
      )}
    </main>
  );
}
