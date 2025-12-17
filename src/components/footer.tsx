"use client"

import Link from "next/link"
import { toast } from "sonner"

export function Footer() {
  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault()
    navigator.clipboard.writeText("www.fritzsforge.com")
    toast.success("Link copied to clipboard!")
  }

  return (
    <footer className="fixed bottom-0 left-0 w-full border-t bg-background/95 backdrop-blur-sm h-16 flex items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-center gap-2 text-muted-foreground">
          <button 
            onClick={handleCopyLink}
            className="font-heading text-foreground font-semibold hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
          >
            www.fritzsforge.com
          </button>
        </div>

        <nav className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  )
}
