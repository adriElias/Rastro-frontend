import { Heart } from "lucide-react";
import { Link } from "react-router";
import { Logo } from "@/components/brand/logo";

const groups = [
  {
    title: "Explore",
    links: [
      { href: "/lost", label: "Lost animals" },
      { href: "/found", label: "Found animals" },
      { href: "/map", label: "Community map" },
    ],
  },
  {
    title: "Act",
    links: [
      { href: "/report/lost", label: "Report a lost pet" },
      { href: "/report/found", label: "Report a found pet" },
      { href: "/my-reports", label: "My reports" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/register", label: "Create account" },
      { href: "/admin", label: "Admin panel" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card pb-[calc(7rem_+_env(safe-area-inset-bottom))] lg:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-8">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            A neighbourhood network that helps lost pets find their way home. Built with care in Madrid.
          </p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <h2 className="font-heading text-sm font-bold">{group.title}</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <p className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-5 text-xs text-muted-foreground sm:px-6 lg:px-8">
          © 2026 RASTRO. Made with{" "}
          <Heart
            className="size-3.5 fill-primary text-primary"
            aria-label="love"
          />{" "}
          for every pet waiting to come home.
        </p>
      </div>
    </footer>
  );
}
