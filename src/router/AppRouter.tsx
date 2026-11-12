import { Link, Route, Routes } from "react-router";
import { AuthLayout } from "@/layouts/AuthLayout";
import { MainLayout } from "@/layouts/MainLayout";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";

function PageNotAvailable() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <h1 className="text-3xl font-bold">
        Página todavía no disponible
      </h1>
      <p className="mt-4">
        Estamos trabajando en esta funcionalidad de Rastro.
      </p>
      <Link to="/" className="mt-6 inline-block underline">
        Volver al inicio
      </Link>
    </section>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="*" element={<PageNotAvailable />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
    
  );
}
