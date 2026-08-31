#!/usr/bin/env python3
"""
Traces low-resolution brand logos into clean vector SVGs, for the two that
stayed visibly jagged after scripts/clean-brand-logos.py's alpha-hardening
pass: agrija and gera-dovana. Writes to src/assets/brands-v2/.

Run once; the outputs are committed.

    python3 scripts/vectorize-logos.py

WHY THIS EXISTS ON TOP OF clean-brand-logos.py
That script fixed the halo/glow around Kurtas Service and Protera by hardening
each logo's soft, anti-aliased alpha edge to a hard 0/255 boundary, then
upscaling. That works when the native artwork has enough pixels to define the
shape — Kurtas Service and Protera both had (or were given) sources several
hundred pixels tall. Agrija and gera-dovana did not: their best available
source is ~60-130px tall, and no amount of upscaling recovers detail that was
never there. Lanczos-upscaling a shape defined by 60 rows of pixels still
looks like 60 rows of pixels, just bigger — visible as a staircase on every
diagonal and curve, which is exactly what showed up at real size.

Vectorizing sidesteps the resolution ceiling entirely: potrace fits smooth
bezier curves through the boundary of the existing pixel shape, so the output
scales losslessly to any size with no staircase, regardless of how few pixels
the source had to define that boundary from.

METHOD
Potrace traces a single-channel bitmap. Each logo's alpha channel is fed in
directly (not pre-thresholded) with blacklevel=0.5 — potrace does its own
thresholding, using the anti-aliased edge's own gradient to place the curve
more precisely than a hard 128-cutoff would. The traced curves are written
into one SVG <path> with fill-rule="evenodd", which is what makes counters
(the enclosed space inside an "a" or "g") render as holes instead of solid
fill — the standard technique for potrace's own SVG export.

Colour is not preserved. Both outputs are used only on the brand strip, which
already forces every logo through `filter: grayscale(1) brightness(0)
invert(1)` — colour has no visual effect there, so the traced shape is filled
solid black and the fill colour is irrelevant outside that one context.
"""
from pathlib import Path

import numpy as np
import potrace
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src/assets/brands-v2"
SOURCES_DIR = ROOT / ".logo-sources"

JOBS = [
    # (output name, source path)
    ("agrija", SOURCES_DIR / "agrija-hires.png"),
    ("gera-dovana", ROOT / "src/assets/brands/gera-dovana.webp"),
]


def trace_to_svg_path(alpha: np.ndarray) -> str:
    """alpha: 2D array, 0-255. Returns an SVG path `d` string."""
    # potrace.Bitmap's own threshold compares the raw input against
    # `255 * blacklevel`, so the array must stay on a 0-255 scale — passing
    # a 0.0-1.0 normalized array (as an earlier version of this script did)
    # made every pixel compare as "below 127.5", which made the whole canvas
    # trace as one rectangle instead of the logo's actual outline.
    #
    # Bitmap.__init__ also unconditionally inverts whatever this comparison
    # produces (see potrace/potrace.py), so the pixels that should end up
    # traced — alpha's opaque "ink" — need to land on the LOW side of the
    # threshold going in. `255 - alpha` does that: ink (alpha=255) becomes 0,
    # background (alpha=0) becomes 255.
    bitmap = potrace.Bitmap((255 - alpha).astype(np.float64), blacklevel=0.5)
    path = bitmap.trace(turdsize=2, alphamax=1.0, opticurve=True, opttolerance=0.2)

    parts = []
    for curve in path:
        parts.append(f"M {curve.start_point.x:.2f} {curve.start_point.y:.2f}")
        for segment in curve:
            if segment.is_corner:
                parts.append(f"L {segment.c.x:.2f} {segment.c.y:.2f}")
                parts.append(f"L {segment.end_point.x:.2f} {segment.end_point.y:.2f}")
            else:
                parts.append(
                    f"C {segment.c1.x:.2f} {segment.c1.y:.2f} "
                    f"{segment.c2.x:.2f} {segment.c2.y:.2f} "
                    f"{segment.end_point.x:.2f} {segment.end_point.y:.2f}"
                )
        parts.append("Z")
    return " ".join(parts)


def vectorize(name: str, source: Path) -> None:
    img = Image.open(source).convert("RGBA")
    alpha = np.array(img)[:, :, 3]
    w, h = img.size

    d = trace_to_svg_path(alpha)

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">\n'
        f'  <path d="{d}" fill="#000000" fill-rule="evenodd" />\n'
        f"</svg>\n"
    )

    OUT.mkdir(parents=True, exist_ok=True)
    out_path = OUT / f"{name}.svg"
    out_path.write_text(svg)
    print(f"  {name}.svg  traced from {w}x{h}px source, {len(svg)} bytes")


if __name__ == "__main__":
    print("Vectorizing low-resolution brand logos into src/assets/brands-v2/")
    for name, source in JOBS:
        vectorize(name, source)
