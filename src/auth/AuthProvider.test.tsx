import { act, cleanup, fireEvent, render, within } from "@testing-library/react";
import {
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "@/auth/AuthProvider";
import { useAuth } from "@/auth/useAuth";
import { apiClient } from "@/services/apiClient";

const TEST_TOKEN = "unit-test-access-token";

function AuthStateProbe() {
  const { hasAccessToken, setAccessToken, logout } = useAuth();

  return (
    <div>
      <span data-testid="auth-state">
        {hasAccessToken ? "token-present" : "no-token"}
      </span>
      <button type="button" onClick={() => setAccessToken(TEST_TOKEN)}>
        Set test token
      </button>
      <button type="button" onClick={logout}>
        Log out
      </button>
    </div>
  );
}

function renderAuthState() {
  return render(
    <AuthProvider>
      <AuthStateProbe />
    </AuthProvider>,
  );
}

async function sendRequest(config: AxiosRequestConfig = {}) {
  let interceptedConfig: InternalAxiosRequestConfig | undefined;
  const adapter: AxiosAdapter = async (requestConfig) => {
    interceptedConfig = requestConfig;
    return {
      data: { ok: true },
      status: 200,
      statusText: "OK",
      headers: new AxiosHeaders(),
      config: requestConfig,
    };
  };

  await apiClient.request({
    url: "/v1/test",
    method: "get",
    ...config,
    adapter,
  });
  return interceptedConfig!;
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("AuthProvider", () => {
  it("starts without a token and never uses persistent browser storage", () => {
    const getItem = vi.spyOn(Storage.prototype, "getItem");
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const removeItem = vi.spyOn(Storage.prototype, "removeItem");
    const { container } = renderAuthState();

    expect(within(container).getByTestId("auth-state")).toHaveTextContent(
      "no-token",
    );
    fireEvent.click(within(container).getByRole("button", { name: "Set test token" }));
    fireEvent.click(within(container).getByRole("button", { name: "Log out" }));
    expect(getItem).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalled();
    expect(removeItem).not.toHaveBeenCalled();
  });

  it("sets and clears the in-memory token through the public context", () => {
    const { container } = renderAuthState();
    const content = within(container);

    fireEvent.click(content.getByRole("button", { name: "Set test token" }));
    expect(content.getByTestId("auth-state")).toHaveTextContent("token-present");

    fireEvent.click(content.getByRole("button", { name: "Log out" }));
    expect(content.getByTestId("auth-state")).toHaveTextContent("no-token");
  });

  it("injects Bearer authorization on same-origin API requests", async () => {
    const { container } = renderAuthState();
    fireEvent.click(within(container).getByRole("button", { name: "Set test token" }));

    const request = await sendRequest({ url: "/v1/reports" });
    expect(request.headers.get("Authorization")).toBe(`Bearer ${TEST_TOKEN}`);
  });

  it("never injects Bearer authorization on the login endpoint", async () => {
    const { container } = renderAuthState();
    fireEvent.click(within(container).getByRole("button", { name: "Set test token" }));

    const request = await sendRequest({
      url: "/v1/auth/login",
      method: "post",
      data: { email: "person@example.com", password: "secret" },
    });
    expect(request.headers.get("Authorization")).toBeUndefined();
  });

  it("never injects Bearer authorization on the register endpoint", async () => {
    const { container } = renderAuthState();
    fireEvent.click(within(container).getByRole("button", { name: "Set test token" }));

    const request = await sendRequest({
      url: "/v1/auth/register",
      method: "post",
      data: {
        name: "Example",
        lastName: "Person",
        email: "person@example.com",
        password: "Valid1",
      },
    });
    expect(request.headers.get("Authorization")).toBeUndefined();
  });

  it.each(["get", "put"])(
    "injects Bearer authorization on %s requests to the register path",
    async (method) => {
      const { container } = renderAuthState();
      fireEvent.click(
        within(container).getByRole("button", { name: "Set test token" }),
      );

      const request = await sendRequest({
        url: "/v1/auth/register",
        method,
      });
      expect(request.headers.get("Authorization")).toBe(`Bearer ${TEST_TOKEN}`);
    },
  );

  it("injects Bearer authorization on paths similar to register", async () => {
    const { container } = renderAuthState();
    fireEvent.click(within(container).getByRole("button", { name: "Set test token" }));

    const request = await sendRequest({
      url: "/v1/auth/register-extra",
      method: "post",
    });
    expect(request.headers.get("Authorization")).toBe(`Bearer ${TEST_TOKEN}`);
  });

  it("does not send the in-memory token to a different origin", async () => {
    const { container } = renderAuthState();
    fireEvent.click(within(container).getByRole("button", { name: "Set test token" }));

    const request = await sendRequest({
      baseURL: "https://external.example",
      url: "/v1/resource",
    });
    expect(request.headers.get("Authorization")).toBeUndefined();
  });

  it("stops injecting the Bearer token immediately after logout", async () => {
    const { container } = renderAuthState();
    const logout = within(container).getByRole("button", { name: "Log out" });
    fireEvent.click(within(container).getByRole("button", { name: "Set test token" }));

    let requestPromise!: ReturnType<typeof sendRequest>;
    act(() => {
      fireEvent.click(logout);
      requestPromise = sendRequest({ url: "/v1/reports" });
    });

    const request = await requestPromise;
    expect(request.headers.get("Authorization")).toBeUndefined();
    expect(within(container).getByTestId("auth-state")).toHaveTextContent(
      "no-token",
    );
  });

  it("does not register duplicate Axios interceptors when provider state changes", () => {
    const interceptorCount = apiClient.interceptors.request.handlers?.length ?? 0;
    const { container } = renderAuthState();
    const setToken = within(container).getByRole("button", { name: "Set test token" });

    fireEvent.click(setToken);
    fireEvent.click(setToken);

    expect(apiClient.interceptors.request.handlers?.length ?? 0).toBe(
      interceptorCount,
    );
  });
});
