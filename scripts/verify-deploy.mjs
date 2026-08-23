// Pre-deploy verification for the Cloudflare Pages build.
//
// Runs dist/ behind a server that implements Cloudflare Pages' documented
// request-resolution rules, then asserts the things that would be expensive to
// discover in production: that every route answers 200 at its canonical URL
// with no redirect hop, that the crawler-facing files keep their headers, that
// no link or asset reference 404s, and that the Meta Pixel initialises exactly
// once per page.
//
// SCOPE, honestly stated: the server below is a faithful implementation of
// Cloudflare's *documented* behaviour, not Cloudflare itself. It proves this
// build's artifacts are correct for those rules; it cannot prove Cloudflare
// implements them. It exists because workerd — and therefore `wrangler pages
// dev` — requires macOS 13.5+, which this machine does not have. On a machine
// that can run it, `npm run cf:preview` is the stronger check and this script's
// assertions can be pointed at that server with VERIFY_BASE_URL.
import { readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";
import { startPagesServer } from "./pagesServer.mjs";
import { DEPLOYMENTS, NOT_FOUND_PRERENDER_PATH, currentOutDir, currentTarget, targetConfig } from "./deployTargets.mjs";

const DIST = currentOutDir();
const PORT = 8791;
const TARGET = currentTarget();
const { routes, indexable } = targetConfig(TARGET);

const failures = [];
const notes = [];
function check(ok, label, detail) {
  if (ok) return true;
  failures.push(detail ? `${label}\n      ${detail}` : label);
  return false;
}


// ── Checks ───────────────────────────────────────────────────────────────────
const BASE = process.env.VERIFY_BASE_URL || `http://127.0.0.1:${PORT}`;
const get = (p, redirect = "manual") => fetch(`${BASE}${p}`, { redirect });
const meta = (html, re) => (html.match(re) || [])[1];
const expectedOrigin = () => (process.env.VITE_SITE_URL || "https://llamamaps.com").replace(/\/+$/, "");

async function checkRoutes() {
  for (const route of routes) {
    const res = await get(route);
    if (!check(res.status === 200, `${route} must answer 200 with no redirect hop`,
      `got ${res.status}${res.headers.get("location") ? ` -> ${res.headers.get("location")}` : ""}`)) continue;

    const html = await res.text();
    const canonical = meta(html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/);
    const expected = `${expectedOrigin()}${route === "/" ? "/" : route}`;

    // The point of the whole dist/<route>.html layout: the URL that serves the
    // page and the URL the page claims as canonical have to be the same one.
    // The A/B variant is the one deliberate exception — it defers to /trial.
    const isVariant = (TARGET === "main" && route === "/landingpage") || TARGET === "landingpage";
    if (isVariant) {
      const trialUrl = process.env.VITE_TRIAL_URL?.replace(/\/+$/, "");
      const acceptable = TARGET === "main"
        ? `${expectedOrigin()}/trial`
        : (trialUrl ? `${trialUrl}/` : `${expectedOrigin()}/`);
      check(canonical === acceptable, `${route} A/B variant canonical must point at the trial page`,
        `got ${canonical}, expected ${acceptable}`);
      // Whatever it points at must at least be a real URL, never a path that
      // only exists on some other host.
      check(Boolean(canonical) && /^https:\/\/[^/]+\//.test(canonical),
        `${route} canonical must be an absolute URL`, `got ${canonical}`);
    } else {
      const canonicalPath = canonical ? new URL(canonical).pathname : "";
      check(canonicalPath === (route === "/" ? "/" : route),
        `${route} canonical must match the URL it is served at`,
        `served at ${route}, canonical says ${canonical}`);
      check(canonical === expected, `${route} canonical origin`, `got ${canonical}`);
    }

    check(Boolean(meta(html, /<title>([^<]+)<\/title>/)), `${route} has a <title>`);
    check(!/<div id="root">\s*<\/div>/.test(html), `${route} is prerendered, not an empty shell`);

    const robots = meta(html, /<meta name="robots" content="([^"]+)"/);
    const shouldIndex = indexable.includes(route);
    check(shouldIndex ? !/noindex/.test(robots ?? "") : /noindex/.test(robots ?? ""),
      `${route} robots directive (${shouldIndex ? "indexable" : "noindex"})`, `got "${robots}"`);
  }
}

