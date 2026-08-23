// Browse the built site exactly as Cloudflare Pages would serve it.
//
// `wrangler pages dev dist` is the real thing and should be preferred wherever
// it runs — but it needs macOS 13.5+ (workerd), so on this machine this is the
// closest available stand-in. It applies dist/_redirects and dist/_headers and
// resolves paths with Pages' documented rules, which means the trailing-slash
// and 404 behaviour you see here is the behaviour the deployed site will have.
//
// Run `vite build && node scripts/prerender.mjs && node scripts/site-files.mjs`
// first — this serves the build output, not source.
import { existsSync } from "node:fs";
import { startPagesServer } from "./pagesServer.mjs";
import { currentOutDir, currentTarget, targetConfig } from "./deployTargets.mjs";

const DIST = currentOutDir();
const PORT = Number(process.env.PORT || 8788);

if (!existsSync(DIST)) {
  console.error(`No ${DIST}/ directory. Build first:\n  ./node_modules/.bin/vite build && node scripts/prerender.mjs && node scripts/site-files.mjs`);
  process.exit(1);
}
if (!existsSync(`${DIST}/404.html`)) {
  console.warn("warning: dist/404.html is missing — the prerender step has not run, so unknown URLs will not behave as they will in production.\n");
}

const target = currentTarget();
const { routes, redirects } = targetConfig(target);

const server = await startPagesServer({
  dist: DIST,
  port: PORT,
  onRequest: (line) => {
    // Only log page-level traffic; the asset firehose drowns it out.
    if (!/\.(js|css|png|jpe?g|webp|svg|ico|woff2?|map)$/.test(line)) console.log(`  ${line}`);
  },
});

const base = `http://localhost:${PORT}`;
console.log(`\n  Cloudflare Pages preview — target "${target}"`);
console.log(`  ${base}\n`);
console.log("  Pages:");
for (const route of routes) console.log(`    ${base}${route}`);
console.log("\n  Redirects to try:");
for (const route of routes.filter((r) => r !== "/")) console.log(`    ${base}${route}/   -> ${route}`);
for (const [from, to] of redirects) console.log(`    ${base}${from}   -> ${to}`);
console.log(`\n  404 (real 404 status, not a soft 404):\n    ${base}/does-not-exist`);
console.log("\n  Ctrl-C to stop.\n  Request log:");

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => { server.close(); process.exit(0); });
}
