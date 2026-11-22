import axios, {
  AxiosHeaders,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  clearAccessTokenIfCurrent,
  getAccessToken,
} from "@/auth/authTokenStore";

export const apiClient = axios.create({
  baseURL: "/api",
});

function requestUrl(config: InternalAxiosRequestConfig) {
  if (typeof window === "undefined") return null;

  try {
    return new URL(apiClient.getUri(config), window.location.origin);
  } catch {
    return null;
  }
}

apiClient.interceptors.request.use((config) => {
  const headers = AxiosHeaders.from(config.headers);
  config.headers = headers;

  const url = requestUrl(config);
  if (!url || typeof window === "undefined" || url.origin !== window.location.origin) {
    headers.delete("Authorization");
    return config;
  }

  const apiBase = new URL(apiClient.defaults.baseURL ?? "/api", window.location.origin);
  const apiPath = apiBase.pathname.replace(/\/$/, "");
  const isApiRequest = url.pathname === apiPath || url.pathname.startsWith(`${apiPath}/`);
  if (!isApiRequest) {
    headers.delete("Authorization");
    return config;
  }

  const isPublicAuthRequest =
    config.method?.toLowerCase() === "post" &&
    (url.pathname === `${apiPath}/v1/auth/login` ||
      url.pathname === `${apiPath}/v1/auth/register`);
  if (isPublicAuthRequest) {
    headers.delete("Authorization");
    return config;
  }

  const token = getAccessToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    headers.delete("Authorization");
  }

  return config;
});

apiClient.interceptors.response.use(undefined, (error: AxiosError) => {
  if (error.response?.status !== 401 || !error.config) {
    return Promise.reject(error);
  }

  const headers = AxiosHeaders.from(error.config.headers);
  const authorization = headers.get("Authorization");
  const token = typeof authorization === "string" && authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (token) clearAccessTokenIfCurrent(token);
  return Promise.reject(error);
});
