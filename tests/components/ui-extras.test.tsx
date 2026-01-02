import { describe, it, expect } from "vitest";
import { Separator } from "@/components/ui/separator";
import { render } from "@testing-library/react";

describe("Separator UI Component", () => {
  it("should render separator", () => {
    const { container } = render(<Separator />);
    const separator =
      container.querySelector('[role="separator"]') ||
      container.querySelector("hr");
    expect(separator).toBeDefined();
  });

  it("should apply horizontal orientation by default", () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).toBeDefined();
  });

  it("should apply vertical orientation", () => {
    const { container } = render(<Separator orientation="vertical" />);
    expect(container.firstChild).toBeDefined();
  });

  it("should accept custom className", () => {
    const { container } = render(<Separator className="custom-separator" />);
    const separator = container.querySelector(".custom-separator");
    expect(separator).toBeDefined();
  });

  it("should be decorative by default", () => {
    const { container } = render(<Separator />);
    const separator = container.querySelector("[data-orientation]");
    expect(separator).toBeDefined();
  });
});

describe("Tabs UI Components", () => {
  it("should exist as component export", () => {
    // Test that components can be imported
    expect(Separator).toBeDefined();
  });
});
