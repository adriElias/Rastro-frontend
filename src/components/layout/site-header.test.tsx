import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/layout/site-header";

describe("SiteHeader", () => {
  it("renders brand, internal navigation, and report/profile actions", () => {
    render(
      <MemoryRouter initialEntries={["/lost"]}>
        <SiteHeader />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "RASTRO home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Create report" })).toHaveAttribute(
      "href",
      "/report",
    );
    expect(screen.getByRole("link", { name: "Your profile" })).toHaveAttribute(
      "href",
      "/profile",
    );
  });

  it("marks the current route as active in the main navigation", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/lost/details"]}>
        <SiteHeader />
      </MemoryRouter>,
    );

    const nav = within(container).getByRole("navigation", { name: "Main" });
    expect(within(nav).getByRole("link", { name: "Lost" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("renders mobile navigation separately from desktop navigation", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <SiteHeader />
      </MemoryRouter>,
    );

    const mainNav = within(container).getByRole("navigation", { name: "Main" });
    const mobileNav = within(container).getByRole("navigation", { name: "Mobile" });
    expect(mainNav).not.toContainElement(mobileNav);
    expect(mobileNav).toHaveClass("lg:hidden");
    expect(within(mobileNav).getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
