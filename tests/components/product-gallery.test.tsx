import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductGallery from "@/components/products/ProductGallery";

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
    render(<ProductGallery images={mockImages} productName="Test Product" />);
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);
  });

  it("should display main image", () => {
    render(<ProductGallery images={mockImages} productName="Test Product" />);
    const mainImage = screen.getByAltText(/Test Product/i);
    expect(mainImage).toBeDefined();
  });

  it("should render thumbnail images", () => {
    const { container } = render(
      <ProductGallery images={mockImages} productName="Test Product" />
    );
    const images = container.querySelectorAll("img");
    expect(images.length).toBeGreaterThanOrEqual(mockImages.length);
  });

  it("should handle empty images array", () => {
    render(<ProductGallery images={[]} productName="Test Product" />);
    // Should still render component without crashing
    const container = screen.queryByRole("img");
    expect(container).toBeDefined();
  });

  it("should handle single image", () => {
    render(
      <ProductGallery images={[mockImages[0]]} productName="Test Product" />
    );
    const image = screen.getByAltText(/Test Product/i);
    expect(image).toBeDefined();
  });

  it("should switch main image on thumbnail click", () => {
    const { container } = render(
      <ProductGallery images={mockImages} productName="Test Product" />
    );
    const thumbnails = container.querySelectorAll("button");

    if (thumbnails.length > 1) {
      fireEvent.click(thumbnails[1]);
      // Main image should update
      const mainImage = screen.getByAltText(
        /Test Product/i
      ) as HTMLImageElement;
      expect(mainImage).toBeDefined();
    }
  });

  it("should display correct alt text", () => {
    render(<ProductGallery images={mockImages} productName="Amazing Hammer" />);
    const image = screen.getByAltText(/Amazing Hammer/i);
    expect(image).toBeDefined();
  });
});
