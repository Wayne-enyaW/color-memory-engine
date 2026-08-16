import type { ContentPack, ContentTarget, GameDefinition } from "@/lib/core/types";
import { geometricDemoPack } from "./packs/geometric-demo";
import { pureColorsPack } from "./packs/pure-colors";
import { worldFlagsPack } from "./packs/world-flags";

export const contentPacks = [pureColorsPack, worldFlagsPack, geometricDemoPack] as const;

export const games: GameDefinition[] = [
  {
    id: "daily-mix",
    title: "Daily Mix",
    roundCount: 5,
    packIds: ["pure-colors", "world-flags", "geometric-demo"],
    dailySeedNamespace: "color-memory-engine-v1",
  },
  {
    id: "pure-colors",
    title: "Pure Colors",
    roundCount: 5,
    packIds: ["pure-colors"],
    dailySeedNamespace: "pure-colors-v1",
  },
  {
    id: "world-flags",
    title: "World Flags",
    roundCount: 5,
    packIds: ["world-flags"],
    dailySeedNamespace: "world-flags-v1",
  },
  {
    id: "geometric-demo",
    title: "Geometric Demo",
    roundCount: 5,
    packIds: ["geometric-demo"],
    dailySeedNamespace: "geometric-demo-v1",
  },
];

export function getPack(packId: string): ContentPack | null {
  return contentPacks.find((pack) => pack.id === packId) ?? null;
}

export function getGame(gameId: string): GameDefinition | null {
  return games.find((game) => game.id === gameId) ?? null;
}

export function getTarget(packId: string, targetId: string): ContentTarget | null {
  return getPack(packId)?.targets.find((target) => target.id === targetId) ?? null;
}
