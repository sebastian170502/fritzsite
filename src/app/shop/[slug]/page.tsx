import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDisplay } from "@/components/products/product-display";
import { parseProductImages, formatEUR } from "@/lib/helpers";
import { JsonLd } from "@/components/seo/json-ld";
import {
  generateProductJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/metadata";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const slug = (await params).slug;
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) {
    return {
      title: "Product Not Found | Fritz's Forge",
    };
  }

  const images = parseProductImages(product.images);
  const price = formatEUR(Number(product.price));

  return {
    title: `${product.name} - ${price} | Fritz's Forge`,
    description:
      product.description ||
      `Hand-forged ${product.name} from Fritz's Forge. Premium metalwork crafted with traditional techniques.`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: images[0] ? [{ url: images[0] }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: images[0] ? [images[0]] : [],
    },
  };
}

// Enable ISR with 60 second revalidation
export const revalidate = 60;

export default async function ProductPage({ params }: ProductPageProps) {
  const slug = (await params).slug;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      reviews: {
        where: { approved: true },
        select: {
          id: true,
          rating: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const images = parseProductImages(product.images);
  const serializedProduct = {
    ...product,
    price: Number(product.price),
    images,
    stock: product.stock,
    reviews: product.reviews,
  };

  // Calculate average rating
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
        product.reviews.length
      : undefined;

  // Generate structured data
  const productJsonLd = generateProductJsonLd({
    name: product.name,
    description: product.description,
    price: Number(product.price),
    images,
    slug: product.slug,
    rating: avgRating,
    reviewCount: product.reviews.length,
    inStock: product.stock > 0,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Shop", url: "/shop" },
    { name: product.name, url: `/shop/${product.slug}` },
  ]);

  return (
    <>
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <div className="min-h-screen bg-background pt-32 pb-32">
        <div className="container mx-auto px-4">
          <ProductDisplay product={serializedProduct} />
        </div>
      </div>
    </>
  );
}
