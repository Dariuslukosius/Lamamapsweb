import { caseStudyLogoFor } from "@/lib/caseStudyLogos";

/**
 * The client's mark on a case-study card, next to its name in the card head.
 *
 * V1 showed an emoji glyph here for every client, with a comment noting it was
 * decoration standing in for logos we did not hold. We now hold real logos for
 * most of them, so those cards show the real thing and the rest keep the
 * glyph rather than getting a fabricated mark — see lib/caseStudyLogos.ts for
 * which are missing and what was already searched for each.
 */
const CaseStudyLogo = ({ slug, glyph, business }: { slug: string; glyph: string; business: string }) => {
  const logo = caseStudyLogoFor(slug);

  if (!logo) {
    return (
      <div className="t3-case-logo--glyph" aria-hidden="true">
        {glyph}
      </div>
    );
  }

  return <img className="t3-case-logo" src={logo} alt={`${business} logo`} loading="lazy" decoding="async" />;
};

export default CaseStudyLogo;
