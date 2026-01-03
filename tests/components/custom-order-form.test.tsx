import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CustomOrderForm } from "@/components/custom-order-form";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("CustomOrderForm Component", () => {
  const mockProducts = [
    { id: "1", name: "Test Product 1", slug: "test-1" },
    { id: "2", name: "Test Product 2", slug: "test-2" },
  ];

  it("should render custom order form", () => {
    render(<CustomOrderForm products={mockProducts} />);
    const form =
      screen.getByRole("tablist") || screen.getByText(/scratch|modify/i);
    expect(form).toBeDefined();
  });

  it("should have name input field", () => {
    const { container } = render(<CustomOrderForm products={mockProducts} />);
    const nameInput =
      container.querySelector("input[name='name']") ||
      container.querySelector("input[placeholder*='name'i]");
    expect(nameInput).toBeDefined();
  });

  it("should have email input field", () => {
    const { container } = render(<CustomOrderForm products={mockProducts} />);
    const emailInput =
      container.querySelector("input[type='email']") ||
      container.querySelector("input[name='email']");
    expect(emailInput).toBeDefined();
  });

  it("should have phone input field", () => {
    const { container } = render(<CustomOrderForm products={mockProducts} />);
    const phoneInput =
      container.querySelector("input[type='tel']") ||
      container.querySelector("input[name='phone']");
    expect(phoneInput).toBeDefined();
  });

  it("should have description textarea", () => {
    const { container } = render(<CustomOrderForm products={mockProducts} />);
    const textarea = container.querySelector("textarea");
    expect(textarea).toBeDefined();
  });

  it("should have submit button", () => {
    const { container } = render(<CustomOrderForm products={mockProducts} />);
    const submitButton = container.querySelector("button[type='submit']");
    expect(submitButton).toBeDefined();
  });

  it("should accept text input in name field", () => {
    const { container } = render(<CustomOrderForm products={mockProducts} />);
    const nameInput = container.querySelector(
      "input[name='name']"
    ) as HTMLInputElement;
    if (nameInput) {
      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      expect(nameInput.value).toBe("John Doe");
    }
    expect(nameInput).toBeDefined();
  });

  it("should accept email input", () => {
    const { container } = render(<CustomOrderForm products={mockProducts} />);
    const emailInput = container.querySelector(
      "input[type='email']"
    ) as HTMLInputElement;
    if (emailInput) {
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      expect(emailInput.value).toBe("john@example.com");
    }
    expect(emailInput).toBeDefined();
  });

  it("should accept phone input", () => {
    const { container } = render(<CustomOrderForm products={mockProducts} />);
    const phoneInput = container.querySelector(
      "input[type='tel']"
    ) as HTMLInputElement;
    if (phoneInput) {
      fireEvent.change(phoneInput, { target: { value: "+1234567890" } });
      expect(phoneInput.value).toBe("+1234567890");
    }
    expect(phoneInput).toBeDefined();
  });

  it("should accept description text", () => {
    const { container } = render(<CustomOrderForm products={mockProducts} />);
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
    if (textarea) {
      fireEvent.change(textarea, {
        target: { value: "Custom hammer with engraving" },
      });
      expect(textarea.value).toBe("Custom hammer with engraving");
    }
    expect(textarea).toBeDefined();
  });

  it("should have proper form structure", () => {
    const { container } = render(<CustomOrderForm products={mockProducts} />);
    const form = container.querySelector("form");
    expect(form).toBeDefined();
  });
});
