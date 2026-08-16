import type { ChallengePayload } from "@/lib/core/challenge";
import type { RoundScore, RoundSubmission } from "@/lib/core/types";

export type LeaderboardEntry = {
  id: string;
  username: string;
  gameId: string;
  dateSeed: string;
  score: number;
  createdAt: string;
  rounds: RoundScore[];
};

export type ChallengeRecord = ChallengePayload & {
  challengeId: string;
  createdAt: string;
};

export type ChallengeResult = {
  id: string;
  challengeId: string;
  name: string;
  submission: RoundSubmission;
  score: number;
  createdAt: string;
};

export interface GameStorage {
  claim(key: string, ttlSeconds: number): Promise<boolean>;
  increment(key: string, ttlSeconds: number): Promise<number>;
  addLeaderboardEntry(key: string, entry: LeaderboardEntry, ttlSeconds: number): Promise<void>;
  listLeaderboard(key: string, limit: number): Promise<LeaderboardEntry[]>;
  saveChallenge(key: string, challenge: ChallengeRecord, ttlSeconds: number): Promise<void>;
  getChallenge(key: string): Promise<ChallengeRecord | null>;
  addChallengeResult(key: string, result: ChallengeResult, ttlSeconds: number): Promise<void>;
}
