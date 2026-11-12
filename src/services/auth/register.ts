import axios from "axios";
import { apiClient } from "@/services/apiClient";

export interface RegisterRequest {
  name: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface RegisterResponse {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  registrationDate: string;
}

export type RegisterApiErrorCode =
  | "INVALID_REQUEST"
  | "EMAIL_ALREADY_REGISTERED"
  | "NETWORK_ERROR"
  | "REQUEST_FAILED";

export class RegisterApiError extends Error {
  readonly code: RegisterApiErrorCode;
  readonly status?: number;

  constructor(
    code: RegisterApiErrorCode,
    message: string,
    status?: number,
  ) {
    super(message);
    this.name = "RegisterApiError";
    this.code = code;
    this.status = status;
  }
}

interface BackendErrorResponse {
  code?: string;
}

function toRegisterApiError(error: unknown): RegisterApiError {
  if (!axios.isAxiosError<BackendErrorResponse>(error)) {
    return new RegisterApiError(
      "REQUEST_FAILED",
      "Unable to complete the registration request.",
    );
  }

  const response = error.response;
  if (!response) {
    return new RegisterApiError(
      "NETWORK_ERROR",
      "Unable to connect to RASTRO. Please check your connection and try again.",
    );
  }

  const { status, data } = response;
  if (status === 400 && data?.code === "INVALID_REQUEST") {
    return new RegisterApiError(
      "INVALID_REQUEST",
      "The registration request is invalid.",
      status,
    );
  }
  if (status === 409 && data?.code === "EMAIL_ALREADY_REGISTERED") {
    return new RegisterApiError(
      "EMAIL_ALREADY_REGISTERED",
      "Email already registered.",
      status,
    );
  }

  return new RegisterApiError(
    "REQUEST_FAILED",
    "Unable to complete the registration request.",
    status,
  );
}

function publicRegistration(data: RegisterResponse): RegisterResponse {
  const response: RegisterResponse = {
    id: data.id,
    name: data.name,
    lastName: data.lastName,
    email: data.email,
    registrationDate: data.registrationDate,
  };

  if (data.phoneNumber !== undefined) {
    response.phoneNumber = data.phoneNumber;
  }

  return response;
}

export async function register(
  request: RegisterRequest,
): Promise<RegisterResponse> {
  const payload: RegisterRequest = {
    name: request.name,
    lastName: request.lastName,
    email: request.email,
    password: request.password,
  };

  if (request.phoneNumber?.trim()) {
    payload.phoneNumber = request.phoneNumber;
  }

  try {
    const response = await apiClient.post<RegisterResponse>(
      "/v1/auth/register",
      payload,
    );
    return publicRegistration(response.data);
  } catch (error) {
    throw toRegisterApiError(error);
  }
}
