import { createHmac, timingSafeEqual } from "node:crypto";
import { isHexColor, scoreGuess } from "@/lib/core/color";
import { createRounds, isDateSeed, todayUtc } from "@/lib/core/rounds";
import type { RoundScore, RoundSubmission } from "@/lib/core/types";
import { contentPacks, getGame } from "@/lib/content/registry";
import { storageKeys } from "./keys";
import type { GameStorage, LeaderboardEntry } from "./types";

const DAILY_TTL_SECONDS = 45 * 24 * 60 * 60;
const RATE_LIMIT_SECONDS = 60;
const RATE_LIMIT_MAX = 10;

export type LeaderboardSubmission = {
  username: string;
  gameId: string;
  scope: "daily";
  dateSeed: string;
  rounds: RoundSubmission[];
};

export type ServiceResult =
  | { ok: true; status: 200 | 201; entry: LeaderboardEntry; duplicate: boolean }
  | { ok: false; status: 400 | 429 | 503; error: string };

export function productionSigningSecret() {
  const value = process.env.LEADERBOARD_SIGNING_SECRET?.trim();
  if (value) return value;
  return process.env.NODE_ENV === "production" ? null : "development-only-secret";
}

function fingerprint(secret: string, value: unknown) {
  return createHmac("sha256", secret).update(JSON.stringify(value)).digest("hex");
}

export function signEntry(secret: string, entry: LeaderboardEntry) {
  return fingerprint(secret, entry);
}

export function verifyEntrySignature(secret: string, entry: LeaderboardEntry, signature: string) {
  const expected = Buffer.from(signEntry(secret, entry));
  const actual = Buffer.from(signature);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function parseLeaderboardSubmission(value: unknown): LeaderboardSubmission | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  if (typeof input.username !== "string" || input.username.trim().length < 1 || input.username.length > 32) return null;
  if (typeof input.gameId !== "string" || input.gameId.length > 80 || !getGame(input.gameId)) return null;
  if (input.scope !== "daily" || !isDateSeed(input.dateSeed)) return null;
  if (!Array.isArray(input.rounds) || input.rounds.length < 1 || input.rounds.length > 20) return null;
  const rounds: RoundSubmission[] = [];
  for (const raw of input.rounds) {
    if (!raw || typeof raw !== "object") return null;
    const round = raw as Record<string, unknown>;
    if (typeof round.packId !== "string" || round.packId.length > 80) return null;
    if (typeof round.targetId !== "string" || round.targetId.length > 100) return null;
    if (!isHexColor(round.guessHex) || typeof round.hintUsed !== "boolean") return null;
    rounds.push({ packId: round.packId, targetId: round.targetId, guessHex: round.guessHex, hintUsed: round.hintUsed });
  }
  return { username: input.username.trim(), gameId: input.gameId, scope: "daily", dateSeed: input.dateSeed, rounds };
}

export async function submitLeaderboard(
  storage: GameStorage | null,
  raw: unknown,
  clientFingerprint: string,
): Promise<ServiceResult> {
  const input = parseLeaderboardSubmission(raw);
  if (!input) return { ok: false, status: 400, error: "Invalid leaderboard submission." };
  if (input.dateSeed !== todayUtc()) return { ok: false, status: 400, error: "Daily submissions are only accepted for the current UTC date." };
  const secret = productionSigningSecret();
  if (!secret) return { ok: false, status: 503, error: "Leaderboard writes are not configured." };
  if (!storage) return { ok: false, status: 503, error: "Redis is not configured." };
  const game = getGame(input.gameId)!;
  const expected = createRounds(game, contentPacks, input.dateSeed);
  if (input.rounds.length !== expected.length) return { ok: false, status: 400, error: "Round count does not match the game." };

  const scored: RoundScore[] = [];
  for (let index = 0; index < expected.length; index += 1) {
    const submitted = input.rounds[index];
    const round = expected[index];
    if (submitted.packId !== round.packId || submitted.targetId !== round.targetId) {
      return { ok: false, status: 400, error: "Submitted targets do not match the deterministic round." };
    }
    const result = scoreGuess(round.targetHex, submitted.guessHex, submitted.hintUsed);
    scored.push({ ...submitted, targetHex: round.targetHex, ...result });
  }

  try {
    const rateKey = storageKeys.rateLimit(input.gameId, input.dateSeed, fingerprint(secret, clientFingerprint));
    if (await storage.increment(rateKey, RATE_LIMIT_SECONDS) > RATE_LIMIT_MAX) {
      return { ok: false, status: 429, error: "Too many submissions. Try again shortly." };
    }
    const id = fingerprint(secret, { gameId: input.gameId, dateSeed: input.dateSeed, rounds: input.rounds });
    const entry: LeaderboardEntry = {
      id,
      username: input.username,
      gameId: input.gameId,
      dateSeed: input.dateSeed,
      score: Number((scored.reduce((sum, round) => sum + round.score, 0) / scored.length).toFixed(2)),
      createdAt: new Date().toISOString(),
      rounds: scored,
    };
    const isNew = await storage.claim(`leaderboard-submission:v1:${id}`, DAILY_TTL_SECONDS);
    if (isNew) {
      await storage.addLeaderboardEntry(storageKeys.leaderboard(input.gameId, "daily", input.dateSeed), entry, DAILY_TTL_SECONDS);
    }
    return { ok: true, status: isNew ? 201 : 200, entry, duplicate: !isNew };
  } catch {
    return { ok: false, status: 503, error: "Leaderboard storage is temporarily unavailable." };
  }
}
