// Which product this build is, and the origin it will be served from.
//
// Both are baked in at build time rather than derived from window.location,
// for the same reason SEO.tsx already avoided it: the prerender step drives a
// headless browser against localhost, so anything read from the live origin
// would freeze "http://localhost:4173" into the canonical, og:url and JSON-LD
// of every static snapshot.
//
// One codebase, three Cloudflare Pages deployments:
//
//   target        origin                 routes
//   ──────────────────────────────────────────────────────────────────────
//   main          llamamaps.com          every route, unchanged
//   trial         (its own domain)       TrialPage promoted to "/"
//   landingpage   (its own domain)       TrialHormoziPage promoted to "/"
//
// Phase 1 deploys "main" only — /trial and /landingpage stay reachable at
// exactly the paths the live ads already point at, so the migration off Vercel
// changes no URL. The other two targets exist so the later domain split is a
// build-variable change rather than a fork of the codebase; each one gets its
// own canonical origin, so no domain ends up claiming another's URLs.

export type DeployTarget =
  | "main"
  | "trial"
  | "landingpage"
  | "trial-v2"
  | "trial-v3"
  | "trial-v4"
  | "landingpage-v2"
  | "landingpage-v3";

// trial-v2, trial-v3, trial-v4, landingpage-v2 and landingpage-v3 are
// temporary review targets for the V2 redesigns (see the matching branches in
// App.tsx) — not permanent products of their own, just root-promoted builds
// so each can be uploaded somewhere and opened in a real browser before
// replacing its V1.
export const DEPLOY_TARGETS: readonly DeployTarget[] = [
  "main",
  "trial",
  "landingpage",
  "trial-v2",
  "trial-v3",
  "trial-v4",
  "landingpage-v2",
  "landingpage-v3",
];

export const DEFAULT_SITE_URL = "https://llamamaps.com";

// Values are validated in vite.config.ts, which fails the build on a typo.
// Doing it here instead would only throw in the visitor's browser, because
// import.meta.env is inlined as a literal at build time.
export const DEPLOY_TARGET = (import.meta.env.VITE_DEPLOY_TARGET ?? "main") as DeployTarget;

// Trailing slash stripped so `${SITE_URL}${pathname}` never produces a
// double slash — the callers all pass paths that start with "/".
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, "");

// The brand's permanent home, which is *not* always the origin this build is
// served from. Two things depend on the difference once the landing pages move
// to their own domains:
//
//   1. Entity identity. schema.org nodes are identified by @id. If the trial
//      domain published "@id: https://<trial-domain>/#organization", answer
//      engines would see two unrelated organizations for one business and
//      split the reputation signals between them. Pinning the Organization,
//      WebSite and logo @ids to the brand origin keeps it one entity that all
//      three deployments point at.
//   2. Link targets. organizationSchema and serviceSchema reference /contacts
//      and /services — pages that exist only on the main site. Built from the
//      landing page's own origin they would be 404s in the structured data.
//
// Page-level URLs (canonical, og:url, WebPage @id) must NOT use this: those
// have to describe the page where it actually lives. They use SITE_URL.
export const BRAND_URL = (import.meta.env.VITE_BRAND_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, "");

/**
 * The path a landing page occupies in this build. On its own domain it is the
 * home page; on the main site it keeps its historical sub-path.
 */
export const trialPath = () => (DEPLOY_TARGET === "trial" ? "/" : "/trial");
export const landingPagePath = () => (DEPLOY_TARGET === "landingpage" ? "/" : "/landingpage");

/** True when this build serves a single ad landing page rather than the site. */
export const isLandingOnlyTarget = () => DEPLOY_TARGET !== "main";

/**
 * Where the landing pages' footer privacy link should point.
 *
 * On the main site /privacy is a real route. On a landing-page domain it is
 * not — that deployment contains one page — so the link has to cross to the
 * brand domain or it is a 404 in the footer of a page paid traffic lands on.
 *
 * Crossing over rather than shipping a copy of the policy is deliberate: the
 * policy page renders the full site Navbar, whose links (/about, /services,
 * /contacts) would themselves 404 on a landing domain, and hosting the same
 * policy text on three hosts creates duplicate pages for no benefit. A privacy
 * link pointing at the company's main site is standard and satisfies ad review.
 */
export const privacyUrl = () => (DEPLOY_TARGET === "main" ? "/privacy" : `${BRAND_URL}/privacy`);

/**
 * What /landingpage should declare as its canonical.
 *
 * It is an A/B duplicate of /trial and has always pointed its canonical at the
 * original so that /trial absorbs the authority rather than the two competing.
 * On the main site that is simply "/trial".
 *
 * Once the pair is split across two domains the same intent needs an absolute
 * URL, because "/trial" would resolve against the landing page's OWN domain —
 * where no such page exists. Set VITE_TRIAL_URL on the landing-page deployment
 * to the trial domain's home page to keep the relationship.
 *
 * If it is not set, this falls back to a self-referencing canonical. That is
 * the deliberate safe default: a self-canonical is merely a missed
 * consolidation, whereas a canonical pointing at a 404 is a signal Google
 * treats as broken. Both pages are noindex either way.
 */
export const landingPageCanonical = (): string | undefined => {
  if (DEPLOY_TARGET === "main") return "/trial";
  const trialUrl = import.meta.env.VITE_TRIAL_URL?.replace(/\/+$/, "");
  if (!trialUrl) return undefined;
  // A bare origin needs the root slash: "https://x.com" and "https://x.com/"
  // are the same resource, but only the second is a well-formed page URL, and
  // canonical values are compared as strings by more than one crawler.
  return /^https?:\/\/[^/]+$/.test(trialUrl) ? `${trialUrl}/` : trialUrl;
};
