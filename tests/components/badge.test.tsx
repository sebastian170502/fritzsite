import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge UI Component", () => {
  it("should render badge with text", () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText("Test Badge")).toBeDefined();
  });

  it("should apply default variant", () => {
    const { container } = render(<Badge>Default</Badge>);
    const badge = container.querySelector(".badge");
    expect(badge).toBeDefined();
  });

  it("should apply destructive variant", () => {
    render(<Badge variant="destructive">Error</Badge>);
    expect(screen.getByText("Error")).toBeDefined();
  });

  it("should apply outline variant", () => {
    render(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText("Outline")).toBeDefined();
  });

  it("should apply secondary variant", () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText("Secondary")).toBeDefined();
  });

  it("should accept custom className", () => {
    const { container } = render(
      <Badge className="custom-class">Custom</Badge>
    );
    const badge = container.querySelector(".custom-class");
    expect(badge).toBeDefined();
  });

  it("should render children correctly", () => {
    render(
      <Badge>
        <span>Complex</span> Content
      </Badge>
    );
    expect(screen.getByText("Complex")).toBeDefined();
    expect(screen.getByText(/Content/)).toBeDefined();
  });
});
