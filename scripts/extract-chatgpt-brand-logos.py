#!/usr/bin/env python3
"""
Extracts the "Svytintys dantys" and "gera dovana" brand-strip lockups out of
two ChatGPT-generated reference images (white artwork on solid navy, no
alpha) and writes clean transparent-alpha webp files to src/assets/brands-v2/,
matching the treatment the brand strip's CSS filter (grayscale(1)
brightness(0) invert(1)) expects: opaque where there's ink, fully transparent
everywhere else. See scripts/clean-brand-logos.py for the same treatment
applied to the other logos in that folder.

Run once; the outputs are committed.

    python3 scripts/extract-chatgpt-brand-logos.py

Each source image contains BOTH lockups stacked vertically (divided by a thin
line), generated twice because the first pass had one word cut off — "gera
dova" instead of "gera dovana" — and the regenerated pass changed the tooth
logo's wording from "Svytintys Dantys" (matches the real client name — see
lib/testimonials.ts's "Švytintys dantys, UAB" — and BrandsSection.tsx's
existing alt text) to "Švytinčių Dantys" (wrong declension). So the correct
half is taken from each of the two source images rather than from one.
"""
from pathlib import Path

import numpy as np
from PIL import Image

DOWNLOADS = Path("/Users/jonas/Downloads")
FILE_SVYTINTYS = DOWNLOADS / "ChatGPT Image Aug 30, 2026, 11_02_23 PM.png"  # correct "Svytintys Dantys" wording
FILE_GERA = DOWNLOADS / "ChatGPT Image Aug 30, 2026, 11_02_33 PM.png"  # correct "gera dovana" wording

OUT = Path(__file__).resolve().parent.parent / "src/assets/brands-v2"

# Background is a solid, near-uniform dark navy (~luminance 10); ink is
# near-white (~240+). A midpoint threshold cleanly separates them even
# through the anti-aliased edge.
THRESHOLD = 90
TARGET_HEIGHT = 220


def extract(src_path: Path, y0: int, y1: int, out_name: str) -> None:
    im = Image.open(src_path).convert("RGB")
    crop = im.crop((0, y0, im.width, y1))
    arr = np.array(crop.convert("L")).astype(np.float32)

    # Hard alpha from luminance threshold -- matches the treatment
    # clean-brand-logos.py already uses for the other logos in this folder.
    alpha = np.where(arr >= THRESHOLD, 255, 0).astype(np.uint8)

    # Tight bbox around actual ink, with a little breathing room.
    ys, xs = np.where(alpha > 0)
    pad = 6
    x0b, x1b = max(0, xs.min() - pad), min(alpha.shape[1], xs.max() + pad + 1)
    y0b, y1b = max(0, ys.min() - pad), min(alpha.shape[0], ys.max() + pad + 1)
    alpha = alpha[y0b:y1b, x0b:x1b]

    h, w = alpha.shape
    scale = TARGET_HEIGHT / h
    new_w, new_h = round(w * scale), TARGET_HEIGHT

    alpha_img = Image.fromarray(alpha).resize((new_w, new_h), Image.LANCZOS)
    # Re-binarize post-resize to keep edges crisp rather than soft/grey.
    alpha_arr = np.array(alpha_img)
    alpha_arr = np.where(alpha_arr >= 128, 255, 0).astype(np.uint8)

    rgba = np.zeros((new_h, new_w, 4), dtype=np.uint8)
    rgba[:, :, :3] = 255
    rgba[:, :, 3] = alpha_arr
    out_img = Image.fromarray(rgba)

    out_path = OUT / f"{out_name}.webp"
    out_img.save(out_path, lossless=True)
    print(f"wrote {out_path} ({new_w}x{new_h})")


# Svytintys Dantys: bottom half of FILE_SVYTINTYS, divider line at y=648.
extract(FILE_SVYTINTYS, 652, 1024, "svytintys-dantys")

# gera dovana: top half of FILE_GERA, divider line at y=657.
extract(FILE_GERA, 0, 657, "gera-dovana-v2")
