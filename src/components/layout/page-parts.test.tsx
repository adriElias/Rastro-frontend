import { fireEvent, render, within } from "@testing-library/react";
import { PawPrint } from "lucide-react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import {
  EmptyState,
  PageContainer,
  PageHeader,
  SectionTitle,
} from "@/components/layout/page-parts";

describe("PageContainer", () => {
  it("renders children with its layout and caller classes", () => {
    const { getByText, container } = render(
      <PageContainer className="custom-container">
        <span>Page content</span>
      </PageContainer>,
    );

    expect(getByText("Page content")).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass(
      "mx-auto",
      "max-w-7xl",
      "custom-container",
    );
  });
});

describe("PageHeader", () => {
  it("renders optional eyebrow, description and action children", () => {
    const { getByRole, getByText } = render(
      <PageHeader eyebrow="Pets" title="Find a pet" description="Browse reports">
        <button type="button">Create report</button>
      </PageHeader>,
    );

    expect(getByRole("heading", { level: 1, name: "Find a pet" })).toBeInTheDocument();
    expect(getByText("Pets")).toBeInTheDocument();
    expect(getByText("Browse reports")).toBeInTheDocument();
    expect(getByRole("button", { name: "Create report" })).toBeInTheDocument();
  });

  it("omits optional content when it is not provided", () => {
    const { container, getByRole } = render(
      <PageHeader title="Reports" />,
    );

    expect(getByRole("heading", { name: "Reports" })).toBeInTheDocument();
    expect(container.textContent).not.toContain("Pets");
    expect(container.querySelector("p")).toBeNull();
  });
});

describe("SectionTitle", () => {
  it("renders an internal link with a customizable label", () => {
    const { container } = render(
      <MemoryRouter>
        <SectionTitle title="Recent reports" href="/reports" linkLabel="Browse all" />
      </MemoryRouter>,
    );

    const section = within(container);
    expect(section.getByRole("heading", { name: "Recent reports" })).toBeInTheDocument();
    expect(section.getByRole("link", { name: "Browse all" })).toHaveAttribute(
      "href",
      "/reports",
    );
  });

  it("omits the link when no destination is given", () => {
    const { container } = render(
      <MemoryRouter>
        <SectionTitle title="Recent reports" />
      </MemoryRouter>,
    );

    expect(within(container).queryByRole("link")).not.toBeInTheDocument();
  });
});

describe("EmptyState", () => {
  it("renders accessible content and a routed call to action", () => {
    const { container } = render(
      <MemoryRouter>
        <EmptyState
          Icon={PawPrint}
          title="No pets yet"
          description="Check back soon."
          cta={{ href: "/report", label: "Create report" }}
        />
      </MemoryRouter>,
    );

    const content = within(container);
    expect(content.getByRole("heading", { name: "No pets yet" })).toBeInTheDocument();
    expect(content.getByText("Check back soon.")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(container.firstElementChild).toHaveClass("rounded-3xl", "border", "bg-card");
    expect(content.getByRole("link", { name: "Create report" })).toHaveAttribute(
      "href",
      "/report",
    );
  });

  it("runs a button action and can omit the call to action", () => {
    const onClick = vi.fn();
    const { container, rerender } = render(
      <MemoryRouter>
        <EmptyState
          Icon={PawPrint}
          title="Try again"
          description="Please retry."
          cta={{ label: "Retry", onClick }}
        />
      </MemoryRouter>,
    );

    fireEvent.click(within(container).getByRole("button", { name: "Retry" }));
    expect(onClick).toHaveBeenCalledOnce();

    rerender(
      <MemoryRouter>
        <EmptyState Icon={PawPrint} title="Try again" description="Please retry." />
      </MemoryRouter>,
    );
    expect(within(container).queryByRole("button")).not.toBeInTheDocument();
    expect(within(container).queryByRole("link")).not.toBeInTheDocument();
  });
});
