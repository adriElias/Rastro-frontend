import { useNavigate } from "react-router";
import { HeartHandshake, MapPin, Search, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { action } from "@/lib/ui";
import { communityStats } from "@/lib/data";

export function Hero() {
  const navigate = useNavigate();

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = new URLSearchParams();
    query.set("q", String(formData.get("q") ?? ""));
    navigate({ pathname: "/lost", search: query.toString() });
  }

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-secondary/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-40 size-96 rounded-full bg-primary/20 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:pb-24 lg:pt-16">
        <div className="flex flex-col items-start gap-7">
          <span className="inline-flex animate-in items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-bold shadow-[var(--shadow-soft)] fade-in slide-in-from-bottom-2 duration-700">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/70" />
              <span className="relative inline-flex size-2.5 rounded-full bg-success" />
            </span>
            {communityStats.activeReports} pets being searched for right now
          </span>

          <h1 className="animate-in text-5xl font-extrabold leading-[1.02] fade-in slide-in-from-bottom-4 duration-700 sm:text-6xl lg:text-7xl">
            Helping pets find their{" "}
            <span className="relative inline-block text-primary">
              way home
              <svg
                aria-hidden="true"
                viewBox="0 0 300 20"
                className="absolute -bottom-2 left-0 h-3 w-full text-secondary"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 14 C 60 2, 140 2, 298 12"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </h1>

          <p className="max-w-xl animate-in text-lg leading-relaxed text-muted-foreground fade-in slide-in-from-bottom-4 duration-700 [animation-delay:120ms] [animation-fill-mode:both]">
            RASTRO connects neighbours to find lost dogs, cats and birds faster. Post an alert in under a minute,
            follow sightings on a live map, and reunite with the ones you love.
          </p>

          <form
            action="/lost"
            method="get"
            role="search"
            onSubmit={handleSearch}
            className="flex w-full max-w-xl animate-in items-center gap-2 rounded-full border border-border bg-card p-2 shadow-[var(--shadow-soft)] fade-in slide-in-from-bottom-4 duration-700 [animation-delay:200ms] [animation-fill-mode:both] focus-within:ring-4 focus-within:ring-ring/20"
          >
            <label htmlFor="hero-search" className="sr-only">
              Search by breed, name or neighbourhood
            </label>
            <Search
              className="ml-3 size-5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="hero-search"
              name="q"
              placeholder="Breed, name or neighbourhood…"
              className="h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
            <button type="submit" className={action({ size: "md" })}>
              Search
            </button>
          </form>

          <div className="flex w-full animate-in flex-col gap-3 fade-in slide-in-from-bottom-4 duration-700 [animation-delay:280ms] [animation-fill-mode:both] sm:w-auto sm:flex-row">
            <Link to="/report/lost" className={action({ size: "lg" })}>
              <Search aria-hidden="true" />I lost my pet
            </Link>
            <Link
              to="/report/found"
              className={action({ variant: "info", size: "lg" })}
            >
              <Sparkles aria-hidden="true" />I found a pet
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-secondary/30 shadow-[var(--shadow-lift)]">
            <img
              src="/images/hero.png"
              alt="A happy dog and cat sitting together in a sunny park"
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="absolute -left-4 top-8 flex animate-float items-center gap-3 rounded-2xl border border-border bg-card p-3 pr-5 shadow-[var(--shadow-soft)] sm:-left-10">
            <span className="flex size-10 items-center justify-center rounded-xl bg-success/15 text-success">
              <HeartHandshake className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-heading text-lg font-extrabold leading-none">
                {communityStats.reunited.toLocaleString("en-US")}
              </p>
              <p className="text-xs font-semibold text-muted-foreground">
                pets reunited
              </p>
            </div>
          </div>

          <div className="absolute -right-2 bottom-10 flex animate-float-slow items-center gap-3 rounded-2xl border border-border bg-card p-3 pr-5 shadow-[var(--shadow-soft)] [animation-delay:1.5s] sm:-right-8">
            <div className="relative size-11 overflow-hidden rounded-xl">
              <img
                src="/images/pets/luna.png"
                alt=""
                loading="lazy"
                sizes="44px"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-bold">New sighting of Luna</p>
              <p className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                <MapPin className="size-3 text-primary" aria-hidden="true" />
                Retiro · 6 min ago
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
