import { GameBoard } from "@/components/game-board";
import { createRounds, todayUtc } from "@/lib/core/rounds";
import { contentPacks, games, getGame } from "@/lib/content/registry";

type PageProps = { searchParams: Promise<{ game?: string; practice?: string }> };

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const game = getGame(params.game ?? "daily-mix") ?? games[0];
  const practiceSeed = params.practice?.slice(0, 80);
  const dateSeed = todayUtc();
  const rounds = createRounds(game, contentPacks, dateSeed, practiceSeed ? `practice:${practiceSeed}` : "daily");

  return (
    <main>
      <section className="play-shell" id="play">
        <aside className="game-intro">
          <p className="eyebrow">Open game engine · v0.1.0</p>
          <h1>Remember<br />{" "}the color.</h1>
          <p className="lede">Preview it. Rebuild it. See how close perception gets.</p>
          <div className="mode-list" aria-label="Choose a game">
            {games.map((item, index) => (
              <a key={item.id} className={item.id === game.id ? "mode active" : "mode"} href={`/?game=${item.id}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>{item.title}
              </a>
            ))}
          </div>
          <div className="sidebar-note">
            <strong>{practiceSeed ? "Practice run" : `Daily seed · ${dateSeed}`}</strong>
            <span>Same UTC date, same rounds.</span>
          </div>
        </aside>
        <GameBoard key={`${game.id}:${practiceSeed ?? "daily"}`} game={game} rounds={rounds} practice={Boolean(practiceSeed)} />
      </section>

      <section className="principles" id="packs">
        <div>
          <p className="eyebrow">What is included</p>
          <h2>Built to fork,<br />inspect, and extend.</h2>
        </div>
        <article><span>01</span><h3>Deterministic rounds</h3><p>Seeded selection produces the same daily target order on the client and server.</p></article>
        <article><span>02</span><h3>Perceptual scoring</h3><p>CIEDE2000 compares Lab colors, with reference-pair regression tests in the repository.</p></article>
        <article><span>03</span><h3>Licensed content packs</h3><p>Pure colors, public-domain flags, and original geometric SVGs ship with provenance notes.</p></article>
      </section>

      <section className="docs-band" id="docs">
        <div><p className="eyebrow">Five-minute path</p><h2>Run locally. Add one pack. Keep the scoring core untouched.</h2></div>
        <pre><code>git clone https://github.com/Wayne-enyaW/color-memory-engine.git{"\n"}cd color-memory-engine{"\n"}npm install && npm run dev</code></pre>
        <a className="text-link" href="https://github.com/Wayne-enyaW/color-memory-engine/blob/main/docs/content-packs.md">Read the content pack guide →</a>
      </section>
    </main>
  );
}
