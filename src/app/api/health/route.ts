import { createStorageFromEnv } from "@/lib/storage/upstash";

export function GET() {
  return Response.json({
    ok: true,
    service: "color-memory-engine",
    storageConfigured: createStorageFromEnv() !== null,
  });
}
