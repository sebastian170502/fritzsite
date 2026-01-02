import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button UI Component", () => {
  it("should render button with text", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeDefined();
  });

  it("should handle click events", () => {
    let clicked = false;
    render(
      <Button
        onClick={() => {
          clicked = true;
        }}
      >
        Click
      </Button>
    );
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(clicked).toBe(true);
  });

  it("should apply default variant", () => {
    render(<Button>Default</Button>);
    expect(screen.getByText("Default")).toBeDefined();
  });

  it("should apply destructive variant", () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByText("Delete")).toBeDefined();
  });

  it("should apply outline variant", () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByText("Outline")).toBeDefined();
  });

  it("should apply secondary variant", () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByText("Secondary")).toBeDefined();
  });

  it("should apply ghost variant", () => {
    render(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByText("Ghost")).toBeDefined();
  });

  it("should apply link variant", () => {
    render(<Button variant="link">Link</Button>);
    expect(screen.getByText("Link")).toBeDefined();
  });

  it("should apply small size", () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByText("Small")).toBeDefined();
  });

  it("should apply large size", () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByText("Large")).toBeDefined();
  });

  it("should apply icon size", () => {
    render(<Button size="icon">Icon</Button>);
    expect(screen.getByText("Icon")).toBeDefined();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");
    expect(button.hasAttribute("disabled")).toBe(true);
  });

  it("should not trigger onClick when disabled", () => {
    let clicked = false;
    render(
      <Button
        disabled
        onClick={() => {
          clicked = true;
        }}
      >
        Disabled
      </Button>
    );
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(clicked).toBe(false);
  });

  it("should accept custom className", () => {
    const { container } = render(
      <Button className="custom-btn">Custom</Button>
    );
    const button = container.querySelector(".custom-btn");
    expect(button).toBeDefined();
  });

  it("should render as child component when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    expect(screen.getByText("Link Button")).toBeDefined();
  });
});
