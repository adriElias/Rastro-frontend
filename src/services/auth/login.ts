import axios from "axios";
import { apiClient } from "@/services/apiClient";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export type LoginApiErrorCode =
  | "INVALID_REQUEST"
  | "AUTHENTICATION_FAILED"
  | "NETWORK_ERROR"
  | "REQUEST_FAILED";

export class LoginApiError extends Error {
  readonly code: LoginApiErrorCode;
  readonly status?: number;

  constructor(
    code: LoginApiErrorCode,
    message: string,
    status?: number,
  ) {
    super(message);
    this.name = "LoginApiError";
    this.code = code;
    this.status = status;
  }
}

interface BackendErrorResponse {
  code?: string;
  message?: string;
}

function getBackendMessage(data: unknown, fallback: string) {
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string" &&
    data.message.length > 0
  ) {
    return data.message;
  }
  return fallback;
}

function toLoginApiError(error: unknown): LoginApiError {
  if (!axios.isAxiosError<BackendErrorResponse>(error)) {
    return new LoginApiError(
      "REQUEST_FAILED",
      "Unable to complete the login request.",
    );
  }

  const response = error.response;
  if (!response) {
    return new LoginApiError(
      "NETWORK_ERROR",
      "Unable to connect to RASTRO. Please check your connection and try again.",
    );
  }

  const { status, data } = response;
  if (status === 400 && data?.code === "INVALID_REQUEST") {
    return new LoginApiError(
      "INVALID_REQUEST",
      getBackendMessage(data, "The login request is invalid."),
      status,
    );
  }
  if (status === 401 && data?.code === "AUTHENTICATION_FAILED") {
    return new LoginApiError(
      "AUTHENTICATION_FAILED",
      getBackendMessage(data, "Authentication failed."),
      status,
    );
  }

  return new LoginApiError(
    "REQUEST_FAILED",
    "Unable to complete the login request.",
    status,
  );
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<LoginResponse>(
      "/v1/auth/login",
      credentials,
    );
    return response.data;
  } catch (error) {
    throw toLoginApiError(error);
  }
}
