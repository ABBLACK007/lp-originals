// Downloads the Higgsfield images listed in assets/manifest.json into assets/generated.
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(path.join(root, "assets/manifest.json"), "utf8"));
const outDir = path.join(root, "assets/generated");
await mkdir(outDir, { recursive: true });

let ok = 0;
for (const img of manifest.images) {
  const dest = path.join(outDir, img.file);
  try { await access(dest); console.log(`skip  ${img.file} (already there)`); ok++; continue; } catch {}
  try {
    const res = await fetch(img.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    console.log(`saved ${img.file}`); ok++;
  } catch (e) {
    console.error(`FAIL  ${img.file}: ${e.message}. Download job ${img.job} from Higgsfield and save it as assets/generated/${img.file}`);
  }
}
console.log(`\n${ok}/${manifest.images.length} images ready.`);
for (const m of manifest.missing) console.log(`still needed: ${m.file} (${m.reason})`);
