import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const manifest = JSON.parse(await readFile(join(root, "content", "ASSET_MANIFEST.json"), "utf8"));
const seen = new Set();
const errors = [];

for (const asset of manifest.assets) {
  if (seen.has(asset.path)) errors.push(`Duplicate manifest path: ${asset.path}`);
  seen.add(asset.path);
  if (!asset.license || !asset.source) errors.push(`Missing provenance for ${asset.path}`);
  try {
    const buffer = await readFile(join(root, asset.path));
    const sha256 = createHash("sha256").update(buffer).digest("hex");
    if (sha256 !== asset.sha256) errors.push(`Checksum mismatch: ${asset.path}`);
    if (buffer.length !== asset.bytes) errors.push(`Size mismatch: ${asset.path}`);
  } catch {
    errors.push(`Missing asset: ${asset.path}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Verified ${manifest.assets.length} licensed asset records.`);
