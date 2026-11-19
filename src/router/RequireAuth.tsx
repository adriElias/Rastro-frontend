import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/auth/useAuth";

export function RequireAuth() {
  const { hasAccessToken } = useAuth();
  const location = useLocation();

  if (!hasAccessToken) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ returnTo: location.pathname }}
      />
    );
  }

  return <Outlet />;
}
