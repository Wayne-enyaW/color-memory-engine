# Codex for Open Source evidence log

This file separates current facts from application targets. The targets below are internal readiness criteria, not OpenAI requirements.

## Current verified facts — 2026-08-16

- Project version: `0.1.0` in the source tree.
- Automated tests: 25 passing tests across color math, deterministic rounds, challenges, content validation, and server verification.
- Distributed assets: 201 checksummed records; 195 are byte-matched upstream flags and 6 are original geometric SVGs.
- Production build: Next.js 16.2.6 build passed locally on Node.js 22.22.2.
- Reference deployment: <https://color-memory-engine.vercel.app> is live without Redis-backed persistence.
- External contributors: 0.
- Verified third-party deployments or packs: 0.
- Non-maintainer issues or pull requests: 0.
- Public maintenance duration: 0 weeks before the repository is published.

These zero values are not omissions. They are why the application must not be submitted at the initial code release.

## Internal readiness gate

- [ ] Publicly maintained for at least six weeks.
- [ ] Three releases with substantive code, documentation, or content changes.
- [ ] Three verified third-party deployments or content-pack uses in `ADOPTERS.md`.
- [ ] Two contributors who are not the maintainer.
- [ ] Five substantive issues or pull requests from non-maintainers.
- [ ] Thirty continuous days of privacy-preserving usage data, separated from developer adoption data.
- [ ] CI, secret scan, CodeQL, and license checks passing.
- [ ] Every application claim has a public link or a dated, reproducible screenshot.

Stars are recorded as context, not used as the sole submission threshold. Stars must never be purchased, exchanged, or induced through misleading incentives.

## Evidence table

| Claim | Current evidence | Submission rule |
| --- | --- | --- |
| Maintainer role | Repository permissions and sustained commit/review history | Link public profile and maintainer activity |
| Releases | GitHub Releases page | Count only tagged releases with substantive changes |
| Contributors | GitHub contributors graph and merged PRs | Exclude the maintainer and automated accounts |
| Adoption | `ADOPTERS.md` entries with public URLs | Exclude the reference deployment and maintainer-owned copies |
| Maintenance | Issue/PR response and review history | Use public timestamps, not estimates |
| Runtime use | Anonymous, aggregate reference-deployment report | Do not describe visits as developer adoption |
