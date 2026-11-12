import { render, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "@/components/pets/status-badge";

describe("StatusBadge", () => {
  it.each([
    ["lost", "Lost", "bg-primary"],
    ["found", "Found", "bg-info"],
    ["reunited", "Reunited", "bg-success"],
  ] as const)("renders the %s status", (status, label, tone) => {
    const { container } = render(<StatusBadge status={status} />);
    const badge = container.firstElementChild;

    expect(within(container).getByText(label)).toBeInTheDocument();
    expect(badge).toHaveClass(tone, "rounded-full");
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("uses a decorative pulse for lost status when pulse is enabled", () => {
    const { container } = render(<StatusBadge status="lost" pulse />);

    expect(container.querySelector("svg")).toBeNull();
    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass("size-2");
    expect(container.querySelector(".animate-ping")).toHaveClass(
      "motion-reduce:animate-none",
    );
  });
});
