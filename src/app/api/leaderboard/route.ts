import { isRecentDateSeed } from "@/lib/core/rounds";
import { getGame } from "@/lib/content/registry";
import { storageKeys } from "@/lib/storage/keys";
import { submitLeaderboard } from "@/lib/storage/leaderboard-service";
import { createStorageFromEnv } from "@/lib/storage/upstash";

export const runtime = "nodejs";
const MAX_BODY_BYTES = 12_000;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const gameId = url.searchParams.get("gameId") ?? "daily-mix";
  const dateSeed = url.searchParams.get("dateSeed");
  if (!getGame(gameId) || !isRecentDateSeed(dateSeed)) {
    return Response.json({ error: "Invalid gameId or dateSeed." }, { status: 400 });
  }
  const storage = createStorageFromEnv();
  if (!storage) return Response.json({ configured: false, entries: [] });
  try {
    const entries = await storage.listLeaderboard(storageKeys.leaderboard(gameId, "daily", dateSeed), 50);
    return Response.json({ configured: true, entries });
  } catch {
    return Response.json({ error: "Leaderboard storage is temporarily unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) return Response.json({ error: "Payload too large." }, { status: 400 });
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return Response.json({ error: "Payload too large." }, { status: 400 });
  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const clientFingerprint = [
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown",
    request.headers.get("user-agent")?.slice(0, 180) ?? "unknown",
  ].join(":");
  const result = await submitLeaderboard(createStorageFromEnv(), payload, clientFingerprint);
  return Response.json(result.ok ? { entry: result.entry, duplicate: result.duplicate } : { error: result.error }, { status: result.status });
}
