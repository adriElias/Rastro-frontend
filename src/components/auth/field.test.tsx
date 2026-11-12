import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Field } from "@/components/auth/field";

describe("Field", () => {
  it("associates its label and hint with the input", () => {
    const { container } = render(
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        hint={<a href="/help">Need help?</a>}
      />,
    );
    const content = within(container);
    const input = content.getByLabelText("Email");

    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("autoComplete", "email");
    expect(input).toBeRequired();
    expect(content.getByRole("link", { name: "Need help?" })).toHaveAttribute(
      "href",
      "/help",
    );
  });

  it("toggles password visibility with an accessible control", () => {
    const { container } = render(
      <Field label="Password" name="password" type="password" />,
    );
    const content = within(container);
    const input = content.getByLabelText("Password");

    expect(input).toHaveAttribute("type", "password");
    fireEvent.click(content.getByRole("button", { name: "Show password" }));
    expect(input).toHaveAttribute("type", "text");
    expect(content.getByRole("button", { name: "Hide password" })).toBeInTheDocument();
  });

  it("connects field errors to the invalid input", () => {
    const { container } = render(
      <Field label="Email" name="email" error="Enter a valid email." />,
    );
    const content = within(container);
    const input = content.getByLabelText("Email");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby");
    expect(content.getByText("Enter a valid email.")).toHaveAttribute("id", input.getAttribute("aria-describedby"));
  });
});
