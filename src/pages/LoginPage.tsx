import { useEffect } from "react";
import { LoginForm } from "@/components/auth/login-form";

export function LoginPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Log in · RASTRO";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return <LoginForm />;
}
