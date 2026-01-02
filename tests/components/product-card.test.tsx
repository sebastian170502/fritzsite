import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductCard } from "@/components/products/ProductCard";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock useCartStore hook
const mockAddItem = vi.fn();
vi.mock("@/hooks/use-cart", () => ({
  useCartStore: vi.fn(() => ({
    items: [],
    addItem: mockAddItem,
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    total: vi.fn(() => 0),
  })),
}));

describe("ProductCard Component", () => {
  const mockProduct = {
    id: "product-1",
    name: "Test Product",
    slug: "test-product",
    description: "Test description",
    price: 29.99,
    images: ["/test-image.jpg"],
    category: "test-category",
    stock: 10,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockAddItem.mockClear();
  });

  it("should render product card with basic info", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Test Product")).toBeDefined();
    expect(screen.getByText("$29.99")).toBeDefined();
  });

  it("should display product image", () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    const images = container.querySelectorAll("img");
    expect(images.length).toBeGreaterThan(0);
  });

  it("should show in stock status", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/In Stock/i)).toBeDefined();
  });

  it("should show out of stock when stock is 0", () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} />);
    expect(screen.getByText(/Out of Stock/i)).toBeDefined();
  });

  it("should render add to cart button", () => {
    render(<ProductCard product={mockProduct} />);
    const addButton = screen.getByText(/Add to Cart/i);
    expect(addButton).toBeDefined();
  });

  it("should have clickable card linking to product page", () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    const link = container.querySelector('a[href*="test-product"]');
    expect(link).toBeDefined();
  });

  it("should display category badge", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("test-category")).toBeDefined();
  });

  it("should format price correctly", () => {
    const expensiveProduct = { ...mockProduct, price: 1234.56 };
    render(<ProductCard product={expensiveProduct} />);
    expect(screen.getByText(/1,234.56/)).toBeDefined();
  });
});
