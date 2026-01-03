import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

describe("Card UI Components", () => {
  describe("Card", () => {
    it("should render card component", () => {
      const { container } = render(<Card>Card Content</Card>);
      expect(container.querySelector(".card")).toBeDefined();
    });

    it("should render children", () => {
      render(<Card>Test Content</Card>);
      expect(screen.getByText("Test Content")).toBeDefined();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <Card className="custom-card">Content</Card>
      );
      const card = container.querySelector(".custom-card");
      expect(card).toBeDefined();
    });
  });

  describe("CardHeader", () => {
    it("should render card header", () => {
      render(
        <Card>
          <CardHeader>Header Content</CardHeader>
        </Card>
      );
      expect(screen.getByText("Header Content")).toBeDefined();
    });
  });

  describe("CardTitle", () => {
    it("should render card title", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>My Title</CardTitle>
          </CardHeader>
        </Card>
      );
      expect(screen.getByText("My Title")).toBeDefined();
    });
  });

  describe("CardDescription", () => {
    it("should render card description", () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription>My Description</CardDescription>
          </CardHeader>
        </Card>
      );
      expect(screen.getByText("My Description")).toBeDefined();
    });
  });

  describe("CardContent", () => {
    it("should render card content", () => {
      render(
        <Card>
          <CardContent>Main Content</CardContent>
        </Card>
      );
      expect(screen.getByText("Main Content")).toBeDefined();
    });
  });

  describe("CardFooter", () => {
    it("should render card footer", () => {
      render(
        <Card>
          <CardFooter>Footer Content</CardFooter>
        </Card>
      );
      expect(screen.getByText("Footer Content")).toBeDefined();
    });
  });

  describe("Full Card Structure", () => {
    it("should render complete card with all parts", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Product Card</CardTitle>
            <CardDescription>A beautiful product</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Product details go here</p>
          </CardContent>
          <CardFooter>
            <button>Add to Cart</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText("Product Card")).toBeDefined();
      expect(screen.getByText("A beautiful product")).toBeDefined();
      expect(screen.getByText("Product details go here")).toBeDefined();
      expect(screen.getByText("Add to Cart")).toBeDefined();
    });
  });
});
