import { render, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { MobileNav } from "@/components/layout/mobile-nav";

describe("MobileNav", () => {
  it("uses a bottom-fixed mobile-only bar with safe-area padding", () => {
    const { container } = render(
      <MemoryRouter>
        <MobileNav />
      </MemoryRouter>,
    );
    const nav = within(container).getByRole("navigation", { name: "Mobile" });

    expect(nav).toHaveClass(
      "fixed",
      "inset-x-3",
      "bottom-3",
      "lg:hidden",
      "pb-[max(env(safe-area-inset-bottom),0.25rem)]",
    );
  });

  it("uses five equal columns and keeps the elevated Report control in the center", () => {
    const { container } = render(
      <MemoryRouter>
        <MobileNav />
      </MemoryRouter>,
    );
    const nav = within(container).getByRole("navigation", { name: "Mobile" });
    const list = nav.querySelector("ul");
    const items = within(nav).getAllByRole("listitem");

    expect(list).toHaveClass("grid", "grid-cols-5", "items-end");
    expect(items).toHaveLength(5);
    for (const item of items) {
      expect(item).toHaveClass("flex", "justify-center");
    }

    const report = within(nav).getByRole("link", { name: "Report" });
    expect(report).toHaveClass("-mt-6", "flex-col", "items-center", "gap-1");
    expect(report.firstElementChild).toHaveClass(
      "size-14",
      "rounded-2xl",
      "bg-primary",
      "text-primary-foreground",
    );

    for (const label of ["Home", "Browse", "Map", "Me"]) {
      expect(within(nav).getByRole("link", { name: label })).toHaveClass(
        "items-center",
        "gap-1",
        "py-2",
      );
    }
  });

  it("renders accessible mobile links and marks grouped routes active", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/found/123"]}>
        <MobileNav />
      </MemoryRouter>,
    );

    const nav = within(container).getByRole("navigation", { name: "Mobile" });
    expect(within(nav).getByRole("link", { name: "Browse" })).toHaveAttribute(
      "href",
      "/lost",
    );
    expect(within(nav).getByRole("link", { name: "Browse" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(nav).getByRole("link", { name: "Me" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(within(nav).getByRole("link", { name: "Report" })).toHaveAttribute(
      "href",
      "/report",
    );
  });

  it("marks profile navigation active on my reports", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/my-reports"]}>
        <MobileNav />
      </MemoryRouter>,
    );

    const nav = within(container).getByRole("navigation", { name: "Mobile" });
    expect(within(nav).getByRole("link", { name: "Me" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
