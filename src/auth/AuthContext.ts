import { createContext } from "react";

export interface AuthContextValue {
  /** Indicates an in-memory token is present; it is not server verification. */
  hasAccessToken: boolean;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
