"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingCart, Menu, Heart, Search, User } from "lucide-react";
import { CartSheet } from "@/components/cart-sheet";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useWishlist } from "@/hooks/use-wishlist";
import { SearchAutocomplete } from "@/components/search/search-autocomplete";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showMobileSearch, setShowMobileSearch] = React.useState(false);
  const wishlist = useWishlist();
  const wishlistCount = wishlist.items.length;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 transition-colors hover:opacity-80 shrink-0"
          >
            <span className="text-xl font-heading font-bold tracking-tight uppercase">
              Fritz&apos;s Forge
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex gap-8 items-center text-sm font-medium text-muted-foreground">
            <Link
              href="/"
              className="hover:text-primary transition-colors font-body uppercase tracking-wider text-xs whitespace-nowrap"
            >
              Home
            </Link>
            <Link
              href="/custom"
              className="hover:text-primary transition-colors font-body uppercase tracking-wider text-xs whitespace-nowrap"
            >
              Custom Order
            </Link>
            <Link
              href="/shop"
              className="hover:text-primary transition-colors font-body uppercase tracking-wider text-xs whitespace-nowrap"
            >
              Shop
            </Link>
          </nav>

          {/* Desktop Search - Flexible width */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <SearchAutocomplete placeholder="Search products..." />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full hover:bg-secondary"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Customer Account Button */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-secondary"
              asChild
            >
              <Link href="/customer" aria-label="My Account">
                <User className="h-5 w-5" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-secondary"
              asChild
            >
              <Link
                href="/wishlist"
                aria-label={`Wishlist with ${wishlistCount} items`}
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold"
                    aria-label={`${wishlistCount} items in wishlist`}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </Button>
            <CartSheet />

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-background border-l border-border w-[300px]"
              >
                <div className="flex flex-col gap-8 mt-12">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-bold uppercase tracking-tight hover:text-primary"
                  >
                    Home
                  </Link>
                  <Link
                    href="/shop"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-bold uppercase tracking-tight hover:text-primary"
                  >
                    Shop
                  </Link>
                  <Link
                    href="/custom"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-bold uppercase tracking-tight hover:text-primary"
                  >
                    Custom Orders
                  </Link>
                  <Link
                    href="/customer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-bold uppercase tracking-tight hover:text-primary"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-bold uppercase tracking-tight hover:text-primary"
                  >
                    Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="lg:hidden px-4 pb-4 border-t border-border/40 pt-4">
          <SearchAutocomplete
            placeholder="Search products..."
            onSearch={() => setShowMobileSearch(false)}
          />
        </div>
      )}
    </header>
  );
}
