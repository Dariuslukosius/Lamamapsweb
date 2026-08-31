import dentpicksLogo from "@/assets/brands-cases/dentpicks.webp";
import vairaldaLogo from "@/assets/brands-cases/vairalda.webp";
import deliveryKingsLogo from "@/assets/brands-cases/delivery-kings.svg";
import hanseTrailerLogo from "@/assets/brands-cases/hanse-trailer.svg";
import karaliusNuogasLogo from "@/assets/brands-cases/karalius-nuogas.webp";
import nidaAgilaLogo from "@/assets/brands-cases/nida-agila.webp";
import ortovetLogo from "@/assets/brands-cases/ortovet.webp";
import malkaPizzaLogo from "@/assets/brands-cases/malka-pizza.webp";
// TODO: žemos kokybės logotipas – reikia pakeisti aukštos kokybės versija
// 200x200px source. The case card renders it in a 52px tile, so it is already
// soft on a 2x screen and visibly soft on a 3x one.
import loveMetalLogo from "@/assets/brands-cases/love-metal.webp";
// TODO: žemos kokybės logotipas – reikia pakeisti aukštos kokybės versija
// 113x128px. The case card renders it in a 52px tile, so it is already soft on
// a 2x screen and visibly soft on a 3x one. Every other logo here is either
// vector or >450px wide.
import miracleK9Logo from "@/assets/brands/miracle-k9-academy.webp";
// Not a client logo — no real logo exists for this business, and lovemetalfab
// invented one is not honest to show as one. A plain generated initials mark
// in the site's own palette (gold ring, navy "JS"), styled so it never reads
// as a scraped or fabricated brand mark. See lib/caseStudies.ts for why no
// real one was found.
import jeanSeoMonogram from "@/assets/brands-cases/jean-seo-monogram.svg";

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
 * MISSING A REAL LOGO. One card, jean-seo-dubai: no site or social profile
 * was found for this client under the name on the card. It gets a generated
 * placeholder (see the import above) rather than the emoji glyph the other
 * unmatched cards use, because the placeholder was requested explicitly —
 * swap it for the real mark if one turns up.
 *
 * To add or replace one: drop the file in src/assets/brands-cases/ and add or
 * change a line below. Vector (.svg) preferred; otherwise at least 400px on
 * the long edge.
 */
export const caseStudyLogos: Record<string, string> = {
  "love-metal-west-sussex": loveMetalLogo,
  "karalius-panevezys": karaliusNuogasLogo,
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

  "nida-renginiai": nidaAgilaLogo,
  "nida-renginiu-erdve": nidaAgilaLogo,

  "jean-seo-dubai": jeanSeoMonogram,

  "ortovet-vilnius": ortovetLogo,

  "malka-juodkrante": malkaPizzaLogo,
};

export const caseStudyLogoFor = (slug: string): string | undefined => caseStudyLogos[slug];
