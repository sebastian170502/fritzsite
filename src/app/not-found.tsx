import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <Search className="h-20 w-20 text-muted-foreground/50" />
        </div>
        <h1 className="text-6xl font-heading font-bold uppercase">404</h1>
        <h2 className="text-2xl font-heading uppercase">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild variant="default">
            <Link href="/shop">Browse Shop</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
