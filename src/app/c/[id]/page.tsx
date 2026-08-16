import { notFound, redirect } from "next/navigation";
import { encodeChallenge } from "@/lib/core/challenge";
import { storageKeys } from "@/lib/storage/keys";
import { createStorageFromEnv } from "@/lib/storage/upstash";

export default async function ShortChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-zA-Z0-9_-]{8,32}$/.test(id)) notFound();
  const storage = createStorageFromEnv();
  if (!storage) notFound();
  let record;
  try {
    record = await storage.getChallenge(storageKeys.challenge(id));
  } catch {
    notFound();
  }
  if (!record) notFound();
  const code = encodeChallenge({ gameId: record.gameId, dateSeed: record.dateSeed, packId: record.packId, targetId: record.targetId });
  redirect(`/challenge/${code}`);
}
