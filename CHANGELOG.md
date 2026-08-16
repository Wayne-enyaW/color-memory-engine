# Changelog

This project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-08-16

### Added

- Deterministic daily and practice round generation.
- CIEDE2000 perceptual scoring with Sharma reference-pair tests.
- Validated Pure Colors, World Flags, and Geometric Demo content packs.
- Long-link challenges and optional Redis-backed seven-day short links.
- Optional server-verified daily leaderboard with 45-day TTL, idempotency, and rate limiting.
- Local, Docker, and standalone Next.js deployment paths.
- CI, CodeQL, secret scanning, governance, security, and content provenance files.

### Known limitations

- No account system or score-name moderation.
- One target color per visual.
- Short links and rankings require compatible Redis REST credentials.
