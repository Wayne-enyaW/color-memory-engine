import { afterEach, describe, expect, it, vi } from "vitest";
import { createRounds, todayUtc } from "@/lib/core/rounds";
import { contentPacks, getGame } from "@/lib/content/registry";
import { submitLeaderboard } from "./leaderboard-service";
import type { GameStorage, LeaderboardEntry } from "./types";

class FakeStorage implements GameStorage {
  entries: LeaderboardEntry[] = [];
  claims = new Set<string>();
  rate = 0;
  fail = false;
  async claim(key: string) { if (this.fail) throw new Error("down"); const fresh = !this.claims.has(key); this.claims.add(key); return fresh; }
  async increment() { if (this.fail) throw new Error("down"); return ++this.rate; }
  async addLeaderboardEntry(_key: string, entry: LeaderboardEntry) { if (this.fail) throw new Error("down"); this.entries.push(entry); }
  async listLeaderboard() { return this.entries; }
  async saveChallenge() {}
  async getChallenge() { return null; }
  async addChallengeResult() {}
}

function validPayload() {
  const dateSeed = todayUtc();
  const game = getGame("daily-mix")!;
  const rounds = createRounds(game, contentPacks, dateSeed).map((round) => ({
    packId: round.packId,
    targetId: round.targetId,
    guessHex: "#000000",
    hintUsed: false,
    score: 10_000,
    targetHex: "#FFFFFF",
  }));
  return { username: "Ada", gameId: game.id, scope: "daily", dateSeed, rounds };
}

describe("server-verified leaderboard", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("recomputes scores and keeps duplicate submissions idempotent", async () => {
    const storage = new FakeStorage();
    const first = await submitLeaderboard(storage, validPayload(), "client-a");
    const second = await submitLeaderboard(storage, validPayload(), "client-a");
    expect(first.ok && first.entry.score).toBeLessThanOrEqual(10);
    expect(second.ok && second.duplicate).toBe(true);
    expect(storage.entries).toHaveLength(1);
    expect(storage.entries[0].rounds[0].targetHex).not.toBe("#FFFFFF");
  });

  it("rejects changed target identifiers", async () => {
    const payload = validPayload();
    payload.rounds[0].targetId = "forged";
    const result = await submitLeaderboard(new FakeStorage(), payload, "client-a");
    expect(result).toMatchObject({ ok: false, status: 400 });
  });

  it("returns 429 when the rate limit is exceeded", async () => {
    const storage = new FakeStorage();
    storage.rate = 10;
    expect(await submitLeaderboard(storage, validPayload(), "client-a")).toMatchObject({ ok: false, status: 429 });
  });

  it("returns 503 when Redis fails", async () => {
    const storage = new FakeStorage();
    storage.fail = true;
    expect(await submitLeaderboard(storage, validPayload(), "client-a")).toMatchObject({ ok: false, status: 503 });
  });

  it("fails closed in production without a signing secret", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("LEADERBOARD_SIGNING_SECRET", "");
    expect(await submitLeaderboard(new FakeStorage(), validPayload(), "client-a")).toMatchObject({ ok: false, status: 503 });
  });

  it("rejects oversized names and illegal enums", async () => {
    expect(await submitLeaderboard(new FakeStorage(), { ...validPayload(), username: "x".repeat(33) }, "client-a")).toMatchObject({ ok: false, status: 400 });
    expect(await submitLeaderboard(new FakeStorage(), { ...validPayload(), scope: "weekly" }, "client-a")).toMatchObject({ ok: false, status: 400 });
  });
});