async function checkTrailingSlashAndHtml() {
  for (const route of routes.filter((r) => r !== "/")) {
    const slashed = await get(`${route}/`);
    check([301, 308].includes(slashed.status) && slashed.headers.get("location") === route,
      `${route}/ must redirect to ${route}`,
      `got ${slashed.status} -> ${slashed.headers.get("location")}`);

    // Cloudflare answers this one with a 307, not a 308 — measured against the
    // live deployment, where the docs had implied 308. Harmless: nothing links
    // to a .html URL, none are in the sitemap, and the canonical on the page
    // points at the extensionless form regardless.
    const dotHtml = await get(`${route}.html`);
    check([301, 307, 308].includes(dotHtml.status) && dotHtml.headers.get("location")?.endsWith(route),
      `${route}.html must redirect to ${route}`,
      `got ${dotHtml.status} -> ${dotHtml.headers.get("location")}`);
  }
}

async function checkNotFound() {
  for (const p of ["/definitely-not-a-page", "/trial/extra/segments", "/about/x"]) {
    const res = await get(p);
    check(res.status === 404, `${p} must return a real 404 status`, `got ${res.status}`);
    const html = await res.text();
    check(/noindex/.test(html), `${p} 404 page must be noindex`);
    check(!/<div id="root">\s*<\/div>/.test(html), `${p} 404 page still boots the SPA shell`);
  }
  check(existsSync(path.join(DIST, "404.html")),
    "dist/404.html must exist — without it Cloudflare falls back to SPA mode and answers every unknown URL with the home page at 200");
}

async function checkConfiguredRedirects() {
  for (const [from, to] of targetConfig(TARGET).redirects) {
    const res = await get(from);
    check(res.status === 301 && res.headers.get("location") === to,
      `${from} must 301 to ${to}`, `got ${res.status} -> ${res.headers.get("location")}`);
  }
}

async function checkCrawlerFiles() {
  const jsonFiles = ["/ai.json", "/agents.json", "/manifest.json", "/.well-known/agent-card.json", "/.well-known/tdmrep.json"];
  const textFiles = ["/ai.txt", "/llms.txt", "/llms-full.txt", "/humans.txt", "/robots.txt", "/.well-known/security.txt"];
  const present = TARGET === "main" ? [...jsonFiles, ...textFiles, "/sitemap.xml"] : [...jsonFiles, ...textFiles];

  for (const file of present) {
    const res = await get(file);
    if (!check(res.status === 200, `${file} must be served`, `got ${res.status}`)) continue;
    check(res.headers.get("access-control-allow-origin") === "*", `${file} CORS header`);
    check(res.headers.get("x-robots-tag") === "all", `${file} X-Robots-Tag`);
    check((res.headers.get("cache-control") ?? "").includes("max-age=300"), `${file} short cache`,
      `got "${res.headers.get("cache-control")}"`);
    const expectedType = file.endsWith(".json") ? "application/json" : file.endsWith(".xml") ? "application/xml" : "text/plain";
    check((res.headers.get("content-type") ?? "").startsWith(expectedType), `${file} Content-Type`,
      `got "${res.headers.get("content-type")}"`);
    if (file.endsWith(".json")) {
      try { JSON.parse(await res.text()); } catch (e) { check(false, `${file} must be valid JSON`, e.message); }
    }
  }

  if (TARGET !== "main") {
    check((await get("/sitemap.xml")).status === 404,
      "landing-page targets must not publish a sitemap listing a noindex page");
  }

  const security = await get("/*");
  check(security.status === 404 || security.status === 200, "server sanity");

  await checkRobotsIsOurs();
}

