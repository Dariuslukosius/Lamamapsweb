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
  currentOutDir,
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
const OUT_DIR = currentOutDir();

// Which of this target's routes render the trial landing page (or its A/B
// variant), and therefore must carry the before/after screenshots. The
// landing-page builds promote that page to "/", where the main build serves its
// homepage instead — so this cannot be one fixed list.
// Each maps to the CSS prefix that page's markup uses, because the assertion
// below greps the snapshot by class name. The V2 pages are deliberate copies
// scoped under their own prefixes so they cannot restyle the originals, which
// means a check hard-coded to "tp-" silently passes on them: it finds zero
// slider images, and zero images all have a src.
const TRIAL_ROUTES = new Map(
  TARGET === "main"
    ? [
        ["/trial", "tp"],
        ["/landingpage", "tp"],
        ["/trial-v2", "t2"],
        ["/landingpage-v2", "l2"],
      ]
    : [["/", "tp"]],
);

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

  // The proof screenshots are the page's whole argument, and they are now
  // viewport-gated, so "the scroll pass silently stopped working" is a real and
  // otherwise invisible failure mode. Assert the snapshot actually carries them.
  const trialPrefix = TRIAL_ROUTES.get(route);
  if (trialPrefix) {
    const sliderImages = html.match(new RegExp(`class="${trialPrefix}-baf-img"`, "g"))?.length ?? 0;
    const withSource =
      html.match(new RegExp(`<img[^>]+class="${trialPrefix}-baf-img"[^>]*\\ssrc="`, "g"))?.length ?? 0;
    if (sliderImages === 0) fail("no before/after slider images in the snapshot");
    if (withSource < sliderImages) {
      fail(`${sliderImages - withSource} of ${sliderImages} slider images have no src — ` +
        "revealLazyContent() did not trip their observers");
    }
  }
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
  if (route === "/") return path.join(OUT_DIR, "index.html");
  return path.join(OUT_DIR, `${route.replace(/^\//, "")}.html`);
}

// "load" waits for every subresource, and these pages still reach the open
// internet for the Calendly widget and the Meta Pixel. A single slow third
// party is therefore enough to time out the navigation and fail the whole
// deploy — which is exactly what happened once while building this. Retrying is
// the right response: the failure is transient and not about our own output.
//
// (Webfonts and the YouTube players used to be on that list too. Fonts are now
// served from our own origin, and the video embeds are click-to-load, so
// neither can stall a build any more.)
//
// ("networkidle" is not the fix. Calendly keeps polling in the background, so
// networkidle would never resolve at all.)
const ATTEMPTS = 3;

// The case-study screenshots only get a `src` once their card nears the
// viewport (see components/trial/useNearViewport.ts). At rest that means a
// snapshot taken at scroll position 0 would bake in seventeen empty frames —
// and these pages are prerendered precisely so that scrapers and ad reviewers,
// which do not run JavaScript, see the proof images.
//
// So walk the page top to bottom first. That trips every observer, React fills
// the `src` attributes in, and the snapshot is complete. Scrolling back to the
// top afterwards keeps the serialised DOM in its natural initial state.
// Every gated screenshot on the trial pages and their V2 counterparts. The V1
// pages render "tp-baf-img", the V2 pages "t2-" and "l2-", so this matches on
// the shared suffix rather than naming one prefix.
const LAZY_IMAGE_SELECTOR = 'img[class*="baf-img"]';

// How long to give the images after a walk, and how many walks to try.
//
// This was one 20s attempt. That is comfortable on a dev machine -- a warm run
// here reveals all thirty-four in under 30ms -- but it is the wrong budget for
// a cold CI container, which is fetching every one of those images for the
// first time on a single-process Chromium with a small cache. Overshooting
// costs a few seconds on a build that already takes minutes; undershooting
// fails the deploy.
const REVEAL_TIMEOUT_MS = 45000;
const REVEAL_PASSES = 3;

