import { describe, expect, it } from "vitest";
import {
  communityStats,
  getPet,
  pets,
  successStories,
} from "@/lib/data";

describe("homepage mock data", () => {
  it("provides the community metrics and eight ordered non-reunited reports", () => {
    expect(communityStats).toEqual({
      members: 18420,
      reunited: 3216,
      activeReports: 412,
      sightingsThisWeek: 1287,
    });
    expect(pets.filter((pet) => pet.status !== "reunited")).toHaveLength(8);
    expect(pets.slice(0, 8).map((pet) => pet.id)).toEqual([
      "luna-retiro",
      "milo-chamberi",
      "toby-lavapies",
      "nala-malasana",
      "rocky-latina",
      "kiwi-casa-de-campo",
      "coco-salamanca",
      "simba-arganzuela",
    ]);
  });

  it("resolves every success story to its original pet fixture", () => {
    expect(successStories).toHaveLength(3);
    for (const story of successStories) {
      expect(getPet(story.petId)).toBeDefined();
    }
  });
});
