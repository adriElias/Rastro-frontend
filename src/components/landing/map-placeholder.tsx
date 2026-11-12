import { MapPin, MapPinned } from "lucide-react";
import { Link } from "react-router";
import { Reveal } from "@/components/motion/reveal";
import { action } from "@/lib/ui";

const locations = [
  { className: "left-[26%] top-[34%] text-primary", label: "Sample lost report" },
  { className: "left-[62%] top-[25%] text-info", label: "Sample found report" },
  { className: "left-[70%] top-[66%] text-success", label: "Sample reunited report" },
  { className: "left-[42%] top-[72%] text-primary", label: "Sample lost report" },
];

export function MapPlaceholder() {
  return (
    <section className="bg-muted/60 py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <Reveal>
          <p className="text-sm font-extrabold uppercase tracking-widest text-primary">
            Community map preview
          </p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
            See what’s happening on your street
          </h2>
          <p className="mt-3 text-pretty text-lg text-muted-foreground">
            The community map will show lost pets, found pets and sightings by location. This illustration previews how reports may appear.
          </p>
          <ul className="mt-8 flex flex-col gap-3 text-sm font-semibold">
            <li className="flex items-center gap-3">
              <span className="size-3 rounded-full bg-primary" aria-hidden="true" />
              Lost pets
            </li>
            <li className="flex items-center gap-3">
              <span className="size-3 rounded-full bg-info" aria-hidden="true" />
              Found pets
            </li>
            <li className="flex items-center gap-3">
              <span className="size-3 rounded-full bg-success" aria-hidden="true" />
              Reunited
            </li>
          </ul>
          <Link to="/map" className={`${action({ size: "lg" })} mt-8`}>
            <MapPinned aria-hidden="true" />
            Open full map
          </Link>
        </Reveal>

        <Reveal delay={120}>
          <div
            role="img"
            aria-label="Illustrative static community map preview. Markers are samples, not live reports."
            className="relative h-[420px] overflow-hidden rounded-[2rem] border-4 border-card bg-[#e8eee2] shadow-[var(--shadow-lift)] sm:h-[480px]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(30deg,transparent_46%,#fff_47%,#fff_51%,transparent_52%),linear-gradient(115deg,transparent_34%,#fff_35%,#fff_39%,transparent_40%),linear-gradient(160deg,transparent_66%,#fff_67%,#fff_71%,transparent_72%)]"
            />
            <div
              aria-hidden="true"
              className="absolute left-[8%] top-[12%] h-24 w-32 rounded-[2rem] bg-success/15"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-[12%] right-[8%] h-28 w-36 rounded-[2.5rem] bg-success/15"
            />
            <div className="absolute left-4 top-4 rounded-full border border-border bg-card/95 px-3 py-1.5 text-xs font-bold text-muted-foreground shadow-[var(--shadow-soft)]">
              Illustrative preview · not live data
            </div>
            {locations.map((location, index) => (
              <MapPin
                key={`${location.label}-${index}`}
                className={`absolute size-9 drop-shadow-md ${location.className}`}
                aria-hidden="true"
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
