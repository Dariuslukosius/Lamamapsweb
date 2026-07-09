// Crawls the built SPA with a headless browser and writes the fully
// rendered HTML for each known route into dist/<route>/index.html, so AI
// crawlers and bots that don't execute JavaScript see real page content
// instead of an empty <div id="root">. The original SPA bundle is kept
// untouched — this only adds extra static HTML snapshots next to it.
import { chromium } from "playwright-core";
import { preview } from "vite";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROUTES = ["/", "/about", "/services", "/contacts", "/privacy"];

async function main() {
  const server = await preview({ preview: { port: 4173, strictPort: true } });
  const base = `http://localhost:4173`;

  const browser = await chromium.launch();
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
