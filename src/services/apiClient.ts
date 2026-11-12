import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
});

type AccessTokenReader = () => string | null;

let accessTokenReader: AccessTokenReader = () => null;

export function registerAccessTokenReader(reader: AccessTokenReader) {
  accessTokenReader = reader;

  return () => {
    if (accessTokenReader === reader) {
      accessTokenReader = () => null;
    }
  };
}

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

  const token = accessTokenReader();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    headers.delete("Authorization");
  }

  return config;
});
