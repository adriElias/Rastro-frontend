import {
  act,
  cleanup,
  fireEvent,
  render,
  within,
} from "@testing-library/react";
import { useState } from "react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "@/auth/AuthProvider";
import { useAuth } from "@/auth/useAuth";
import { LoginForm } from "@/components/auth/login-form";
import {
  login,
  LoginApiError,
  type LoginCredentials,
  type LoginResponse,
} from "@/services/auth/login";

vi.mock("@/services/auth/login", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/services/auth/login")>();
  return { ...actual, login: vi.fn() };
});

const mockedLogin = vi.mocked(login);
const TEST_TOKEN = "test-access-token-not-for-display";

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
      <button type="button" onClick={() => setAccessToken("existing-token")}>
        Seed existing token
      </button>
    </div>
  );
}

function TestApp() {
  return (
    <AuthProvider>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={<p>Dashboard route</p>} />
        </Routes>
        <CurrentPath />
        <AuthStateProbe />
      </MemoryRouter>
    </AuthProvider>
  );
}

function enterCredentials(container: HTMLElement, credentials: LoginCredentials) {
  fireEvent.change(within(container).getByLabelText("Email"), {
    target: { value: credentials.email },
  });
  fireEvent.change(within(container).getByLabelText("Password"), {
    target: { value: credentials.password },
  });
}

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  mockedLogin.mockReset();
});

