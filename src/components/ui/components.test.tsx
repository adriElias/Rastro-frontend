import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

describe("shared UI components", () => {
  it("merges conflicting Tailwind utility classes", () => {
    expect(cn("px-2 text-sm", "px-4")).toBe("text-sm px-4");
  });

  it("renders an accessible button with selected variant and size", () => {
    render(<Button variant="outline" size="lg">Save</Button>);

    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("data-slot", "button");
    expect(button).toHaveClass("border-border", "h-9");
  });

  it("renders an input with native props and slot marker", () => {
    render(<Input aria-label="Email" type="email" placeholder="you@example.com" />);

    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute(
      "data-slot",
      "input",
    );
  });

  it("renders a label with native accessibility association", () => {
    render(<><Label htmlFor="name">Name</Label><input id="name" /></>);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByText("Name")).toHaveAttribute("data-slot", "label");
  });
});
