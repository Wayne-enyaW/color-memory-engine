# Color Memory Engine

[![CI](https://github.com/Wayne-enyaW/color-memory-engine/actions/workflows/ci.yml/badge.svg)](https://github.com/Wayne-enyaW/color-memory-engine/actions/workflows/ci.yml)
[![CodeQL](https://github.com/Wayne-enyaW/color-memory-engine/actions/workflows/codeql.yml/badge.svg)](https://github.com/Wayne-enyaW/color-memory-engine/actions/workflows/codeql.yml)
[![Secret scan](https://github.com/Wayne-enyaW/color-memory-engine/actions/workflows/secret-scan.yml/badge.svg)](https://github.com/Wayne-enyaW/color-memory-engine/actions/workflows/secret-scan.yml)
[![MIT license](https://img.shields.io/badge/license-MIT-151515.svg)](LICENSE)

Color Memory Engine is a self-hostable open-source engine for building daily visual color-memory games. It provides deterministic round generation, perceptual CIEDE2000 scoring, licensed content packs, shareable challenges, server-verified results, and an optional Redis leaderboard.

Reference deployment: <https://color-memory-engine.vercel.app>

This is a new, independent project with a clean Git history. It does not include character assets, third-party character data, production credentials, or private product documents from the private source project.

## Why this is more than a color-picker demo

- Daily rounds are derived from `gameId + UTC date + namespace`, so server and client agree on the sequence.
- Scores use CIEDE2000 in Lab space and are tested against published Sharma reference pairs.
- Content is a validated extension boundary. Packs declare stable IDs, target colors, visual assets, versions, and licenses.
- Leaderboard writes are recomputed from registry targets on the server; submitted scores and target colors are ignored.
- The core game has no database dependency. Redis only enables persistence, short challenge links, and rankings.

## Run it locally

Requirements: Node.js 22.

```bash
git clone https://github.com/Wayne-enyaW/color-memory-engine.git
cd color-memory-engine
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables are required to play daily, practice, or long-link challenges.

## Included v1 content

| Pack | What it contains | License |
| --- | --- | --- |
| `pure-colors` | 48 colors generated from fixed HSB definitions | CC0-1.0 |
| `world-flags` | 195 country flag SVGs and one declared color target per flag | Public domain, per upstream declaration |
| `geometric-demo` | 6 original geometric SVG compositions | CC0-1.0 |

Every distributed asset has a source, license, byte size, and SHA-256 checksum in [`content/ASSET_MANIFEST.json`](content/ASSET_MANIFEST.json). See [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) for the flag-source caveat.

## Add a content pack

Implement the `ContentPack` contract in `src/lib/content/packs`, register it in `src/lib/content/registry.ts`, add its assets under `public`, and run:

```bash
npm run assets:manifest
npm run validate:content
```

Invalid IDs, duplicate target IDs, missing licenses, non-canonical hex colors, unknown game references, missing assets, and changed checksums fail validation. The full walkthrough is in [`docs/content-packs.md`](docs/content-packs.md).

## Optional Redis features

Copy `.env.example` to `.env.local` and configure Upstash-compatible REST credentials:

```bash
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
LEADERBOARD_SIGNING_SECRET=use-a-long-random-production-secret
```

Without Redis, the game remains playable, long challenge URLs work, leaderboard reads return `configured: false`, and writes/short links return an explicit 503. Production leaderboard writes also return 503 when `LEADERBOARD_SIGNING_SECRET` is missing. The application never substitutes process memory for production persistence.

## Quality checks

```bash
npm run lint
npm run test
npm run build
```

Pull requests run these checks plus CodeQL and secret scanning. Content checks run before every production build.

## Architecture

- `src/lib/core`: pure color math, scoring, seeding, rounds, and challenge codec
- `src/lib/content`: pack contracts, registry, and build-time validation
- `src/lib/storage`: storage interfaces, Upstash Redis, TTL, idempotency, and rate limiting
- `src/app/api`: bounded HTTP parsing and orchestration
- `src/components`: non-authoritative game UI

See [`docs/architecture.md`](docs/architecture.md) and [`docs/deployment.md`](docs/deployment.md).

## Current limitations and non-goals

- v0.1.0 is an application template, not an npm library or monorepo.
- The default UI supports one target color per visual.
- Short challenges and rankings require Redis.
- There is no user-account system or moderation workflow.
- The engine does not require OpenAI APIs and does not add AI features for program eligibility.
- Upstream flag maintainers note that non-copyright restrictions may still apply to flag use in some jurisdictions.

## Contributing

Start with [`CONTRIBUTING.md`](CONTRIBUTING.md), the public [`ROADMAP.md`](ROADMAP.md), or an issue labeled `good first issue`. Security reports should follow [`SECURITY.md`](SECURITY.md).

Code is MIT licensed. Content licenses are recorded per pack and asset.
