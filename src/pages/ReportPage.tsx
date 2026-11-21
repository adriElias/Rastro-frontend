import { useEffect } from "react";
import { ArrowRight, LockKeyhole, Search, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "@/auth/useAuth";
import { PageContainer, PageHeader } from "@/components/layout/page-parts";
import { card } from "@/lib/ui";
import { cn } from "@/lib/utils";

const reportOptions = [
  {
    href: "/report/lost",
    title: "Report a lost pet",
    description:
      "Alert neighbours and start gathering sightings to help your pet get home safely.",
    action: "Create a lost pet report",
    Icon: Search,
    iconClassName: "bg-primary/15 text-primary",
  },
  {
    href: "/report/found",
    title: "Report a found pet",
    description:
      "Share where you found them so their family can recognise them and get in touch.",
    action: "Create a found pet report",
    Icon: Sparkles,
    iconClassName: "bg-info/15 text-info",
  },
] as const;

export function ReportPage() {
  const { hasAccessToken } = useAuth();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Create a report · RASTRO";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <PageContainer className="pt-12 sm:pt-16">
      <PageHeader
        eyebrow="Create a report"
        title="What happened?"
        description="Choose the option that best matches your situation."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {reportOptions.map(({ href, title, description, action, Icon, iconClassName }) => (
          <Link
            key={href}
            to={href}
            className={cn(
              card,
              "group relative flex min-h-72 flex-col overflow-hidden p-7 transition-all duration-200 outline-none hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-lift)] focus-visible:ring-4 focus-visible:ring-ring/30 sm:p-9",
            )}
          >
            <span
              aria-hidden="true"
              className="absolute -right-12 -top-12 size-40 rounded-full bg-secondary/15 transition-transform duration-300 group-hover:scale-110"
            />
            <span
              className={cn(
                "relative flex size-16 items-center justify-center rounded-2xl",
                iconClassName,
              )}
            >
              <Icon className="size-8" aria-hidden="true" />
            </span>
            <h2 className="relative mt-7 text-2xl font-extrabold">{title}</h2>
            <p className="relative mt-3 max-w-md leading-relaxed text-muted-foreground">
              {description}
            </p>
            <span className="relative mt-auto flex items-center gap-2 pt-8 font-bold text-foreground transition-colors group-hover:text-primary">
              {action}
              <ArrowRight
                className="size-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </Link>
        ))}
      </div>

      {!hasAccessToken ? (
        <aside
          aria-labelledby="report-login-guidance-title"
          className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-accent px-4 py-4 sm:px-5"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary">
            <LockKeyhole className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="report-login-guidance-title" className="font-bold">
              Ready to help?
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Log in to create a report and help reunite pets with their families.
            </p>
          </div>
        </aside>
      ) : null}
    </PageContainer>
  );
}
