import type { HsbColor, LabColor, RgbColor } from "./types";

const HEX_PATTERN = /^#[0-9A-F]{6}$/;
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
const toRad = (degrees: number) => (degrees * Math.PI) / 180;
const toDeg = (radians: number) => (radians * 180) / Math.PI;
const normalizeAngle = (degrees: number) => ((degrees % 360) + 360) % 360;

export function isHexColor(value: unknown): value is `#${string}` {
  return typeof value === "string" && HEX_PATTERN.test(value);
}

export function assertHexColor(value: string): asserts value is `#${string}` {
  if (!isHexColor(value)) {
    throw new Error(`Invalid color "${value}". Expected #RRGGBB in uppercase.`);
  }
}

export function normalizeHue(hue: number) {
  return ((Math.round(hue) % 360) + 360) % 360;
}

export function hsbToRgb({ h, s, b }: HsbColor): RgbColor {
  const hue = normalizeHue(h);
  const saturation = clamp(s, 0, 100) / 100;
  const brightness = clamp(b, 0, 100) / 100;
  const chroma = brightness * saturation;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = brightness - chroma;
  let [r1, g1, b1] = [0, 0, 0];

  if (hue < 60) [r1, g1, b1] = [chroma, x, 0];
  else if (hue < 120) [r1, g1, b1] = [x, chroma, 0];
  else if (hue < 180) [r1, g1, b1] = [0, chroma, x];
  else if (hue < 240) [r1, g1, b1] = [0, x, chroma];
  else if (hue < 300) [r1, g1, b1] = [x, 0, chroma];
  else [r1, g1, b1] = [chroma, 0, x];

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

export function rgbToHex({ r, g, b }: RgbColor): `#${string}` {
  return `#${[r, g, b]
    .map((channel) => Math.round(clamp(channel, 0, 255)).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

export function hsbToHex(color: HsbColor) {
  return rgbToHex(hsbToRgb(color));
}

export function hexToRgb(hex: string): RgbColor {
  assertHexColor(hex);
  return {
    r: Number.parseInt(hex.slice(1, 3), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    b: Number.parseInt(hex.slice(5, 7), 16),
  };
}

export function hexToHsb(hex: string): HsbColor {
  const { r, g, b } = hexToRgb(hex);
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let h = 0;

  if (delta !== 0) {
    if (max === red) h = 60 * (((green - blue) / delta) % 6);
    else if (max === green) h = 60 * ((blue - red) / delta + 2);
    else h = 60 * ((red - green) / delta + 4);
  }

  return {
    h: normalizeHue(h),
    s: max === 0 ? 0 : Math.round((delta / max) * 100),
    b: Math.round(max * 100),
  };
}

function pivotRgb(channel: number) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function pivotXyz(value: number) {
  return value > 0.008856 ? Math.cbrt(value) : 7.787037 * value + 16 / 116;
}

export function rgbToLab(rgb: RgbColor): LabColor {
  const red = pivotRgb(rgb.r);
  const green = pivotRgb(rgb.g);
  const blue = pivotRgb(rgb.b);
  const x = (red * 0.4124564 + green * 0.3575761 + blue * 0.1804375) / 0.95047;
  const y = red * 0.2126729 + green * 0.7151522 + blue * 0.072175;
  const z = (red * 0.0193339 + green * 0.119192 + blue * 0.9503041) / 1.08883;
  const fx = pivotXyz(x);
  const fy = pivotXyz(y);
  const fz = pivotXyz(z);
  return { l: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

export function deltaE00Lab(lab1: LabColor, lab2: LabColor) {
  const avgLp = (lab1.l + lab2.l) / 2;
  const c1 = Math.hypot(lab1.a, lab1.b);
  const c2 = Math.hypot(lab2.a, lab2.b);
  const avgC = (c1 + c2) / 2;
  const g = 0.5 * (1 - Math.sqrt(avgC ** 7 / (avgC ** 7 + 25 ** 7)));
  const a1p = (1 + g) * lab1.a;
  const a2p = (1 + g) * lab2.a;
  const c1p = Math.hypot(a1p, lab1.b);
  const c2p = Math.hypot(a2p, lab2.b);
  const avgCp = (c1p + c2p) / 2;
  // CIEDE2000 operates on continuous hue angles. Rounding here produces
  // measurable errors against the published Sharma reference pairs.
  const h1p = normalizeAngle(toDeg(Math.atan2(lab1.b, a1p)));
  const h2p = normalizeAngle(toDeg(Math.atan2(lab2.b, a2p)));
  const dhp = c1p * c2p === 0
    ? 0
    : Math.abs(h2p - h1p) <= 180
      ? h2p - h1p
      : h2p <= h1p ? h2p - h1p + 360 : h2p - h1p - 360;
  const dLp = lab2.l - lab1.l;
  const dCp = c2p - c1p;
  const dHp = 2 * Math.sqrt(c1p * c2p) * Math.sin(toRad(dhp / 2));
  const avgHp = c1p * c2p === 0
    ? h1p + h2p
    : Math.abs(h1p - h2p) <= 180
      ? (h1p + h2p) / 2
      : h1p + h2p < 360 ? (h1p + h2p + 360) / 2 : (h1p + h2p - 360) / 2;
  const t = 1 - 0.17 * Math.cos(toRad(avgHp - 30)) + 0.24 * Math.cos(toRad(2 * avgHp))
    + 0.32 * Math.cos(toRad(3 * avgHp + 6)) - 0.2 * Math.cos(toRad(4 * avgHp - 63));
  const deltaTheta = 30 * Math.exp(-(((avgHp - 275) / 25) ** 2));
  const rc = 2 * Math.sqrt(avgCp ** 7 / (avgCp ** 7 + 25 ** 7));
  const sl = 1 + (0.015 * (avgLp - 50) ** 2) / Math.sqrt(20 + (avgLp - 50) ** 2);
  const sc = 1 + 0.045 * avgCp;
  const sh = 1 + 0.015 * avgCp * t;
  const rt = -Math.sin(toRad(2 * deltaTheta)) * rc;
  return Math.sqrt((dLp / sl) ** 2 + (dCp / sc) ** 2 + (dHp / sh) ** 2
    + rt * (dCp / sc) * (dHp / sh));
}

export function deltaE00(hexA: string, hexB: string) {
  return deltaE00Lab(rgbToLab(hexToRgb(hexA)), rgbToLab(hexToRgb(hexB)));
}

export function scoreGuess(targetHex: string, guessHex: string, hintUsed = false) {
  const difference = deltaE00(targetHex, guessHex);
  const score = clamp(10 - difference * 0.2 - (hintUsed ? 1 : 0), 0, 10);
  return { deltaE00: Number(difference.toFixed(2)), score: Number(score.toFixed(2)) };
}
