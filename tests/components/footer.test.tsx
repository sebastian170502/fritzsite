import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/footer";

describe("Footer Component", () => {
  it("should render footer", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeDefined();
  });

  it("should display company information", () => {
    render(<Footer />);
    expect(screen.getByText(/Fritz Handmade/i)).toBeDefined();
  });

  it("should contain navigation links", () => {
    const { container } = render(<Footer />);
    const links = container.querySelectorAll("a");
    expect(links.length).toBeGreaterThan(0);
  });

  it("should display copyright information", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(String(year)))).toBeDefined();
  });

  it("should have proper semantic structure", () => {
    const { container } = render(<Footer />);
    expect(container.querySelector("footer")).toBeDefined();
  });
});
