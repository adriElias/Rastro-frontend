import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AuthContext } from "@/auth/AuthContext";
import { registerAccessTokenReader } from "@/services/apiClient";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setTokenState] = useState<string | null>(null);
  const accessTokenRef = useRef<string | null>(null);

  const setAccessToken = useCallback((token: string) => {
    const nextToken = token.length > 0 ? token : null;
    accessTokenRef.current = nextToken;
    setTokenState(nextToken);
  }, []);

  const logout = useCallback(() => {
    accessTokenRef.current = null;
    setTokenState(null);
  }, []);

  useEffect(
    () => registerAccessTokenReader(() => accessTokenRef.current),
    [],
  );

  const value = useMemo(
    () => ({
      hasAccessToken: accessToken !== null,
      setAccessToken,
      logout,
    }),
    [accessToken, setAccessToken, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
