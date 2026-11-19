import { useEffect } from "react";
import { LockKeyhole } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "@/auth/useAuth";
import { LoginForm } from "@/components/auth/login-form";

type ReportRoute = "/report/lost" | "/report/found";

const reportLoginMessages: Record<ReportRoute, string> = {
  "/report/lost":
    "Log in to create a lost pet report. You'll continue where you left off after logging in.",
  "/report/found":
    "Log in to create a found pet report. You'll continue where you left off after logging in.",
};

function getReportReturnTo(state: unknown): ReportRoute | undefined {
  if (typeof state !== "object" || state === null) return undefined;

  const returnTo = (state as { returnTo?: unknown }).returnTo;
  return returnTo === "/report/lost" || returnTo === "/report/found"
    ? returnTo
    : undefined;
}

export function LoginPage() {
  const { hasAccessToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = getReportReturnTo(location.state);
  const contextMessage = returnTo ? reportLoginMessages[returnTo] : undefined;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Log in · RASTRO";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    if (hasAccessToken && returnTo) {
      navigate(returnTo, { replace: true });
    }
  }, [hasAccessToken, navigate, returnTo]);

  return (
    <>
      {contextMessage ? (
        <aside
          aria-label="Login required"
          className="mb-6 flex items-start gap-3 rounded-2xl border border-border bg-accent px-4 py-4"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary">
            <LockKeyhole className="size-5" aria-hidden="true" />
          </span>
          <p className="pt-1 text-sm font-semibold leading-relaxed text-accent-foreground">
            {contextMessage}
          </p>
        </aside>
      ) : null}
      <LoginForm />
    </>
  );
}
