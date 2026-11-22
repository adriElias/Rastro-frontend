import {
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { AuthContext } from "@/auth/AuthContext";
import {
  clearAccessToken,
  getAccessToken,
  initializeAccessToken,
  setAccessToken,
  subscribeToAccessToken,
} from "@/auth/authTokenStore";

export function AuthProvider({ children }: { children: ReactNode }) {
  const initializedRef = useRef(false);
  const getInitializedToken = () => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      initializeAccessToken();
    }
    return getAccessToken();
  };
  const accessToken = useSyncExternalStore(
    subscribeToAccessToken,
    getInitializedToken,
    () => null,
  );

  const value = useMemo(
    () => ({
      hasAccessToken: accessToken !== null,
      setAccessToken,
      logout: clearAccessToken,
    }),
    [accessToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
