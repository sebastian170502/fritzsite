import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CustomOrderForm from "@/components/custom-order-form";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("CustomOrderForm Component", () => {
  it("should render custom order form", () => {
    render(<CustomOrderForm />);
    expect(screen.getByText(/custom order/i)).toBeDefined();
  });

  it("should have name input field", () => {
    render(<CustomOrderForm />);
    const nameInput =
      screen.getByLabelText(/name/i) || screen.getByPlaceholderText(/name/i);
    expect(nameInput).toBeDefined();
  });

  it("should have email input field", () => {
    render(<CustomOrderForm />);
    const emailInput =
      screen.getByLabelText(/email/i) || screen.getByPlaceholderText(/email/i);
    expect(emailInput).toBeDefined();
  });

  it("should have phone input field", () => {
    render(<CustomOrderForm />);
    const phoneInput =
      screen.getByLabelText(/phone/i) || screen.getByPlaceholderText(/phone/i);
    expect(phoneInput).toBeDefined();
  });

  it("should have description textarea", () => {
    render(<CustomOrderForm />);
    const textarea =
      screen.getByLabelText(/description/i) ||
      screen.getByPlaceholderText(/description/i);
    expect(textarea).toBeDefined();
  });

  it("should have submit button", () => {
    render(<CustomOrderForm />);
    const submitButton = screen.getByRole("button", { name: /submit|send/i });
    expect(submitButton).toBeDefined();
  });

  it("should accept text input in name field", () => {
    render(<CustomOrderForm />);
    const nameInput =
      screen.getByLabelText(/name/i) ||
      (screen.getByPlaceholderText(/name/i) as HTMLInputElement);
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    expect(nameInput.value).toBe("John Doe");
  });

  it("should accept email input", () => {
    render(<CustomOrderForm />);
    const emailInput =
      screen.getByLabelText(/email/i) ||
      (screen.getByPlaceholderText(/email/i) as HTMLInputElement);
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    expect(emailInput.value).toBe("john@example.com");
  });

  it("should accept phone input", () => {
    render(<CustomOrderForm />);
    const phoneInput =
      screen.getByLabelText(/phone/i) ||
      (screen.getByPlaceholderText(/phone/i) as HTMLInputElement);
    fireEvent.change(phoneInput, { target: { value: "+1234567890" } });
    expect(phoneInput.value).toBe("+1234567890");
  });

  it("should accept description text", () => {
    render(<CustomOrderForm />);
    const textarea =
      screen.getByLabelText(/description/i) ||
      (screen.getByPlaceholderText(/description/i) as HTMLTextAreaElement);
    fireEvent.change(textarea, {
      target: { value: "Custom hammer with engraving" },
    });
    expect(textarea.value).toBe("Custom hammer with engraving");
  });

  it("should have proper form structure", () => {
    const { container } = render(<CustomOrderForm />);
    const form = container.querySelector("form");
    expect(form).toBeDefined();
  });
});
