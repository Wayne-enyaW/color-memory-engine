import { describe, expect, it } from "vitest";
import { deltaE00Lab, hexToHsb, hexToRgb, hsbToHex, normalizeHue, scoreGuess } from "./color";

describe("CIEDE2000", () => {
  const referencePairs = [
    [[50, 2.6772, -79.7751], [50, 0, -82.7485], 2.0425],
    [[50, 3.1571, -77.2803], [50, 0, -82.7485], 2.8615],
    [[50, 2.8361, -74.02], [50, 0, -82.7485], 3.4412],
    [[50, -1.3802, -84.2814], [50, 0, -82.7485], 1],
    [[50, -1.1848, -84.8006], [50, 0, -82.7485], 1],
    [[50, -0.9009, -85.5211], [50, 0, -82.7485], 1],
  ] as const;

  it.each(referencePairs)("matches a Sharma reference pair", (left, right, expected) => {
    const actual = deltaE00Lab(
      { l: left[0], a: left[1], b: left[2] },
      { l: right[0], a: right[1], b: right[2] },
    );
    expect(actual).toBeCloseTo(expected, 4);
  });

  it("scores identical colors as ten", () => {
    expect(scoreGuess("#2F63F5", "#2F63F5")).toEqual({ deltaE00: 0, score: 10 });
    expect(scoreGuess("#2F63F5", "#2F63F5", true).score).toBe(9);
  });
});

describe("color conversion boundaries", () => {
  it("normalizes positive and negative hue", () => {
    expect(normalizeHue(360)).toBe(0);
    expect(normalizeHue(-1)).toBe(359);
    expect(normalizeHue(721)).toBe(1);
  });

  it("clamps HSB channels and returns uppercase hex", () => {
    expect(hsbToHex({ h: 0, s: 120, b: 120 })).toBe("#FF0000");
    expect(hsbToHex({ h: 240, s: -2, b: 100 })).toBe("#FFFFFF");
  });

  it("rejects non-canonical hex input", () => {
    expect(() => hexToRgb("#fff")).toThrow(/Expected #RRGGBB/);
    expect(() => hexToHsb("#ffffff")).toThrow(/Expected #RRGGBB/);
    expect(() => hexToRgb("#GG0000")).toThrow(/Expected #RRGGBB/);
  });
});
