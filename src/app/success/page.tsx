"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/use-cart";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trackPurchase } from "@/lib/analytics";

function SuccessContent() {
  const searchParams = useSearchParams();
  const { items, total, clearCart } = useCartStore();

  useEffect(() => {
    // Track purchase
    const sessionId = searchParams.get("session_id");
    if (sessionId && items.length > 0) {
      trackPurchase(
        sessionId,
        items.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
        })),
        total()
      );
    }

    // Clear the cart
    clearCart();

    // Fire confetti
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, [clearCart, items, searchParams, total]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-xl bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-8 pb-8 px-6">
            <div className="flex flex-col items-center">
                {/* Icon Circle */}
                <div className="mx-auto bg-green-100 p-3 rounded-full mb-6 dark:bg-green-900/30">
                    <span className="text-3xl">🎉</span>
                </div>
                
                {/* Title */}
                <h2 className="text-center text-2xl font-semibold mb-4 text-foreground">
                    Comandă Plasată!
                </h2>

                {/* Description */}
                <div className="text-center space-y-4 text-base text-muted-foreground">
                    <p>
                        Îți mulțumim pentru comandă! Am primit detaliile tale și ne apucăm de treabă.
                    </p>
                    <p>
                        Vei primi un email de confirmare în scurt timp.
                    </p>
                    
                    {/* Secondary Info Box */}
                    <div className="bg-secondary/30 p-4 rounded-lg text-sm border border-border/50 mt-6 relative overflow-hidden">
                        <p className="font-medium mb-1 text-foreground">Ai întrebări despre comandă?</p>
                        <p className="mb-2">
                             Dacă ai uitat să adaugi ceva sau ai nelămuriri, scrie-ne direct la:
                        </p>
                        <a href="mailto:fritzsforge@gmail.com" className="text-primary font-bold hover:underline block">
                            fritzsforge@gmail.com
                        </a>
                    </div>
                </div>

                {/* Action Button */}
                <div className="w-full mt-8">
                     <Button asChild className="w-full rounded-full h-12 text-lg font-medium shadow-md hover:shadow-lg transition-all">
                        <Link href="/">Înapoi la Magazin</Link>
                    </Button>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