async function walkWholePage(page) {
  await page.evaluate(async () => {
    // The trial pages set `html { scroll-behavior: smooth }` for their anchor
    // nav. Left in place it animates every scrollTo below, so re-targeting on a
    // 100ms cadence just keeps restarting an easing curve and the walk never
    // reaches the bottom of a 29,000px page — it got four images in out of
    // thirty-four. Pin it to instant for the duration of the walk.
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    const step = Math.max(1, window.innerHeight);
    // scrollHeight is re-read each iteration on purpose: revealing images gives
    // previously-empty frames their real height, so the page grows underneath
    // the walk and a bound captured up front would stop short of the new bottom.
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      // A frame is not enough here, and getting that wrong is what the
      // assertion in assertSnapshotIsSound() first caught: an observer
      // notification is delivered in its own task, and React then needs a
      // further render pass to put the `src` on the element. Give each step
      // long enough for both to happen before scrolling away from it.
      await new Promise((r) => setTimeout(r, 100));
    }
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previousBehavior;
  });
}

async function countRevealed(page) {
  return page.evaluate((selector) => {
    const images = [...document.querySelectorAll(selector)];
    return { total: images.length, withSrc: images.filter((img) => img.getAttribute("src")).length };
  }, LAZY_IMAGE_SELECTOR);
}

// Walk the page so every gated image trips its observer, then wait on the
// actual outcome rather than on a duration. Pages with no gated images satisfy
// this immediately.
//
// A failed pass re-walks instead of giving up. An observer that fired while its
// image was still being fetched leaves the element without a src, and the cheap
// fix is to go past it again once the network has caught up — which is a
// likelier state on a build container than on a developer's machine.
async function revealLazyContent(page) {
  for (let pass = 1; pass <= REVEAL_PASSES; pass += 1) {
    await walkWholePage(page);
    try {
      await page.waitForFunction(
        (selector) =>
          [...document.querySelectorAll(selector)].every((img) => img.getAttribute("src")),
        LAZY_IMAGE_SELECTOR,
        { timeout: REVEAL_TIMEOUT_MS },
      );
      return;
    } catch (err) {
      const { total, withSrc } = await countRevealed(page);
      if (pass === REVEAL_PASSES) {
        // Say what was actually missing. The old message was a bare Playwright
        // timeout, which in a CI log gives no clue whether the walk stalled,
        // the images 404'd, or the page simply never grew.
        throw new Error(
          `lazy images never resolved: ${withSrc}/${total} have a src after ` +
            `${REVEAL_PASSES} scroll passes (${REVEAL_TIMEOUT_MS}ms each)`,
        );
      }
      console.warn(
        `  reveal pass ${pass}/${REVEAL_PASSES}: ${withSrc}/${total} images ready, walking again…`,
      );
    }
  }
}

async function snapshotWithRetry(page, url, route) {
  let lastError;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      await page.goto(url, { waitUntil: "load", timeout: 45000 });
      // A short extra wait lets React finish rendering after load fires.
      await page.waitForTimeout(1500);
      await revealLazyContent(page);
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
  // preview() defaults to serving "dist"; each deployment builds into its own
  // folder, so it has to be told which one this run produced.
  const server = await preview({
    build: { outDir: OUT_DIR },
    preview: { port: 4173, strictPort: true },
  });
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
    { route: NOT_FOUND_PRERENDER_PATH, outFile: path.join(OUT_DIR, "404.html") },
  ];

  for (const { route, outFile } of jobs) {
    const html = await snapshotWithRetry(page, `${base}${route}`, route);
    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, html, "utf-8");
    console.log(`Prerendered ${route} -> ${outFile}`);
  }

  await browser.close();
  await server.httpServer.close();
  console.log(`Prerender complete for target "${TARGET}" -> ${OUT_DIR}/ (${jobs.length} pages).`);
}

main().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
