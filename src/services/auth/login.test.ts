import {
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/services/apiClient";
import { login, LoginApiError } from "@/services/auth/login";

afterEach(() => {
  vi.restoreAllMocks();
});

function createResponseError(status: number, data: unknown) {
  const error = new AxiosError("Request failed");
  error.response = {
    status,
    statusText: "Request failed",
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() } as InternalAxiosRequestConfig,
    data,
  } as AxiosResponse;
  return error;
}

describe("login API service", () => {
  it("uses the shared API base URL", () => {
    expect(apiClient.defaults.baseURL).toBe("/api");
  });

  it("posts the exact email and password and returns only accessToken", async () => {
    const post = vi.spyOn(apiClient, "post").mockResolvedValue({
      data: { accessToken: "signed.jwt.value" },
    } as AxiosResponse<{ accessToken: string }>);
    const credentials = {
      email: "person@example.com",
      password: "  exact password  ",
    };

    await expect(login(credentials)).resolves.toEqual({
      accessToken: "signed.jwt.value",
    });
    expect(post).toHaveBeenCalledOnce();
    expect(post).toHaveBeenCalledWith("/v1/auth/login", credentials);
  });

  it("maps INVALID_REQUEST responses to a typed API error", async () => {
    vi.spyOn(apiClient, "post").mockRejectedValue(
      createResponseError(400, {
        code: "INVALID_REQUEST",
        message: "The login request is invalid",
      }),
    );

    await expect(login({ email: "", password: "" })).rejects.toMatchObject({
      name: "LoginApiError",
      code: "INVALID_REQUEST",
      status: 400,
      message: "The login request is invalid",
    });
  });

  it("maps AUTHENTICATION_FAILED responses without exposing transport details", async () => {
    vi.spyOn(apiClient, "post").mockRejectedValue(
      createResponseError(401, {
        code: "AUTHENTICATION_FAILED",
        message: "Authentication failed",
      }),
    );

    const result = login({ email: "person@example.com", password: "wrong" });
    await expect(result).rejects.toBeInstanceOf(LoginApiError);
    await expect(result).rejects.toMatchObject({
      code: "AUTHENTICATION_FAILED",
      status: 401,
      message: "Authentication failed",
    });
  });

  it("maps Axios network failures to a typed network error", async () => {
    vi.spyOn(apiClient, "post").mockRejectedValue(
      new AxiosError("Network Error", "ERR_NETWORK"),
    );

    await expect(
      login({ email: "person@example.com", password: "secret" }),
    ).rejects.toMatchObject({
      name: "LoginApiError",
      code: "NETWORK_ERROR",
      status: undefined,
    });
  });

  it("maps unexpected non-Axios failures to a generic request error", async () => {
    vi.spyOn(apiClient, "post").mockRejectedValue(new Error("private detail"));

    await expect(
      login({ email: "person@example.com", password: "secret" }),
    ).rejects.toMatchObject({
      name: "LoginApiError",
      code: "REQUEST_FAILED",
      message: "Unable to complete the login request.",
    });
  });
});
