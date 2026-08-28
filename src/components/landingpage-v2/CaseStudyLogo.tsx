import { caseStudyLogoFor } from "@/lib/caseStudyLogos";

/**
 * The client's mark on a case-study card.
 *
 * V1 showed an emoji glyph here for every client, with a comment noting it was
 * decoration standing in for logos we did not hold. We now hold ten of the
 * seventeen, so those cards show the real thing and the rest keep the glyph
 * rather than getting a fabricated mark — see lib/caseStudyLogos.ts for which
 * are missing and what was already searched for each.
 *
 * `variant="pin"` renders the same logo as a map pin for the before/after
 * scan. It sits in the frame's corner, not over the centre of the grid: the
 * centre of a LamaLocal scan is the business's own location and carries its
 * most important ranking bubble, so a pin placed there would cover the single
 * number the reader is meant to be checking.
 */
const CaseStudyLogo = ({
  slug,
  glyph,
  business,
  variant = "tile",
}: {
  slug: string;
  glyph: string;
  business: string;
  variant?: "tile" | "pin";
}) => {
  const logo = caseStudyLogoFor(slug);
  const base = variant === "pin" ? "l2-case-pin" : "l2-case-logo";

  if (!logo) {
    // The pin is purely an identifier; with no logo there is nothing to
    // identify the map with, so it is dropped rather than shown as an emoji
    // floating on a screenshot.
    if (variant === "pin") return null;
    return (
      <div className={`${base} ${base}--glyph`} aria-hidden="true">
        {glyph}
      </div>
    );
  }

  const img = (
    <img
      className={base}
      src={logo}
      alt={variant === "pin" ? "" : `${business} logo`}
      aria-hidden={variant === "pin" ? true : undefined}
      loading="lazy"
      decoding="async"
    />
  );

  // The pin carries its own frame. It has to be rendered by this component
  // rather than by the caller: the caller passes the pin down as an element,
  // and an element is truthy whether or not it renders anything, so a frame
  // added at the other end would sit on every scan including the ones with no
  // logo to put in it.
  return variant === "pin" ? <div className="l2-baf-pin">{img}</div> : img;
};

export default CaseStudyLogo;
