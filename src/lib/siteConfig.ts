// Which product this build is, and the origin it will be served from.
//
// Both are baked in at build time rather than derived from window.location,
// for the same reason SEO.tsx already avoided it: the prerender step drives a
// headless browser against localhost, so anything read from the live origin
// would freeze "http://localhost:4173" into the canonical, og:url and JSON-LD
// of every static snapshot.
//
// This project now builds one product only: llamamaps.com. It used to also
// build /trial and /landingpage as separate single-page domain deployments,
// plus several temporary review targets for redesign candidates — all of that
// was retired when the site consolidated onto one /trial landing page (see
// CLEANUP-TRIAL-ONLY-PROMPT.md). DEPLOY_TARGET is kept as a type rather than
// deleted outright because SITE_URL/BRAND_URL below still read it from the
// same build-time env var, and because prerender.mjs and site-files.mjs share
// this file's shape with the sibling project that still builds llamamaps.eu
// and llamamaps.co.uk from the pre-consolidation codebase.

export type DeployTarget = "main";

export const DEPLOY_TARGETS: readonly DeployTarget[] = ["main"];

export const DEFAULT_SITE_URL = "https://llamamaps.com";

// Values are validated in vite.config.ts, which fails the build on a typo.
// Doing it here instead would only throw in the visitor's browser, because
// import.meta.env is inlined as a literal at build time.
export const DEPLOY_TARGET = (import.meta.env.VITE_DEPLOY_TARGET ?? "main") as DeployTarget;

// Trailing slash stripped so `${SITE_URL}${pathname}` never produces a
// double slash — the callers all pass paths that start with "/".
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, "");

// The brand's permanent home. Distinct from SITE_URL in principle — schema.org
// nodes are identified by @id, and organizationSchema/serviceSchema reference
// /contacts and /services, so anything built from a *different* origin than
// llamamaps.com would need this to keep pointing at the real one. In this
// single-target build the two are the same value; BRAND_URL stays a separate
// export because structuredData.ts's @id logic depends on the distinction
// existing, not on it currently having a different value.
export const BRAND_URL = (import.meta.env.VITE_BRAND_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, "");

/** Where the footer's privacy link points. Always a real route now that every
 * page in this build shares one domain and one navbar. */
export const privacyUrl = () => "/privacy";
