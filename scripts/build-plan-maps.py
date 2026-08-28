#!/usr/bin/env python3
"""
Builds the plan coverage maps used by the V2 landing pages.

Run once; the outputs are committed. Re-run only to change the location, the
zoom framing, or the dark treatment.

    python3 scripts/build-plan-maps.py

These replace the V1 "pricing-community/city" images, which were rendered glass
map-pin ornaments rather than maps — and which had "4KM RADIUS" / "8km RADIUS"
baked into the artwork while the plan copy beside them says 2.5 and 5 miles.

WHY THE TILES ARE BAKED AT BUILD TIME RATHER THAN FETCHED IN THE BROWSER
Two reasons. The OSM tile usage policy asks that sites not point end users at
tile.openstreetmap.org for production traffic, and these pages are the landing
pages for paid ads, so that is exactly the traffic they would send. And the
pages are on a page-weight budget: one webp per plan costs a single request
against nine tile requests each, with no runtime failure mode.

WHAT IS DRAWN HERE AND WHAT IS NOT
Only the map itself is baked in. The radius circle, the centre marker and the
labels are drawn by PlanRadiusMap.tsx as SVG on top, so they stay crisp at any
size and follow the page's palette instead of being frozen into the raster.

GEOMETRY
Web Mercator resolution is 156543.03392 * cos(latitude) / 2**zoom metres per
pixel, which halves with every zoom step. The two plans differ by exactly a
factor of two in radius (2.5 vs 5 miles), so rendering them one zoom level
apart puts the circle at an identical pixel radius in both images. That is what
makes the pair look like one designed set rather than two unrelated maps.
"""
from __future__ import annotations

import math
import time
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src/assets/plans-v2"

# Central London. The plans are sold on radius, not on a specific address, so
# the map is illustrative — PlanRadiusMap.tsx labels it as such on the page.
CENTER_LAT, CENTER_LON = 51.5074, -0.1278

TILE = 256
SIZE = 640  # final square edge, in pixels

# (output name, zoom). z=12 gives the 2.5-mile circle a 169px radius at this
# latitude; z=11 gives the 5-mile circle the same 169px. See GEOMETRY above.
PLANS = [("community", 12), ("city", 11)]

TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"

# The OSM tile policy requires a real identifying User-Agent on every request.
USER_AGENT = "LlamaMaps-site-build/1.0 (+https://llamamaps.com; one-off asset build)"

CACHE = ROOT / ".tile-cache"


def lonlat_to_pixel(lat: float, lon: float, zoom: int) -> tuple[float, float]:
    """Web Mercator, in whole-world pixel coordinates at this zoom."""
    n = 2.0**zoom * TILE
    x = (lon + 180.0) / 360.0 * n
    phi = math.radians(lat)
    y = (1.0 - math.asinh(math.tan(phi)) / math.pi) / 2.0 * n
    return x, y


def fetch_tile(z: int, x: int, y: int) -> Image.Image:
    cached = CACHE / f"{z}_{x}_{y}.png"
    if not cached.exists():
        CACHE.mkdir(parents=True, exist_ok=True)
        req = urllib.request.Request(
            TILE_URL.format(z=z, x=x, y=y), headers={"User-Agent": USER_AGENT}
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            cached.write_bytes(resp.read())
        # Courtesy rate limit; this loop runs a couple of dozen times, once.
        time.sleep(0.4)
    return Image.open(cached).convert("RGB")


def darken(img: Image.Image) -> Image.Image:
    """Recolour the standard OSM raster into the page's dark navy palette.

    Standard OSM tiles are near-white and would glare against the #0B1420 page.
    Rather than dropping in a second tile provider for a dark style, the tiles
    are converted to luminance, inverted (so paper-white becomes deep navy and
    dark roads become light), and mapped across a two-point ramp between the
    page background and a muted slate. Roads and water keep their structure and
    the gold radius circle drawn on top stays the brightest thing in the frame.
    """
    lo = (13, 22, 35)  # near the page background, for former white paper
    hi = (122, 134, 156)  # muted slate, for former dark linework

    grey = img.convert("L")
    lut = []
    for channel in range(3):
        lut += [
            round(lo[channel] + (hi[channel] - lo[channel]) * ((255 - v) / 255.0))
            for v in range(256)
        ]
    return Image.merge("RGB", (grey, grey, grey)).point(lut)


def build(name: str, zoom: int) -> None:
    cx, cy = lonlat_to_pixel(CENTER_LAT, CENTER_LON, zoom)

    # Enough whole tiles to cover the crop, plus one for the partial edges.
    half = SIZE / 2
    x0, x1 = int((cx - half) // TILE), int((cx + half) // TILE)
    y0, y1 = int((cy - half) // TILE), int((cy + half) // TILE)

    mosaic = Image.new("RGB", ((x1 - x0 + 1) * TILE, (y1 - y0 + 1) * TILE))
    for tx in range(x0, x1 + 1):
        for ty in range(y0, y1 + 1):
            mosaic.paste(fetch_tile(zoom, tx, ty), ((tx - x0) * TILE, (ty - y0) * TILE))

    # Crop so the requested centre lands exactly at the centre of the output —
    # the SVG circle on top is positioned at 50%/50% and has to agree.
    left = cx - x0 * TILE - half
    top = cy - y0 * TILE - half
    crop = mosaic.crop((round(left), round(top), round(left) + SIZE, round(top) + SIZE))

    OUT.mkdir(parents=True, exist_ok=True)
    out = OUT / f"london-{name}.webp"
    darken(crop).save(out, "WEBP", quality=82, method=6)

    metres_per_px = 156543.03392 * math.cos(math.radians(CENTER_LAT)) / 2**zoom
    miles = 2.5 if name == "community" else 5.0
    radius_px = miles * 1609.344 / metres_per_px
    print(
        f"  {out.name}  z{zoom}  {metres_per_px:.2f} m/px  "
        f"{miles} mi = {radius_px:.1f}px ({radius_px / SIZE * 100:.1f}% of edge)"
    )


if __name__ == "__main__":
    print("Building plan coverage maps into src/assets/plans-v2/")
    for name, zoom in PLANS:
        build(name, zoom)
    print("\nRadius circle, marker and labels are drawn by PlanRadiusMap.tsx.")
    print("Attribution (c) OpenStreetMap contributors is rendered by that component.")
