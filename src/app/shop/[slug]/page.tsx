import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDisplay } from "@/components/products/product-display";
import { parseProductImages, formatEUR } from "@/lib/helpers";

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

export default async function ProductPage({ params }: ProductPageProps) {
  const slug = (await params).slug;
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) {
    notFound();
  }

  const serializedProduct = {
    ...product,
    price: Number(product.price),
    images: parseProductImages(product.images),
    stock: product.stock,
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-32">
      <div className="container mx-auto px-4">
        <ProductDisplay product={serializedProduct} />
      </div>
    </div>
  );
}
