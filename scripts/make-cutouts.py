"""Cut the shoes out of the product photos (transparent background), for the product tiles and the product stand.

Uses rembg (https://github.com/danielgatis/rembg, MIT), run locally. Each photo uses the model that cut it out
best (compared side by side on 2026-10-15): u2net for most, isnet-general-use where u2net kept boxes or a
neighbouring shoe. Set CUTOUT_MODEL to force one model for every photo.
Writes assets/cutouts/<name>.png, trimmed to the shoes with a small margin, longest side at most 1200px.

    python -m venv .venv-cutouts && .venv-cutouts/Scripts/python -m pip install "rembg[cpu]"
    .venv-cutouts/Scripts/python scripts/make-cutouts.py [name ...]

On Windows, set NUMBA_CACHE_DIR to a short folder if the first run fails with a "No such file" path error.
"""
import os
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from rembg import new_session, remove
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "photos"
OUT = ROOT / "assets" / "cutouts"

ISNET = {"two-strap-slide-brown", "band-slide-chocolate", "cross-slide-black-leather"}

# cutout name -> source photo (the product's main photo in lib/content-defaults.ts)
JOBS = {
    "buckle-sandal-rust": "buckle-sandal-rust.jpg",
    "wide-band-slide-tan": "wide-band-slide-tan.jpg",
    "cross-strap-slide-black": "cross-strap-slide-black.jpg",
    "two-strap-slide-brown": "two-strap-slide-brown.jpg",
    "band-slide-chocolate": "band-slide-chocolate.jpg",
    "platform-toe-post-brown": "platform-toe-post-brown.jpg",
    "stitched-slide-black": "stitched-slide-black.jpg",
    "stitched-slide-green": "stitched-slide-green.jpg",
    "woven-slide-olive": "woven-slide-olive.jpg",
    "cutout-slide-red": "cutout-slide-red.jpg",
    "perforated-slide-brown": "perforated-slide-brown.jpg",
    "cross-slide-black-leather": "cross-slide-black-leather.jpg",
    "toe-post-sandal-cream": "toe-post-sandal-cream.jpg",
    "clog-mocha": "clog-mocha.jpg",
}


def despeckle(img: Image.Image, keep: float = 0.02) -> Image.Image:
    """Drop small disconnected bits (specks, stray straps) smaller than `keep` of the largest piece."""
    a = np.array(img)
    mask = a[:, :, 3] > 40
    labels, n = ndimage.label(mask)
    if n <= 1:
        return img
    sizes = ndimage.sum(mask, labels, range(1, n + 1))
    small = [i + 1 for i, size in enumerate(sizes) if size < sizes.max() * keep]
    a[np.isin(labels, small), 3] = 0
    return Image.fromarray(a)


def trim(img: Image.Image, margin: float = 0.04) -> Image.Image:
    """Crop to the visible pixels plus a margin; drop faint specks left in the alpha channel."""
    alpha = img.getchannel("A").point(lambda a: 255 if a > 24 else 0)
    box = alpha.getbbox()
    if not box:
        return img
    l, t, r, b = box
    m = int(max(r - l, b - t) * margin)
    return img.crop((max(0, l - m), max(0, t - m), min(img.width, r + m), min(img.height, b + m)))


def main(names: list[str]) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    forced = os.environ.get("CUTOUT_MODEL")
    sessions: dict[str, object] = {}
    for name in names or list(JOBS):
        model = forced or ("isnet-general-use" if name in ISNET else "u2net")
        if model not in sessions:
            sessions[model] = new_session(model)
        session = sessions[model]
        src = SRC / JOBS[name]
        img = Image.open(src).convert("RGB")
        cut = remove(img, session=session, post_process_mask=True)
        cut = trim(despeckle(cut))
        cut.thumbnail((1200, 1200), Image.LANCZOS)
        cut.save(OUT / f"{name}.png", optimize=True)
        print(f"{name}: {cut.width}x{cut.height} ({model})")


if __name__ == "__main__":
    main(sys.argv[1:])
