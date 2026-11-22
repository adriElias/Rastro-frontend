import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  clearAccessToken,
  clearAccessTokenIfCurrent,
  getAccessToken,
  initializeAccessToken,
  isValidAccessToken,
  setAccessToken,
  subscribeToAccessToken,
} from "@/auth/authTokenStore";

function encode(value: unknown) {
  return btoa(JSON.stringify(value))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function token(exp: number, subject = "user") {
  return `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ sub: subject, exp })}.signature`;
}

const validToken = () => token(Math.floor(Date.now() / 1000) + 900);

beforeEach(() => {
  localStorage.clear();
  clearAccessToken();
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  clearAccessToken();
});

describe("authTokenStore", () => {
  it("accepts and persists a valid unexpired JWT", () => {
    const accessToken = validToken();

    expect(isValidAccessToken(accessToken)).toBe(true);
    expect(setAccessToken(accessToken)).toBe(true);
    expect(getAccessToken()).toBe(accessToken);
    expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBe(accessToken);
  });

  it.each([
    "",
    "not-a-jwt",
    "one.two",
    "one.two.three.four",
    `${encode({ alg: "HS256" })}.not-json.signature`,
    `${encode({ alg: "HS256" })}.${encode({ sub: "user" })}.signature`,
    `${encode({ alg: "HS256" })}.${encode({ exp: "later" })}.signature`,
  ])("rejects malformed or incomplete token %s", (accessToken) => {
    expect(isValidAccessToken(accessToken)).toBe(false);
    expect(setAccessToken(accessToken)).toBe(false);
    expect(getAccessToken()).toBeNull();
    expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBeNull();
  });

  it("removes an expired token during initialization", () => {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token(Math.floor(Date.now() / 1000) - 1));

    expect(initializeAccessToken()).toBeNull();
    expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBeNull();
  });

  it("synchronizes valid and cleared tokens from other tabs", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToAccessToken(listener);
    const accessToken = validToken();

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: ACCESS_TOKEN_STORAGE_KEY,
        newValue: accessToken,
        storageArea: localStorage,
      }),
    );
    expect(getAccessToken()).toBe(accessToken);
    expect(listener).toHaveBeenCalledOnce();

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: ACCESS_TOKEN_STORAGE_KEY,
        newValue: null,
        storageArea: localStorage,
      }),
    );
    expect(getAccessToken()).toBeNull();
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
  });

  it("rejects an invalid token received from another tab", () => {
    setAccessToken(validToken());

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: ACCESS_TOKEN_STORAGE_KEY,
        newValue: "invalid-token",
        storageArea: localStorage,
      }),
    );

    expect(getAccessToken()).toBeNull();
    expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBeNull();
  });

  it("clears memory even when localStorage removal fails during logout", () => {
    setAccessToken(validToken());
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    });

    expect(() => clearAccessToken()).not.toThrow();
    expect(getAccessToken()).toBeNull();
  });

  it("only clears the token that caused a 401", () => {
    const oldToken = token(Math.floor(Date.now() / 1000) + 900, "old-user");
    const newToken = token(Math.floor(Date.now() / 1000) + 900, "new-user");
    setAccessToken(newToken);

    expect(clearAccessTokenIfCurrent(oldToken)).toBe(false);
    expect(getAccessToken()).toBe(newToken);
    expect(clearAccessTokenIfCurrent(newToken)).toBe(true);
    expect(getAccessToken()).toBeNull();
  });
});
