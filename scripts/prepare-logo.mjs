// Builds the web logo files from the client's LP Wears logo (black + brown on white):
//   npm run logo
// - public/images/logo-light.png  cream letters, gold swoosh, transparent (for the dark header/footer)
// - public/images/logo-dark.png   original ink + brown, transparent (for light backgrounds)
// - public/icons/icon-*.png, app/apple-icon.png, app/icon.png: LP mark only, on ink
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "assets/brand/lp-wears-logo-original.png");
const INK = [20, 18, 16], BROWN = [150, 106, 59];
const CREAM = [242, 237, 230], GOLD = [201, 164, 92];

// Turn white into transparency and recolour: letters -> `letters`, swoosh -> `swoosh`.
async function recolor(input, letters, swoosh) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let p = 0, q = 0; p < data.length; p += 3, q += 4) {
    const [r, g, b] = [data[p], data[p + 1], data[p + 2]];
    const brown = r - b > 25;
    // Coverage: how far the pixel is from white, relative to the ink/brown it was drawn with.
    let a = brown ? (255 - b) / (255 - BROWN[2]) : (255 - Math.min(r, g, b)) / (255 - INK[0]);
    if (a < 0.08) a = 0; // faint off-white noise in the source would otherwise block the trim
    const c = brown ? swoosh : letters;
    out.set([c[0], c[1], c[2], Math.round(Math.max(0, Math.min(1, a)) * 255)], q);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).trim({ threshold: 1 });
}

const full = await sharp(src).png().toBuffer();
await (await recolor(full, CREAM, GOLD)).resize({ width: 640 }).png({ compressionLevel: 9 }).toFile(path.join(root, "public/images/logo-light.png"));
await (await recolor(full, INK, BROWN)).resize({ width: 640 }).png({ compressionLevel: 9 }).toFile(path.join(root, "public/images/logo-dark.png"));

// LP mark only (everything above the WEARS line, which starts at y≈700 in the original).
const meta = await sharp(src).metadata();
const markSrc = await sharp(src).extract({ left: 0, top: 0, width: meta.width, height: 690 }).png().toBuffer();
const mark = await (await recolor(markSrc, CREAM, GOLD)).png().toBuffer();
async function icon(size, file, pad = 0.18) {
  const inner = Math.round(size * (1 - pad * 2));
  const m = await sharp(mark).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: { r: INK[0], g: INK[1], b: INK[2], alpha: 1 } } })
    .composite([{ input: m, gravity: "center" }]).png().toFile(path.join(root, file));
}
await icon(192, "public/icons/icon-192.png");
await icon(512, "public/icons/icon-512.png");
await icon(180, "app/apple-icon.png");
await icon(64, "app/icon.png", 0.12);
console.log("logo files written");
