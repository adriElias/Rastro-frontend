import { Outlet } from "react-router";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function MainLayout() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="min-h-[calc(100dvh-4rem)]">
        <Outlet />
      </main>
      <SiteFooter />
      <MobileNav />
    </>
  );
}
