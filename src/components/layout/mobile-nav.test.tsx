import { render, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { MobileNav } from "@/components/layout/mobile-nav";

describe("MobileNav", () => {
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
