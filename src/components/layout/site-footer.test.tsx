import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/layout/site-footer";

describe("SiteFooter", () => {
  it("renders the brand, grouped internal links, and copyright message", () => {
    render(
      <MemoryRouter>
        <SiteFooter />
      </MemoryRouter>,
    );

    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByRole("link", { name: "RASTRO home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(within(footer).getByRole("heading", { name: "Explore" })).toBeInTheDocument();
    expect(within(footer).getByRole("link", { name: "Lost animals" })).toHaveAttribute(
      "href",
      "/lost",
    );
    expect(within(footer).getByRole("link", { name: "Create account" })).toHaveAttribute(
      "href",
      "/register",
    );
    expect(within(footer).getByText(/© 2026 RASTRO/)).toBeInTheDocument();
  });
});
