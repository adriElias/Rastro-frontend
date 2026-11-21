import { cleanup, fireEvent, render, waitFor, within } from "@testing-library/react";
import { useMemo, useState, type ReactNode } from "react";
import {
  MemoryRouter,
  useLocation,
  useNavigate,
  type InitialEntry,
} from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { AuthContext } from "@/auth/AuthContext";
import { AppRouter } from "@/router/AppRouter";

function LocationProbe() {
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: unknown } | null)?.returnTo;

  return (
    <div>
      <span data-testid="current-path">{location.pathname}</span>
      <span data-testid="return-to">
        {typeof returnTo === "string" ? returnTo : "no-return"}
      </span>
    </div>
  );
}

function BackButton() {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate(-1)}>
      Go back in history
    </button>
  );
}

function TestAuthProvider({
  children,
  initiallyAuthenticated = false,
}: {
  children: ReactNode;
  initiallyAuthenticated?: boolean;
}) {
  const [hasAccessToken, setHasAccessToken] = useState(initiallyAuthenticated);
  const value = useMemo(
    () => ({
      hasAccessToken,
      setAccessToken: () => setHasAccessToken(true),
      logout: () => setHasAccessToken(false),
    }),
    [hasAccessToken],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <button type="button" onClick={() => setHasAccessToken(true)}>
        Authenticate for test
      </button>
    </AuthContext.Provider>
  );
}

function renderRouter({
  entries,
  initialIndex,
  authenticated = false,
}: {
  entries: InitialEntry[];
  initialIndex?: number;
  authenticated?: boolean;
}) {
  return render(
    <MemoryRouter initialEntries={entries} initialIndex={initialIndex}>
      <TestAuthProvider initiallyAuthenticated={authenticated}>
        <AppRouter />
        <LocationProbe />
        <BackButton />
      </TestAuthProvider>
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
});

describe("AppRouter report routes", () => {
  it("keeps the report type selection page public", () => {
    const { container } = renderRouter({ entries: ["/report"] });
    const content = within(container);

    expect(
      content.getByRole("heading", { level: 1, name: "What happened?" }),
    ).toBeInTheDocument();
    expect(content.getByTestId("current-path")).toHaveTextContent("/report");
  });

  it.each(["/report/lost", "/report/found"])(
    "redirects an unauthenticated visit to %s through login and preserves the destination",
    (destination) => {
      const { container } = renderRouter({ entries: [destination] });
      const content = within(container);

      expect(
        content.getByRole("heading", { name: "Good to see you again" }),
      ).toBeInTheDocument();
      expect(content.getByTestId("current-path")).toHaveTextContent("/login");
      expect(content.getByTestId("return-to")).toHaveTextContent(destination);
    },
  );

  it.each(["/report/lost", "/report/found"])(
    "allows an authenticated visit to %s and renders the temporary fallback",
    (destination) => {
      const { container } = renderRouter({
        entries: [destination],
        authenticated: true,
      });
      const content = within(container);

      expect(
        content.getByRole("heading", { name: "Página todavía no disponible" }),
      ).toBeInTheDocument();
      expect(content.getByTestId("current-path")).toHaveTextContent(destination);
      expect(
        content.queryByRole("heading", { name: "Good to see you again" }),
      ).not.toBeInTheDocument();
    },
  );

  it("uses replacement navigation so login return and browser back do not loop", async () => {
    const { container } = renderRouter({
      entries: ["/previous", "/report/lost"],
      initialIndex: 1,
    });
    const content = within(container);

    expect(content.getByTestId("current-path")).toHaveTextContent("/login");
    fireEvent.click(content.getByRole("button", { name: "Authenticate for test" }));
    await waitFor(() =>
      expect(content.getByTestId("current-path")).toHaveTextContent("/report/lost"),
    );

    fireEvent.click(content.getByRole("button", { name: "Go back in history" }));
    await waitFor(() =>
      expect(content.getByTestId("current-path")).toHaveTextContent("/previous"),
    );
    expect(
      content.queryByRole("heading", { name: "Good to see you again" }),
    ).not.toBeInTheDocument();
  });
});
