# Asset provenance

## Distributed sources

| Directory | Source | Revision | License statement |
| --- | --- | --- | --- |
| `public/content/flags` | `hampusborgos/country-flags` | `c09927e63705529bbf59ca6684cd9b23225dddad` | Upstream `package.json` uses `PD`; upstream README states flags are public domain and notes other restrictions may apply |
| `public/content/geometric` | Original files created for this repository | initial v0.1.0 history | CC0-1.0 |

On 2026-08-16, all 195 distributed flag SVGs were byte-compared with the locked upstream revision. The repository contains only the country subset used by the World Flags pack; territories and regional flags outside that list are not distributed.

`content/ASSET_MANIFEST.json` records 201 assets with SHA-256, byte size, license, and source. `scripts/check-assets.mjs` verifies every recorded file before a build.

## Explicit exclusions

The repository does not distribute:

- third-party character or franchise images;
- character names, title names, watermarks, or character SEO pages;
- scripts that download character content from the private source project;
- proprietary production branding or analytics identifiers;
- private product, research, or operations documents.

## Updating flags

Review upstream changes and its current license statement, record the new exact commit, copy only intended SVGs, rerun the byte comparison, regenerate the manifest, and include the provenance change in the release notes.
