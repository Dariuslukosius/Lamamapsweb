import communityMap from "@/assets/plans-v2/london-community.webp";
import cityMap from "@/assets/plans-v2/london-city.webp";

/**
 * The coverage visual on each pricing plan: a real map with the plan's radius
 * drawn on it, replacing V1's rendered glass map-pin ornament.
 *
 * The pin art it replaces had "4KM RADIUS" and "8km RADIUS" baked into the
 * image while the copy beside it sold 2.5 and 5 MILES — so the picture and the
 * price list disagreed with each other on what the customer was buying.
 *
 * The map raster is pre-built by scripts/build-plan-maps.py (see that file for
 * why the tiles are baked rather than fetched in the browser, and why they are
 * left in native OSM colour instead of retinted). It frames both plans so the
 * radius lands at the same pixel size in each, which is why one RADIUS_PCT
 * covers both: the plans differ by a factor of two in radius and the images
 * differ by exactly one zoom level.
 *
 * Only the map is baked in. The circle, the centred radius pill and the area
 * badge are drawn here — SVG for the circle so it stays sharp at any width,
 * HTML for the labels so they get real font rendering instead of SVG <text>'s
 * worse hinting and line-wrapping.
 *
 * area is the bounding square (2 × radius), not the circle's own area — a
 * "5 mile radius" plan is shown as "100 mi²" (10mi × 10mi), which is the
 * simpler number a prospect can sanity-check against a map by eye, rather
 * than a circle-area figure (π × 5² ≈ 78.5 mi²) nobody will mentally verify.
 */
const MAPS = {
  community: { src: communityMap, miles: 2.5, label: "2.5 mile radius" },
  city: { src: cityMap, miles: 5, label: "5 mile radius" },
} as const;

export type PlanRadiusKey = keyof typeof MAPS;

/** Circle radius as a percentage of the image edge. Set by the build script. */
const RADIUS_PCT = 26.4;

const PlanRadiusMap = ({ plan }: { plan: PlanRadiusKey }) => {
  const { src, miles, label } = MAPS[plan];
  const area = (miles * 2) ** 2;

  return (
    <figure className="l3-planmap">
      <img
        className="l3-planmap-img"
        src={src}
        width={640}
        height={640}
        loading="lazy"
        decoding="async"
        alt=""
        aria-hidden="true"
      />

      <svg
        className="l3-planmap-overlay"
        viewBox="0 0 100 100"
        role="img"
        aria-label={`Map showing a ${label} of coverage around a business location`}
      >
        <circle
          cx="50"
          cy="50"
          r={RADIUS_PCT}
          fill="var(--l3-gold)"
          fillOpacity="0.22"
          stroke="var(--l3-gold)"
          strokeWidth="1.1"
        />
      </svg>

      <span className="l3-planmap-radius">{label}</span>
      <span className="l3-planmap-area">{area} mi²</span>

      {/* OpenStreetMap's licence requires attribution wherever its map data is
          shown, but their own attribution guideline explicitly allows collapsing
          it to a small icon that reveals the full credit on click — the pattern
          mapping SDKs use in tight UI. This is that: a barely-visible "i" mark
          rather than a permanent text band sitting across the bottom of the
          map. https://osmfoundation.org/wiki/Licence/Attribution_Guidelines */}
      <a
        className="l3-planmap-attr"
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noreferrer"
        aria-label="Map data © OpenStreetMap contributors"
        title="Map data © OpenStreetMap contributors"
      >
        i
      </a>
    </figure>
  );
};

export default PlanRadiusMap;
