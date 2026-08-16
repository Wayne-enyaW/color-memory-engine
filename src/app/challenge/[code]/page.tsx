import { notFound } from "next/navigation";
import { GameBoard } from "@/components/game-board";
import type { GameDefinition, GameRound } from "@/lib/core/types";
import { resolveLongChallenge } from "@/lib/storage/challenge-service";

export default async function ChallengePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const resolved = resolveLongChallenge(code);
  if (!resolved) notFound();
  const { payload, target } = resolved;
  const game: GameDefinition = {
    id: payload.gameId,
    title: "Shared challenge",
    roundCount: 1,
    packIds: [payload.packId],
    dailySeedNamespace: "shared-challenge-v1",
  };
  const round: GameRound = {
    id: `challenge:${payload.packId}:${payload.targetId}`,
    gameId: payload.gameId,
    dateSeed: payload.dateSeed,
    roundIndex: 1,
    packId: payload.packId,
    targetId: payload.targetId,
    prompt: target.prompt,
    difficulty: target.difficulty,
    targetHex: target.targetHex,
    visual: target.visual,
  };
  return <main className="challenge-page"><div className="challenge-heading"><p className="eyebrow">Shared challenge</p><h1>One color.<br />One remembered guess.</h1></div><GameBoard game={game} rounds={[round]} practice /></main>;
}
