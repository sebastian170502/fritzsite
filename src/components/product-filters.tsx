"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  materials: string[];
  categories: string[];
  className?: string;
}

export interface FilterState {
  materials: string[];
  categories: string[];
  priceRange?: { min: number; max: number };
  inStockOnly: boolean;
}

export function ProductFilters({
  onFilterChange,
  materials,
  categories,
  className,
}: ProductFiltersProps) {
  const [filters, setFilters] = React.useState<FilterState>({
    materials: [],
    categories: [],
    inStockOnly: false,
  });

  const handleMaterialToggle = (material: string) => {
    const newMaterials = filters.materials.includes(material)
      ? filters.materials.filter((m) => m !== material)
      : [...filters.materials, material];

    const newFilters = { ...filters, materials: newMaterials };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStockToggle = () => {
    const newFilters = { ...filters, inStockOnly: !filters.inStockOnly };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearAll = () => {
    const clearedFilters: FilterState = {
      materials: [],
      categories: [],
      inStockOnly: false,
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const activeFilterCount =
    filters.materials.length +
    filters.categories.length +
    (filters.inStockOnly ? 1 : 0);

  return (
    <Card className={cn("border-border/40 shadow-lg", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-8 text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
        <CardDescription>
          Refine your search with filters
          {activeFilterCount > 0 && ` (${activeFilterCount} active)`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Materials */}
        {materials.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Material
            </h3>
            <div className="space-y-2">
              {materials.map((material) => (
                <button
                  key={material}
                  onClick={() => handleMaterialToggle(material)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors",
                    "hover:bg-secondary/50",
                    filters.materials.includes(material) && "bg-secondary"
                  )}
                >
                  <span className="capitalize">
                    {material.replace(/-/g, " ")}
                  </span>
                  {filters.materials.includes(material) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {materials.length > 0 && categories.length > 0 && <Separator />}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Category
            </h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors",
                    "hover:bg-secondary/50",
                    filters.categories.includes(category) && "bg-secondary"
                  )}
                >
                  <span className="capitalize">
                    {category.replace(/-/g, " ")}
                  </span>
                  {filters.categories.includes(category) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Stock availability */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Availability
          </h3>
          <button
            onClick={handleStockToggle}
            className={cn(
              "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors",
              "hover:bg-secondary/50",
              filters.inStockOnly && "bg-secondary"
            )}
          >
            <span>In stock only</span>
            {filters.inStockOnly && <Check className="h-4 w-4 text-primary" />}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
