import { act, cleanup, fireEvent, render, within } from "@testing-library/react";
import { useState } from "react";
import { MemoryRouter, useLocation } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "@/auth/AuthProvider";
import { useAuth } from "@/auth/useAuth";
import { RegisterForm } from "@/components/auth/register-form";
import {
  register,
  RegisterApiError,
  type RegisterRequest,
  type RegisterResponse,
} from "@/services/auth/register";

vi.mock("@/services/auth/register", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/services/auth/register")>();
  return { ...actual, register: vi.fn() };
});

const mockedRegister = vi.mocked(register);

const successfulResponse: RegisterResponse = {
  id: "b5c8610d-93c4-4b82-97e1-1a5873cbaf5a",
  name: "Adriana",
  lastName: "Elias",
  email: "adriana@example.com",
  phoneNumber: null,
  registrationDate: "2026-11-02T15:30:00Z",
};

const validFields = {
  name: "Adriana",
  lastName: "Elias",
  email: "adriana@example.com",
  password: "Valid1",
  confirmPassword: "Valid1",
};

function renderForm() {
  return render(
    <MemoryRouter initialEntries={["/register"]}>
      <RegisterForm />
      <CurrentPath />
    </MemoryRouter>,
  );
}

function CurrentPath() {
  const location = useLocation();
  return <span data-testid="current-path">{location.pathname}</span>;
}

function AuthStateProbe() {
  const { hasAccessToken, setAccessToken } = useAuth();
  return (
    <div>
      <span data-testid="auth-state">
        {hasAccessToken ? "token-present" : "no-token"}
      </span>
      <button type="button" onClick={() => setAccessToken("existing-token") }>
        Seed existing token
      </button>
    </div>
  );
}

function enterFields(container: HTMLElement, fields: Partial<typeof validFields> & {
  phoneNumber?: string;
}) {
  const content = within(container);
  for (const [name, value] of Object.entries(fields)) {
    fireEvent.change(container.querySelector<HTMLInputElement>(`[name="${name}"]`)!, {
      target: { value },
    });
  }
  return content;
}

function submit(container: HTMLElement) {
  fireEvent.submit(container.querySelector("form")!);
}

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  mockedRegister.mockReset();
  mockedRegister.mockResolvedValue(successfulResponse);
});

