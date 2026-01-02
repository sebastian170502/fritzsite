import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AddToCartButton } from "@/components/products/add-to-cart-button";

// Mock useCartStore hook
const mockAddItem = vi.fn();
const mockItems = [] as any[];

vi.mock("@/hooks/use-cart", () => ({
  useCartStore: vi.fn(() => ({
    items: mockItems,
    addItem: mockAddItem,
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    total: vi.fn(() => 0),
  })),
}));

describe("AddToCartButton Component", () => {
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
    mockItems.length = 0;
  });

  it("should render add to cart button", () => {
    render(<AddToCartButton product={mockProduct} />);
    expect(screen.getByText(/Add to Cart/i)).toBeDefined();
  });

  it("should be enabled when product is in stock", () => {
    render(<AddToCartButton product={mockProduct} />);
    const button = screen.getByRole("button");
    expect(button.hasAttribute("disabled")).toBe(false);
  });

  it("should be disabled when product is out of stock", () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<AddToCartButton product={outOfStockProduct} />);
    const button = screen.getByRole("button");
    expect(button.hasAttribute("disabled")).toBe(true);
  });

  it("should call addItem when clicked", () => {
    render(<AddToCartButton product={mockProduct} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockAddItem).toHaveBeenCalledTimes(1);
    expect(mockAddItem).toHaveBeenCalledWith(mockProduct, 1);
  });

  it("should show out of stock text when stock is 0", () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<AddToCartButton product={outOfStockProduct} />);
    expect(screen.getByText(/Out of Stock/i)).toBeDefined();
  });

  it("should have proper button styling", () => {
    render(<AddToCartButton product={mockProduct} />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("button");
  });
});
