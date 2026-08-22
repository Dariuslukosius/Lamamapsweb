// Crawls the built SPA with a headless browser and writes the fully
// rendered HTML for each known route into dist/<route>/index.html, so AI
// crawlers and bots that don't execute JavaScript see real page content
// instead of an empty <div id="root">. The original SPA bundle is kept
// untouched — this only adds extra static HTML snapshots next to it.
import { chromium } from "playwright-core";
import { preview } from "vite";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  NOT_FOUND_PRERENDER_PATH,
  currentTarget,
  targetConfig,
} from "./deployTargets.mjs";

// Which paths this deployment serves is decided by scripts/deployTargets.mjs.
// On the main target that is every route the site has ever had; on the
// landing-page targets it is a single page promoted to "/".
//
// /trial and /free-trial are noindex ad landing pages, but they are still
// prerendered: link-preview scrapers and ad quality reviewers do not run JS,
// and the snapshot also removes the blank-screen flash on first paint.
// /landingpage is the A/B variant of /trial. It is prerendered on the same
// terms so first-paint timing stays comparable between the two — an LCP gap
// caused by one side lacking a snapshot would contaminate the test.
const TARGET = currentTarget();
const ROUTES = targetConfig(TARGET).routes;

// Serverless and CI build containers have no local Chromium install and are
// missing the shared libraries a vanilla `playwright install chromium` binary
// needs to launch. @sparticuz/chromium ships a build made for exactly that kind
// of environment, so we swap to it there and keep using the locally-installed
// browser (via `playwright install`) everywhere else.
//
// CF_PAGES is set by Cloudflare Pages' build image, VERCEL by Vercel's. The
// explicit override exists for any other CI that needs the bundled browser.
const NEEDS_BUNDLED_CHROMIUM =
  Boolean(process.env.CF_PAGES) ||
  Boolean(process.env.VERCEL) ||
  process.env.PRERENDER_BUNDLED_CHROMIUM === "1";

async function launchBrowser() {
  if (NEEDS_BUNDLED_CHROMIUM) {
    const sparticuzChromium = (await import("@sparticuz/chromium")).default;
    return chromium.launch({
      args: sparticuzChromium.args,
      executablePath: await sparticuzChromium.executablePath(),
      headless: true,
    });
  }
  return chromium.launch();
}


// page.content() serialises the LIVE DOM, which by then contains the <script>
// tags third-party loaders injected into themselves. The Meta Pixel is the one
// that matters: its inline snippet in index.html injects fbevents.js at runtime,
// so baking those injected tags into the snapshot makes the browser fetch and
// execute fbevents.js several times on a real visit. The second copy overwrites
// the first one's module registry and the page throws
// "a.__fbeventsModules[e] is not a function" — with ad traffic pointed at these
// exact pages, a half-initialised pixel is the last thing we want.
//
// Strip them; the inline snippet re-injects a single clean copy at runtime.
function stripInjectedVendorScripts(html) {
  return html.replace(
    /<script[^>]*\ssrc="https:\/\/connect\.facebook\.net\/[^"]*"[^>]*>\s*<\/script>/g,
    "",
  );
}

