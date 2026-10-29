import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { Logo } from "@/components/brand/logo";

describe("Logo", () => {
  it("renders the accessible home link and original brand", () => {
    const { container } = render(
      <MemoryRouter>
        <Logo />
      </MemoryRouter>,
    );

    const link = within(container).getByRole("link", { name: "RASTRO home" });
    expect(link).toHaveAttribute("href", "/");
    expect(link).toHaveAttribute("data-discover", "true");
    expect(screen.getByText("RASTRO")).toBeInTheDocument();
  });

  it("uses the supplied href and appends the caller class", () => {
    const { container } = render(
      <MemoryRouter>
        <Logo href="/dashboard" className="custom-logo" />
      </MemoryRouter>,
    );

    const link = within(container).getByRole("link", { name: "RASTRO home" });
    expect(link).toHaveAttribute("href", "/dashboard");
    expect(link).toHaveAttribute("data-discover", "true");
    expect(link).toHaveClass("custom-logo");
  });
});
