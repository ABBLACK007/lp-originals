// Crops the client's original product photos (assets/photos/originals) into the web
// versions the site imports (assets/photos). Re-run after adding or re-cropping photos:
//   npm run photos
// Colours are left untouched so suede and leather shades stay true to the product.
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "assets/photos/originals");
const out = path.join(root, "assets/photos");

// [output file, original file, crop box in original pixels (omit to keep the full frame),
//  options: { soften: [boxes] } blurs small areas, e.g. lettering engraved on a buckle]
// Product crops are 4:5 to match the product cards.
// Not used: "brown black birken.jpeg" and "brown & black birken 2.jpeg" (BIRKENSTOCK on the buckles),
// "black-cutout-slides.jpg" (Loro Piana logo on the insole),
// and a Birkenstock clog product photo (never copied in).
const photos = [
  ["cork-collection.jpg", "birken pams.jpeg"],
  ["wide-band-slide-tan.jpg", "birken pams.jpeg", { left: 105, top: 0, width: 480, height: 600 }],
  ["cross-strap-slide-black.jpg", "birken pams.jpeg", { left: 0, top: 420, width: 480, height: 600 }],
  ["two-strap-slide-brown.jpg", "birken pams.jpeg", { left: 470, top: 380, width: 564, height: 705 }],
  ["buckle-sandal-rust.jpg", "brown birken.jpeg", { left: 250, top: 150, width: 840, height: 1050 }],
  ["buckle-sandal-group.jpg", "brown birken.jpeg"],
  ["band-slide-chocolate.jpg", "birken swade.jpeg", { left: 0, top: 0, width: 1024, height: 1280 }],
  ["cork-footbed-detail.jpg", "birken swade.jpeg", { left: 0, top: 230, width: 700, height: 800 }],
  ["cutout-slide-red.jpg", "slides.jpeg"],
  ["cross-slide-black-leather.jpg", "male slides.jpeg"],
  ["toe-post-sandal-cream.jpg", "female slides.jpeg", { left: 300, top: 150, width: 726, height: 908 }],
  ["perforated-slide-brown.jpg", "brown-perforated-slides.jpg", { left: 0, top: 30, width: 736, height: 920 }],
  // Only the clog in hand: the top clog's buckle is engraved "BIRKEN…" and the corner shows a size label and another brand's box.
  ["clog-mocha.jpg", "mocha-clogs.jpg", { left: 96, top: 372, width: 544, height: 609 }],
  // Square for a round frame; the lettering engraved on the left buckle is softened (original stays out of git).
  ["buckle-slide-worn.jpg", "black-buckle-slide-worn.jpg", { left: 0, top: 245, width: 736, height: 736 },
    { soften: [{ left: 258, top: 710, width: 46, height: 44 }] }],
];

for (const [file, original, box, opts] of photos) {
  // Respect camera orientation; keep the working copy lossless (PNG) so photos are JPEG-compressed only once.
  let buf = await sharp(path.join(src, original)).rotate().png().toBuffer();
  for (const r of opts?.soften ?? []) {
    // Blurred patch with a feathered oval alpha, so no hard-edged box shows.
    const mask = await sharp(Buffer.from(`<svg width="${r.width}" height="${r.height}"><ellipse cx="${r.width / 2}" cy="${r.height / 2}" rx="${r.width * 0.42}" ry="${r.height * 0.42}" fill="#fff"/></svg>`))
      .blur(4).extractChannel(0).toBuffer();
    const patch = await sharp(buf).extract(r).blur(2.2).removeAlpha().joinChannel(mask).png().toBuffer();
    buf = await sharp(buf).composite([{ input: patch, left: r.left, top: r.top }]).toBuffer();
  }
  let img = sharp(buf);
  if (box) img = img.extract(box);
  const { width, height } = await img.jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(out, file));
  console.log(`saved ${file} (${width}x${height})`);
}
