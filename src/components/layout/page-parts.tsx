import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";
import { action, card } from "@/lib/ui";
import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto max-w-7xl px-4 pb-28 pt-8 sm:px-6 md:pb-16 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-sm font-extrabold uppercase tracking-widest text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-2 text-pretty text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children ? <div className="flex flex-wrap gap-3">{children}</div> : null}
    </div>
  );
}

export function SectionTitle({
  title,
  href,
  linkLabel = "See all",
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="text-2xl font-extrabold">{title}</h2>
      {href ? (
        <Link to={href} className="text-sm font-bold text-primary hover:underline">
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function EmptyState({
  Icon,
  title,
  description,
  cta,
}: {
  Icon: LucideIcon;
  title: string;
  description: string;
  cta?: { href?: string; label: string; onClick?: () => void };
}) {
  return (
    <div className={cn(card, "flex flex-col items-center px-6 py-14 text-center")}>
      <span className="relative flex size-20 items-center justify-center rounded-full bg-secondary/30 text-secondary-foreground">
        <span className="absolute inset-0 animate-float rounded-full bg-secondary/20" />
        <Icon className="relative size-9" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-xl font-bold">{title}</h3>
      <p className="mt-2 max-w-sm text-muted-foreground">{description}</p>
      {cta ? (
        cta.href ? (
          <Link to={cta.href} className={cn(action(), "mt-6")}>
            {cta.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={cta.onClick}
            className={cn(action(), "mt-6")}
          >
            {cta.label}
          </button>
        )
      ) : null}
    </div>
  );
}
