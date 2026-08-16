const segment = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 100);

export const storageKeys = {
  leaderboard: (gameId: string, scope: "daily", dateSeed: string) =>
    `leaderboard:v1:${segment(gameId)}:${scope}:${segment(dateSeed)}`,
  rateLimit: (gameId: string, dateSeed: string, fingerprint: string) =>
    `ratelimit:v1:${segment(gameId)}:${segment(dateSeed)}:${segment(fingerprint)}`,
  challenge: (challengeId: string) => `challenge:v1:${segment(challengeId)}`,
  challengeResults: (challengeId: string) => `challenge:v1:${segment(challengeId)}:results`,
};
