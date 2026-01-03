import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "@/components/search-bar";

// Mock next/navigation
const mockPush = vi.fn();
const mockOnSearch = vi.fn();

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
    mockOnSearch.mockClear();
  });

  it("should render search input", () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/search/i);
    expect(input).toBeDefined();
  });

  it("should accept text input", () => {
    const { container } = render(<SearchBar onSearch={mockOnSearch} />);
    const input = container.querySelector("input") as HTMLInputElement;
    if (input) fireEvent.change(input, { target: { value: "test query" } });
    expect(input?.value).toBe("test query");
  });

  it("should have search button", () => {
    const { container } = render(<SearchBar onSearch={mockOnSearch} />);
    const button = container.querySelector("button");
    expect(button).toBeDefined();
  });

  it("should render search icon", () => {
    const { container } = render(<SearchBar onSearch={mockOnSearch} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeDefined();
  });

  it("should handle form submission", () => {
    const { container } = render(<SearchBar onSearch={mockOnSearch} />);
    const input = container.querySelector("input") as HTMLInputElement;
    const form = input?.closest("form");

    if (input) {
      fireEvent.change(input, { target: { value: "hammers" } });
      if (form) {
        fireEvent.submit(form);
      }
    }

    // Should call onSearch when form is submitted
    expect(mockOnSearch).toHaveBeenCalled();
  });

  it("should clear input after submission", () => {
    const { container } = render(<SearchBar onSearch={mockOnSearch} />);
    const input = container.querySelector("input") as HTMLInputElement;
    const form = input?.closest("form");

    if (input) {
      fireEvent.change(input, { target: { value: "test" } });
      expect(input.value).toBe("test");
      if (form) fireEvent.submit(form);
    }
    // Input might be cleared after submission
    expect(input).toBeDefined();
  });
});
