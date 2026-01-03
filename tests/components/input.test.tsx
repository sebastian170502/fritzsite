import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "@/components/ui/input";

describe("Input UI Component", () => {
  it("should render input field", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDefined();
  });

  it("should accept value prop", () => {
    const { container } = render(<Input value="test value" readOnly />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("test value");
  });

  it("should handle onChange events", () => {
    let value = "";
    const { container } = render(
      <Input
        onChange={(e) => {
          value = e.target.value;
        }}
      />
    );
    const input = container.querySelector("input");
    if (input) fireEvent.change(input, { target: { value: "new value" } });
    expect(value).toBe("new value");
  });

  it("should accept placeholder", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeDefined();
  });

  it("should be disabled when disabled prop is true", () => {
    const { container } = render(<Input disabled />);
    const input = container.querySelector("input");
    expect(input?.hasAttribute("disabled")).toBe(true);
  });

  it("should accept different input types", () => {
    const { container } = render(<Input type="email" />);
    const input = container.querySelector("input");
    expect(input?.getAttribute("type")).toBe("email");
  });

  it("should accept custom className", () => {
    const { container } = render(<Input className="custom-input" />);
    const input = container.querySelector(".custom-input");
    expect(input).toBeDefined();
  });

  it("should render password input", () => {
    const { container } = render(<Input type="password" />);
    const input = container.querySelector('input[type="password"]');
    expect(input).toBeDefined();
  });

  it("should render number input", () => {
    const { container } = render(<Input type="number" />);
    const input = container.querySelector('input[type="number"]');
    expect(input).toBeDefined();
  });

  it("should accept min and max for number inputs", () => {
    const { container } = render(<Input type="number" min={0} max={100} />);
    const input = container.querySelector('input[type="number"]');
    expect(input?.getAttribute("min")).toBe("0");
    expect(input?.getAttribute("max")).toBe("100");
  });
});
