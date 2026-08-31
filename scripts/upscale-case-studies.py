#!/usr/bin/env python3
"""
Produces retina-sharp V2-only copies of the 17 case-study before/after scans,
for the ad landing pages. Writes to src/assets/results-v2/.

Run once; the outputs are committed.

    python3 scripts/upscale-case-studies.py

WHY THE CURRENT IMAGES LOOK SOFT ON A PHONE, AND WHY RE-EXTRACTING FROM THE
SOURCE GIFS DOES NOT FIX IT
The rank-scan GIFs LamaLocal exports (the ones now collected in
~/Downloads/visi gifai/ and ~/Downloads/gifai case studies/) are natively
800x800px — every one checked (Love Metal, Karalius Nuogas, Dentpicks, Hanse
Trailer) confirms this. The webp files already in src/assets/results/ are
already cropped straight from that same 800px-wide source (800x743, top 57px
of date-header trimmed) — they are not a lossy or accidentally-downscaled
extraction. 800px is the real ceiling; there is no higher-resolution version
of these images to pull from.

What IS fixable: the frame is displayed up to ~460px CSS-wide (see
.t2-baf-frame), which on a 2x retina phone needs ~920 real device pixels, and
~1380 on 3x. The browser has to stretch the 743px-tall source to fill that,
and does it with whatever interpolation it reaches for at paint time — that
stretch is the softness being seen, not a defect in the source crop.

METHOD
Each image is upscaled 2x with Lanczos resampling — a slower, higher-quality
filter than a browser's real-time upscale — then given a light unsharp mask to
recover edge definition Lanczos's own smoothing softens. This does not invent
detail beyond the 800px source; it is the same data, resampled and sharpened
better than the browser would do it live. It closes most, not all, of the
gap on a 3x screen (1486px output vs. an ideal ~1380px need is close; a 2x
screen at ~920px need is fully covered).

WHY V2-ONLY
Changing src/assets/results/*.webp in place would change what V1 renders —
those files are imported by both the V1 and V2 pages via lib/caseStudies.ts.
Outputs land in results-v2/ instead, and only the V2 pages are wired to prefer
them; caseStudies.ts itself, and everything V1 renders, is untouched.
"""
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src/assets/results"
OUT = ROOT / "src/assets/results-v2"

UPSCALE = 2
# Unsharp mask tuned to recover edge crispness on the rank-bubble numerals and
# map linework without haloing the flat-colour circle fills.
UNSHARP = {"radius": 1.4, "percent": 110, "threshold": 2}

# These cards are lazy-loaded (see useNearViewport) so this weight is never
# on the page's initial load, but seventeen of them add up fast for anyone who
# actually scrolls the section a real ad viewer would scroll — 68 cost ~1.9MB
# across all 34 images for a difference a side-by-side crop couldn't show over
# 55. Dropped to the lighter setting once that comparison held up.
QUALITY = 55

# Asset filename stems, NOT CaseStudy.slug values — they diverge for several
# entries (e.g. slug "miracle-k9-residential" but file "miracle-k9-birmingham",
# slug "vairalda-profesionalus" but file "vairalda-kaunas"). Taken directly
# from the `import ... from "@/assets/results/..."` lines in lib/caseStudies.ts
# rather than derived, so this can't silently drift from the real filenames.
ASSET_STEMS = [
    "malka-juodkrante",
    "miracle-k9-birmingham", "miracle-k9-1on1", "miracle-k9-canine",
    "karalius-panevezys",
    "love-metal-west-sussex",
    "dentpicks-texas",
    "delivery-kings-sunshine-coast",
    "jean-seo-dubai",
    "vairalda-kaunas", "vairalda-bkat",
    "nida-neringa", "nida-erdve",
    "schmitz-centras", "schmitz-dalys", "schmitz-servisas",
    "vet-vilnius",
]


def upscale_one(name: str) -> tuple[int, int]:
    src_path = SRC / f"{name}.webp"
    img = Image.open(src_path).convert("RGB")
    big = img.resize((img.width * UPSCALE, img.height * UPSCALE), Image.LANCZOS)
    big = big.filter(ImageFilter.UnsharpMask(**UNSHARP))

    OUT.mkdir(parents=True, exist_ok=True)
    out_path = OUT / f"{name}.webp"
    big.save(out_path, "WEBP", quality=QUALITY, method=6)
    return src_path.stat().st_size, out_path.stat().st_size


if __name__ == "__main__":
    print("Writing retina-sharp case-study scans to src/assets/results-v2/")
    total_before = total_after = 0
    for slug in ASSET_STEMS:
        for suffix in ("before", "after"):
            name = f"{slug}-{suffix}"
            before, after = upscale_one(name)
            total_before += before
            total_after += after
            print(f"  {name}.webp  {before/1024:6.1f}KB -> {after/1024:6.1f}KB")
    print(
        f"\n{len(ASSET_STEMS)*2} images. Total {total_before/1024/1024:.2f}MB -> "
        f"{total_after/1024/1024:.2f}MB"
    )
