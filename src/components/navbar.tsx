"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Globe, ShoppingCart, ChevronDown, Menu } from "lucide-react"
import { CartSheet } from "@/components/cart-sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 transition-colors hover:opacity-80 z-50">
           <span className="text-xl font-heading font-bold tracking-tight uppercase">Fritz&apos;s Forge</span>
        </Link>
        
            {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center text-sm font-medium text-muted-foreground ml-8">
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
        <div className="flex items-center space-x-2">
          {/* Mobile Menu */}
           <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background border-r border-border">
                <div className="flex flex-col gap-8 mt-12">
                     <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold uppercase tracking-tight hover:text-primary">Home</Link>
                     <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold uppercase tracking-tight hover:text-primary">Shop</Link>
                     <Link href="/custom" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold uppercase tracking-tight hover:text-primary">Custom Orders</Link>
                </div>
            </SheetContent>
          </Sheet>

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hidden md:flex">
                    <Globe className="h-5 w-5 opacity-70" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
                <DropdownMenuLabel>Language</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="font-bold flex justify-between focus:bg-primary/20">
                    English <span>✓</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-primary/20">
                    Romanian
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <CartSheet />
        </div>
      </div>
    </header>
  )
}
