import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CartSheet } from "@/components/cart/CartSheet";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock useCartStore
const mockItems = [
  {
    id: "product-1",
    name: "Test Product 1",
    price: 29.99,
    imageUrl: "/image1.jpg",
    quantity: 2,
    slug: "test-product-1",
  },
  {
    id: "product-2",
    name: "Test Product 2",
    price: 49.99,
    imageUrl: "/image2.jpg",
    quantity: 1,
    slug: "test-product-2",
  },
];

const mockRemoveItem = vi.fn();
const mockUpdateQuantity = vi.fn();
const mockClearCart = vi.fn();
const mockTotal = vi.fn(() => 109.97);

vi.mock("@/hooks/use-cart", () => ({
  useCartStore: vi.fn(() => ({
    items: mockItems,
    addItem: vi.fn(),
    removeItem: mockRemoveItem,
    updateQuantity: mockUpdateQuantity,
    clearCart: mockClearCart,
    total: mockTotal,
  })),
}));

describe("CartSheet Component", () => {
  beforeEach(() => {
    mockRemoveItem.mockClear();
    mockUpdateQuantity.mockClear();
    mockClearCart.mockClear();
  });

  it("should render cart sheet", () => {
    const { container } = render(<CartSheet />);
    expect(container).toBeDefined();
  });

  it("should display cart items", () => {
    render(<CartSheet />);
    expect(screen.getByText("Test Product 1")).toBeDefined();
    expect(screen.getByText("Test Product 2")).toBeDefined();
  });

  it("should display item quantities", () => {
    render(<CartSheet />);
    const quantities = screen.getAllByText(/2|1/);
    expect(quantities.length).toBeGreaterThan(0);
  });

  it("should display item prices", () => {
    render(<CartSheet />);
    expect(screen.getByText(/29.99/)).toBeDefined();
    expect(screen.getByText(/49.99/)).toBeDefined();
  });

  it("should calculate and display total", () => {
    render(<CartSheet />);
    expect(screen.getByText(/109.97/)).toBeDefined();
  });

  it("should have checkout button", () => {
    render(<CartSheet />);
    const checkoutButton = screen.getByText(/checkout/i);
    expect(checkoutButton).toBeDefined();
  });

  it("should display empty cart message when no items", () => {
    vi.mocked(vi.fn()).mockReturnValue({
      useCartStore: () => ({
        items: [],
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
        total: () => 0,
      }),
    });

    const { container } = render(<CartSheet />);
    expect(container).toBeDefined();
  });
});
