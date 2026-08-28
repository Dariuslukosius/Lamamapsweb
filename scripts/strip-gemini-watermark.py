#!/usr/bin/env python3
"""
Removes the Gemini sparkle watermark from the AI-generated service images used
by the V2 landing pages, writing clean copies to src/assets/services-v2/.

Run once; the outputs are committed. Re-run only if the source art is replaced.

    python3 scripts/strip-gemini-watermark.py

Method: normalized-convolution inpainting. The watermark is a flat, light
four-pointed star sitting well above its local background, so it is isolated by
thresholding brightness inside a small search window, dilated a little to catch
its anti-aliased edge, then filled by diffusing the surrounding real pixels
inward at decreasing radii (coarse pass carries colour across the whole star,
finer passes re-tighten it against the nearest genuine pixels).

Nothing generative is involved: every replacement pixel is a weighted average
of real neighbouring background from the same image. A rectangular patch-copy
was tried first and rejected — a rectangle large enough to cover the star's
four tips also swallowed the world-map continent drawn behind it.

The V1 pages keep pointing at the untouched originals in src/assets/services/.
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src/assets/services"
OUT = ROOT / "src/assets/services-v2"

# (file, search window around the watermark, how far above local background a
# pixel must sit to count as watermark)
JOBS = [
    ("no-direct-access", (1140, 730, 1248, 820), 14),
    ("best-results",     (900, 900, 1024, 1024), 18),
]

# Only these two carry a watermark. The rest are copied through so every V2
# image import resolves inside services-v2/ and no V2 page reaches back into
# the V1 asset folder.
CLEAN = ("increase-local-visibility", "improve-search-performance")

# Chosen so every re-encoded file lands at or under the byte size of the
# original it replaces. These pages are on a page-weight budget, and a
# watermark fix that quietly added ~18% to four images would spend it.
QUALITY = 80


def _box_1d(a: np.ndarray, radius: int, axis: int) -> np.ndarray:
    """Sliding-window sum along one axis, via a prefix sum."""
    a = np.moveaxis(a, axis, 0)
    padded = np.pad(a, [(radius, radius)] + [(0, 0)] * (a.ndim - 1), mode="constant")
    prefix = np.concatenate([np.zeros((1, *a.shape[1:])), np.cumsum(padded, axis=0)])
    n, k = a.shape[0], 2 * radius + 1
    return np.moveaxis(prefix[k : k + n] - prefix[:n], 0, axis)


def box_blur(a: np.ndarray, radius: int) -> np.ndarray:
    """Unnormalised box blur. Used for both numerator and denominator of the
    normalized convolution, so the missing 1/k factor cancels out."""
    return _box_1d(_box_1d(a.astype(np.float64), radius, 0), radius, 1)


def watermark_mask(region: np.ndarray, threshold: int) -> np.ndarray:
    """Pixels brighter than the region's own background level."""
    luma = region.mean(axis=2)
    # The star covers a small minority of the window, so a low percentile is a
    # robust stand-in for "background here" that the star cannot drag upward.
    background = np.percentile(luma, 40)
    return luma > background + threshold


def dilate(mask: np.ndarray, radius: int) -> np.ndarray:
    grown = Image.fromarray((mask * 255).astype(np.uint8)).filter(
        ImageFilter.MaxFilter(radius * 2 + 1)
    )
    return np.asarray(grown) > 127


def inpaint(region: np.ndarray, mask: np.ndarray) -> np.ndarray:
    """Diffuse real neighbouring pixels into the masked area."""
    source = region.astype(np.float64)
    known = (~mask).astype(np.float64)
    result = source.copy()

    for radius in (28, 14, 7, 3):
        weight = box_blur(known, radius)
        spread = box_blur(source * known[:, :, None], radius)
        estimate = spread / np.maximum(weight, 1e-9)[:, :, None]

        # A pass only gets a say where its window actually caught real pixels.
        # Without this guard the narrow passes blank the star's interior, which
        # sits further from genuine background than their radius reaches: they
        # divide a zero numerator by a zero denominator and paint it black.
        # So the widest pass fills the middle and each finer pass refines only
        # the rim, where it has real neighbours to average.
        usable = mask & (weight > 0)
        result = np.where(usable[:, :, None], estimate, result)

    # Real pixels always win.
    return np.clip(np.where(mask[:, :, None], result, source), 0, 255).astype(np.uint8)


def strip(name: str, window: tuple[int, int, int, int], threshold: int) -> None:
    img = Image.open(SRC / f"{name}.webp").convert("RGB")
    region = np.asarray(img.crop(window))
    mask = dilate(watermark_mask(region, threshold), radius=3)

    img.paste(Image.fromarray(inpaint(region, mask)), window[:2])

    OUT.mkdir(parents=True, exist_ok=True)
    img.save(OUT / f"{name}.webp", "WEBP", quality=QUALITY, method=6)
    print(f"  {name}.webp  {img.size}  removed {int(mask.sum())} watermark px")


def copy_clean(name: str) -> None:
    img = Image.open(SRC / f"{name}.webp").convert("RGB")
    OUT.mkdir(parents=True, exist_ok=True)
    img.save(OUT / f"{name}.webp", "WEBP", quality=QUALITY, method=6)
    print(f"  {name}.webp  {img.size}  (no watermark, copied)")


if __name__ == "__main__":
    print("Writing watermark-free service images to src/assets/services-v2/")
    for name, window, threshold in JOBS:
        strip(name, window, threshold)
    for name in CLEAN:
        copy_clean(name)
