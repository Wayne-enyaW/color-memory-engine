# Contributing

Thank you for considering a contribution. Small, reviewable changes with a clear user or maintainer benefit are preferred.

## Before opening a pull request

1. Search existing issues and pull requests.
2. Open an issue first for new runtime dependencies, public API changes, new storage backends, or license-sensitive content.
3. Fork the repository and create a focused branch.
4. Run `npm install`, then `npm run lint`, `npm run test`, and `npm run build`.
5. Explain behavior changes, tests, and content provenance in the pull request template.

Pull requests from forks use GitHub's `pull_request` event. CI does not expose repository secrets to forked code.

## Content contributions

Do not submit copyrighted characters, brand art, scraped assets, or files with unclear ownership. A new pack must include:

- a stable pack ID and semantic version;
- a non-empty license and source URL when applicable;
- globally unique target IDs;
- canonical uppercase `#RRGGBB` colors;
- local assets and an updated asset manifest;
- a short provenance note and validation tests.

See `docs/content-packs.md` for a complete example.

## Review standard

Maintainers check correctness, scope, test coverage, accessible interaction, license evidence, and whether the simplest implementation meets the need. Submitting a pull request does not guarantee acceptance.

By contributing code, you agree that it may be distributed under the MIT License. Content contributions must remain under their declared license.
