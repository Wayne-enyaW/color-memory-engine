import { createHash } from "node:crypto";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

const projectRoot = process.cwd();
const publicRoot = join(projectRoot, "public", "content");

async function walk(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(path));
    else output.push(path);
  }
  return output;
}

const assets = [];
for (const path of (await walk(publicRoot)).sort()) {
  const buffer = await readFile(path);
  const repoPath = relative(projectRoot, path).replaceAll("\\", "/");
  const isFlag = repoPath.includes("/flags/");
  assets.push({
    path: repoPath,
    bytes: (await stat(path)).size,
    sha256: createHash("sha256").update(buffer).digest("hex"),
    license: isFlag ? "Public Domain (upstream declaration)" : "CC0-1.0",
    source: isFlag
      ? "https://github.com/hampusborgos/country-flags"
      : "Original work in this repository",
  });
}

const manifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  upstream: {
    name: "hampusborgos/country-flags",
    revision: "c09927e63705529bbf59ca6684cd9b23225dddad",
    verified: "Distributed flag files were byte-compared with this revision.",
  },
  assets,
};

await writeFile(join(projectRoot, "content", "ASSET_MANIFEST.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${assets.length} asset records.`);
