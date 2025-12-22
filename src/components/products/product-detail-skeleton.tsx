import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
      {/* Image Gallery */}
      <div className="space-y-6">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-20 h-20 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="space-y-6 pt-8">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-14 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
