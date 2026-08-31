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

/** @typedef {"main" | "trial" | "landingpage" | "trial-v2" | "trial-v3" | "trial-v4" | "landingpage-v2" | "landingpage-v3"} DeployTarget */

// trial-v2, trial-v3, trial-v4, landingpage-v2 and landingpage-v3 are
// temporary review builds for the V2 redesigns, not permanent products of
// their own — see the DEPLOYMENTS entries below and the matching branches in
// src/App.tsx.
/** @type {DeployTarget[]} */
export const DEPLOY_TARGETS = [
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
 * Build output directory for the current build. Each deployment gets its own so
 * all three can exist side by side — otherwise building the .eu site would
 * overwrite the .com one, and `wrangler pages deploy dist` would be a coin flip
 * on which product is actually in there.
 */
export function currentOutDir() {
  return process.env.BUILD_OUT_DIR || "dist";
}

// ── Deployments ──────────────────────────────────────────────────────────────
// A deployment binds a domain to one of the three products and to its own
// output folder. `npm run build:all` produces all three; `node scripts/build.mjs
// <name>` produces one.
//
// The domain split, as decided: the original /trial is the control and goes to
// llamamaps.eu; the Hormozi A/B variant goes to llamamaps.co.uk. That ordering
// matters to the canonical — /landingpage declares /trial as the original, so
// the .co.uk build points VITE_TRIAL_URL at llamamaps.eu, where the page it
// defers to actually lives.
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
  eu: {
    domain: "llamamaps.eu",
    target: "trial",
    outDir: "dist-eu",
    siteUrl: "https://llamamaps.eu",
    // Hostinger shared hosting is Apache. _redirects and _headers are a
    // Cloudflare Pages format and do nothing there — worse, Apache would serve
    // them as plain text to anyone who asked. Apache builds get .htaccess
    // instead, and the Pages files are removed from the output.
    host: "apache",
    // Meta Business Manager domain verification code for this domain. See the
    // matching field on "couk" below for how it gets into the built page.
    fbDomainVerification: "cuofigg98zbstafg1y8nzl8gc0xw7w",
    description: "/trial (control) as the home page",
  },
  couk: {
    domain: "llamamaps.co.uk",
    target: "landingpage",
    outDir: "dist-couk",
    siteUrl: "https://llamamaps.co.uk",
    // The A/B original is on the .eu domain, so that is what this page's
    // canonical has to point at. Without it the canonical would resolve to
    // llamamaps.co.uk/trial — a URL that does not exist on this deployment.
    trialUrl: "https://llamamaps.eu",
    host: "apache",
    // Meta Business Manager domain verification. Each domain gets its own code
    // from Meta — Settings -> Brand Safety -> Domains -> Add. Meta requires the
    // <meta name="facebook-domain-verification"> tag to be present in the raw
    // HTML the server returns, not injected by client-side JS, so this is
    // written into the built index.html by site-files.mjs rather than rendered
    // by a React component. Add llamamaps.eu's own code here once it exists.
    fbDomainVerification: "efy12ykxkminqedcmyryOkyxyfzi7v",
    description: "/landingpage (Hormozi variant) as the home page",
  },
  // Temporary review copies of the two V2 redesigns, each promoted to "/" the
  // same way eu/couk promote their V1 counterparts. Not bound to a real
  // domain yet — no fbDomainVerification, and host stays "cloudflare" so the
  // output gets a plain _redirects/_headers pair rather than an
  // Apache-specific .htaccess. Delete these two entries (and their outDir)
  // once the V2 pages either replace their V1s or get a real domain of their
  // own; there is nothing else in the build that depends on them existing.
  trialv2: {
    domain: "(unassigned — temporary review build)",
    target: "trial-v2",
    outDir: "dist-trial-v2",
    siteUrl: "https://llamamaps.com",
    host: "cloudflare",
    description: "/trial-v2 (V2 redesign) as the home page, for review only",
  },
  trialv3: {
    domain: "(unassigned — temporary review build)",
    target: "trial-v3",
    outDir: "dist-trial-v3",
    siteUrl: "https://llamamaps.com",
    host: "cloudflare",
    description: "/trial-v3 (V2 redesign + hero rank-climb video) as the home page, for review only",
  },
  trialv4: {
    domain: "(unassigned — temporary review build)",
    target: "trial-v4",
    outDir: "dist-trial-v4",
    siteUrl: "https://llamamaps.com",
    host: "cloudflare",
    description: "/trial-v4 (V2 redesign + dark green #0D1F17 theme) as the home page, for review only",
  },
  landingpagev2: {
    domain: "(unassigned — temporary review build)",
    target: "landingpage-v2",
    outDir: "dist-landingpage-v2",
    siteUrl: "https://llamamaps.com",
    host: "cloudflare",
    description: "/landingpage-v2 (V2 redesign) as the home page, for review only",
  },
  landingpagev3: {
    domain: "(unassigned — temporary review build)",
    target: "landingpage-v3",
    outDir: "dist-landingpage-v3",
    siteUrl: "https://llamamaps.com",
    host: "cloudflare",
    description: "/landingpage-v3 (V2 redesign + dark green #0D1F17 theme + hero rank-climb video) as the home page, for review only",
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
  // The live site. This list is deliberately identical to the one the project
  // ran on Vercel, so the migration itself changes no URL.
  main: {
    // Prerendered and served as static HTML.
    // /trial-v2 and /landingpage-v2 are the reworked versions of the two
    // landing pages, live alongside the originals for comparison. Like the
    // originals they are noindex, so they are prerendered but not listed as
    // indexable below.
    routes: [
      "/", "/about", "/services", "/contacts", "/privacy",
      "/trial", "/free-trial", "/landingpage",
      "/trial-v2", "/trial-v3", "/trial-v4", "/landingpage-v2", "/landingpage-v3",
    ],
    // Listed in sitemap.xml. /trial, /free-trial and /landingpage carry a
    // page-level noindex, so listing them would send Google contradictory
    // signals — the same reasoning the hand-written sitemap already used.
    indexable: ["/", "/services", "/about", "/contacts", "/privacy"],
    // Server-side 301s, emitted into _redirects.
    redirects: [
      // The A/B variant shipped as /trial-hormozi before it was renamed to
      // /landingpage. Anything already linking to the old path keeps working.
      ["/trial-hormozi", "/landingpage"],
    ],
  },
  // Phase 2: /trial gets its own domain and becomes that domain's home page.
  trial: {
    routes: ["/"],
    indexable: [],
    redirects: [["/trial", "/"]],
  },
  // Phase 2: /landingpage gets its own domain, on the same terms.
  landingpage: {
    routes: ["/"],
    indexable: [],
    redirects: [["/landingpage", "/"]],
  },
  // Temporary review builds — same shape as trial/landingpage above.
  "trial-v2": {
    routes: ["/"],
    indexable: [],
    redirects: [["/trial-v2", "/"]],
  },
  "trial-v3": {
    routes: ["/"],
    indexable: [],
    redirects: [["/trial-v3", "/"]],
  },
  "trial-v4": {
    routes: ["/"],
    indexable: [],
    redirects: [["/trial-v4", "/"]],
  },
  "landingpage-v2": {
    routes: ["/"],
    indexable: [],
    redirects: [["/landingpage-v2", "/"]],
  },
  "landingpage-v3": {
    routes: ["/"],
    indexable: [],
    redirects: [["/landingpage-v3", "/"]],
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
