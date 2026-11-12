import type { ReactNode } from "react";
import {
  ArrowRight,
  Bell,
  Camera,
  HeartHandshake,
  MapPinned,
  Quote,
} from "lucide-react";
import { Link } from "react-router";
import { AnimatedCounter, Reveal } from "@/components/motion/reveal";
import { PetCard } from "@/components/pets/pet-card";
import {
  communityStats,
  getPet,
  pets,
  successStories,
} from "@/lib/data";
import { action, card } from "@/lib/ui";
import { cn } from "@/lib/utils";

function SectionHeading({
  eyebrow,
  title,
  description,
  action: cta,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="max-w-2xl">
        <p className="text-sm font-extrabold uppercase tracking-widest text-primary">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">{title}</h2>
        {description ? (
          <p className="mt-3 text-pretty text-lg text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {cta}
    </div>
  );
}

export function StatsBand() {
  const stats = [
    { label: "Pets reunited", value: communityStats.reunited, tone: "text-success" },
    { label: "Active reports", value: communityStats.activeReports, tone: "text-primary" },
    {
      label: "Sightings this week",
      value: communityStats.sightingsThisWeek,
      tone: "text-info",
    },
    { label: "Neighbours helping", value: communityStats.members, tone: "text-foreground" },
  ];

  return (
    <section
      aria-label="Community impact"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className={cn(card, "grid grid-cols-2 divide-border p-2 md:grid-cols-4 md:divide-x")}>
        {stats.map((stat, index) => (
          <Reveal
            key={stat.label}
            delay={index * 80}
            className="flex flex-col items-center gap-1 px-4 py-6 text-center"
          >
            <AnimatedCounter
              value={stat.value}
              className={cn(
                "font-heading text-3xl font-extrabold sm:text-4xl",
                stat.tone,
              )}
            />
            <span className="text-sm font-semibold text-muted-foreground">
              {stat.label}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function RecentlyLost() {
  const recent = pets.filter((pet) => pet.status !== "reunited").slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Near you"
        title="Recently reported"
        description="Every share and sighting brings them one step closer to home."
        action={
          <Link to="/lost" className={action({ variant: "outline" })}>
            View all
            <ArrowRight aria-hidden="true" />
          </Link>
        }
      />
      <div className="-mx-4 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {recent.map((pet, index) => (
          <Reveal
            key={pet.id}
            delay={index * 60}
            className="w-72 shrink-0 snap-start"
          >
            <PetCard pet={pet} className="h-full" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const steps = [
  {
    Icon: Camera,
    title: "Post an alert",
    text: "Add a photo, the last place you saw them and a few details. It takes less than a minute.",
    tone: "bg-primary/15 text-primary",
  },
  {
    Icon: Bell,
    title: "Neighbours get notified",
    text: "Everyone within your search radius receives an instant alert and can share it.",
    tone: "bg-secondary/40 text-secondary-foreground",
  },
  {
    Icon: MapPinned,
    title: "Follow sightings",
    text: "Track every sighting on the map and chat safely with people who have seen your pet.",
    tone: "bg-info/15 text-info",
  },
  {
    Icon: HeartHandshake,
    title: "Reunite",
    text: "Bring them home, mark the case as resolved and inspire your community.",
    tone: "bg-success/15 text-success",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-sm font-extrabold uppercase tracking-widest text-primary">
          How it works
        </p>
        <h2 className="mx-auto mt-2 max-w-2xl text-3xl font-extrabold sm:text-4xl">
          Four simple steps, one big community
        </h2>
      </div>
      <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <Reveal
            as="li"
            key={step.title}
            delay={index * 100}
            className={cn(
              card,
              "relative p-6 transition-transform hover:-translate-y-1",
            )}
          >
            <span className="absolute right-5 top-5 font-heading text-5xl font-extrabold text-muted">
              {index + 1}
            </span>
            <span
              className={cn(
                "flex size-14 items-center justify-center rounded-2xl",
                step.tone,
              )}
            >
              <step.Icon className="size-7" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">{step.text}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

export function SuccessStories() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Happy endings" title="They made it home" />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {successStories.map((story, index) => {
          const pet = getPet(story.petId);
          if (!pet) return null;

          return (
            <Reveal
              key={story.petId}
              delay={index * 100}
              className={cn(card, "flex flex-col overflow-hidden")}
            >
              <div className="relative aspect-[16/10]">
                <img
                  src={pet.image || "/placeholder.svg"}
                  alt={pet.name ?? pet.breed}
                  loading="lazy"
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-success px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white">
                  Home in {story.days} {story.days === 1 ? "day" : "days"}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <Quote className="size-7 text-secondary" aria-hidden="true" />
                <blockquote className="flex-1 leading-relaxed">{story.quote}</blockquote>
                <p className="text-sm font-bold">
                  {story.author}{" "}
                  <span className="font-semibold text-muted-foreground">
                    · with {pet.name}
                  </span>
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
        <div
          aria-hidden="true"
          className="absolute -left-10 -top-10 size-48 rounded-full bg-secondary/50 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-16 -right-10 size-64 rounded-full bg-white/20 blur-2xl"
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl font-extrabold sm:text-5xl">
            Be the neighbour someone is hoping for
          </h2>
          <p className="mt-4 text-lg opacity-90">
            Join thousands of people in Madrid who keep an eye out for lost pets. It’s free, and it works.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className={cn(action({ size: "lg", variant: "secondary" }))}
            >
              Join RASTRO for free
            </Link>
            <Link
              to="/map"
              className={cn(
                action({ size: "lg", variant: "ghost" }),
                "text-primary-foreground hover:bg-white/15",
              )}
            >
              Explore the map
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
