import type { ContentPack, GameDefinition, GameRound } from "./types";

export const DATE_SEED_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function todayUtc(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function isDateSeed(value: unknown): value is string {
  if (typeof value !== "string" || !DATE_SEED_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

export function isRecentDateSeed(value: unknown, pastDays = 44, futureDays = 0): value is string {
  if (!isDateSeed(value)) return false;
  const day = 24 * 60 * 60 * 1_000;
  const candidate = new Date(`${value}T00:00:00.000Z`).valueOf();
  const today = new Date(`${todayUtc()}T00:00:00.000Z`).valueOf();
  const difference = Math.round((candidate - today) / day);
  return difference >= -pastDays && difference <= futureDays;
}

export function hashString(input: string) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function seededRandom(seed: string) {
  let state = hashString(seed) || 1;
  return () => {
    state = Math.imul(1664525, state) + 1013904223;
    return (state >>> 0) / 4294967296;
  };
}

export function shuffleSeeded<T>(items: readonly T[], seed: string) {
  const random = seededRandom(seed);
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function createRounds(
  game: GameDefinition,
  packs: readonly ContentPack[],
  dateSeed = todayUtc(),
  sessionSeed = "daily",
): GameRound[] {
  if (!isDateSeed(dateSeed)) throw new Error(`Invalid UTC date seed: ${dateSeed}`);
  const allowed = new Set(game.packIds);
  const targets = packs.flatMap((pack) => allowed.has(pack.id)
    ? pack.targets.map((target) => ({ pack, target }))
    : []);
  if (targets.length < game.roundCount) {
    throw new Error(`Game ${game.id} needs ${game.roundCount} targets; found ${targets.length}.`);
  }
  const seed = `${game.id}:${game.dailySeedNamespace}:${dateSeed}:${sessionSeed}`;
  return shuffleSeeded(targets, seed).slice(0, game.roundCount).map(({ pack, target }, index) => ({
    id: `${game.id}:${dateSeed}:${pack.id}:${target.id}:${index + 1}`,
    gameId: game.id,
    dateSeed,
    roundIndex: index + 1,
    packId: pack.id,
    targetId: target.id,
    prompt: target.prompt,
    difficulty: target.difficulty,
    targetHex: target.targetHex,
    visual: target.visual,
  }));
}
