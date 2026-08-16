import { createShortChallenge } from "@/lib/storage/challenge-service";
import { createStorageFromEnv } from "@/lib/storage/upstash";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const text = await request.text();
  if (text.length > 1_024) return Response.json({ error: "Payload too large." }, { status: 400 });
  let code: unknown;
  try {
    code = (JSON.parse(text) as Record<string, unknown>).code;
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (typeof code !== "string") return Response.json({ error: "Missing challenge code." }, { status: 400 });
  const result = await createShortChallenge(createStorageFromEnv(), code);
  return Response.json(result.ok ? { challengeId: result.challengeId } : { error: result.error }, { status: result.status });
}
