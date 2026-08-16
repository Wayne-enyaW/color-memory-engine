import { hsbToHex } from "@/lib/core/color";
import type { ContentPack, Difficulty } from "@/lib/core/types";

const hueNames = [
  "red", "orange", "amber", "lime", "green", "mint",
  "cyan", "sky", "blue", "violet", "magenta", "rose",
] as const;

const tones = [
  { name: "clear", saturation: 72, brightness: 88, difficulty: "easy" },
  { name: "soft", saturation: 48, brightness: 82, difficulty: "normal" },
  { name: "deep", saturation: 76, brightness: 55, difficulty: "normal" },
  { name: "muted", saturation: 34, brightness: 64, difficulty: "expert" },
] satisfies Array<{ name: string; saturation: number; brightness: number; difficulty: Difficulty }>;

export const pureColorsPack: ContentPack = {
  id: "pure-colors",
  name: "Pure Colors",
  version: "1.0.0",
  license: "CC0-1.0",
  targets: hueNames.flatMap((hueName, hueIndex) => tones.map((tone) => ({
    id: `pure-colors-${hueName}-${tone.name}`,
    prompt: `Remember this ${tone.name} ${hueName}`,
    difficulty: tone.difficulty,
    targetHex: hsbToHex({ h: hueIndex * 30, s: tone.saturation, b: tone.brightness }),
    visual: { kind: "solid" as const },
  }))),
};