describe("LoginForm", () => {
  it("renders labeled email and password fields and preserves account links", () => {
    const { container } = render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <LoginForm />
        </MemoryRouter>
      </AuthProvider>,
    );
    const content = within(container);

    expect(content.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(content.getByLabelText("Password")).toHaveAttribute("type", "password");
    expect(content.getByRole("link", { name: "Forgot password?" })).toHaveAttribute(
      "href",
      "/login",
    );
    expect(content.getByRole("link", { name: "Create a free account" })).toHaveAttribute(
      "href",
      "/register",
    );
  });

  it("announces invalid email or empty password without submitting", () => {
    const { container } = render(
      <TestApp />,
    );
    const content = within(container);
    const form = container.querySelector("form")!;

    fireEvent.change(content.getByLabelText("Email"), {
      target: { value: "not-an-email" },
    });
    fireEvent.submit(form);
    expect(content.getByRole("alert")).toHaveTextContent(
      "Please check your email and password.",
    );
    expect(mockedLogin).not.toHaveBeenCalled();

    fireEvent.change(content.getByLabelText("Email"), {
      target: { value: "person@example.com" },
    });
    fireEvent.submit(form);
    expect(content.getByRole("alert")).toHaveTextContent(
      "Please check your email and password.",
    );
  });

  it("stores the returned token, announces success and does not navigate", async () => {
    mockedLogin.mockResolvedValue({ accessToken: TEST_TOKEN });
    const { container } = render(<TestApp />);
    const content = within(container);
    const form = container.querySelector("form")!;
    const credentials = {
      email: "person@example.com",
      password: " x ",
    };

    enterCredentials(container, credentials);
    fireEvent.submit(form);

    expect(await content.findByRole("status")).toHaveTextContent("Login successful.");
    expect(mockedLogin).toHaveBeenCalledOnce();
    expect(mockedLogin).toHaveBeenCalledWith(credentials);
    expect(content.getByTestId("auth-state")).toHaveTextContent("token-present");
    expect(content.getByTestId("current-path")).toHaveTextContent("/login");
    expect(content.queryByText("Dashboard route")).not.toBeInTheDocument();
    expect(container.textContent).not.toContain(TEST_TOKEN);
  });

  it("shows an accessible loading state and prevents duplicate submissions", async () => {
    let resolveLogin!: (response: LoginResponse) => void;
    mockedLogin.mockReturnValue(
      new Promise((resolve) => {
        resolveLogin = resolve;
      }),
    );
    const { container } = render(<TestApp />);
    const form = container.querySelector("form")!;
    enterCredentials(container, {
      email: "person@example.com",
      password: "password",
    });

    fireEvent.submit(form);
    const content = within(container);
    const submitButton = content.getByRole("button", { name: "Logging in…" });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute("aria-busy", "true");
    expect(form).toHaveAttribute("aria-busy", "true");

    fireEvent.submit(form);
    expect(mockedLogin).toHaveBeenCalledOnce();

    await act(async () => resolveLogin({ accessToken: TEST_TOKEN }));
    expect(await content.findByRole("status")).toHaveTextContent("Login successful.");
  });

  it.each([
    [
      new LoginApiError("INVALID_REQUEST", "The login request is invalid.", 400),
      "The login request is invalid.",
    ],
    [
      new LoginApiError("AUTHENTICATION_FAILED", "Authentication failed.", 401),
      "Authentication failed.",
    ],
    [
      new LoginApiError("NETWORK_ERROR", "Unable to connect to RASTRO.", undefined),
      "Unable to connect to RASTRO.",
    ],
    [new Error("private error detail"), "Unable to complete the login request."],
  ])("shows a safe accessible error for failed login", async (error, message) => {
    mockedLogin.mockRejectedValue(error);
    const { container } = render(<TestApp />);
    const content = within(container);
    enterCredentials(container, {
      email: "person@example.com",
      password: "password",
    });
    fireEvent.submit(container.querySelector("form")!);

    expect(await content.findByRole("alert")).toHaveTextContent(message);
    expect(content.getByTestId("auth-state")).toHaveTextContent("no-token");
    expect(content.getByTestId("current-path")).toHaveTextContent("/login");
    expect(content.queryByText("private error detail")).not.toBeInTheDocument();
  });

  it("preserves an existing token when a subsequent login attempt fails", async () => {
    mockedLogin.mockRejectedValue(
      new LoginApiError("AUTHENTICATION_FAILED", "Authentication failed.", 401),
    );
    const { container } = render(<TestApp />);
    const content = within(container);
    fireEvent.click(content.getByRole("button", { name: "Seed existing token" }));
    enterCredentials(container, {
      email: "person@example.com",
      password: "wrong",
    });
    fireEvent.submit(container.querySelector("form")!);

    expect(await content.findByRole("alert")).toHaveTextContent("Authentication failed.");
    expect(content.getByTestId("auth-state")).toHaveTextContent("token-present");
  });

  it("clears stale errors before processing a later submission", async () => {
    mockedLogin.mockResolvedValue({ accessToken: TEST_TOKEN });
    const { container } = render(<TestApp />);
    const content = within(container);
    const form = container.querySelector("form")!;

    fireEvent.submit(form);
    expect(content.getByRole("alert")).toHaveTextContent(
      "Please check your email and password.",
    );
    enterCredentials(container, {
      email: "person@example.com",
      password: "password",
    });
    fireEvent.submit(form);

    expect(await content.findByRole("status")).toHaveTextContent("Login successful.");
    expect(content.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("does not update authentication after the form unmounts during a request", async () => {
    let resolveLogin!: (response: LoginResponse) => void;
    mockedLogin.mockReturnValue(
      new Promise((resolve) => {
        resolveLogin = resolve;
      }),
    );
    function UnmountableForm() {
      const [visible, setVisible] = useState(true);
      return (
        <AuthProvider>
          <MemoryRouter initialEntries={["/login"]}>
            {visible ? <LoginForm /> : <p>Form unmounted</p>}
            <AuthStateProbe />
            <button type="button" onClick={() => setVisible(false)}>
              Unmount login form
            </button>
          </MemoryRouter>
        </AuthProvider>
      );
    }
    const { container } = render(<UnmountableForm />);
    const content = within(container);
    enterCredentials(container, {
      email: "person@example.com",
      password: "password",
    });
    fireEvent.submit(container.querySelector("form")!);
    fireEvent.click(content.getByRole("button", { name: "Unmount login form" }));

    await act(async () => resolveLogin({ accessToken: TEST_TOKEN }));
    expect(content.getByText("Form unmounted")).toBeInTheDocument();
    expect(content.getByTestId("auth-state")).toHaveTextContent("no-token");
  });
});
