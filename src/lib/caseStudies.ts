import malkaBefore from "@/assets/results/malka-juodkrante-before.webp";
import malkaAfter from "@/assets/results/malka-juodkrante-after.webp";
import miracleK9Before from "@/assets/results/miracle-k9-birmingham-before.webp";
import miracleK9After from "@/assets/results/miracle-k9-birmingham-after.webp";
import miracleK91on1Before from "@/assets/results/miracle-k9-1on1-before.webp";
import miracleK91on1After from "@/assets/results/miracle-k9-1on1-after.webp";
import miracleK9CanineBefore from "@/assets/results/miracle-k9-canine-before.webp";
import miracleK9CanineAfter from "@/assets/results/miracle-k9-canine-after.webp";
import karaliusBefore from "@/assets/results/karalius-panevezys-before.webp";
import karaliusAfter from "@/assets/results/karalius-panevezys-after.webp";
import loveMetalBefore from "@/assets/results/love-metal-west-sussex-before.webp";
import loveMetalAfter from "@/assets/results/love-metal-west-sussex-after.webp";
import dentpicksBefore from "@/assets/results/dentpicks-texas-before.webp";
import dentpicksAfter from "@/assets/results/dentpicks-texas-after.webp";
import deliveryKingsBefore from "@/assets/results/delivery-kings-sunshine-coast-before.webp";
import deliveryKingsAfter from "@/assets/results/delivery-kings-sunshine-coast-after.webp";
import jeanSeoBefore from "@/assets/results/jean-seo-dubai-before.webp";
import jeanSeoAfter from "@/assets/results/jean-seo-dubai-after.webp";
import vairaldaBefore from "@/assets/results/vairalda-kaunas-before.webp";
import vairaldaAfter from "@/assets/results/vairalda-kaunas-after.webp";
import vairaldaBkatBefore from "@/assets/results/vairalda-bkat-before.webp";
import vairaldaBkatAfter from "@/assets/results/vairalda-bkat-after.webp";
import nidaBefore from "@/assets/results/nida-neringa-before.webp";
import nidaAfter from "@/assets/results/nida-neringa-after.webp";
import nidaErdveBefore from "@/assets/results/nida-erdve-before.webp";
import nidaErdveAfter from "@/assets/results/nida-erdve-after.webp";
import hanseCentrasBefore from "@/assets/results/schmitz-centras-before.webp";
import hanseCentrasAfter from "@/assets/results/schmitz-centras-after.webp";
import hanseDalysBefore from "@/assets/results/schmitz-dalys-before.webp";
import hanseDalysAfter from "@/assets/results/schmitz-dalys-after.webp";
import hanseServisasBefore from "@/assets/results/schmitz-servisas-before.webp";
import hanseServisasAfter from "@/assets/results/schmitz-servisas-after.webp";
import ortovetBefore from "@/assets/results/vet-vilnius-before.webp";
import ortovetAfter from "@/assets/results/vet-vilnius-after.webp";

/**
 * Case studies shown on /trial and /landingpage.
 *
 * Single source of truth on purpose: these are verifiable claims about real
 * client businesses, and the two pages are an A/B pair. Duplicating the numbers
 * per page would eventually let one drift and publish a figure the screenshots
 * don't support.
 *
 * Every grid-scan before/after pair is two frames of one LamaLocal GIF, so the
 * map extent, zoom and grid geometry are identical by construction rather than
 * by eye — only the ranking bubbles differ. The scans' own header (date +
 * search term) is cropped off both frames identically, because in the slider it
 * would tear into a half-before/half-after date as the handle moves; the dates
 * live in `beforeLabel`/`afterLabel` as real text instead.
 *
 * Frames are NOT blindly first-and-last. Some scans had their grid area changed
 * partway through the sequence, so the two frames used are picked from a run that
 * shares one map extent — otherwise the slider morphs between two different maps
 * instead of showing the same one twice. Hanse Trailer's "schmitz centras" uses
 * frames 2→7 for exactly this reason.
 *
 * One card per scan, deliberately. Several clients are tracked on more than one
 * search term, and each term is its own scan with its own dates and figures —
 * the same client can take six weeks on one phrase and ten on another. Those get
 * one card each rather than being folded together, so no scan is hidden behind a
 * control the reader has to find. Cards for the same business sit next to each
 * other and name their term in the subtitle so they read as a set, not a repeat.
 */
export interface CaseStudyMetric {
  label: string;
  value: string;
  /**
   * Stack the value under its label instead of opposite it. For phrase-length
   * values (the tracked search term) — side by side they collide in the card's
   * narrow left column and wrap into a cramped two-line tangle.
   */
  stack?: boolean;
}

export interface CaseStudy {
  slug: string;
  business: string;
  location: string;
  /** Decorative only — we have no logo assets for these clients. */
  icon: string;
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  metrics: CaseStudyMetric[];
}

