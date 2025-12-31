import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig, generateOrganizationJsonLd } from "@/lib/metadata";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { TawkToChat } from "@/components/chat/tawk-to-chat";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "blacksmith",
    "handmade",
    "metalwork",
    "forge",
    "knives",
    "tools",
    "jewelry",
    "hardware",
    "handcrafted",
    "artisan",
    "custom metalwork",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd data={generateOrganizationJsonLd()} />
        <GoogleAnalytics
          measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-body bg-background text-foreground antialiased`}
      >
        <div className="min-h-screen flex flex-col pt-16 pb-16">
          <Navbar />
          {children}
        </div>
        <Footer />
        <Toaster />
        {process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID && <TawkToChat />}
      </body>
    </html>
  );
}
