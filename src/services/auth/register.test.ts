import {
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/services/apiClient";
import {
  register,
  RegisterApiError,
  type RegisterRequest,
  type RegisterResponse,
} from "@/services/auth/register";

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

const requiredRequest: RegisterRequest = {
  name: "Adriana",
  lastName: "Elias",
  email: "  Adriana@Example.COM  ",
  password: "  Valid1  ",
};

const publicResponse: RegisterResponse = {
  id: "b5c8610d-93c4-4b82-97e1-1a5873cbaf5a",
  name: "Adriana",
  lastName: "Elias",
  email: "adriana@example.com",
  phoneNumber: "+34600111222",
  registrationDate: "2026-11-02T15:30:00Z",
};

describe("register API service", () => {
  it("posts only allowed fields to the Register endpoint and returns public user data", async () => {
    const post = vi.spyOn(apiClient, "post").mockResolvedValue({
      status: 201,
      data: {
        ...publicResponse,
        accessToken: "must-not-be-exposed",
        role: "ADMIN",
        accountStatus: "BLOCKED",
      },
    } as unknown as AxiosResponse<RegisterResponse>);
    const request = {
      ...requiredRequest,
      phoneNumber: "+34600111222",
      confirmPassword: "  Valid1  ",
      role: "ADMIN",
      accountStatus: "BLOCKED",
    } as RegisterRequest & {
      confirmPassword: string;
      role: string;
      accountStatus: string;
    };

    const result = await register(request);

    expect(post).toHaveBeenCalledOnce();
    expect(post).toHaveBeenCalledWith("/v1/auth/register", {
      name: "Adriana",
      lastName: "Elias",
      email: "  Adriana@Example.COM  ",
      password: "  Valid1  ",
      phoneNumber: "+34600111222",
    });
    expect(result).toEqual(publicResponse);
    expect(result).not.toHaveProperty("accessToken");
    expect(result).not.toHaveProperty("role");
    expect(result).not.toHaveProperty("accountStatus");
  });

  it.each([undefined, "", "   "])(
    "omits an empty optional phone number (%s)",
    async (phoneNumber) => {
      const post = vi.spyOn(apiClient, "post").mockResolvedValue({
        status: 201,
        data: { ...publicResponse, phoneNumber: null },
      } as AxiosResponse<RegisterResponse>);

      await register({ ...requiredRequest, phoneNumber });

      expect(post).toHaveBeenCalledWith("/v1/auth/register", requiredRequest);
    },
  );

  it("preserves a non-empty optional phone number exactly", async () => {
    const post = vi.spyOn(apiClient, "post").mockResolvedValue({
      status: 201,
      data: publicResponse,
    } as AxiosResponse<RegisterResponse>);
    const phoneNumber = "  +34 600 111 222  ";

    await register({ ...requiredRequest, phoneNumber });

    expect(post).toHaveBeenCalledWith("/v1/auth/register", {
      ...requiredRequest,
      phoneNumber,
    });
  });

  it("does not write registration data or tokens to browser storage", async () => {
    const localSetItem = vi.spyOn(localStorage, "setItem");
    const sessionSetItem = vi.spyOn(sessionStorage, "setItem");
    vi.spyOn(apiClient, "post").mockResolvedValue({
      status: 201,
      data: publicResponse,
    } as AxiosResponse<RegisterResponse>);

    await register(requiredRequest);

    expect(localSetItem).not.toHaveBeenCalled();
    expect(sessionSetItem).not.toHaveBeenCalled();
  });

  it("maps INVALID_REQUEST to a safe typed API error", async () => {
    vi.spyOn(apiClient, "post").mockRejectedValue(
      createResponseError(400, {
        code: "INVALID_REQUEST",
        message: "Internal validation detail",
      }),
    );

    await expect(register(requiredRequest)).rejects.toMatchObject({
      name: "RegisterApiError",
      code: "INVALID_REQUEST",
      status: 400,
      message: "The registration request is invalid.",
    });
  });

  it("maps EMAIL_ALREADY_REGISTERED to a safe typed API error", async () => {
    vi.spyOn(apiClient, "post").mockRejectedValue(
      createResponseError(409, {
        code: "EMAIL_ALREADY_REGISTERED",
        message: "Internal persistence detail",
      }),
    );

    const result = register(requiredRequest);
    await expect(result).rejects.toBeInstanceOf(RegisterApiError);
    await expect(result).rejects.toMatchObject({
      code: "EMAIL_ALREADY_REGISTERED",
      status: 409,
      message: "Email already registered.",
    });
  });

  it("maps Axios network failures to a typed network error", async () => {
    vi.spyOn(apiClient, "post").mockRejectedValue(
      new AxiosError("Network Error", "ERR_NETWORK"),
    );

    await expect(register(requiredRequest)).rejects.toMatchObject({
      name: "RegisterApiError",
      code: "NETWORK_ERROR",
      status: undefined,
      message:
        "Unable to connect to RASTRO. Please check your connection and try again.",
    });
  });

  it("maps unknown backend responses without exposing transport details", async () => {
    vi.spyOn(apiClient, "post").mockRejectedValue(
      createResponseError(503, {
        code: "DATABASE_UNAVAILABLE",
        message: "private database detail",
      }),
    );

    await expect(register(requiredRequest)).rejects.toMatchObject({
      name: "RegisterApiError",
      code: "REQUEST_FAILED",
      status: 503,
      message: "Unable to complete the registration request.",
    });
  });

  it("maps unexpected non-Axios failures to a generic request error", async () => {
    vi.spyOn(apiClient, "post").mockRejectedValue(new Error("private detail"));

    await expect(register(requiredRequest)).rejects.toMatchObject({
      name: "RegisterApiError",
      code: "REQUEST_FAILED",
      status: undefined,
      message: "Unable to complete the registration request.",
    });
  });
});
