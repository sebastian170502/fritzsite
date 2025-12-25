"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface StockNotifyFormProps {
  productId: string;
  productName: string;
}

export function StockNotifyForm({
  productId,
  productName,
}: StockNotifyFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/stock-notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setIsSubscribed(true);
      toast.success("You'll be notified when this item is back in stock!");
      setEmail("");
    } catch (error) {
      console.error("Notification subscription error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to subscribe"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="space-y-4 p-6 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">You're all set!</h3>
            <p className="text-sm text-green-600 dark:text-green-500">
              We'll email you when {productName} is back in stock.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6 bg-secondary/30 border border-border/50 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 shrink-0">
          <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">
            Notify Me When Available
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get an email alert when this item is back in stock. No spam, just
            one notification.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="notify-email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="notify-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="bg-background"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  <Bell className="mr-2 h-4 w-4" />
                  Notify Me
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-3">
            We'll only use your email for this stock notification. You can
            unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
