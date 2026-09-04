// Single source of truth for what each deployment contains.
//
// The build pipeline has two Node steps that both need to agree with the React
// router in src/App.tsx about which paths exist: prerender.mjs (which snapshots
// them) and site-files.mjs (which lists them in sitemap.xml). Cloudflare Pages
// has no SPA catch-all in this setup — see cloudflare/_headers-and-redirects in
// README-CLOUDFLARE.md for why — so a path that App.tsx routes but this file
// forgets is a hard 404 in production, not a slow client-side render.
//
// src/test/routes.test.ts fails the build if this file and App.tsx disagree.
//
// This project builds one product only: llamamaps.com. It used to also build
// /trial and /landingpage as their own single-page domains (llamamaps.eu,
// llamamaps.co.uk) plus several temporary review targets for redesign
// candidates (trial-v2..v4, landingpage-v2/v3) — all retired when the site
// consolidated onto one /trial landing page. See CLEANUP-TRIAL-ONLY-PROMPT.md.

/** @typedef {"main"} DeployTarget */

/** @type {DeployTarget[]} */
export const DEPLOY_TARGETS = ["main"];

export const DEFAULT_SITE_URL = "https://llamamaps.com";

/**
 * Reads the target for the current build. Kept in one place so prerender and
 * site-files can never disagree about which product they are producing.
 * @returns {DeployTarget}
 */
export function currentTarget() {
  const target = process.env.VITE_DEPLOY_TARGET || "main";
  if (!DEPLOY_TARGETS.includes(target)) {
    throw new Error(
      `VITE_DEPLOY_TARGET="${target}" is not one of: ${DEPLOY_TARGETS.join(", ")}`,
    );
  }
  return /** @type {DeployTarget} */ (target);
}

export function currentSiteUrl() {
  return (process.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");
}

/**
 * Build output directory for the current build.
 */
export function currentOutDir() {
  return process.env.BUILD_OUT_DIR || "dist";
}

// ── Deployments ──────────────────────────────────────────────────────────────
// A deployment binds a domain to a target and to its own output folder.
export const DEPLOYMENTS = {
  com: {
    domain: "llamamaps.com",
    target: "main",
    outDir: "dist",
    siteUrl: "https://llamamaps.com",
    // Cloudflare Pages: routing and headers come from _redirects and _headers.
    host: "cloudflare",
    description: "the full site",
  },
};

/** @param {string} name */
export function deployment(name) {
  const config = DEPLOYMENTS[name];
  if (!config) {
    throw new Error(`Unknown deployment "${name}". Expected one of: ${Object.keys(DEPLOYMENTS).join(", ")}`);
  }
  return config;
}

const TARGETS = {
  main: {
    routes: ["/", "/about", "/services", "/contacts", "/privacy", "/trial"],
    // Listed in sitemap.xml. /trial carries a page-level noindex (it is the
    // same content as /services under different chrome — see LandingV3Chrome
    // in LandingPageV3Page.tsx), so listing it would send Google contradictory
    // signals.
    indexable: ["/", "/services", "/about", "/contacts", "/privacy"],
    // Server-side 301s, emitted into _redirects. Every path retired by the
    // /trial consolidation gets one, so a bookmark, an old ad, or a URL a
    // crawler already indexed lands on its closest surviving replacement
    // instead of 404ing.
    redirects: [
      ["/trial-hormozi", "/trial"],
      ["/free-trial", "/trial"],
      ["/landingpage", "/trial"],
      ["/trial-v2", "/trial"],
      ["/trial-v3", "/trial"],
      ["/trial-v4", "/trial"],
      ["/landingpage-v3", "/trial"],
      ["/landingpage-v2", "/services"],
    ],
  },
};

/** @param {DeployTarget} target */
export function targetConfig(target) {
  const config = TARGETS[target];
  if (!config) throw new Error(`Unknown deploy target: ${target}`);
  return config;
}

/**
 * Path used to prerender the catch-all route into dist/404.html.
 * Cloudflare Pages resolves extensionless URLs, so "/404" is the URL this
 * snapshot is reachable at — which keeps its self-referencing canonical
 * honest instead of pointing at a path that does not exist.
 */
export const NOT_FOUND_PRERENDER_PATH = "/404";
