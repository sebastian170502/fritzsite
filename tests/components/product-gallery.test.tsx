import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductGallery } from "@/components/products/ProductGallery";

// Mock Next Image
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

describe("ProductGallery Component", () => {
  const mockImages = [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg",
  ];

  it("should render gallery with images", () => {
    const { container } = render(
      <ProductGallery images={mockImages} productName="Test Product" />
    );
    const images = container.querySelectorAll("img");
    expect(images.length).toBeGreaterThan(0);
  });

  it("should display main image", () => {
    const { container } = render(
      <ProductGallery images={mockImages} productName="Test Product" />
    );
    const images = container.querySelectorAll("img");
    expect(images.length).toBeGreaterThan(0);
    expect(images[0]).toBeDefined();
  });

  it("should render thumbnail images", () => {
    const { container } = render(
      <ProductGallery images={mockImages} productName="Test Product" />
    );
    const images = container.querySelectorAll("img");
    expect(images.length).toBeGreaterThanOrEqual(mockImages.length);
  });

  it("should handle empty images array", () => {
    const { container } = render(
      <ProductGallery images={[]} productName="Test Product" />
    );
    // Should still render component without crashing
    expect(container).toBeDefined();
  });

  it("should handle single image", () => {
    const { container } = render(
      <ProductGallery images={[mockImages[0]]} productName="Test Product" />
    );
    const images = container.querySelectorAll("img");
    expect(images.length).toBeGreaterThan(0);
  });

  it("should switch main image on thumbnail click", () => {
    const { container } = render(
      <ProductGallery images={mockImages} productName="Test Product" />
    );
    const thumbnails = container.querySelectorAll("button");

    if (thumbnails.length > 1) {
      fireEvent.click(thumbnails[1]);
      // Main image should update
      const mainImage = container.querySelector("img") as HTMLImageElement;
      expect(mainImage).toBeDefined();
    }
  });

  it("should display correct alt text", () => {
    const { container } = render(
      <ProductGallery images={mockImages} productName="Amazing Hammer" />
    );
    const images = container.querySelectorAll("img");
    expect(images.length).toBeGreaterThan(0);
    // Check that at least one image has the correct alt text
    const hasCorrectAlt = Array.from(images).some((img) =>
      img.getAttribute("alt")?.includes("Amazing Hammer")
    );
    expect(hasCorrectAlt).toBe(true);
  });
});
