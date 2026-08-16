"use client";

import Image from "next/image";
import { type FormEvent, useMemo, useState } from "react";
import { encodeChallenge } from "@/lib/core/challenge";
import { hexToHsb, hsbToHex, scoreGuess } from "@/lib/core/color";
import type { GameDefinition, GameRound, HsbColor, RoundSubmission } from "@/lib/core/types";

type Phase = "preview" | "guessing" | "reveal" | "completed";
type Result = ReturnType<typeof scoreGuess> & RoundSubmission;
type PublicLeaderboardEntry = { id: string; username: string; score: number };

function Visual({ round, phase, guessHex }: { round: GameRound; phase: Phase; guessHex: string }) {
  const showTarget = phase === "preview" || phase === "reveal" || phase === "completed";
  if (round.visual.kind === "solid") {
    return <div className="solid-visual" style={{ backgroundColor: showTarget ? round.targetHex : guessHex }} aria-label={showTarget ? "Target color" : "Your current color"} />;
  }
  if (showTarget && round.visual.kind === "image") {
    return <Image className="target-image" src={round.visual.imageSrc} alt="Visual memory target" fill sizes="(max-width: 800px) 100vw, 60vw" priority />;
  }
  if (showTarget && round.visual.kind === "mask") {
    return <Image className="target-image" src={round.visual.foregroundSrc} alt="Visual memory target" fill sizes="(max-width: 800px) 100vw, 60vw" priority />;
  }
  return <div className="memory-hidden"><span aria-hidden="true">◌</span><p>The visual is hidden.<br />Rebuild the remembered color.</p></div>;
}

