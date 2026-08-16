import { describe, expect, it } from "vitest";
import type { ContentPack } from "@/lib/core/types";
import { contentPacks, games } from "./registry";
import { validateContent } from "./validation";

describe("content registry validation", () => {
  it("accepts every distributed v1 pack", () => {
    expect(validateContent(contentPacks, games)).toEqual([]);
  });

  it("reports duplicate ids, licenses, hex values, and missing files", () => {
    const invalid: ContentPack = {
      id: "bad id",
      name: "Broken",
      version: "latest",
      license: "",
      targets: [
        { id: "same", prompt: "One", difficulty: "easy", targetHex: "#fff" as `#${string}`, visual: { kind: "solid" } },
        { id: "same", prompt: "Two", difficulty: "easy", targetHex: "#FFFFFF", visual: { kind: "image", imageSrc: "/missing.svg" } },
      ],
    };
    const errors = validateContent([invalid], []);
    expect(errors.join("\n")).toMatch(/Invalid pack id/);
    expect(errors.join("\n")).toMatch(/has no license/);
    expect(errors.join("\n")).toMatch(/Invalid targetHex/);
    expect(errors.join("\n")).toMatch(/Duplicate target id/);
    expect(errors.join("\n")).toMatch(/Missing asset/);
  });

  it("rejects mask and foreground dimension mismatches", () => {
    const invalidMask: ContentPack = {
      id: "mask-demo",
      name: "Mask demo",
      version: "1.0.0",
      license: "CC0-1.0",
      targets: [{
        id: "mask-demo-one",
        prompt: "Mismatch",
        difficulty: "easy",
        targetHex: "#FFFFFF",
        visual: {
          kind: "mask",
          foregroundSrc: "/content/geometric/orbit.svg",
          maskSrc: "/content/flags/ad.svg",
        },
      }],
    };
    expect(validateContent([invalidMask], []).join("\n")).toMatch(/dimensions differ/);
  });
});
