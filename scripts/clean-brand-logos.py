#!/usr/bin/env python3
"""
Cleans up four brand-strip logos that turned blurry once run through the
strip's CSS filter, and writes V2-only copies to src/assets/brands-v2/.

Run once; the outputs are committed.

    python3 scripts/clean-brand-logos.py

WHY THESE FOUR LOOKED BAD
The brand strip renders every logo through `filter: grayscale(1)
brightness(0) invert(1)`, which turns every pixel with ANY opacity into pure
white while leaving its alpha untouched — a logo becomes a flat white
silhouette of its own alpha channel. That is a fine treatment for solid,
hard-edged artwork, but four of these source files carry a wide band of
semi-transparent anti-aliased pixels around their edges (measured: Kurtas
Service was 31% partial-alpha), because they were saved small (as little as
246x60px) with the soft edges a normal export leaves in. Under the filter,
that soft band becomes a soft white glow/halo around every letter — the
"gaidiškai" look this script fixes.

THE FIX IS NOT A REDRAW
Colour is irrelevant to the final look — brightness(0) discards it before
invert(1) runs — so the only thing that matters is the shape of the alpha
channel. This script (1) hardens each alpha channel to pure 0/255 at native
resolution, which deletes the soft fringe outright, then (2) upscales the
now-binary image with Lanczos resampling to a generous working size, which
resupplies a clean, evenly-proportioned anti-aliased edge sized correctly for
that resolution — the effect a properly-sized source export would have had.
Nothing about the mark's shape is invented or redrawn.

SOURCES
protera and kurtas use the higher-resolution files supplied for this fix
(1600x439 and 1999x702) rather than the tiny ones already in the repo — more
source pixels means a thinner, less visible anti-alias band to begin with.
protera's source is a flat opaque white background rather than true alpha, so
its mask is derived from luminance distance-from-white instead of an existing
alpha channel. agrija and gera-dovana have no higher-resolution source
available, so the existing repo files are hardened and upscaled as they are.

WHY V2-ONLY
src/assets/brands/*.webp is imported by both the V1 and the V2 trial pages.
Overwriting it in place would change V1's rendered output, which the V2 build
rules for this project forbid. These outputs land in brands-v2/ instead, and
only TrialV2Page.tsx / LandingPageV2Page.tsx are repointed at them.
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src/assets/brands-v2"
SOURCES_DIR = ROOT / ".logo-sources"  # the higher-res files supplied for this fix

# Target height for the cleaned output. The strip displays these at 42px CSS
# height; this comfortably covers a 3x retina display with headroom to spare.
TARGET_HEIGHT = 220

# Below this native alpha value a pixel is background; at or above it, ink.
# The midpoint of 0-255 — not tuned per file, because tuning it to "look
# right" per logo is exactly the kind of manual redraw judgement this script
# is trying to avoid making.
ALPHA_THRESHOLD = 128


def harden_from_alpha(img: Image.Image) -> Image.Image:
    """For sources that already carry real alpha: binarize it."""
    img = img.convert("RGBA")
    r, g, b, a = img.split()
    a = a.point(lambda v: 255 if v >= ALPHA_THRESHOLD else 0)
    return Image.merge("RGBA", (r, g, b, a))


def harden_from_white_bg(img: Image.Image) -> Image.Image:
    """For sources that are a flat opaque white background: key it out.

    alpha = 255 - min(R, G, B). A pixel exactly white maps to 0 (background);
    any pixel with a dark channel — black ink or a saturated colour like the
    logo's red bar — maps to a high value. Thresholded the same as real alpha.
    """
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            rr, gg, bb, _ = px[x, y]
            distance_from_white = 255 - min(rr, gg, bb)
            alpha = 255 if distance_from_white >= (255 - ALPHA_THRESHOLD) else 0
            px[x, y] = (rr, gg, bb, alpha)
    return img


def finish(img: Image.Image, name: str) -> None:
    scale = TARGET_HEIGHT / img.height
    target = (round(img.width * scale), TARGET_HEIGHT)
    img = img.resize(target, Image.LANCZOS)

    OUT.mkdir(parents=True, exist_ok=True)
    out_path = OUT / f"{name}.webp"
    img.save(out_path, "WEBP", quality=92, method=6)
    print(f"  {name}.webp  {img.size}")


if __name__ == "__main__":
    print("Writing cleaned brand logos to src/assets/brands-v2/")

    protera = Image.open(SOURCES_DIR / "protera-servisas-hires.png")
    finish(harden_from_white_bg(protera), "protera-servisas")

    kurtas = Image.open(SOURCES_DIR / "kurtas-service-hires.png")
    finish(harden_from_alpha(kurtas), "kurtas-service")

    agrija = Image.open(SOURCES_DIR / "agrija-hires.png")
    finish(harden_from_alpha(agrija), "agrija")

    gera_dovana = Image.open(ROOT / "src/assets/brands/gera-dovana.webp")
    finish(harden_from_alpha(gera_dovana), "gera-dovana")
