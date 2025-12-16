"use client"

import { useEffect } from "react"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import confetti from "canvas-confetti"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/hooks/use-cart"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart)

  useEffect(() => {
    // Clear the cart
    clearCart()

    // Fire confetti
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)

    return () => clearInterval(interval)
  }, [clearCart])

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-xl bg-card/50 backdrop-blur-sm text-center">
        <CardHeader className="flex flex-col items-center space-y-4 pb-2">
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
            Comandă Plasată!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Îți mulțumim pentru comandă! Plata a fost procesată cu succes.
          </p>
          <p className="text-sm text-muted-foreground">
            Vei primi un email de confirmare cu detaliile comenzii în scurt timp.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pt-4">
          <Button asChild className="w-full rounded-full h-12 text-lg">
            <Link href="/">
              Înapoi la Magazin
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
