import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "@/auth/AuthProvider";
import { LoginPage } from "@/pages/LoginPage";
import { login, LoginApiError } from "@/services/auth/login";

vi.mock("@/services/auth/login", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/services/auth/login")>();
  return { ...actual, login: vi.fn() };
});

const mockedLogin = vi.mocked(login);

function CurrentPath() {
  return <span data-testid="current-path">{useLocation().pathname}</span>;
}

function renderLogin(state?: unknown) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[{ pathname: "/login", state }]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/report/lost" element={<p>Lost report destination</p>} />
          <Route path="/report/found" element={<p>Found report destination</p>} />
        </Routes>
        <CurrentPath />
      </MemoryRouter>
    </AuthProvider>,
  );
}

function submitValidCredentials(container: HTMLElement) {
  const content = within(container);
  fireEvent.change(content.getByLabelText("Email"), {
    target: { value: "person@example.com" },
  });
  fireEvent.change(content.getByLabelText("Password"), {
    target: { value: "password" },
  });
  fireEvent.submit(container.querySelector("form")!);
}

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  mockedLogin.mockReset();
});

describe("LoginPage return navigation", () => {
  it.each([
    [
      "/report/lost",
      "Log in to create a lost pet report. You'll continue where you left off after logging in.",
    ],
    [
      "/report/found",
      "Log in to create a found pet report. You'll continue where you left off after logging in.",
    ],
  ])("explains why login is required for %s", (returnTo, message) => {
    const { container } = renderLogin({ returnTo });
    const guidance = within(container).getByRole("complementary", {
      name: "Login required",
    });

    expect(guidance).toHaveTextContent(message);
  });

  it("returns to the selected reporting route after successful login", async () => {
    mockedLogin.mockResolvedValue({ accessToken: "test-access-token" });
    const { container } = renderLogin({ returnTo: "/report/found" });

    submitValidCredentials(container);

    expect(await within(container).findByText("Found report destination")).toBeInTheDocument();
    expect(within(container).getByTestId("current-path")).toHaveTextContent(
      "/report/found",
    );
  });

  it("preserves direct-login behavior when there is no return destination", async () => {
    mockedLogin.mockResolvedValue({ accessToken: "test-access-token" });
    const { container } = renderLogin();
    const content = within(container);

    expect(
      content.queryByRole("complementary", { name: "Login required" }),
    ).not.toBeInTheDocument();

    submitValidCredentials(container);

    expect(await content.findByRole("status")).toHaveTextContent("Login successful.");
    expect(content.getByTestId("current-path")).toHaveTextContent("/login");
  });

  it.each([
    { returnTo: "https://external.example/report" },
    { returnTo: "//external.example/report" },
    { returnTo: "/dashboard" },
    { returnTo: 42 },
  ])("ignores an unsafe or unsupported return destination", async (state) => {
    mockedLogin.mockResolvedValue({ accessToken: "test-access-token" });
    const { container } = renderLogin(state);
    const content = within(container);

    expect(
      content.queryByRole("complementary", { name: "Login required" }),
    ).not.toBeInTheDocument();

    submitValidCredentials(container);

    expect(await content.findByRole("status")).toHaveTextContent("Login successful.");
    expect(content.getByTestId("current-path")).toHaveTextContent("/login");
  });

  it("keeps the pending destination after a failed login", async () => {
    mockedLogin.mockRejectedValue(
      new LoginApiError("AUTHENTICATION_FAILED", "Authentication failed.", 401),
    );
    const { container } = renderLogin({ returnTo: "/report/lost" });
    const content = within(container);

    submitValidCredentials(container);

    expect(await content.findByRole("alert")).toHaveTextContent("Authentication failed.");
    expect(content.getByTestId("current-path")).toHaveTextContent("/login");
  });
});
