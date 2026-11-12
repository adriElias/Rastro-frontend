import { fireEvent, render, within } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router";
import { describe, expect, it } from "vitest";
import { Hero } from "@/components/landing/hero";

function CurrentLocation() {
  const location = useLocation();
  return (
    <output data-testid="current-location">
      {location.pathname}
      {location.search}
    </output>
  );
}

describe("Hero", () => {
  it("renders the main message, community statistics, images and CTA links", () => {
    const { container } = render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    );
    const content = within(container);

    expect(
      content.getByRole("heading", {
        name: "Helping pets find their way home.",
      }),
    ).toBeInTheDocument();
    expect(content.getByText("412 pets being searched for right now")).toBeInTheDocument();
    expect(content.getByText("3,216")).toBeInTheDocument();

    const heroImage = content.getByRole("img", {
      name: "A happy dog and cat sitting together in a sunny park",
    });
    expect(heroImage).toHaveAttribute("src", "/images/hero.png");
    expect(heroImage).toHaveAttribute("loading", "eager");
    expect(heroImage).toHaveAttribute("fetchpriority", "high");
    expect(heroImage).toHaveClass("object-cover");

    const lunaImage = container.querySelector('img[alt=""]');
    expect(lunaImage).not.toBeNull();
    expect(lunaImage).toHaveAttribute("src", "/images/pets/luna.png");
    expect(lunaImage).toHaveAttribute("loading", "lazy");
    expect(content.getByText("New sighting of Luna")).toBeInTheDocument();

    expect(content.getByRole("link", { name: "I lost my pet" })).toHaveAttribute(
      "href",
      "/report/lost",
    );
    expect(content.getByRole("link", { name: "I found a pet" })).toHaveAttribute(
      "href",
      "/report/found",
    );
  });

  it("submits a URL-encoded GET-style search through React Router without reloading", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Hero />
        <CurrentLocation />
      </MemoryRouter>,
    );
    const content = within(container);
    const form = content.getByRole("search");
    fireEvent.change(
      form.querySelector('input[name="q"]') as HTMLInputElement,
      { target: { value: "golden retriever & parque" } },
    );
    fireEvent.submit(form);

    expect(content.getByTestId("current-location")).toHaveTextContent(
      "/lost?q=golden+retriever+%26+parque",
    );
    expect(window.location.pathname).toBe("/");
    expect(container.querySelector("form")).toHaveAttribute("role", "search");
  });
});