export function GameBoard({ game, rounds, practice }: { game: GameDefinition; rounds: GameRound[]; practice: boolean }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("preview");
  const [guess, setGuess] = useState<HsbColor>({ h: 220, s: 65, b: 78 });
  const [exactHintHex, setExactHintHex] = useState<string | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [shareStatus, setShareStatus] = useState("");
  const [username, setUsername] = useState("");
  const [leaderboardStatus, setLeaderboardStatus] = useState("");
  const [leaderboard, setLeaderboard] = useState<PublicLeaderboardEntry[]>([]);
  const round = rounds[roundIndex];
  const guessHex = useMemo(() => exactHintHex ?? hsbToHex(guess), [exactHintHex, guess]);
  const score = phase === "reveal" ? scoreGuess(round.targetHex, guessHex, hintUsed) : null;
  const practiceUrl = `/?game=${game.id}&practice=${encodeURIComponent(`${round.id}:practice`)}`;

  function update(channel: keyof HsbColor, value: number) {
    setExactHintHex(null);
    setGuess((current) => ({ ...current, [channel]: value }));
  }

  function reveal() {
    setResults((current) => [...current, { packId: round.packId, targetId: round.targetId, guessHex, hintUsed, ...scoreGuess(round.targetHex, guessHex, hintUsed) }]);
    setPhase("reveal");
  }

  function nextRound() {
    if (roundIndex === rounds.length - 1) {
      setPhase("completed");
      return;
    }
    setRoundIndex((value) => value + 1);
    setGuess({ h: 220, s: 65, b: 78 });
    setExactHintHex(null);
    setHintUsed(false);
    setShareStatus("");
    setPhase("preview");
  }

  async function shareChallenge() {
    const code = encodeChallenge({ gameId: game.id, dateSeed: round.dateSeed, packId: round.packId, targetId: round.targetId });
    const longUrl = `${window.location.origin}/challenge/${code}`;
    let url = longUrl;
    try {
      const response = await fetch("/api/challenges", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code }) });
      if (response.ok) {
        const data = await response.json() as { challengeId: string };
        url = `${window.location.origin}/c/${data.challengeId}`;
      }
    } catch {
      // The long URL remains fully functional without Redis.
    }
    await navigator.clipboard.writeText(url);
    setShareStatus(url === longUrl ? "Long challenge link copied." : "Short challenge link copied.");
  }

  async function submitScore(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLeaderboardStatus("Submitting for server verification…");
    const payload = {
      username,
      gameId: game.id,
      scope: "daily",
      dateSeed: round.dateSeed,
      rounds: results.map(({ packId, targetId, guessHex: submittedHex, hintUsed: submittedHint }) => ({
        packId,
        targetId,
        guessHex: submittedHex,
        hintUsed: submittedHint,
      })),
    };
    const response = await fetch("/api/leaderboard", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json() as { error?: string; duplicate?: boolean };
    if (!response.ok) {
      setLeaderboardStatus(data.error ?? "Score submission failed.");
      return;
    }
    setLeaderboardStatus(data.duplicate ? "This run was already recorded." : "Server-verified score recorded.");
    const listResponse = await fetch(`/api/leaderboard?gameId=${encodeURIComponent(game.id)}&dateSeed=${round.dateSeed}`);
    if (listResponse.ok) {
      const list = await listResponse.json() as { entries?: PublicLeaderboardEntry[] };
      setLeaderboard(list.entries ?? []);
    }
  }

  const average = results.length ? results.reduce((sum, item) => sum + item.score, 0) / results.length : 0;

  return (
    <section className="game-panel" aria-label={`${game.title} game`}>
      <div className="round-topline">
        <div><span>{game.title}</span><strong>{phase === "preview" ? "Preview" : phase === "guessing" ? "Recall" : phase === "reveal" ? "Result" : "Complete"}</strong></div>
        <div className="round-count">Round {Math.min(roundIndex + 1, rounds.length)} <span>/ {rounds.length}</span></div>
      </div>
      <div className="progress" aria-label={`Round ${roundIndex + 1} of ${rounds.length}`}>
        {rounds.map((item, index) => <i key={item.id} className={index <= roundIndex ? "filled" : ""} />)}
      </div>

      {phase === "completed" ? (
        <div className="completion-card">
          <p className="eyebrow">Run complete</p>
          <strong>{average.toFixed(2)}</strong><span>average score out of 10</span>
          <div className="result-swatches">{results.map((item) => <i key={item.targetId} style={{ background: item.guessHex }} title={`${item.score.toFixed(2)} / 10`} />)}</div>
          <p>Your results stay in this browser unless you explicitly submit them to a configured leaderboard.</p>
          {!practice && (
            <form className="leaderboard-form" onSubmit={submitScore}>
              <label htmlFor="leaderboard-name">Display name</label>
              <div><input id="leaderboard-name" name="username" value={username} onChange={(event) => setUsername(event.target.value)} minLength={1} maxLength={32} required autoComplete="nickname" /><button className="secondary-button" type="submit">Submit verified score</button></div>
              <output aria-live="polite">{leaderboardStatus}</output>
            </form>
          )}
          {leaderboard.length > 0 && <ol className="mini-leaderboard">{leaderboard.slice(0, 5).map((entry) => <li key={entry.id}><span>{entry.username}</span><b>{entry.score.toFixed(2)}</b></li>)}</ol>}
          <a className="primary-button" href={practiceUrl}>Start a new practice</a>
        </div>
      ) : (
        <>
          <div className={`visual-stage phase-${phase}`}>
            <Visual round={round} phase={phase} guessHex={guessHex} />
            <div className="prompt-card"><span>{round.difficulty}</span><h2>{round.prompt}</h2></div>
          </div>

          {phase === "guessing" && (
            <div className="controls">
              <label><span>Hue <b>{guess.h}°</b></span><input aria-label="Hue" type="range" min="0" max="359" value={guess.h} onChange={(event) => update("h", Number(event.target.value))} style={{ accentColor: guessHex }} /></label>
              <label><span>Saturation <b>{guess.s}%</b></span><input aria-label="Saturation" type="range" min="0" max="100" value={guess.s} onChange={(event) => update("s", Number(event.target.value))} style={{ accentColor: guessHex }} /></label>
              <label><span>Brightness <b>{guess.b}%</b></span><input aria-label="Brightness" type="range" min="0" max="100" value={guess.b} onChange={(event) => update("b", Number(event.target.value))} style={{ accentColor: guessHex }} /></label>
              <div className="control-actions"><button className="hint-button" type="button" onClick={() => { setGuess(hexToHsb(round.targetHex)); setExactHintHex(round.targetHex); setHintUsed(true); }}>Use exact-color hint (−1)</button><button className="primary-button" type="button" onClick={reveal}>Lock in {guessHex}</button></div>
            </div>
          )}

          {phase === "reveal" && score && (
            <div className="reveal-row">
              <div><span>Your color</span><i style={{ background: guessHex }} /><b>{guessHex}</b></div>
              <div><span>Target</span><i style={{ background: round.targetHex }} /><b>{round.targetHex}</b></div>
              <div className="score"><span>CIEDE2000 · {score.deltaE00}</span><strong>{score.score.toFixed(2)}</strong><b>/ 10</b></div>
            </div>
          )}

          <div className="game-actions">
            {phase === "preview" && <button className="primary-button" type="button" onClick={() => setPhase("guessing")}>Hide color & start matching</button>}
            {phase === "reveal" && <><button className="secondary-button" type="button" onClick={shareChallenge}>Copy challenge link</button><button className="primary-button" type="button" onClick={nextRound}>{roundIndex === rounds.length - 1 ? "See final score" : "Next round"}</button></>}
            {shareStatus && <output className="share-status">{shareStatus}</output>}
            <a className="quiet-link" href={practiceUrl}>{practice ? "Restart practice" : "New practice"}</a>
          </div>
        </>
      )}
    </section>
  );
}
