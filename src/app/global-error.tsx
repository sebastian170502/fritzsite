"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center px-4 bg-background">
          <div className="text-center space-y-6 max-w-md">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-destructive">
                Critical Error
              </h1>
              <p className="text-muted-foreground">
                A critical error occurred. The application needs to be reloaded.
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground/70">
                  Error ID: {error.digest}
                </p>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={reset} variant="default">
                Reload Application
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
