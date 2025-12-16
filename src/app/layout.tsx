import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Fritz's Forge",
  description: "Hand-forged artisanal steel and iron products",
  metadataBase: new URL('https://fritzsforge.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-body bg-background text-foreground antialiased`}>
        <div className="min-h-screen flex flex-col pb-32">
          <Navbar />
          {children}
        </div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
