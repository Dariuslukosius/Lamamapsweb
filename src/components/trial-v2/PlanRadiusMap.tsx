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
 * why the tiles are baked rather than fetched in the browser). It frames both
 * plans so the radius lands at the same pixel size in each, which is why one
 * RADIUS_PCT covers both: the plans differ by a factor of two in radius and the
 * images differ by exactly one zoom level.
 *
 * Only the map is baked in. The circle is drawn here as SVG so it stays sharp
 * at any width and takes its colour from the page palette rather than being
 * frozen into the image.
 */
const MAPS = {
  community: { src: communityMap, miles: "2.5", label: "2.5 mile radius" },
  city: { src: cityMap, miles: "5", label: "5 mile radius" },
} as const;

export type PlanRadiusKey = keyof typeof MAPS;

/** Circle radius as a percentage of the image edge. Set by the build script. */
const RADIUS_PCT = 26.4;

const PlanRadiusMap = ({ plan }: { plan: PlanRadiusKey }) => {
  const { src, miles, label } = MAPS[plan];

  return (
    <figure className="t2-planmap">
      <img
        className="t2-planmap-img"
        src={src}
        width={640}
        height={640}
        loading="lazy"
        decoding="async"
        alt=""
        aria-hidden="true"
      />

      <svg
        className="t2-planmap-overlay"
        viewBox="0 0 100 100"
        role="img"
        aria-label={`Map showing a ${label} of coverage around a business location`}
      >
        <circle
          cx="50"
          cy="50"
          r={RADIUS_PCT}
          fill="var(--t2-gold)"
          fillOpacity="0.12"
          stroke="var(--t2-gold)"
          strokeWidth="0.7"
        />
        {/* Radius line from the centre out to the edge, so the circle reads as
            a measured distance rather than a decorative ring. */}
        <line
          x1="50"
          y1="50"
          x2={50 + RADIUS_PCT}
          y2="50"
          stroke="var(--t2-gold)"
          strokeWidth="0.5"
          strokeDasharray="2 1.6"
        />
        <circle cx="50" cy="50" r="1.9" fill="var(--t2-gold)" />
      </svg>

      <span className="t2-planmap-badge">{miles} mi</span>

      {/* Required by the OpenStreetMap licence wherever its map data is shown. */}
      <figcaption className="t2-planmap-attr">
        Illustrative · map data ©{" "}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
          OpenStreetMap
        </a>{" "}
        contributors
      </figcaption>
    </figure>
  );
};

export default PlanRadiusMap;
