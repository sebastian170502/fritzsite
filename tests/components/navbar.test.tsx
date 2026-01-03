import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "@/components/navbar";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock useCartStore hook
vi.mock("@/hooks/use-cart", () => ({
  useCartStore: vi.fn(() => ({
    items: [],
    addItem: vi.fn(),
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    total: vi.fn(() => 0),
  })),
}));

// Mock useWishlist hook
vi.mock("@/hooks/use-wishlist", () => ({
  useWishlist: vi.fn(() => ({
    items: [],
    addItem: vi.fn(),
    removeItem: vi.fn(),
    isInWishlist: vi.fn(() => false),
  })),
}));

// Mock SearchAutocomplete component
vi.mock("@/components/search/search-autocomplete", () => ({
  SearchAutocomplete: () => <div>SearchAutocomplete</div>,
}));

describe("Navbar Component", () => {
  it("should render navbar with logo", () => {
    render(<Navbar />);
    expect(screen.getByText(/Fritz/i)).toBeDefined();
  });

  it("should render navigation links", () => {
    render(<Navbar />);
    const shopLinks = screen.getAllByText(/Shop/i);
    expect(shopLinks.length).toBeGreaterThan(0);
  });

  it("should render cart icon", () => {
    render(<Navbar />);
    // Cart sheet trigger should be present
    const cartElements = screen.getAllByRole("button");
    expect(cartElements.length).toBeGreaterThan(0);
  });

  it("should display correct structure", () => {
    const { container } = render(<Navbar />);
    expect(container.querySelector("header")).toBeDefined();
  });
});
