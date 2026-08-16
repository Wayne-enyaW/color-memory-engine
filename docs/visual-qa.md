# Visual QA record

Last reviewed: 2026-08-16

The reference interface was compared with a locally generated concept before release. The concept is not a product claim or a shipped asset; it was used only to establish layout, hierarchy, and visual tone.

## Fidelity ledger

| Concept point | Implemented result |
| --- | --- |
| Light canvas with a strong blue action color | White interface, cobalt primary actions, and high-contrast black text |
| Persistent game-mode selector | Daily Mix, Pure Colors, World Flags, and Geometric Demo remain visible beside the game on desktop and above it on mobile |
| Large visual-memory target | The active target owns the largest area in the game panel, with the prompt overlaid at the lower right |
| Deterministic progress | The current round and five-step progress indicator are visible before and after a guess |
| Inspectable engine value proposition | Deterministic rounds, CIEDE2000 scoring, and licensed packs are named below the playable demo |
| Direct local-start path | The page shows the clone, install, and development commands and links to the content-pack guide |

## Deliberate differences

- The shipped page uses a more editorial left rail and a black/lime documentation band to distinguish the engine from a generic dashboard.
- The concept's decorative illustration was replaced with actual content-pack targets so every screenshot reflects runnable behavior.
- Controls appear only during recall. This keeps the preview state focused on memory rather than exposing inactive sliders.
- Copy was shortened where needed to describe implemented behavior only. No adoption, popularity, or impact claims were added.

## Browser checks

- Production build inspected in the in-app browser at 1280 × 720.
- Responsive DOM inspected at 390 × 844 with device scale factor 1; document width and scroll width both measured 390 pixels.
- A Chrome headless screenshot was used as a secondary mobile visual check because the in-app browser's full-page capture cropped the device-scale rendering.
- Preview, recall, exact-color hint, reveal, and score states were exercised. The exact-color hint produced CIEDE2000 `0` and a `9.00 / 10` score after the documented one-point hint penalty.
- No browser console errors were present in the checked flow.
