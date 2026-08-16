import type { ContentPack } from "@/lib/core/types";

const entries = [
  ["orbit", "blue circle", "#2F63F5", "easy"],
  ["steps", "coral steps", "#FF6B5E", "easy"],
  ["arch", "green arch", "#38A169", "normal"],
  ["sun", "amber sun", "#F5B82E", "normal"],
  ["ribbon", "violet ribbon", "#7257D7", "expert"],
  ["garden", "deep teal leaf", "#147D73", "expert"],
] as const;

export const geometricDemoPack: ContentPack = {
  id: "geometric-demo",
  name: "Geometric Demo",
  version: "1.0.0",
  license: "CC0-1.0",
  sourceUrl: "https://github.com/Wayne-enyaW/color-memory-engine/tree/main/public/content/geometric",
  targets: entries.map(([id, label, color, difficulty]) => ({
    id: `geometric-demo-${id}`,
    prompt: `Remember the ${label}`,
    difficulty,
    targetHex: color,
    visual: { kind: "image", imageSrc: `/content/geometric/${id}.svg` },
  })),
};
