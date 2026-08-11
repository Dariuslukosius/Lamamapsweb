/**
 * Single source of truth for every headline, CTA and badge on /trial-hormozi.
 *
 * The weekly A/B cycle (see TESTING.md) swaps one element per week against the
 * /trial control. That is only workable if each swappable string lives in
 * exactly one place — so nothing below may be inlined back into a component.
 */
export const COPY = {
  // ---------- CTA (ONE primary, ONE secondary — across the whole page) ----------
  cta: {
    primary: "Start My Free 7-Day Trial",
    secondary: "Book a 15-Min Call",
  },

  // ---------- 3 badges — under every primary CTA ----------
  badges: [
    "No card required",
    "No account access needed",
    "Cancel anytime",
  ],

  // ---------- HERO ----------
  hero: {
    // ACTIVE variant (default). The other 4 live in h1Variants, for testing.
    h1: "The Calls You're Missing Are Going to the Shop Down the Road",
    subheadline:
      "We move your business into the Top 3 on Google Maps — usually within 90 days. No access to your Google account. No website changes. No contract.",
    socialProof: "4.9 ★ from 45 reviews",
  },

  /**
   * Visible rating, kept in one place so it cannot drift from the AggregateRating
   * in lib/structuredData.ts (4.9 / 45). /trial still shows 4.8 against the same
   * 45-review set; a visible number that contradicts the schema is what makes
   * Google drop a rich result, so this variant matches the schema instead.
   *
   * TODO: confirm 4.9 / 45 against the real review source, then align /trial too.
   */
  rating: {
    value: "4.9",
    countLabel: "45 reviews",
  },

  // ---------- H1 VARIANTS (for the weekly test) ----------
  h1Variants: {
    v1_money:
      "The Calls You're Missing Are Going to the Shop Down the Road", // ACTIVE
    v2_result_time:
      "Get Into the Top 3 on Google Maps in 90 Days — Guaranteed",
    v3_effortless:
      "Top 3 on Google Maps — Without Giving Us Access to Anything",
    v4_proof:
      "Rank 9 to Rank 1 in Six Weeks. Here's Exactly How We Did It.",
    v5_ads:
      "Stop Paying for Clicks You Should Be Getting for Free",
  },

  subheadlineVariants: {
    a: "We move your business into the Top 3 on Google Maps — usually within 90 days. No access to your Google account. No website changes. No contract.",
    b: "Local customers search, tap one of the top three results, and call. We get you into that list — and you don't lift a finger.",
    c: "Everything is done for you. You keep full control of your Google profile, your website, and your money until you see movement.",
  },

  /**
   * The one guarantee wording used everywhere on the page. Previously the page
   * said "Guaranteed Top 3" in one place and "typically within 90 days" in
   * another; two different promises for the same thing reads as hedging.
   */
  guaranteeShort: "Top 3 in 90 days — or you don't pay",

  // ---------- GUARANTEE BLOCK ----------
  guarantee: {
    eyebrow: "OUR GUARANTEE",
    h2: "Top 3 on Google Maps in 90 Days — or You Don't Pay",
    body:
      "If your business isn't in the Top 3 for your agreed keywords within 90 days, you don't pay for that period. You keep every ranking gain we made. We take the risk, not you.",
    // Deliberately blunt, and deliberately placed inside the guarantee rather
    // than buried in the FAQ: an over-claimed guarantee that the FAQ then walks
    // back is worse than no guarantee at all.
    honest:
      "To be straight with you: nobody controls Google's algorithm, so we can't promise a specific position on a specific day. What we can promise is the Top 3 inside 90 days — and if we miss it, that period is free.",
    bullets: [
      "No long-term contract — cancel any time",
      "You never hand over access to your Google account",
      "You see ranking movement during the free trial, before you pay",
    ],
  },

  // ---------- OBJECTIONS BLOCK ----------
  objections: {
    eyebrow: "BEFORE YOU DECIDE",
    h2: "Still Not Sure? Here's the Honest Answer.",
    items: [
      {
        question: "“I've been burned by SEO before.”",
        answer:
          "Fair. That's why you see ranking movement during a free trial, before you pay anything — and why we guarantee Top 3 in 90 days or you don't pay.",
      },
      {
        question: "“I don't have time for this.”",
        answer:
          "You need 15 minutes once. We handle the profile work, the local signals and the reporting. There is nothing for you to build or manage.",
      },
      {
        question: "“Is this safe? Sounds like black hat.”",
        answer:
          "We never access your Google account or your website. Nothing can be penalised, suspended or broken, because we don't touch it.",
      },
      {
        question: "“Will it work for my type of business?”",
        answer:
          "It has worked for a dental clinic, an auto service and a spa — all local, all previously invisible on the map. See the results above.",
      },
    ],
  },

  /**
   * Rewritten bodies for the four "what we do" cards. Same headings as /trial;
   * only the bodies change, so the work reads as ours rather than the client's.
   */
  leadCardBodies: {
    "Increase Your Local Visibility":
      "We build authority around your Google Business Profile and generate the local signals that push you into the map pack. You don't touch anything.",
    "Improve Your Search Performance":
      "We handle the keyword targeting, the service pages and the local relevance work — so ready-to-buy customers find you first.",
    "No Direct Access Required":
      "We never log into your accounts. Nothing on your website breaks. Nothing is at risk — and rankings still move.",
    "What's Needed for Best Results":
      "If your profile is verified and you have reviews, we move faster. If something's missing, we tighten it up for you — no work on your side.",
  },
} as const;
