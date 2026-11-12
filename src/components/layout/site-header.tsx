/* eslint-disable react-refresh/only-export-components -- mainNav is exported as a shared navigation definition. */
import { Bell, Plus } from "lucide-react";
import { Link, NavLink } from "react-router";
import { Logo } from "@/components/brand/logo";
import { action } from "@/lib/ui";
import { cn } from "@/lib/utils";

export const mainNav = [
  { href: "/dashboard", label: "Home" },
  { href: "/lost", label: "Lost" },
  { href: "/found", label: "Found" },
  { href: "/map", label: "Map" },
  { href: "/my-reports", label: "My Reports" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-[1100] border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav aria-label="Main" className="ml-6 hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "relative rounded-full px-4 py-2 text-sm font-bold transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/report"
            className={cn(action({ size: "sm" }), "hidden sm:inline-flex")}
          >
            <Plus aria-hidden="true" />
            Create report
          </Link>
          <Link
            to="/dashboard#activity"
            className="relative flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
          >
            <Bell className="size-5" aria-hidden="true" />
            <span className="sr-only">Notifications, 3 unread</span>
            <span className="absolute right-2 top-2 size-2.5 rounded-full border-2 border-background bg-primary" />
          </Link>
          <NavLink
            to="/profile"
            end
            className={({ isActive }) =>
              cn(
                "flex size-10 items-center justify-center rounded-full bg-secondary font-heading text-sm font-extrabold text-secondary-foreground ring-offset-2 ring-offset-background transition hover:ring-2 hover:ring-primary",
                isActive && "ring-2 ring-primary",
              )
            }
          >
            <span aria-hidden="true">LF</span>
            <span className="sr-only">Your profile</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