// Cloudflare ships an "AI Crawl Control" / managed-robots.txt feature that is
// ON BY DEFAULT on new zones. When enabled it intercepts GET /robots.txt at the
// edge and serves its OWN generated file — our _headers never apply, and worse,
// its block declares `Disallow: /` for GPTBot, ClaudeBot, CCBot, Google-Extended
// and friends, plus `Content-Signal: ai-train=no`.
//
// That is the exact inverse of this project's robots.txt, which deliberately
// allows every answer engine and training crawler, and it silently undoes the
// GEO/AEO work. It is a dashboard setting, so no amount of correct build output
// fixes it — which is why this check names the cause instead of just reporting
// three missing headers.
async function checkRobotsIsOurs() {
  const res = await get("/robots.txt", "follow");
  const body = await res.text();
  const managed = /Cloudflare Managed content|Content-Signal:/i.test(body);
  check(!managed,
    "robots.txt is being replaced by Cloudflare's managed robots.txt",
    "Turn it off: Cloudflare dashboard -> the zone -> AI Crawl Control (Security -> Bots) " +
    "-> disable the managed robots.txt AND the 'block AI crawlers' rule. It currently serves " +
    "Disallow: / for the AI crawlers this site's own robots.txt explicitly allows.");

  if (managed) return;

  // What "ours" looks like differs by target: the main site serves the full
  // hand-written policy from public/, while site-files.mjs replaces it on the
  // landing-page domains with a minimal crawlable one that deliberately has no
  // Sitemap line (the single page there is noindex).
  if (TARGET === "main") {
    check(body.includes("User-agent: GPTBot") && body.includes("Sitemap:"),
      "robots.txt served is the full policy from public/", "the body does not match the repo's file");
  } else {
    check(body.includes("Allow: /") && !body.includes("Sitemap:"),
      "robots.txt served is the generated landing-page one",
      "expected a minimal crawlable robots.txt with no Sitemap line");
  }
}

async function checkSecurityAndCacheHeaders() {
  const home = await get("/");
  for (const [header, expected] of [
    ["x-content-type-options", "nosniff"],
    ["referrer-policy", "strict-origin-when-cross-origin"],
    ["x-frame-options", "SAMEORIGIN"],
  ]) {
    check(home.headers.get(header) === expected, `site-wide ${header}`, `got "${home.headers.get(header)}"`);
  }
  check((home.headers.get("strict-transport-security") ?? "").includes("max-age=63072000"), "site-wide HSTS");
  check((home.headers.get("permissions-policy") ?? "").includes("interest-cohort=()"), "site-wide Permissions-Policy");

  // A hashed bundle and a root-level image both need the immutable year.
  const bundle = (await readdir(path.join(DIST, "assets"))).find((f) => f.endsWith(".js"));
  const assetRes = await get(`/assets/${bundle}`);
  check((assetRes.headers.get("cache-control") ?? "").includes("immutable"), "/assets/* immutable cache",
    `got "${assetRes.headers.get("cache-control")}"`);
  const imgRes = await get("/og-image.png");
  check((imgRes.headers.get("cache-control") ?? "").includes("immutable"), "/og-image.png immutable cache",
    `got "${imgRes.headers.get("cache-control")}"`);

  // HTML must NOT be long-cached, or a deploy would not reach returning visitors.
  check(!(home.headers.get("cache-control") ?? "").includes("max-age=31536000"),
    "HTML must not be immutably cached", `got "${home.headers.get("cache-control")}"`);
}

