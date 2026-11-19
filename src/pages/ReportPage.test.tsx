import { cleanup, fireEvent, render, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, useLocation } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { AuthContext } from "@/auth/AuthContext";
import { ReportPage } from "@/pages/ReportPage";

function CurrentPath() {
  return <span data-testid="current-path">{useLocation().pathname}</span>;
}

function TestAuthProvider({
  children,
  authenticated = false,
}: {
  children: ReactNode;
  authenticated?: boolean;
}) {
  return (
    <AuthContext.Provider
      value={{
        hasAccessToken: authenticated,
        setAccessToken: () => undefined,
        logout: () => undefined,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

afterEach(() => {
  cleanup();
});

describe("ReportPage", () => {
  it("renders accessible lost and found report options", () => {
    const { container } = render(
      <TestAuthProvider>
        <MemoryRouter>
          <ReportPage />
        </MemoryRouter>
      </TestAuthProvider>,
    );
    const content = within(container);

    expect(
      content.getByRole("heading", { level: 1, name: "What happened?" }),
    ).toBeInTheDocument();

    const lostOption = content.getByRole("link", { name: /report a lost pet/i });
    const foundOption = content.getByRole("link", { name: /report a found pet/i });

    expect(lostOption).toHaveAttribute("href", "/report/lost");
    expect(foundOption).toHaveAttribute("href", "/report/found");

    lostOption.focus();
    expect(lostOption).toHaveFocus();
    foundOption.focus();
    expect(foundOption).toHaveFocus();
  });

  it("navigates to the selected report route with a mouse click", () => {
    const { container } = render(
      <TestAuthProvider>
        <MemoryRouter initialEntries={["/report"]}>
          <ReportPage />
          <CurrentPath />
        </MemoryRouter>
      </TestAuthProvider>,
    );
    const content = within(container);

    fireEvent.click(content.getByRole("link", { name: /report a found pet/i }));

    expect(content.getByTestId("current-path")).toHaveTextContent("/report/found");
  });

  it("shows login guidance below the options when unauthenticated", () => {
    const { container } = render(
      <TestAuthProvider>
        <MemoryRouter>
          <ReportPage />
        </MemoryRouter>
      </TestAuthProvider>,
    );
    const guidance = within(container).getByRole("complementary", {
      name: "Ready to help?",
    });

    expect(within(guidance).getByRole("heading", { name: "Ready to help?" })).toBeInTheDocument();
    expect(guidance).toHaveTextContent(
      "Log in to create a report and help reunite pets with their families.",
    );
  });

  it("hides login guidance when authenticated", () => {
    const { container } = render(
      <TestAuthProvider authenticated>
        <MemoryRouter>
          <ReportPage />
        </MemoryRouter>
      </TestAuthProvider>,
    );

    expect(
      within(container).queryByRole("complementary", { name: "Ready to help?" }),
    ).not.toBeInTheDocument();
  });

  it("sets the document title and restores it on unmount", async () => {
    const previousTitle = "Previous page title";
    document.title = previousTitle;
    const { unmount } = render(
      <TestAuthProvider>
        <MemoryRouter>
          <ReportPage />
        </MemoryRouter>
      </TestAuthProvider>,
    );

    await waitFor(() => expect(document.title).toBe("Create a report · RASTRO"));

    unmount();
    expect(document.title).toBe(previousTitle);
  });
});