describe("RegisterForm", () => {
  it("renders accessible registration fields and the Login link", () => {
    const { container } = renderForm();
    const content = within(container);

    expect(content.getByLabelText("Name")).toHaveAttribute("autocomplete", "given-name");
    expect(content.getByLabelText("Last name")).toHaveAttribute(
      "autocomplete",
      "family-name",
    );
    expect(content.getByLabelText("Email")).toHaveAttribute("type", "text");
    expect(content.getByLabelText("Email")).toHaveAttribute("inputmode", "email");
    expect(content.getByLabelText("Phone number (optional)")).toHaveAttribute(
      "type",
      "tel",
    );
    expect(content.getByLabelText("Password")).toHaveAttribute(
      "autocomplete",
      "new-password",
    );
    expect(content.getByLabelText("Confirm password")).toHaveAttribute(
      "autocomplete",
      "new-password",
    );
    expect(content.getByRole("link", { name: "Log in" })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("shows accessible required errors, focuses the first invalid field and does not submit", () => {
    const { container } = renderForm();
    const content = within(container);
    const name = content.getByLabelText("Name");
    let errorExistedWhenFocused = false;
    name.addEventListener("focus", () => {
      const descriptionId = name.getAttribute("aria-describedby");
      errorExistedWhenFocused = Boolean(
        descriptionId && document.getElementById(descriptionId),
      );
    });

    submit(container);

    expect(name).toHaveFocus();
    expect(errorExistedWhenFocused).toBe(true);
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription(
      "Name must contain between 3 and 10 characters.",
    );
    expect(content.getByLabelText("Last name")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(content.getByLabelText("Email")).toHaveAccessibleDescription(
      "Enter a valid email address.",
    );
    expect(content.getByLabelText("Password")).toHaveAccessibleDescription(
      "Password must contain at least 5 characters.",
    );
    expect(content.getByLabelText("Confirm password")).toHaveAccessibleDescription(
      "Please confirm your password.",
    );
    expect(content.getByLabelText("Phone number (optional)")).not.toHaveAttribute(
      "aria-invalid",
    );
    expect(mockedRegister).not.toHaveBeenCalled();
  });

  it("clears a corrected field error without clearing unrelated errors", () => {
    const { container } = renderForm();
    const content = within(container);
    submit(container);

    const name = content.getByLabelText("Name");
    const lastName = content.getByLabelText("Last name");
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(lastName).toHaveAttribute("aria-invalid", "true");

    fireEvent.change(name, { target: { value: "Adriana" } });

    expect(name).not.toHaveAttribute("aria-invalid");
    expect(name).not.toHaveAttribute("aria-describedby");
    expect(
      content.queryByText("Name must contain between 3 and 10 characters."),
    ).not.toBeInTheDocument();
    expect(lastName).toHaveAttribute("aria-invalid", "true");
    expect(lastName).toHaveAccessibleDescription(
      "Last name must contain between 3 and 10 characters.",
    );
  });

  it("updates an existing field error while the value remains invalid", () => {
    const { container } = renderForm();
    const content = within(container);
    enterFields(container, {
      ...validFields,
      password: "Val1",
      confirmPassword: "Val1",
    });
    submit(container);
    const password = content.getByLabelText("Password");
    expect(password).toHaveAccessibleDescription(
      "Password must contain at least 5 characters.",
    );

    fireEvent.change(password, { target: { value: "12345" } });

    expect(password).toHaveAccessibleDescription(
      "Password must contain at least one ASCII letter.",
    );
  });

  it("validates trimmed name boundaries before submitting", () => {
    const { container } = renderForm();
    enterFields(container, {
      ...validFields,
      name: "  Al  ",
      lastName: "Longlastname",
    });

    submit(container);

    expect(within(container).getByLabelText("Name")).toHaveAccessibleDescription(
      "Name must contain between 3 and 10 characters.",
    );
    expect(within(container).getByLabelText("Last name")).toHaveAccessibleDescription(
      "Last name must contain between 3 and 10 characters.",
    );
    expect(mockedRegister).not.toHaveBeenCalled();
  });

  it.each([
    ["person@mail.example.com", "Enter a valid email address."],
    [`${"a".repeat(140)}@example.com`, "Email must contain at most 150 characters."],
  ])("rejects an invalid email (%s)", (email, message) => {
    const { container } = renderForm();
    enterFields(container, { ...validFields, email });

    submit(container);

    expect(within(container).getByLabelText("Email")).toHaveAccessibleDescription(
      message,
    );
    expect(mockedRegister).not.toHaveBeenCalled();
  });

  it("trims names, preserves email and password, and omits an empty phone number", () => {
    const { container } = renderForm();
    enterFields(container, {
      name: "  Adriana  ",
      lastName: "  Elias  ",
      email: "  Adriana@Example.COM  ",
      phoneNumber: "   ",
      password: "  Valid1  ",
      confirmPassword: "  Valid1  ",
    });

    submit(container);

    expect(mockedRegister).toHaveBeenCalledOnce();
    expect(mockedRegister).toHaveBeenCalledWith({
      name: "Adriana",
      lastName: "Elias",
      email: "  Adriana@Example.COM  ",
      password: "  Valid1  ",
    } satisfies RegisterRequest);
  });

  it("preserves a valid non-empty phone number", () => {
    const { container } = renderForm();
    const phone = "  +34 600 111 222  ";
    enterFields(container, { ...validFields, phoneNumber: phone });

    submit(container);

    expect(mockedRegister).toHaveBeenCalledWith({
      name: "Adriana",
      lastName: "Elias",
      email: "adriana@example.com",
      password: "Valid1",
      phoneNumber: phone,
    });
  });

  it("rejects a phone number longer than 20 UTF-16 units", () => {
    const { container } = renderForm();
    enterFields(container, {
      ...validFields,
      phoneNumber: "1".repeat(21),
    });

    submit(container);

    expect(
      within(container).getByLabelText("Phone number (optional)"),
    ).toHaveAccessibleDescription(
      "Phone number must contain at most 20 characters.",
    );
    expect(mockedRegister).not.toHaveBeenCalled();
  });

  it.each([
    ["Val1", "Password must contain at least 5 characters."],
    ["12345", "Password must contain at least one ASCII letter."],
    ["Valid", "Password must contain at least one ASCII digit."],
    [`a1${"é".repeat(36)}`, "Password must contain at most 72 UTF-8 bytes."],
  ])("rejects an invalid password without changing it (%s)", (password, message) => {
    const { container } = renderForm();
    enterFields(container, {
      ...validFields,
      password,
      confirmPassword: password,
    });

    submit(container);

    expect(within(container).getByLabelText("Password")).toHaveAccessibleDescription(
      message,
    );
    expect(mockedRegister).not.toHaveBeenCalled();
  });

  it("accepts a password of exactly 72 UTF-8 bytes and preserves it", () => {
    const { container } = renderForm();
    const password = `a1${"é".repeat(35)}`;
    expect(new TextEncoder().encode(password)).toHaveLength(72);
    enterFields(container, {
      ...validFields,
      password,
      confirmPassword: password,
    });

    submit(container);

    expect(mockedRegister).toHaveBeenCalledWith(
      expect.objectContaining({ password }),
    );
  });

  it("requires an exact password confirmation", () => {
    const { container } = renderForm();
    enterFields(container, {
      ...validFields,
      confirmPassword: "Valid1 ",
    });

    submit(container);

    expect(
      within(container).getByLabelText("Confirm password"),
    ).toHaveAccessibleDescription("Passwords do not match.");
    expect(mockedRegister).not.toHaveBeenCalled();
  });

  it.each([
    [
      new RegisterApiError("INVALID_REQUEST", "private validation detail", 400),
      "The registration request is invalid.",
    ],
    [
      new RegisterApiError("NETWORK_ERROR", "private network detail"),
      "Unable to connect to RASTRO. Please check your connection and try again.",
    ],
    [
      new RegisterApiError("REQUEST_FAILED", "private transport detail", 503),
      "Unable to complete the registration request.",
    ],
    [new Error("private unexpected detail"), "Unable to complete the registration request."],
  ])("shows a safe accessible submission error", async (error, message) => {
    mockedRegister.mockRejectedValue(error);
    const { container } = renderForm();
    enterFields(container, validFields);

    submit(container);

    expect(await within(container).findByRole("alert")).toHaveTextContent(message);
    expect(container).not.toHaveTextContent("private");
    expect(within(container).getByRole("button", { name: "Create account" })).toBeEnabled();
  });

  it("associates a duplicate email error with the field and focuses it", async () => {
    mockedRegister.mockRejectedValue(
      new RegisterApiError(
        "EMAIL_ALREADY_REGISTERED",
        "private persistence detail",
        409,
      ),
    );
    const { container } = renderForm();
    enterFields(container, validFields);
    const content = within(container);
    const email = content.getByLabelText("Email");
    let errorExistedWhenFocused = false;
    email.addEventListener("focus", () => {
      const descriptionId = email.getAttribute("aria-describedby");
      errorExistedWhenFocused = Boolean(
        descriptionId && document.getElementById(descriptionId),
      );
    });

    submit(container);

    expect(await content.findByRole("alert")).toHaveTextContent(
      "Please check the email field.",
    );
    expect(email).toHaveFocus();
    expect(errorExistedWhenFocused).toBe(true);
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription("Email already registered.");
    expect(container).not.toHaveTextContent("private persistence detail");
  });

  it("does not apply a duplicate error to an email edited while the request is pending", async () => {
    let rejectRegister!: (error: unknown) => void;
    mockedRegister.mockReturnValue(
      new Promise((_, reject) => {
        rejectRegister = reject;
      }),
    );
    const { container } = renderForm();
    const content = within(container);
    enterFields(container, validFields);
    submit(container);
    expect(mockedRegister).toHaveBeenCalledWith(
      expect.objectContaining({ email: "adriana@example.com" }),
    );

    const email = content.getByLabelText("Email");
    fireEvent.change(email, { target: { value: "new@example.com" } });
    content.getByLabelText("Name").focus();
    await act(async () => {
      rejectRegister(
        new RegisterApiError(
          "EMAIL_ALREADY_REGISTERED",
          "private persistence detail",
          409,
        ),
      );
    });

    expect(email).toHaveValue("new@example.com");
    expect(email).not.toHaveAttribute("aria-invalid");
    expect(email).not.toHaveAttribute("aria-describedby");
    expect(content.queryByRole("alert")).not.toBeInTheDocument();
    expect(content.getByLabelText("Name")).toHaveFocus();
    expect(content.getByRole("button", { name: "Create account" })).toBeEnabled();
  });

  it("clears a duplicate email error when the email is corrected", async () => {
    mockedRegister.mockRejectedValue(
      new RegisterApiError("EMAIL_ALREADY_REGISTERED", "private detail", 409),
    );
    const { container } = renderForm();
    const content = within(container);
    enterFields(container, validFields);
    submit(container);
    const email = content.getByLabelText("Email");
    expect(await content.findByRole("alert")).toBeInTheDocument();
    expect(email).toHaveAccessibleDescription("Email already registered.");

    fireEvent.change(email, { target: { value: "new@example.com" } });

    expect(email).not.toHaveAttribute("aria-invalid");
    expect(email).not.toHaveAttribute("aria-describedby");
    expect(content.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("allows retry after a submission error", async () => {
    mockedRegister
      .mockRejectedValueOnce(new RegisterApiError("NETWORK_ERROR", "private detail"))
      .mockResolvedValueOnce(successfulResponse);
    const { container } = renderForm();
    enterFields(container, validFields);

    submit(container);
    expect(await within(container).findByRole("alert")).toHaveTextContent(
      "Unable to connect to RASTRO.",
    );

    submit(container);

    expect(await within(container).findByRole("status")).toHaveTextContent(
      "Account created successfully.",
    );
    expect(mockedRegister).toHaveBeenCalledTimes(2);
  });

  it("replaces the form with an accessible success confirmation without navigating", async () => {
    const { container } = renderForm();
    enterFields(container, validFields);

    submit(container);

    const content = within(container);
    const confirmation = await content.findByRole("status");
    expect(confirmation).toHaveFocus();
    expect(confirmation).toHaveTextContent("Account created successfully.");
    expect(confirmation).toHaveTextContent("Log in to continue.");
    expect(content.getByRole("link", { name: "Log in" })).toHaveAttribute(
      "href",
      "/login",
    );
    expect(content.getByTestId("current-path")).toHaveTextContent("/register");
    expect(container.querySelector("form")).not.toBeInTheDocument();
    expect(container.querySelector('[name="password"]')).not.toBeInTheDocument();
    expect(container.querySelector('[name="confirmPassword"]')).not.toBeInTheDocument();
  });

  it("does not create, replace or persist authentication after success", async () => {
    const localSetItem = vi.spyOn(localStorage, "setItem");
    const sessionSetItem = vi.spyOn(sessionStorage, "setItem");
    const { container } = render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/register"]}>
          <RegisterForm />
          <AuthStateProbe />
        </MemoryRouter>
      </AuthProvider>,
    );
    const content = within(container);
    fireEvent.click(content.getByRole("button", { name: "Seed existing token" }));
    enterFields(container, validFields);

    submit(container);

    expect(await content.findByRole("status")).toHaveTextContent(
      "Account created successfully.",
    );
    expect(content.getByTestId("auth-state")).toHaveTextContent("token-present");
    expect(localSetItem).not.toHaveBeenCalled();
    expect(sessionSetItem).not.toHaveBeenCalled();
  });

  it("shows an accessible loading state, keeps fields enabled and prevents duplicates", async () => {
    let resolveRegister!: (response: RegisterResponse) => void;
    mockedRegister.mockReturnValue(
      new Promise((resolve) => {
        resolveRegister = resolve;
      }),
    );
    const { container } = renderForm();
    enterFields(container, validFields);
    const form = container.querySelector("form")!;

    submit(container);

    const content = within(container);
    const button = content.getByRole("button", { name: "Creating your account…" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(form).toHaveAttribute("aria-busy", "true");
    expect(content.getByLabelText("Email")).not.toBeDisabled();

    submit(container);
    expect(mockedRegister).toHaveBeenCalledOnce();

    await act(async () => resolveRegister(successfulResponse));
    expect(await content.findByRole("status")).toHaveTextContent(
      "Account created successfully.",
    );
  });

  it("does not update state after unmounting during registration", async () => {
    let resolveRegister!: (response: RegisterResponse) => void;
    mockedRegister.mockReturnValue(
      new Promise((resolve) => {
        resolveRegister = resolve;
      }),
    );
    function UnmountableForm() {
      const [visible, setVisible] = useState(true);
      return (
        <MemoryRouter>
          {visible ? <RegisterForm /> : <p>Form unmounted</p>}
          <button type="button" onClick={() => setVisible(false)}>
            Unmount register form
          </button>
        </MemoryRouter>
      );
    }
    const { container } = render(<UnmountableForm />);
    const content = within(container);
    enterFields(container, validFields);
    submit(container);
    fireEvent.click(content.getByRole("button", { name: "Unmount register form" }));

    await act(async () => resolveRegister(successfulResponse));

    expect(content.getByText("Form unmounted")).toBeInTheDocument();
    expect(content.queryByRole("status")).not.toBeInTheDocument();
  });

  it("does not update state after a registration request rejects following unmount", async () => {
    let rejectRegister!: (error: unknown) => void;
    mockedRegister.mockReturnValue(
      new Promise((_, reject) => {
        rejectRegister = reject;
      }),
    );
    function UnmountableForm() {
      const [visible, setVisible] = useState(true);
      return (
        <MemoryRouter>
          {visible ? <RegisterForm /> : <p>Form unmounted</p>}
          <button type="button" onClick={() => setVisible(false)}>
            Unmount register form
          </button>
        </MemoryRouter>
      );
    }
    const { container } = render(<UnmountableForm />);
    const content = within(container);
    enterFields(container, validFields);
    submit(container);
    fireEvent.click(content.getByRole("button", { name: "Unmount register form" }));

    await act(async () => {
      rejectRegister(new RegisterApiError("NETWORK_ERROR", "private detail"));
    });

    expect(content.getByText("Form unmounted")).toBeInTheDocument();
    expect(content.queryByRole("alert")).not.toBeInTheDocument();
  });
});
