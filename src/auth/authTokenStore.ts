export const ACCESS_TOKEN_STORAGE_KEY = "rastro.accessToken";

type Listener = () => void;

let currentToken: string | null = null;
const listeners = new Set<Listener>();
let expirationTimer: ReturnType<typeof setTimeout> | undefined;

function notify() {
  listeners.forEach((listener) => listener());
}

function safeStorage() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function decodePayload(token: string): unknown {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const normalized = parts[1].replaceAll("-", "+").replaceAll("_", "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function expiration(token: string) {
  const payload = decodePayload(token);
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return null;
  }

  const exp = (payload as { exp?: unknown }).exp;
  return typeof exp === "number" && Number.isFinite(exp) ? exp : null;
}

export function isValidAccessToken(token: string) {
  const exp = expiration(token);
  return token.length > 0 && exp !== null && exp > Date.now() / 1000;
}

function clearExpirationTimer() {
  if (expirationTimer !== undefined) {
    clearTimeout(expirationTimer);
    expirationTimer = undefined;
  }
}

function scheduleExpiration(token: string) {
  clearExpirationTimer();
  const exp = expiration(token);
  if (exp === null) return;

  const delay = Math.min(Math.max(0, exp * 1000 - Date.now()), 2_147_483_647);
  expirationTimer = setTimeout(() => {
    if (currentToken !== token) return;
    if (isValidAccessToken(token)) {
      scheduleExpiration(token);
    } else {
      clearAccessTokenIfCurrent(token);
    }
  }, delay);
}

function removePersistedToken() {
  const storage = safeStorage();
  if (!storage) return;
  try {
    storage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    // Memory state must still be cleared when browser storage is unavailable.
  }
}

export function getAccessToken() {
  return currentToken;
}

export function initializeAccessToken() {
  const storage = safeStorage();
  let persistedToken: string | null = null;
  try {
    persistedToken = storage?.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? null;
  } catch {
    // Storage failures result in a memory-only session.
  }

  if (persistedToken && isValidAccessToken(persistedToken)) {
    currentToken = persistedToken;
    scheduleExpiration(persistedToken);
    return currentToken;
  }

  currentToken = null;
  removePersistedToken();
  clearExpirationTimer();
  return null;
}

export function setAccessToken(token: string) {
  if (!isValidAccessToken(token)) return false;

  currentToken = token;
  scheduleExpiration(token);
  const storage = safeStorage();
  try {
    storage?.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  } catch {
    // An in-memory session remains available when persistence is unavailable.
  }
  notify();
  return true;
}

export function clearAccessToken() {
  currentToken = null;
  clearExpirationTimer();
  removePersistedToken();
  notify();
}

export function clearAccessTokenIfCurrent(token: string) {
  if (currentToken !== token) return false;
  clearAccessToken();
  return true;
}

export function subscribeToAccessToken(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== ACCESS_TOKEN_STORAGE_KEY) return;

    if (event.newValue && isValidAccessToken(event.newValue)) {
      currentToken = event.newValue;
      scheduleExpiration(event.newValue);
      notify();
      return;
    }

    currentToken = null;
    clearExpirationTimer();
    if (event.newValue !== null) removePersistedToken();
    notify();
  });
}
