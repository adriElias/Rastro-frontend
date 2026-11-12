import { render, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import {
  FinalCta,
  HowItWorks,
  RecentlyLost,
  StatsBand,
  SuccessStories,
} from "@/components/landing/sections";

describe("homepage sections", () => {
  it("renders all community statistics", () => {
    const { container } = render(<StatsBand />);
    const section = within(container).getByRole("region", {
      name: "Community impact",
    });

    expect(within(section).getByText("3,216")).toBeInTheDocument();
    expect(within(section).getByText("412")).toBeInTheDocument();
    expect(within(section).getByText("1,287")).toBeInTheDocument();
    expect(within(section).getByText("18,420")).toBeInTheDocument();
    expect(within(section).getByText("Neighbours helping")).toBeInTheDocument();
  });

  it("renders the recent reports and their internal browse link", () => {
    const { container } = render(
      <MemoryRouter>
        <RecentlyLost />
      </MemoryRouter>,
    );
    const heading = within(container).getByRole("heading", {
      name: "Recently reported",
    });
    const section = within(heading.closest("section") as HTMLElement);

    expect(section.getByRole("link", { name: /View all/ })).toHaveAttribute(
      "href",
      "/lost",
    );
    expect(section.getAllByRole("link")).toHaveLength(9);
    expect(section.getAllByRole("img")).toHaveLength(8);
    expect(section.getByRole("img", { name: "Luna, Golden Retriever" })).toHaveAttribute(
      "src",
      "/images/pets/luna.png",
    );
  });

  it("renders the four accessible how-it-works steps", () => {
    const { container } = render(<HowItWorks />);
    const heading = within(container).getByRole("heading", {
      name: "Four simple steps, one big community",
    });
    const list = heading.parentElement?.nextElementSibling;

    expect(list?.tagName).toBe("OL");
    expect(within(list as HTMLElement).getAllByRole("listitem")).toHaveLength(4);
    expect(within(list as HTMLElement).getByText("Neighbours get notified")).toBeInTheDocument();
  });

  it("renders success stories with images, quotes and author attribution", () => {
    const { container } = render(<SuccessStories />);
    const heading = within(container).getByRole("heading", {
      name: "They made it home",
    });
    const section = within(heading.closest("section") as HTMLElement);

    expect(section.getAllByRole("img")).toHaveLength(3);
    expect(section.getAllByRole("blockquote")).toHaveLength(3);
    expect(
      section.getByText(
        (_, element) =>
          element?.tagName === "P" &&
          element.textContent?.includes("Sofía H.") === true &&
          element.textContent.includes("with Canela"),
      ),
    ).toBeInTheDocument();
    expect(section.getByRole("img", { name: "Canela" })).toHaveAttribute(
      "src",
      "/images/pets/canela.png",
    );
  });

  it("renders final calls to action with their original destinations", () => {
    const { container } = render(
      <MemoryRouter>
        <FinalCta />
      </MemoryRouter>,
    );
    const section = within(container);

    expect(
      section.getByRole("heading", {
        name: "Be the neighbour someone is hoping for",
      }),
    ).toBeInTheDocument();
    expect(section.getByRole("link", { name: "Join RASTRO for free" })).toHaveAttribute(
      "href",
      "/register",
    );
    expect(section.getByRole("link", { name: /Explore the map/ })).toHaveAttribute(
      "href",
      "/map",
    );
  });
});