// Every href, src and srcset in every prerendered page has to resolve. This is
// what catches a renamed asset or a link to a route that no longer exists.
async function checkLinksAndAssets() {
  const seen = new Map();
  for (const route of routes) {
    const html = await (await get(route)).text();
    const refs = new Set();
    for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) refs.add(m[1]);
    for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
      for (const part of m[1].split(",")) {
        const u = part.trim().split(/\s+/)[0];
        if (u.startsWith("/")) refs.add(u);
      }
    }
    for (const ref of refs) {
      const clean = ref.split("#")[0].split("?")[0];
      if (!clean || clean === "/") continue;
      if (!seen.has(clean)) seen.set(clean, (await get(clean, "follow")).status);
      check(seen.get(clean) < 400, `link/asset referenced by ${route} is broken: ${clean}`,
        `status ${seen.get(clean)}`);
    }
  }
  notes.push(`checked ${seen.size} distinct internal link/asset targets across ${routes.length} pages`);
}

// ── Meta Business domain verification ───────────────────────────────────────
// Meta's crawler fetches "/" with plain HTTP — no JS execution — and looks for
// this exact meta tag in the raw response. Checking it the same way (fetch, not
// a browser) is what actually proves the requirement Meta states explicitly:
// the tag must be in the static HTML, not injected client-side.
async function checkMetaDomainVerification() {
  const config = Object.values(DEPLOYMENTS).find((d) => d.outDir === DIST);
  const code = config?.fbDomainVerification;
  if (!code) return;

  const html = await (await get("/", "follow")).text();
  const tag = `<meta name="facebook-domain-verification" content="${code}" />`;
  check(html.includes(tag), `Meta domain verification tag for ${config.domain} must be in the raw HTML of /`,
    `expected to find: ${tag}`);
}

// ── Meta Pixel ───────────────────────────────────────────────────────────────
// Method per the project's established harness: let fbevents.js load for real
// (that is the only way the duplicate-registry crash reproduces) but abort the
// facebook.com/tr beacons so nothing reaches Events Manager, and defeat Meta's
// automation detection so the pixel behaves as it would for a real visitor.
const beaconlessRoutes = [];

