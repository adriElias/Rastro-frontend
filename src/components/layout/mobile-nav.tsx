import { Home, Map, Plus, Search, User } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", Icon: Home },
  { href: "/lost", label: "Browse", Icon: Search, match: ["/lost", "/found"] },
  { href: "/report", label: "Report", Icon: Plus, primary: true },
  { href: "/map", label: "Map", Icon: Map },
  { href: "/profile", label: "Me", Icon: User, match: ["/profile", "/my-reports"] },
];

export function MobileNav() {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-3 bottom-3 z-[1100] rounded-3xl border border-border bg-card/95 px-2 pb-[max(env(safe-area-inset-bottom),0.25rem)] pt-1 shadow-[0_12px_40px_-12px_rgb(45_55_72/0.3)] backdrop-blur-xl lg:hidden"
    >
      <ul className="flex items-end justify-around">
        {items.map(({ href, label, Icon, primary, match }) => {
          const active = (match ?? [href]).some((route) =>
            pathname.startsWith(route),
          );

          if (primary) {
            return (
              <li key={href}>
                <Link
                  to={href}
                  className="-mt-6 flex flex-col items-center gap-1 text-[11px] font-bold text-foreground"
                >
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-lift)] transition-transform active:scale-95">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  {label}
                </Link>
              </li>
            );
          }

          return (
            <li key={href}>
              <Link
                to={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[11px] font-bold transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon
                  className={cn("size-5 transition-transform", active && "scale-110")}
                  aria-hidden="true"
                />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
