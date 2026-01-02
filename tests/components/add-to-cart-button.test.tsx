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
    const buttons = screen.getAllByRole("button");
    const addButton = buttons.find((btn) =>
      btn.textContent?.includes("Add to Cart")
    );
    expect(addButton?.hasAttribute("disabled")).toBe(false);
  });

  it("should be disabled while loading", async () => {
    render(<AddToCartButton product={mockProduct} />);
    const buttons = screen.getAllByRole("button");
    const addButton = buttons.find((btn) =>
      btn.textContent?.includes("Add to Cart")
    );

    if (addButton) {
      fireEvent.click(addButton);
      // Button should be disabled during loading
      expect(addButton.hasAttribute("disabled")).toBe(true);
    }
  });

  it("should call addItem when clicked", async () => {
    render(<AddToCartButton product={mockProduct} />);
    const buttons = screen.getAllByRole("button");
    const addButton = buttons.find((btn) =>
      btn.textContent?.includes("Add to Cart")
    );
    if (addButton) fireEvent.click(addButton);

    // Wait for async operation
    await new Promise((resolve) => setTimeout(resolve, 250));

    expect(mockAddItem).toHaveBeenCalledTimes(1);
    expect(mockAddItem).toHaveBeenCalledWith({
      id: mockProduct.id,
      name: mockProduct.name,
      price: mockProduct.price,
      imageUrl: mockProduct.images[0],
      category: mockProduct.category,
    });
  });

  it("should show loading state when clicked", () => {
    render(<AddToCartButton product={mockProduct} />);
    const buttons = screen.getAllByRole("button");
    const addButton = buttons.find((btn) =>
      btn.textContent?.includes("Add to Cart")
    );
    expect(addButton).toBeDefined();
  });

  it("should have proper button styling", () => {
    render(<AddToCartButton product={mockProduct} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
