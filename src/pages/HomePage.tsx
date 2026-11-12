import { FinalCta, HowItWorks, RecentlyLost, StatsBand, SuccessStories } from "@/components/landing/sections";
import { Hero } from "@/components/landing/hero";
import { MapPlaceholder } from "@/components/landing/map-placeholder";

export function HomePage() {
  return (
    <>
      <Hero />
      <StatsBand />
      <RecentlyLost />
      <MapPlaceholder />
      <HowItWorks />
      <SuccessStories />
      <FinalCta />
    </>
  );
}
