import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      {/* Header Skeleton */}
      <section className="relative w-full bg-secondary">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
          <Skeleton className="min-h-[300px] md:min-h-full" />
          <div className="flex flex-col justify-center p-12 md:p-24">
            <Skeleton className="h-12 w-48 mb-6" />
            <Skeleton className="h-6 w-full max-w-xl mb-4" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 pb-32 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
