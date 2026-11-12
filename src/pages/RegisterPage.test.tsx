import { cleanup, render, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { RegisterPage } from "@/pages/RegisterPage";

afterEach(() => {
  cleanup();
});

describe("RegisterPage", () => {
  it("renders RegisterForm, sets the document title and restores it on unmount", async () => {
    const previousTitle = "Previous page title";
    document.title = previousTitle;
    const { container, unmount } = render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    expect(
      within(container).getByRole("heading", { name: "Become someone's hero" }),
    ).toBeInTheDocument();
    await waitFor(() => expect(document.title).toBe("Create account · RASTRO"));

    unmount();
    expect(document.title).toBe(previousTitle);
  });
});
