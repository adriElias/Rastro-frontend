import { render, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { MapPlaceholder } from "@/components/landing/map-placeholder";

describe("MapPlaceholder", () => {
  it("describes the map illustration as static and exposes its legend accessibly", () => {
    const { container } = render(
      <MemoryRouter>
        <MapPlaceholder />
      </MemoryRouter>,
    );
    const content = within(container);

    expect(
      content.getByRole("img", {
        name: /illustrative static community map.*not live reports/i,
      }),
    ).toBeInTheDocument();
    expect(content.getByText("Lost pets")).toBeInTheDocument();
    expect(content.getByText("Found pets")).toBeInTheDocument();
    expect(content.getByText("Reunited")).toBeInTheDocument();
    expect(content.getByRole("link", { name: /Open full map/ })).toHaveAttribute(
      "href",
      "/map",
    );
  });
});
