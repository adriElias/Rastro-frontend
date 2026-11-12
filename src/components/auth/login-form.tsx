import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/auth/field";
import { action } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { login, LoginApiError } from "@/services/auth/login";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export function LoginForm() {
  const { setAccessToken } = useAuth();
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    setError(undefined);
    setStatus(undefined);
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    if (!EMAIL_PATTERN.test(email) || password.length === 0) {
      setError("Please check your email and password.");
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      const response = await login({ email, password });
      if (!mountedRef.current) return;
      setAccessToken(response.accessToken);
      setStatus("Login successful.");
    } catch (requestError) {
      if (!mountedRef.current) return;
      setError(
        requestError instanceof LoginApiError
          ? requestError.message
          : "Unable to complete the login request.",
      );
    } finally {
      submittingRef.current = false;
      if (mountedRef.current) setIsSubmitting(false);
    }
  }

  function clearStatus() {
    if (status) setStatus(undefined);
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <p className="text-sm font-extrabold uppercase tracking-widest text-primary">
        Welcome back
      </p>
      <h1 className="mt-2 text-4xl font-extrabold">Good to see you again</h1>
      <p className="mt-3 text-muted-foreground">
        Log in to follow your alerts and help pets near you.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-busy={isSubmitting}
        className="mt-8 flex flex-col gap-5"
      >
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          onChange={clearStatus}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          onChange={clearStatus}
          hint={
            <Link to="/login" className="text-sm font-bold text-primary hover:underline">
              Forgot password?
            </Link>
          }
        />
        {error ? (
          <p
            role="alert"
            className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
          >
            {error}
          </p>
        ) : null}
        {status ? (
          <p
            role="status"
            className="rounded-2xl bg-muted px-4 py-3 text-sm font-semibold text-foreground"
          >
            {status}
          </p>
        ) : null}
        <Button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className={cn(action({ size: "lg" }), "mt-2 w-full")}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              Logging in…
            </>
          ) : (
            "Log in"
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-muted-foreground">
        New to RASTRO?{" "}
        <Link to="/register" className="font-bold text-primary hover:underline">
          Create a free account
        </Link>
      </p>
    </div>
  );
}