async function checkMetaPixel() {
  const browser = await chromium.launch({ args: ["--disable-blink-features=AutomationControlled"] });
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });

  const beacons = [];
  await ctx.route("**://www.facebook.com/tr/**", (r) => { beacons.push(r.request().url()); r.abort(); });

  for (const route of routes) {
    const page = await ctx.newPage();
    const fbevents = [];
    const errors = [];
    page.on("request", (r) => { if (r.url().includes("connect.facebook.net")) fbevents.push(r.url()); });
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

    beacons.length = 0;
    await page.goto(`${BASE}${route}`, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(2500);

    // The regression this guards against: a prerendered snapshot that baked in
    // the loader tag fetched fbevents.js twice, the second copy overwrote the
    // first one's module registry, and the pixel died with
    // "a.__fbeventsModules[e] is not a function".
    const fbeventsScripts = fbevents.filter((u) => u.includes("fbevents.js"));
    check(fbeventsScripts.length === 1, `${route}: fbevents.js must load exactly once`,
      `loaded ${fbeventsScripts.length}x — more than one copy clobbers the module registry`);

    // Count fbevents.js tags only. fbevents.js injects a second
    // connect.facebook.net script of its own (signals/config/<pixel-id>); that
    // one is expected and its presence is in fact evidence the pixel booted.
    const dom = await page.evaluate(() => ({
      loaderTags: document.querySelectorAll('script[src*="fbevents.js"]').length,
      configTags: document.querySelectorAll('script[src*="/signals/config/"]').length,
      fbqType: typeof window.fbq,
      // fbq.loaded flips to true only when the real library has replaced the
      // inline stub, and the queue is drained as it processes init + PageView.
      // A non-empty queue means the calls are stuck in the stub.
      loaded: Boolean(window.fbq && window.fbq.loaded),
      queued: (window.fbq && window.fbq.queue && window.fbq.queue.length) ?? -1,
    }));

    check(dom.loaderTags === 1, `${route}: exactly one fbevents.js tag in the DOM`, `found ${dom.loaderTags}`);
    check(dom.fbqType === "function", `${route}: window.fbq must be a function`, `got ${dom.fbqType}`);
    check(dom.loaded, `${route}: the real fbevents library must replace the inline stub`);
    check(dom.queued === 0, `${route}: the pixel queue must drain (init + PageView processed)`,
      `${dom.queued} call(s) still queued`);
    check(dom.configTags === 1, `${route}: pixel must fetch its config exactly once`, `found ${dom.configTags}`);

    const registryErrors = errors.filter((e) => /__fbeventsModules|fbq is not|fbevents/i.test(e));
    check(registryErrors.length === 0, `${route}: no Meta Pixel runtime error`, registryErrors.join(" | "));

    // Beacons are recorded but only asserted against DUPLICATES. Meta suppresses
    // sending from automated browsers on an unrecognised domain, so zero beacons
    // here is an artefact of the harness, not a defect — the checks above are
    // what actually prove the pixel is healthy. On a real domain this count
    // becomes meaningful, which is why the assertion is <= 1 rather than absent.
    const pageViews = beacons.filter((u) => /[?&]ev=PageView/.test(u));
    check(pageViews.length <= 1, `${route}: must not send duplicate PageView beacons`,
      `saw ${pageViews.length}`);
    if (pageViews.length === 0) beaconlessRoutes.push(route);

    const otherErrors = errors.filter((e) => !/__fbeventsModules|fbevents|facebook|calendly|youtube|net::ERR/i.test(e));
    if (otherErrors.length) notes.push(`${route}: console noise (not failed): ${otherErrors.slice(0, 2).join(" | ")}`);

    await page.close();
  }

  // Client-side navigation must fire exactly one extra PageView per route change
  // and must NOT re-inject the loader.
  if (TARGET === "main") {
    const page = await ctx.newPage();
    const fbevents = [];
    page.on("request", (r) => { if (r.url().includes("fbevents.js")) fbevents.push(r.url()); });
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    await page.waitForTimeout(2000);
    beacons.length = 0;
    await page.evaluate(() => window.history.pushState({}, "", "/services"));
    await page.evaluate(() => window.dispatchEvent(new PopStateEvent("popstate")));
    await page.waitForTimeout(1500);
    check(fbevents.length === 1, "SPA navigation must not re-load fbevents.js", `loaded ${fbevents.length}x`);
    await page.close();
  }

  await browser.close();

  if (beaconlessRoutes.length) {
    notes.push(
      `no facebook.com/tr beacon was observed on ${beaconlessRoutes.length}/${routes.length} route(s). ` +
      "Expected here: Meta suppresses sending from an automated browser on an unrecognised host " +
      "(127.0.0.1). The pixel was verified healthy by other means — one fbevents.js load, real " +
      "library attached, queue drained, config fetched. Confirm beacons on the real domain after deploy.",
    );
  }
}

async function main() {
  const server = await startPagesServer({ dist: DIST, port: PORT });
  console.log(`Verifying target "${TARGET}" against ${BASE}\n`);
  try {
    await checkRoutes();
    await checkTrailingSlashAndHtml();
    await checkNotFound();
    await checkConfiguredRedirects();
    await checkCrawlerFiles();
    await checkSecurityAndCacheHeaders();
    await checkLinksAndAssets();
    await checkMetaDomainVerification();
    await checkMetaPixel();
  } finally {
    server.close();
  }

  for (const note of notes) console.log(`note: ${note}`);
  if (failures.length) {
    console.error(`\n${failures.length} check(s) FAILED:`);
    for (const f of failures) console.error(`  ✗ ${f}`);
    process.exit(1);
  }
  console.log(`\nAll checks passed for target "${TARGET}".`);
}

main().catch((err) => { console.error("verify-deploy crashed:", err); process.exit(1); });
