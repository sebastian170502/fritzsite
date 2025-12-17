"use client"

import * as React from "react"
import Link from "next/link"
import { ShoppingCart, Menu, Info } from "lucide-react"
import { CartSheet } from "@/components/cart-sheet"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full h-16 flex items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 transition-colors hover:opacity-80 z-50">
           <span className="text-xl font-heading font-bold tracking-tight uppercase">Fritz&apos;s Forge</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center text-sm font-medium text-muted-foreground absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="hover:text-primary transition-colors font-body uppercase tracking-wider text-xs">
                Home
            </Link>
            <Link href="/custom" className="hover:text-primary transition-colors font-body uppercase tracking-wider text-xs">
                Custom Order
            </Link>
            <Link href="/shop" className="hover:text-primary transition-colors font-body uppercase tracking-wider text-xs">
                Shop
            </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <CartSheet />

          {/* Mobile Menu */}
           <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-l border-border w-[300px]">
                <div className="flex flex-col gap-8 mt-12">
                     <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold uppercase tracking-tight hover:text-primary">Home</Link>
                     <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold uppercase tracking-tight hover:text-primary">Shop</Link>
                     <Link href="/custom" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold uppercase tracking-tight hover:text-primary">Custom Orders</Link>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
