import {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type InternalAxiosRequestConfig,
} from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { clearAccessToken, setAccessToken } from "@/auth/authTokenStore";
import { apiClient } from "@/services/apiClient";

function encode(value: unknown) {
  return btoa(JSON.stringify(value)).replaceAll("=", "");
}

function validToken() {
  return `${encode({ alg: "HS256" })}.${encode({ exp: Math.floor(Date.now() / 1000) + 900 })}.signature`;
}

function responseError(status: number, config: InternalAxiosRequestConfig) {
  return new AxiosError("Request failed", undefined, config, undefined, {
    status,
    statusText: "Unauthorized",
    headers: new AxiosHeaders(),
    config,
    data: { code: "AUTHENTICATION_FAILED" },
  });
}

afterEach(() => {
  clearAccessToken();
  vi.restoreAllMocks();
});

describe("apiClient authentication", () => {
  it("uses the current token and clears it after an authenticated 401", async () => {
    const accessToken = validToken();
    setAccessToken(accessToken);
    let requestConfig!: InternalAxiosRequestConfig;
    const adapter: AxiosAdapter = async (config) => {
      requestConfig = config;
      throw responseError(401, config);
    };

    await expect(apiClient.request({ url: "/v1/reports", method: "get", adapter })).rejects.toThrow(
      "Request failed",
    );
    expect(requestConfig.headers.get("Authorization")).toBe(`Bearer ${accessToken}`);
    expect(localStorage.getItem("rastro.accessToken")).toBeNull();
  });

  it("does not clear a session for a 401 without an Authorization header", async () => {
    const accessToken = validToken();
    setAccessToken(accessToken);
    const adapter: AxiosAdapter = async (config) => {
      const error = responseError(401, config);
      if (config.headers.get("Authorization")) {
        throw error;
      }
      throw error;
    };

    await expect(
      apiClient.request({
        url: "/v1/auth/login",
        method: "post",
        data: {},
        adapter,
      }),
    ).rejects.toBeInstanceOf(AxiosError);
    expect(localStorage.getItem("rastro.accessToken")).toBe(accessToken);
  });

  it("keeps public auth requests free of Bearer authorization", async () => {
    setAccessToken(validToken());
    let requestConfig!: InternalAxiosRequestConfig;
    const adapter: AxiosAdapter = async (config) => {
      requestConfig = config;
      return {
        data: {},
        status: 200,
        statusText: "OK",
        headers: new AxiosHeaders(),
        config,
      };
    };

    await apiClient.post("/v1/auth/register", {}, { adapter });
    expect(requestConfig.headers.get("Authorization")).toBeUndefined();
  });

  it("does not send the token to another origin", async () => {
    setAccessToken(validToken());
    let requestConfig!: InternalAxiosRequestConfig;
    const adapter: AxiosAdapter = async (config) => {
      requestConfig = config;
      return {
        data: {},
        status: 200,
        statusText: "OK",
        headers: new AxiosHeaders(),
        config,
      };
    };

    await apiClient.request({
      baseURL: "https://external.example",
      url: "/resource",
      method: "get",
      adapter,
    });
    expect(requestConfig.headers.get("Authorization")).toBeUndefined();
  });
});
