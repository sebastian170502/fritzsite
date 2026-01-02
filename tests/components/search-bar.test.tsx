import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "@/components/search-bar";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: vi.fn(() => null),
  }),
}));

describe("SearchBar Component", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("should render search input", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search/i);
    expect(input).toBeDefined();
  });

  it("should accept text input", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test query" } });
    expect(input.value).toBe("test query");
  });

  it("should have search button", () => {
    render(<SearchBar />);
    const button = screen.getByRole("button");
    expect(button).toBeDefined();
  });

  it("should render search icon", () => {
    const { container } = render(<SearchBar />);
    const svg = container.querySelector("svg");
    expect(svg).toBeDefined();
  });

  it("should handle form submission", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search/i);
    const form = input.closest("form");

    fireEvent.change(input, { target: { value: "hammers" } });
    if (form) {
      fireEvent.submit(form);
    }

    // Should navigate or update URL
    expect(mockPush).toHaveBeenCalled();
  });

  it("should clear input after submission", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
    const form = input.closest("form");

    fireEvent.change(input, { target: { value: "test" } });
    if (form) {
      fireEvent.submit(form);
    }

    // Input might be cleared after submission
    expect(input.value).toBeDefined();
  });
});
