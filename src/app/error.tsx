"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <AlertCircle className="h-20 w-20 text-destructive" />
        </div>
        <h1 className="text-4xl font-heading font-bold uppercase">
          Something Went Wrong
        </h1>
        <p className="text-muted-foreground">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="w-full max-w-md overflow-hidden text-left bg-muted/50 p-4 rounded-md text-xs font-mono">
           <p className="font-semibold text-destructive mb-2">Technical Details:</p>
           <p>{error.toString()}</p>
           <details className="mt-2 cursor-pointer">
             <summary>Stack Trace</summary>
             <pre className="mt-2 text-[10px] overflow-auto max-h-40 whitespace-pre-wrap">
               {error.stack}
             </pre>
           </details>
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()} variant="default">
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
