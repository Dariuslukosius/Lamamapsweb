import dentpicksLogo from "@/assets/brands-cases/dentpicks.webp";
import vairaldaLogo from "@/assets/brands-cases/vairalda.webp";
import deliveryKingsLogo from "@/assets/brands-cases/delivery-kings.svg";
import hanseTrailerLogo from "@/assets/brands-cases/hanse-trailer.svg";
// TODO: žemos kokybės logotipas – reikia pakeisti aukštos kokybės versija
// 113x128px. The case card renders it in a 52px tile, so it is already soft on
// a 2x screen and visibly soft on a 3x one. Every other logo here is either
// vector or >450px wide.
import miracleK9Logo from "@/assets/brands/miracle-k9-academy.webp";

/**
 * Client logos for the case-study cards on /trial-v2 and /landingpage-v2.
 *
 * Deliberately a separate file from lib/caseStudies.ts rather than new fields on
 * it. caseStudies.ts is shared with the V1 pages, and its own docblock explains
 * why its contents are single-sourced: the figures there are verifiable claims
 * about named real businesses, and a copy of that file would eventually drift
 * away from the screenshots that back it. Logos are pure presentation, so they
 * live here, keyed by slug, and the V1 pages never import this module.
 *
 * Keys are CaseStudy["slug"] values. A slug with no entry falls back to the
 * card's existing glyph — see CaseStudyLogo.tsx.
 *
 * MISSING LOGOS. Seven of the seventeen cards have no logo asset. What was
 * found for each, so the search does not get repeated from scratch:
 *
 *   love-metal-west-sussex  lovemetalfab.co.uk currently serves "Account
 *                           Suspended" — nothing to take a logo from.
 *   ortovet-vilnius         ortovet.lt ships only a generic Lucide-style
 *                           outline icon as its favicon, not a wordmark.
 *   nida-renginiai          visitneringa.com's header image is the Neringa
 *   nida-renginiu-erdve     municipal coat of arms, which belongs to the
 *                           municipality and is not the centre's own logo.
 *   karalius-panevezys      no site found.
 *   jean-seo-dubai          no site found.
 *   malka-juodkrante        no site found; Facebook page only.
 *
 * To add one: drop the file in src/assets/brands-cases/ and add a line below.
 * Vector (.svg) preferred; otherwise at least 400px on the long edge.
 */
export const caseStudyLogos: Record<string, string> = {
  "dentpicks-texas": dentpicksLogo,

  "miracle-k9-residential": miracleK9Logo,
  "miracle-k9-1on1": miracleK9Logo,
  "miracle-k9-canine": miracleK9Logo,

  "vairalda-profesionalus": vairaldaLogo,
  "vairalda-bkategorija": vairaldaLogo,

  "delivery-kings-sunshine-coast": deliveryKingsLogo,

  "hanse-trailer-centras": hanseTrailerLogo,
  "hanse-trailer-dalys": hanseTrailerLogo,
  "hanse-trailer-servisas": hanseTrailerLogo,
};

export const caseStudyLogoFor = (slug: string): string | undefined => caseStudyLogos[slug];
