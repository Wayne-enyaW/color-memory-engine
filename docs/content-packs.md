# Creating a content pack

A pack is data plus local, licensed assets. It must not need changes to scoring, rounds, storage, or API modules.

## Minimal pack

```ts
import type { ContentPack } from "@/lib/core/types";

export const seasonsPack: ContentPack = {
  id: "seasons-demo",
  name: "Seasons Demo",
  version: "1.0.0",
  license: "CC0-1.0",
  targets: [
    {
      id: "seasons-demo-autumn",
      prompt: "Remember the autumn square",
      difficulty: "easy",
      targetHex: "#C85A32",
      visual: { kind: "solid" },
    },
  ],
};
```

Supported visuals are:

```ts
{ kind: "solid" }
{ kind: "image", imageSrc: "/content/my-pack/target.svg" }
{ kind: "mask", foregroundSrc: "/content/my-pack/front.svg", maskSrc?: "/content/my-pack/mask.svg" }
```

## Register the pack

1. Add the definition under `src/lib/content/packs`.
2. Import it into `src/lib/content/registry.ts` and add it to `contentPacks`.
3. Add its ID to a `GameDefinition` or create a new game.
4. Put visual files under `public/content/<pack-id>`.
5. Add `content/packs/<pack-id>/README.md` with source and license notes.
6. Run `npm run assets:manifest` after reviewing every added file.
7. Run `npm run validate:content`, `npm run test`, and `npm run build`.

## Validation rules

- pack and target IDs use lowercase kebab case;
- pack IDs and target IDs are unique across the registry;
- semantic versions use `major.minor.patch`;
- licenses are non-empty;
- target colors are uppercase `#RRGGBB`;
- assets are local absolute public paths without `..`;
- referenced files exist and use a supported image extension;
- SVG and PNG mask/foreground pairs have matching dimensions;
- every game references a registered pack;
- manifest sizes and SHA-256 checksums match.

Invalid content fails the build. It is never silently skipped.

## License review

Do not infer a license because an image is easy to download. Record the author or upstream project, an exact revision when possible, a license declaration, and file checksums. Public-domain flags can still be subject to non-copyright rules in some jurisdictions. If rights are uncertain, do not distribute the pack.