/**
 * Builds the rows every grid-scan card shows, in a fixed order.
 *
 * The first four are MEASURED — read straight off the two scan frames.
 * `callsEst` and `trafficEst` are NOT. No client here has handed over Google
 * Business Profile call or view counts, so those two are modelled from the
 * measured ranking change using published local-pack click-through rates by
 * position, then compressed onto a credible band: a share gain does not lift
 * calls one-for-one, because total local search volume is a hard ceiling.
 * (Raw click-share ratios reach ~690x for the "not ranked -> #1" cases, which
 * is arithmetically true and commercially meaningless.)
 *
 * They are labelled "(est.)" on the card and footnoted under the section. Do
 * not drop that labelling, and do not restate these as measured results —
 * they are attributed to named, identifiable real businesses.
 */
const scanMetrics = (
  term: string,
  rankStart: string,
  rankNow: string,
  timeToResult: string,
  callsEst: string,
  trafficEst: string,
): CaseStudyMetric[] => [
  { label: "Search term tracked", value: term, stack: true },
  { label: "Rank at start", value: rankStart },
  { label: "Rank now", value: rankNow },
  { label: "Time to result", value: timeToResult },
  { label: "Calls increased (est.)", value: callsEst },
  { label: "Traffic from Maps (est.)", value: trafficEst },
];

