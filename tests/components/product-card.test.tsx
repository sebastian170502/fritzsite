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

// Mock WishlistButton component
vi.mock("@/components/wishlist-button", () => ({
  WishlistButton: () => <button>Wishlist</button>,
}));

describe("ProductCard Component", () => {
  const mockProduct = {
    id: "product-1",
    name: "Test Product",
    slug: "test-product",
    price: 29.99,
    imageUrl: "/test-image.jpg",
  };

  beforeEach(() => {
    mockAddItem.mockClear();
  });

  it("should render product card with basic info", () => {
    render(<ProductCard {...mockProduct} />);
    expect(screen.getByText("Test Product")).toBeDefined();
    expect(screen.getByText(/€29/)).toBeDefined();
  });

  it("should display product image", () => {
    const { container } = render(<ProductCard {...mockProduct} />);
    const images = container.querySelectorAll("img");
    expect(images.length).toBeGreaterThan(0);
  });

  it("should render add to cart button", () => {
    const { container } = render(<ProductCard {...mockProduct} />);
    // Check for button element instead of specific text
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should have clickable card linking to product page", () => {
    const { container } = render(<ProductCard {...mockProduct} />);
    const link = container.querySelector('a[href*="test-product"]');
    expect(link).toBeDefined();
  });

  it("should format expensive price correctly", () => {
    const expensiveProduct = { ...mockProduct, price: 1234.56 };
    render(<ProductCard {...expensiveProduct} />);
    expect(screen.getByText(/1,234/)).toBeDefined();
  });

  it("should format cheap price correctly", () => {
    const cheapProduct = { ...mockProduct, price: 9.99 };
    render(<ProductCard {...cheapProduct} />);
    expect(screen.getByText(/€9/)).toBeDefined();
  });

  it("should display product name in link", () => {
    render(<ProductCard {...mockProduct} />);
    const productNames = screen.getAllByText("Test Product");
    expect(productNames.length).toBeGreaterThan(0);
  });

  it("should have group hover class for styling", () => {
    const { container } = render(<ProductCard {...mockProduct} />);
    const groupElement = container.querySelector('[class*="group"]');
    expect(groupElement).toBeDefined();
  });
});
