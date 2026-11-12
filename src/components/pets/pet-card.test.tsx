import { render, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { PetCard } from "@/components/pets/pet-card";
import { pets } from "@/lib/data";

describe("PetCard", () => {
  it("renders an accessible image, status and routed pet details link", () => {
    const { container } = render(
      <MemoryRouter>
        <PetCard pet={pets[0]} priority />
      </MemoryRouter>,
    );

    const content = within(container);
    const card = content.getByRole("link");
    expect(card).toHaveAttribute("href", "/pets/luna-retiro");
    expect(content.getByRole("img", { name: "Luna, Golden Retriever" })).toHaveAttribute(
      "src",
      "/images/pets/luna.png",
    );
    expect(content.getByRole("img", { name: "Luna, Golden Retriever" })).toHaveAttribute(
      "loading",
      "eager",
    );
    expect(content.getByText("Lost")).toBeInTheDocument();
    expect(content.getByText("Retiro")).toBeInTheDocument();
  });

  it("uses lazy image loading and compact layout when requested", () => {
    const { container } = render(
      <MemoryRouter>
        <PetCard pet={pets[1]} compact />
      </MemoryRouter>,
    );

    const content = within(container);
    expect(content.getByRole("img", { name: "Milo, European Shorthair" })).toHaveAttribute(
      "loading",
      "lazy",
    );
    expect(content.queryByText(pets[1].title)).not.toBeInTheDocument();
    expect(container.querySelector("img")).toHaveClass("object-cover");
    expect(container.querySelector("img")).toHaveClass(
      "absolute",
      "inset-0",
      "object-cover",
      "motion-reduce:transition-none",
    );
  });
});
