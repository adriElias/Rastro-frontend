import { useEffect } from "react";
import { RegisterForm } from "@/components/auth/register-form";

export function RegisterPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Create account · RASTRO";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return <RegisterForm />;
}
