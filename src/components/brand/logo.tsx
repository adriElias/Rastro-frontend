import { PawPrint } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      to={href}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full outline-none focus-visible:ring-4 focus-visible:ring-ring/30",
        className,
      )}
      aria-label="RASTRO home"
    >
      <span className="relative flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-lift)] transition-transform duration-300 group-hover:-rotate-12">
        <PawPrint className="size-5" aria-hidden="true" />
        <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-background bg-secondary" />
      </span>
      <span className="font-heading text-xl font-extrabold tracking-tight">
        RASTRO
      </span>
    </Link>
  );
}
