import { Redis } from "@upstash/redis";
import type { ChallengeRecord, ChallengeResult, GameStorage, LeaderboardEntry } from "./types";

export class UpstashGameStorage implements GameStorage {
  constructor(private readonly redis: Redis) {}

  async claim(key: string, ttlSeconds: number) {
    const result = await this.redis.set(key, "1", { nx: true, ex: ttlSeconds });
    return result === "OK";
  }

  async increment(key: string, ttlSeconds: number) {
    const count = await this.redis.incr(key);
    if (count === 1) await this.redis.expire(key, ttlSeconds);
    return count;
  }

  async addLeaderboardEntry(key: string, entry: LeaderboardEntry, ttlSeconds: number) {
    await this.redis.zadd(key, { score: entry.score, member: entry });
    await this.redis.expire(key, ttlSeconds);
  }

  async listLeaderboard(key: string, limit: number) {
    return this.redis.zrange<LeaderboardEntry[]>(key, 0, Math.max(0, limit - 1), { rev: true });
  }

  async saveChallenge(key: string, challenge: ChallengeRecord, ttlSeconds: number) {
    await this.redis.set(key, challenge, { ex: ttlSeconds });
  }

  async getChallenge(key: string) {
    return this.redis.get<ChallengeRecord>(key);
  }

  async addChallengeResult(key: string, result: ChallengeResult, ttlSeconds: number) {
    await this.redis.lpush(key, result);
    await this.redis.ltrim(key, 0, 99);
    await this.redis.expire(key, ttlSeconds);
  }
}

export function createStorageFromEnv(): GameStorage | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return new UpstashGameStorage(new Redis({ url, token }));
}
