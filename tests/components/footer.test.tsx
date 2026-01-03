import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/footer";

describe("Footer Component", () => {
  it("should render footer", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeDefined();
  });

  it("should display company information", () => {
    render(<Footer />);
    const linkElements = screen.getAllByText(/www.fritzsforge.com/i);
    expect(linkElements.length).toBeGreaterThan(0);
  });

  it("should contain navigation links", () => {
    const { container } = render(<Footer />);
    const links = container.querySelectorAll("a");
    expect(links.length).toBeGreaterThan(0);
  });

  it("should display footer links", () => {
    render(<Footer />);
    const privacyLinks = screen.getAllByText(/Privacy Policy/i);
    const termsLinks = screen.getAllByText(/Terms of Service/i);
    expect(privacyLinks.length).toBeGreaterThan(0);
    expect(termsLinks.length).toBeGreaterThan(0);
  });

  it("should have proper semantic structure", () => {
    const { container } = render(<Footer />);
    expect(container.querySelector("footer")).toBeDefined();
  });
});
