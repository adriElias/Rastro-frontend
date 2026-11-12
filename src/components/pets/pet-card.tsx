import { Clock, MapPin, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import { displayName, relativeTime, type Pet } from "@/lib/data";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/pets/status-badge";

export function PetCard({
  pet,
  className,
  priority = false,
  compact = false,
}: {
  pet: Pet;
  className?: string;
  priority?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      to={`/pets/${pet.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)] outline-none transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)] focus-visible:ring-4 focus-visible:ring-ring/30",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-muted",
          compact ? "aspect-[4/3]" : "aspect-[4/3.4]",
        )}
      >
        <img
          src={pet.image || "/placeholder.svg"}
          alt={`${displayName(pet)}, ${pet.breed}`}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <StatusBadge status={pet.status} pulse />
          {pet.safekeeping ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-card/95 px-2.5 py-1 text-xs font-bold text-success backdrop-blur">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Safe
            </span>
          ) : null}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-card/95 px-2.5 py-1 text-xs font-bold backdrop-blur">
          <MapPin className="size-3.5 text-primary" aria-hidden="true" />
          {pet.distanceKm.toFixed(1)} km
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate text-lg font-bold">{pet.name ?? "Unknown name"}</h3>
          <span className="shrink-0 text-xs font-semibold text-muted-foreground">
            {pet.breed}
          </span>
        </div>
        {!compact ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {pet.title}
          </p>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 text-xs font-semibold text-muted-foreground">
          <span className="inline-flex items-center gap-1 truncate">
            <MapPin className="size-3.5" aria-hidden="true" />
            {pet.zone}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden="true" />
            {relativeTime(pet.date)}
          </span>
        </div>
      </div>
    </Link>
  );
}