/*
 * TODO: replace the two "(est.)" rows with real figures per client.
 * Google Business Profile > Performance exports calls, direction requests and
 * searches per month; one CSV per client turns the modelled numbers into
 * measured ones, and the "(est.)" labels and the section footnote can then go.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "love-metal-west-sussex",
    business: "Love Metal Fabrication",
    location: "West Sussex · architectural metalwork",
    icon: "🔩",
    before: loveMetalBefore,
    after: loveMetalAfter,
    beforeLabel: "Before · 20 Dec 2024",
    afterLabel: "After · 5 May 2025",
    metrics: scanMetrics("architectural metalwork", "21 across the whole grid", "1 across the whole grid", "19 weeks", "~5x", "+600%"),
  },
  {
    slug: "karalius-panevezys",
    business: "Karalius Nuogas",
    location: "Panevėžys · tortillas",
    icon: "🌯",
    before: karaliusBefore,
    after: karaliusAfter,
    beforeLabel: "Before · 18 Jun 2026",
    afterLabel: "After · 10 Aug 2026",
    metrics: scanMetrics("tortilijos panevezys", "21 across the grid", "1–2 across the grid", "8 weeks", "~5x", "+575%"),
  },
  {
    slug: "dentpicks-texas",
    business: "Dentpicks Auto Hail Repair",
    location: "Plano, Texas · hail damage repair",
    icon: "🚗",
    before: dentpicksBefore,
    after: dentpicksAfter,
    beforeLabel: "Before · 6 May 2026",
    afterLabel: "After · 11 Aug 2026",
    metrics: scanMetrics("auto hail repair", "5–13 across the grid", "1–3 across the grid", "14 weeks", "~2.5x", "+250%"),
  },
  {
    slug: "miracle-k9-residential",
    business: "Miracle K9 Academy",
    location: "Birmingham · residential dog training",
    icon: "🐕",
    before: miracleK9Before,
    after: miracleK9After,
    beforeLabel: "Before · 2 Oct 2025",
    afterLabel: "After · 11 Dec 2025",
    metrics: scanMetrics("residential dog training birmingham", "4–15 across the grid", "2–4 across the grid", "10 weeks", "~2.5x", "+225%"),
  },
  {
    slug: "miracle-k9-1on1",
    business: "Miracle K9 Academy",
    location: "Birmingham · 1 on 1 dog training",
    icon: "🐕",
    before: miracleK91on1Before,
    after: miracleK91on1After,
    beforeLabel: "Before · 2 Oct 2025",
    afterLabel: "After · 15 Nov 2025",
    metrics: scanMetrics("1 on 1 dog training", "6–20 across the grid", "1–3 across most of the grid", "6 weeks", "~3x", "+300%"),
  },
  {
    slug: "miracle-k9-canine",
    business: "Miracle K9 Academy",
    location: "Birmingham · canine training",
    icon: "🐕",
    before: miracleK9CanineBefore,
    after: miracleK9CanineAfter,
    beforeLabel: "Before · 2 Oct 2025",
    afterLabel: "After · 11 Dec 2025",
    metrics: scanMetrics("canine training", "5–21 across the grid", "1–3 across central Birmingham", "10 weeks", "~3x", "+300%"),
  },
  {
    slug: "vairalda-profesionalus",
    business: "Vairalda Driving School",
    location: "Kaunas · profesionalūs vairavimo kursai",
    icon: "🚦",
    before: vairaldaBefore,
    after: vairaldaAfter,
    beforeLabel: "Before · 26 Jun 2026",
    afterLabel: "After · 2 Jul 2026",
    metrics: scanMetrics("profesionalūs vairavimo kursai kaune", "5–20 across the grid", "1–3 across most of the grid", "1 week", "~3x", "+300%"),
  },
  {
    slug: "vairalda-bkategorija",
    business: "Vairalda Driving School",
    location: "Kaunas · geriausi b kategorijos kursai",
    icon: "🚦",
    before: vairaldaBkatBefore,
    after: vairaldaBkatAfter,
    beforeLabel: "Before · 26 Jun 2026",
    afterLabel: "After · 2 Jul 2026",
    metrics: scanMetrics("geriausi b kategorijos kursai kaune", "4–13 across the grid", "1–2 across most of the grid", "1 week", "~2.5x", "+250%"),
  },
  {
    slug: "delivery-kings-sunshine-coast",
    business: "Delivery Kings",
    location: "Sunshine Coast, Australia · removals",
    icon: "🚚",
    before: deliveryKingsBefore,
    after: deliveryKingsAfter,
    beforeLabel: "Before · 12 Mar 2026",
    afterLabel: "After · 17 May 2026",
    metrics: scanMetrics("furniture removalists sunshine coast", "4–16 across the grid", "1–2 across most of the grid", "9 weeks", "~3x", "+275%"),
  },
  {
    slug: "hanse-trailer-centras",
    business: "Hanse Trailer",
    location: "Vilnius · schmitz centras",
    icon: "🚛",
    before: hanseCentrasBefore,
    after: hanseCentrasAfter,
    beforeLabel: "Before · 26 Mar 2026",
    afterLabel: "After · 1 Jun 2026",
    metrics: scanMetrics("schmitz centras", "21 across the whole grid", "1 across nearly the whole grid", "10 weeks", "~5x", "+600%"),
  },
  {
    slug: "hanse-trailer-dalys",
    business: "Hanse Trailer",
    location: "Vilnius · schmitz dalys vilnius",
    icon: "🚛",
    before: hanseDalysBefore,
    after: hanseDalysAfter,
    beforeLabel: "Before · 26 Mar 2026",
    afterLabel: "After · 1 Jun 2026",
    metrics: scanMetrics("schmitz dalys vilnius", "21 across the whole grid", "1 across the whole grid", "10 weeks", "~5x", "+600%"),
  },
  {
    slug: "hanse-trailer-servisas",
    business: "Hanse Trailer",
    location: "Vilnius · schmitz servisas",
    icon: "🚛",
    before: hanseServisasBefore,
    after: hanseServisasAfter,
    beforeLabel: "Before · 26 Mar 2026",
    afterLabel: "After · 1 Jun 2026",
    metrics: scanMetrics("schmitz servisas", "21 across nearly the whole grid", "1–2 across the whole grid", "10 weeks", "~5x", "+575%"),
  },
  {
    slug: "nida-renginiai",
    business: "Nida Tourist Information Centre",
    location: "Neringa · renginiai",
    icon: "🏖️",
    before: nidaBefore,
    after: nidaAfter,
    beforeLabel: "Before · 3 Jun 2026",
    afterLabel: "After · 10 Jun 2026",
    metrics: scanMetrics("renginiai neringa", "4–21 across the grid", "1–3 across most of the grid", "1 week", "~3x", "+275%"),
  },
  {
    slug: "nida-renginiu-erdve",
    business: "Nida Tourist Information Centre",
    location: "Neringa · renginių erdvė",
    icon: "🏖️",
    before: nidaErdveBefore,
    after: nidaErdveAfter,
    beforeLabel: "Before · 3 Jun 2026",
    afterLabel: "After · 10 Jun 2026",
    metrics: scanMetrics("renginių erdvė nida", "5–8 across the grid", "2–3 across most of the grid", "1 week", "~2.5x", "+200%"),
  },
  {
    slug: "jean-seo-dubai",
    business: "Jean Local SEO Agency",
    location: "Dubai · SEO agency",
    icon: "📍",
    before: jeanSeoBefore,
    after: jeanSeoAfter,
    beforeLabel: "Before · 20 Jul 2025",
    afterLabel: "After · 28 Jul 2025",
    metrics: scanMetrics("local seo near me", "5–21 across the grid", "1–2 across most of the grid", "1 week", "~3x", "+325%"),
  },
  {
    slug: "ortovet-vilnius",
    business: "Ortovet",
    location: "Vilnius · veterinary clinic",
    icon: "🐾",
    before: ortovetBefore,
    after: ortovetAfter,
    beforeLabel: "Before · 25 Mar 2026",
    afterLabel: "After · 1 Apr 2026",
    metrics: scanMetrics("veterinarijos klinika vilniuje", "3–21 across the grid", "1–2 across most of the grid", "1 week", "~3x", "+275%"),
  },
  {
    slug: "malka-juodkrante",
    business: "Malka Pizza & Grill",
    location: "Juodkrantė · restaurant",
    icon: "🍕",
    before: malkaBefore,
    after: malkaAfter,
    beforeLabel: "Before · 3 Jun 2026",
    afterLabel: "After · 9 Jun 2026",
    metrics: scanMetrics("pizza juodkrantė", "4 across the grid", "2 across the grid", "1 week", "~2x", "+150%"),
  },
];
