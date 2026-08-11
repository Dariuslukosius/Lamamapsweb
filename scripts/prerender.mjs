// Crawls the built SPA with a headless browser and writes the fully
// rendered HTML for each known route into dist/<route>/index.html, so AI
// crawlers and bots that don't execute JavaScript see real page content
// instead of an empty <div id="root">. The original SPA bundle is kept
// untouched — this only adds extra static HTML snapshots next to it.
import { chromium } from "playwright-core";
import { preview } from "vite";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// /trial and /free-trial are noindex ad landing pages, but they are still
// prerendered: link-preview scrapers and ad quality reviewers do not run JS,
// and the snapshot also removes the blank-screen flash on first paint.
// /trial-hormozi is the A/B variant of /trial. It is prerendered on the same
// terms so first-paint timing stays comparable between the two — an LCP gap
// caused by one side lacking a snapshot would contaminate the test.
const ROUTES = ["/", "/about", "/services", "/contacts", "/privacy", "/trial", "/free-trial", "/trial-hormozi"];

// Vercel's build container has no local Chromium install and is missing the
// shared libraries a vanilla `playwright install chromium` binary needs to
// launch. @sparticuz/chromium ships a build made for exactly this kind of
// serverless/build environment, so we swap to it there and keep using the
// locally-installed browser (via `playwright install`) everywhere else.
async function launchBrowser() {
  if (process.env.VERCEL) {
    const sparticuzChromium = (await import("@sparticuz/chromium")).default;
    return chromium.launch({
      args: sparticuzChromium.args,
      executablePath: await sparticuzChromium.executablePath(),
      headless: true,
    });
  }
  return chromium.launch();
}

async function main() {
  const server = await preview({ preview: { port: 4173, strictPort: true } });
  const base = `http://localhost:4173`;

  const browser = await launchBrowser();
  const page = await browser.newPage();

  for (const route of ROUTES) {
    // "load" instead of "networkidle": pages embed YouTube iframes that keep
    // making background requests indefinitely, which would never let
    // networkidle resolve. A short extra wait lets React finish rendering.
    await page.goto(`${base}${route}`, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(1500);
    const html = await page.content();

    const outDir = route === "/" ? "dist" : path.join("dist", route.replace(/^\//, ""));
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, "index.html"), html, "utf-8");
    console.log(`Prerendered ${route} -> ${path.join(outDir, "index.html")}`);
  }

  await browser.close();
  await server.httpServer.close();
}

main().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
