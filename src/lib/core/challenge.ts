const CHALLENGE_VERSION = 1;

export type ChallengePayload = {
  v: 1;
  gameId: string;
  dateSeed: string;
  packId: string;
  targetId: string;
};

function base64UrlEncode(value: string) {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  return atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
}

export function encodeChallenge(payload: Omit<ChallengePayload, "v">) {
  return base64UrlEncode(JSON.stringify({ v: CHALLENGE_VERSION, ...payload }));
}

export function decodeChallenge(code: string): ChallengePayload | null {
  if (code.length === 0 || code.length > 512) return null;
  try {
    const value = JSON.parse(base64UrlDecode(code)) as Record<string, unknown>;
    if (value.v !== CHALLENGE_VERSION) return null;
    for (const key of ["gameId", "dateSeed", "packId", "targetId"] as const) {
      if (typeof value[key] !== "string" || value[key].length === 0 || value[key].length > 80) return null;
    }
    return value as ChallengePayload;
  } catch {
    return null;
  }
}