// A prerender that "succeeds" while producing an empty shell is the worst
// outcome available: the deploy goes green and every crawler silently sees a
// blank page. These assertions turn that into a failed build.
function assertSnapshotIsSound(route, html) {
  const fail = (why) => {
    throw new Error(`Prerender check failed for ${route}: ${why}`);
  };

  if (/<div id="root">\s*<\/div>/.test(html)) fail("React rendered nothing into #root");
  if (!/<title>[^<]+<\/title>/.test(html)) fail("no <title> in the snapshot");
  if (!/<link[^>]+rel="canonical"/.test(html)) fail("no canonical link in the snapshot");

  // The pixel guarantee, asserted rather than assumed: exactly one inline
  // loader, and no baked-in <script src> copy for the loader to collide with.
  const injectedPixelTags = html.match(/<script[^>]*\ssrc="https:\/\/connect\.facebook\.net\//g);
  if (injectedPixelTags) fail(`${injectedPixelTags.length} injected fbevents.js tag(s) survived stripping`);
  const inlinePixelInits = html.match(/fbq\('init'/g) ?? [];
  if (inlinePixelInits.length !== 1) fail(`expected 1 fbq('init') call, found ${inlinePixelInits.length}`);
}

// Where a route's snapshot has to live so that Cloudflare serves it at exactly
// the URL the page declares as its canonical.
//
// This is NOT the layout the Vercel build used, and the difference is the whole
// reason the file exists. Cloudflare Pages' default "auto-trailing-slash" mode
// treats a directory as a directory: given dist/about/index.html it serves the
// page at "/about/" and answers "/about" with a 308 to the slashed form. Every
// canonical, og:url and JSON-LD @id this app emits is UNSLASHED — SEO.tsx
// strips the trailing slash — so that layout would have put the whole site one
// permanent redirect away from its own declared canonical, and would have added
// a redirect hop in front of every ad click landing on /trial.
//
// Writing dist/about.html instead makes Cloudflare serve it at "/about" with a
// straight 200, which is what Vercel did and what the canonicals claim.
// scripts/site-files.mjs adds "/about/" -> "/about" redirects so the slashed
// shape, which ad URLs are known to arrive in, still resolves.
function outputFileFor(route) {
  if (route === "/") return "dist/index.html";
  return path.join("dist", `${route.replace(/^\//, "")}.html`);
}

// "load" waits for every subresource, and these pages pull in Google Fonts, a
// Calendly widget and YouTube iframes from the open internet. A single slow
// third party is therefore enough to time out the navigation and fail the whole
// deploy — which is exactly what happened once while building this. Retrying is
// the right response: the failure is transient and not about our own output.
//
// ("networkidle" is not the fix. The YouTube embeds keep making background
// requests indefinitely, so networkidle would never resolve at all.)
const ATTEMPTS = 3;

async function snapshotWithRetry(page, url, route) {
  let lastError;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      await page.goto(url, { waitUntil: "load", timeout: 45000 });
      // A short extra wait lets React finish rendering after load fires.
      await page.waitForTimeout(1500);
      const html = stripInjectedVendorScripts(await page.content());
      assertSnapshotIsSound(route, html);
      return html;
    } catch (err) {
      lastError = err;
      if (attempt < ATTEMPTS) {
        console.warn(`  ${route}: attempt ${attempt}/${ATTEMPTS} failed (${err.message.split("\n")[0]}), retrying…`);
        await page.waitForTimeout(2000);
      }
    }
  }
  throw lastError;
}

async function main() {
  const server = await preview({ preview: { port: 4173, strictPort: true } });
  const base = `http://localhost:4173`;

  const browser = await launchBrowser();
  const page = await browser.newPage();

  // The catch-all route is snapshotted to dist/404.html. Cloudflare Pages
  // serves that file, with a real 404 status, for any URL that matches no
  // asset — which is what replaces Vercel's rewrite-everything-to-index.html
  // fallback. Vercel answered unknown URLs with the home page and a 200, a
  // soft 404; this is both correct and the SPA still boots from it.
  const jobs = [
    ...ROUTES.map((route) => ({ route, outFile: outputFileFor(route) })),
    { route: NOT_FOUND_PRERENDER_PATH, outFile: "dist/404.html" },
  ];

  for (const { route, outFile } of jobs) {
    const html = await snapshotWithRetry(page, `${base}${route}`, route);
    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, html, "utf-8");
    console.log(`Prerendered ${route} -> ${outFile}`);
  }

  await browser.close();
  await server.httpServer.close();
  console.log(`Prerender complete for target "${TARGET}" (${jobs.length} pages).`);
}

main().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
