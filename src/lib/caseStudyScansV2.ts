import malkaBefore from "@/assets/results-v2/malka-juodkrante-before.webp";
import malkaAfter from "@/assets/results-v2/malka-juodkrante-after.webp";
import miracleK9Before from "@/assets/results-v2/miracle-k9-birmingham-before.webp";
import miracleK9After from "@/assets/results-v2/miracle-k9-birmingham-after.webp";
import miracleK91on1Before from "@/assets/results-v2/miracle-k9-1on1-before.webp";
import miracleK91on1After from "@/assets/results-v2/miracle-k9-1on1-after.webp";
import miracleK9CanineBefore from "@/assets/results-v2/miracle-k9-canine-before.webp";
import miracleK9CanineAfter from "@/assets/results-v2/miracle-k9-canine-after.webp";
import karaliusBefore from "@/assets/results-v2/karalius-panevezys-before.webp";
import karaliusAfter from "@/assets/results-v2/karalius-panevezys-after.webp";
import loveMetalBefore from "@/assets/results-v2/love-metal-west-sussex-before.webp";
import loveMetalAfter from "@/assets/results-v2/love-metal-west-sussex-after.webp";
import dentpicksBefore from "@/assets/results-v2/dentpicks-texas-before.webp";
import dentpicksAfter from "@/assets/results-v2/dentpicks-texas-after.webp";
import deliveryKingsBefore from "@/assets/results-v2/delivery-kings-sunshine-coast-before.webp";
import deliveryKingsAfter from "@/assets/results-v2/delivery-kings-sunshine-coast-after.webp";
import jeanSeoBefore from "@/assets/results-v2/jean-seo-dubai-before.webp";
import jeanSeoAfter from "@/assets/results-v2/jean-seo-dubai-after.webp";
import vairaldaBefore from "@/assets/results-v2/vairalda-kaunas-before.webp";
import vairaldaAfter from "@/assets/results-v2/vairalda-kaunas-after.webp";
import vairaldaBkatBefore from "@/assets/results-v2/vairalda-bkat-before.webp";
import vairaldaBkatAfter from "@/assets/results-v2/vairalda-bkat-after.webp";
import nidaBefore from "@/assets/results-v2/nida-neringa-before.webp";
import nidaAfter from "@/assets/results-v2/nida-neringa-after.webp";
import nidaErdveBefore from "@/assets/results-v2/nida-erdve-before.webp";
import nidaErdveAfter from "@/assets/results-v2/nida-erdve-after.webp";
import hanseCentrasBefore from "@/assets/results-v2/schmitz-centras-before.webp";
import hanseCentrasAfter from "@/assets/results-v2/schmitz-centras-after.webp";
import hanseDalysBefore from "@/assets/results-v2/schmitz-dalys-before.webp";
import hanseDalysAfter from "@/assets/results-v2/schmitz-dalys-after.webp";
import hanseServisasBefore from "@/assets/results-v2/schmitz-servisas-before.webp";
import hanseServisasAfter from "@/assets/results-v2/schmitz-servisas-after.webp";
import ortovetBefore from "@/assets/results-v2/vet-vilnius-before.webp";
import ortovetAfter from "@/assets/results-v2/vet-vilnius-after.webp";

/**
 * Retina-sharp copies of the case-study before/after scans, for /trial-v2 and
 * /landingpage-v2 only. Built by scripts/upscale-case-studies.py.
 *
 * Separate from lib/caseStudies.ts for the same reason lib/caseStudyLogos.ts
 * is: that file is shared with the V1 pages and is the single source of truth
 * for the dates/ranks/metrics claims attached to named real businesses — this
 * module only swaps which IMAGE renders for a given slug, all text and figures
 * still come from caseStudies.ts unchanged.
 *
 * Every slug in caseStudies.ts has an entry here — unlike caseStudyLogos.ts,
 * there was no missing-source problem to work around, so this is a plain
 * Record rather than a lookup with a documented fallback.
 */
export const caseStudyScansV2: Record<string, { before: string; after: string }> = {
  "love-metal-west-sussex": { before: loveMetalBefore, after: loveMetalAfter },
  "karalius-panevezys": { before: karaliusBefore, after: karaliusAfter },
  "dentpicks-texas": { before: dentpicksBefore, after: dentpicksAfter },
  "miracle-k9-residential": { before: miracleK9Before, after: miracleK9After },
  "miracle-k9-1on1": { before: miracleK91on1Before, after: miracleK91on1After },
  "miracle-k9-canine": { before: miracleK9CanineBefore, after: miracleK9CanineAfter },
  "vairalda-profesionalus": { before: vairaldaBefore, after: vairaldaAfter },
  "vairalda-bkategorija": { before: vairaldaBkatBefore, after: vairaldaBkatAfter },
  "delivery-kings-sunshine-coast": { before: deliveryKingsBefore, after: deliveryKingsAfter },
  "hanse-trailer-centras": { before: hanseCentrasBefore, after: hanseCentrasAfter },
  "hanse-trailer-dalys": { before: hanseDalysBefore, after: hanseDalysAfter },
  "hanse-trailer-servisas": { before: hanseServisasBefore, after: hanseServisasAfter },
  "nida-renginiai": { before: nidaBefore, after: nidaAfter },
  "nida-renginiu-erdve": { before: nidaErdveBefore, after: nidaErdveAfter },
  "jean-seo-dubai": { before: jeanSeoBefore, after: jeanSeoAfter },
  "ortovet-vilnius": { before: ortovetBefore, after: ortovetAfter },
  "malka-juodkrante": { before: malkaBefore, after: malkaAfter },
};
