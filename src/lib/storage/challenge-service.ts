import { randomBytes } from "node:crypto";
import { decodeChallenge } from "@/lib/core/challenge";
import { isDateSeed } from "@/lib/core/rounds";
import { getGame, getTarget } from "@/lib/content/registry";
import { storageKeys } from "./keys";
import type { ChallengeRecord, GameStorage } from "./types";

export const CHALLENGE_TTL_SECONDS = 7 * 24 * 60 * 60;

export function resolveLongChallenge(code: string) {
  const payload = decodeChallenge(code);
  if (!payload || !isDateSeed(payload.dateSeed) || !getGame(payload.gameId)) return null;
  const target = getTarget(payload.packId, payload.targetId);
  return target ? { payload, target } : null;
}

export async function createShortChallenge(storage: GameStorage | null, code: string) {
  const resolved = resolveLongChallenge(code);
  if (!resolved) return { ok: false as const, status: 400 as const, error: "Invalid challenge." };
  if (!storage) return { ok: false as const, status: 503 as const, error: "Short links require Redis." };
  const challengeId = randomBytes(9).toString("base64url");
  const record: ChallengeRecord = {
    ...resolved.payload,
    challengeId,
    createdAt: new Date().toISOString(),
  };
  try {
    await storage.saveChallenge(storageKeys.challenge(challengeId), record, CHALLENGE_TTL_SECONDS);
    return { ok: true as const, status: 201 as const, challengeId };
  } catch {
    return { ok: false as const, status: 503 as const, error: "Challenge storage is temporarily unavailable." };
  }
}
