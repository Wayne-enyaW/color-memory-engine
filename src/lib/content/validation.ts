import { existsSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { isHexColor } from "@/lib/core/color";
import type { ContentPack, GameDefinition } from "@/lib/core/types";

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function imageDimensions(path: string) {
  const extension = extname(path).toLowerCase();
  const buffer = readFileSync(path);
  if (extension === ".png" && buffer.length >= 24 && buffer.toString("ascii", 1, 4) === "PNG") {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (extension === ".svg") {
    const source = buffer.toString("utf8", 0, Math.min(buffer.length, 16_384));
    const viewBox = source.match(/viewBox=["']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*["']/i);
    if (viewBox) return { width: Number(viewBox[1]), height: Number(viewBox[2]) };
    const width = source.match(/\bwidth=["']([\d.]+)(?:px)?["']/i)?.[1];
    const height = source.match(/\bheight=["']([\d.]+)(?:px)?["']/i)?.[1];
    if (width && height) return { width: Number(width), height: Number(height) };
  }
  return null;
}

export function validateContent(
  packs: readonly ContentPack[],
  games: readonly GameDefinition[],
  publicRoot = join(process.cwd(), "public"),
) {
  const errors: string[] = [];
  const packIds = new Set<string>();
  const targetIds = new Set<string>();

  for (const pack of packs) {
    if (!ID_PATTERN.test(pack.id)) errors.push(`Invalid pack id: ${pack.id}`);
    if (packIds.has(pack.id)) errors.push(`Duplicate pack id: ${pack.id}`);
    packIds.add(pack.id);
    if (!pack.license.trim()) errors.push(`Pack ${pack.id} has no license.`);
    if (!/^\d+\.\d+\.\d+$/.test(pack.version)) errors.push(`Pack ${pack.id} has an invalid version.`);
    if (pack.targets.length === 0) errors.push(`Pack ${pack.id} has no targets.`);

    for (const target of pack.targets) {
      if (!ID_PATTERN.test(target.id)) errors.push(`Invalid target id: ${target.id}`);
      if (targetIds.has(target.id)) errors.push(`Duplicate target id: ${target.id}`);
      targetIds.add(target.id);
      if (!isHexColor(target.targetHex)) errors.push(`Invalid targetHex on ${target.id}: ${target.targetHex}`);
      const visual = target.visual;
      const paths = visual.kind === "image"
        ? [visual.imageSrc]
        : visual.kind === "mask" ? [visual.foregroundSrc, ...(visual.maskSrc ? [visual.maskSrc] : [])] : [];
      for (const source of paths) {
        if (!source.startsWith("/") || source.includes("..")) {
          errors.push(`Unsafe asset path on ${target.id}: ${source}`);
          continue;
        }
        if (!existsSync(join(publicRoot, source))) errors.push(`Missing asset on ${target.id}: ${source}`);
        if (![".svg", ".png", ".webp", ".jpg", ".jpeg"].includes(extname(source).toLowerCase())) {
          errors.push(`Unsupported asset extension on ${target.id}: ${source}`);
        }
      }
      if (visual.kind === "mask" && visual.maskSrc && extname(visual.foregroundSrc) !== extname(visual.maskSrc)) {
        errors.push(`Mask and foreground formats differ on ${target.id}.`);
      }
      if (visual.kind === "mask" && visual.maskSrc) {
        const foregroundPath = join(publicRoot, visual.foregroundSrc);
        const maskPath = join(publicRoot, visual.maskSrc);
        if (existsSync(foregroundPath) && existsSync(maskPath)) {
          const foregroundSize = imageDimensions(foregroundPath);
          const maskSize = imageDimensions(maskPath);
          if (!foregroundSize || !maskSize) errors.push(`Could not verify mask dimensions on ${target.id}. Use SVG or PNG masks.`);
          else if (foregroundSize.width !== maskSize.width || foregroundSize.height !== maskSize.height) {
            errors.push(`Mask and foreground dimensions differ on ${target.id}.`);
          }
        }
      }
    }
  }

  const gameIds = new Set<string>();
  for (const game of games) {
    if (gameIds.has(game.id)) errors.push(`Duplicate game id: ${game.id}`);
    gameIds.add(game.id);
    if (!Number.isInteger(game.roundCount) || game.roundCount < 1 || game.roundCount > 20) {
      errors.push(`Invalid round count on ${game.id}.`);
    }
    for (const packId of game.packIds) {
      if (!packIds.has(packId)) errors.push(`Game ${game.id} references unknown pack ${packId}.`);
    }
  }

  return errors;
}
