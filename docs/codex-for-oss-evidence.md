# Codex for Open Source evidence log

This file separates current facts from application positioning and longer-term evidence targets. The targets below are internal confidence milestones, not OpenAI requirements or blockers for an initial application.

## Current verified facts — 2026-08-16

- Project version: `0.1.0` in the source tree.
- Public repository: <https://github.com/Wayne-enyaW/color-memory-engine>, published 2026-08-16.
- Releases: 1 — <https://github.com/Wayne-enyaW/color-memory-engine/releases/tag/v0.1.0>.
- Automated tests: 25 passing tests across color math, deterministic rounds, challenges, content validation, and server verification.
- Distributed assets: 201 checksummed records; 195 are byte-matched upstream flags and 6 are original geometric SVGs.
- Production build: Next.js 16.2.6 build passed locally on Node.js 22.22.2.
- Reference deployment: <https://color-memory-engine.vercel.app> is live without Redis-backed persistence.
- CI: <https://github.com/Wayne-enyaW/color-memory-engine/actions/runs/31951161650> passed lint, tests, content validation, and build for the release commit.
- CodeQL: <https://github.com/Wayne-enyaW/color-memory-engine/actions/runs/31951161626> passed after publication; open CodeQL alerts at fact-check time: 0.
- Secret scanning: <https://github.com/Wayne-enyaW/color-memory-engine/actions/runs/31951328143> passed a full-history Gitleaks scan; GitHub Secret Scanning and Push Protection are enabled with 0 open alerts at fact-check time.
- Maintainer-created contribution tasks: [#12](https://github.com/Wayne-enyaW/color-memory-engine/issues/12), [#13](https://github.com/Wayne-enyaW/color-memory-engine/issues/13), and [#14](https://github.com/Wayne-enyaW/color-memory-engine/issues/14). These do not count as non-maintainer activity.
- External contributors: 0.
- Verified third-party deployments or packs: 0.
- Non-maintainer issues or pull requests: 0.
- Public maintenance duration: less than one week as of this fact check.

These zero values are not omissions. A near-term application must use the ecosystem-importance path and disclose the project's early stage instead of presenting these values as adoption.

## Immediate submission readiness

- [x] Public repository and primary-maintainer role are verifiable.
- [x] A tagged release and live reference deployment are public.
- [x] The reusable problem, current features, limitations, and non-goals are documented.
- [x] CI, full-history secret scan, CodeQL, and license/provenance checks pass.
- [x] The application text explicitly says there is no verified broad adoption, external contributor, or third-party deployment evidence yet.
- [x] Every technical claim in the application is linked or reproducible from the repository.
- [ ] Maintainer has fact-checked the personal fields and OpenAI Organization ID outside the public repository.
- [ ] Maintainer has approved the final answers and submission.

## Post-submission evidence milestones

- [ ] Publicly maintained for at least six weeks.
- [ ] Three releases with substantive code, documentation, or content changes.
- [ ] Three verified third-party deployments or content-pack uses in `ADOPTERS.md`.
- [ ] Two contributors who are not the maintainer.
- [ ] Five substantive issues or pull requests from non-maintainers.
- [ ] Thirty continuous days of privacy-preserving usage data, separated from developer adoption data.
- [x] CI, secret scan, CodeQL, and license checks passing.
- [ ] Every application claim has a public link or a dated, reproducible screenshot.

These milestones can support a later application update or reapplication if the initial submission is not selected. They must not be manufactured through cosmetic releases, maintainer-owned “adopters,” or low-substance activity.

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
