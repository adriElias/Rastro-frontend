import { render, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { AuthLayout } from "@/layouts/AuthLayout";

describe("AuthLayout", () => {
  it("renders the isolated responsive auth design, logo and testimonial image", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<h1>Login content</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    const content = within(container);
    const aside = content.getByRole("complementary");

    expect(content.getByRole("main")).toHaveClass("flex", "flex-col");
    expect(content.getByRole("link", { name: "RASTRO home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(content.getByRole("heading", { name: "Login content" })).toBeInTheDocument();
    expect(aside).toHaveClass("hidden", "lg:block");
    expect(
      within(aside).getByRole("img", {
        name: "A smiling person hugging their dog outdoors",
      }),
    ).toHaveAttribute("src", "/images/auth.png");
    expect(within(aside).getByText("3,216 pets reunited in Madrid")).toBeInTheDocument();
    expect(content.queryByRole("banner")).not.toBeInTheDocument();
    expect(content.queryByRole("contentinfo")).not.toBeInTheDocument();
    expect(content.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  });
});
