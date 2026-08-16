import { describe, expect, it } from "vitest";
import { contentPacks, getGame } from "@/lib/content/registry";
import { createRounds, isDateSeed } from "./rounds";

describe("deterministic rounds", () => {
  const game = getGame("daily-mix")!;

  it("returns the same sequence for the same seed", () => {
    const first = createRounds(game, contentPacks, "2026-08-16");
    const second = createRounds(game, contentPacks, "2026-08-16");
    expect(first).toEqual(second);
  });

  it("changes the sequence for another date", () => {
    const first = createRounds(game, contentPacks, "2026-08-16").map((item) => item.targetId);
    const second = createRounds(game, contentPacks, "2026-08-17").map((item) => item.targetId);
    expect(first).not.toEqual(second);
  });

  it("rejects invalid calendar dates", () => {
    expect(isDateSeed("2026-02-29")).toBe(false);
    expect(isDateSeed("2026-08-16")).toBe(true);
    expect(() => createRounds(game, contentPacks, "16-08-2026")).toThrow();
  });
});
