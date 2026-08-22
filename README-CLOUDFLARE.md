# Deploying to Cloudflare Pages

This project builds one static site three different ways. Phase 1 is the whole
site on one domain, exactly as it ran on Vercel. Phase 2 gives `/trial` and
`/landingpage` their own domains without forking the codebase.

---

## 1. Phase 1 — the whole site on one domain

Create a Pages project connected to this repo, then set:

| Setting | Value |
| --- | --- |
| Build command | `npm run build:prerender` |
| Build output directory | `dist` |
| Node version | `22` (already pinned by `.node-version`) |

No environment variables are required — every deployment variable defaults to
the current live values.

`/trial` and `/landingpage` stay reachable at exactly those paths. **The
migration changes no URL and no page.** The prerendered HTML was diffed against
the Vercel build: title, canonical, robots, `og:url`, description and the full
JSON-LD graph are byte-identical on all eight pages, and `robots.txt`,
`sitemap.xml`, `ai.json`, `llms.txt`, `agents.json` and every `.well-known/`
file are unchanged.

### Disconnect Vercel

The old `vercel.json` is kept for rollback, but leave both platforms connected
and they will diverge: the build now emits `dist/about.html` where Vercel
expected `dist/about/index.html`. Point DNS at Cloudflare, confirm the site,
then disconnect the Vercel git integration.

---

## 2. How routing works, and why there is no SPA catch-all

This is the part that is easy to "fix" into a broken state, so it is worth
understanding before editing `_redirects`.

Cloudflare Pages evaluates `_redirects` **before** it looks for a matching file.
Cloudflare's own wording: *"Redirects are always followed, regardless of whether
or not an asset matches the incoming request."* The line almost every SPA guide
tells you to add —

```
/*    /index.html    200
```

— would therefore shadow every prerendered page. `/services`, `/trial` and
`/landingpage` would all return the **home page's** HTML to any crawler that
does not run JavaScript: same title, same canonical, same JSON-LD on every URL.
In a browser the site would look perfect, because React would then render the
right page. That is what makes it dangerous. **Do not add it.**

Instead:

- Each route is prerendered to `dist/<route>.html`, which Pages serves at
  `/<route>` with a plain 200.
- Unmatched URLs fall through to `dist/404.html`, which Pages serves **with a
  real 404 status** and which still boots the SPA. (Vercel answered unknown URLs
  with the home page and a 200 — a soft 404. This is an improvement.)
- `dist/404.html` must exist. Without a top-level `404.html`, Pages assumes SPA
  mode and answers every unknown URL with the home page at 200.

### Why `about.html` and not `about/index.html`

Pages' default `auto-trailing-slash` mode treats a directory as a directory:
given `about/index.html` it serves the page at `/about/` and **308-redirects
`/about` to `/about/`**.

Every canonical this app emits is unslashed — `SEO.tsx` strips the trailing
slash. The directory layout would therefore have put the entire site one
permanent redirect away from its own declared canonical, and added a redirect
hop in front of every ad click landing on `/trial`.

Writing `dist/about.html` makes `/about` a direct 200. `scripts/site-files.mjs`
then adds `/about/ → /about` 301s so the slashed shape, which ad URLs are known
to arrive in, still resolves — and now consolidates instead of serving a
duplicate 200 the way Vercel did.

### Adding a route later

Add it to `src/App.tsx` **and** to `scripts/deployTargets.mjs`. There is no
catch-all, so a route missing from the second file is a hard 404 in production.
`src/test/routes.test.ts` fails the build if the two disagree — that guard is
the reason it is safe not to have a catch-all.

---

## 3. Phase 2 — `/trial` and `/landingpage` on their own domains

Each landing page becomes its **own Pages project** built from this same repo
and the same branch. The difference is entirely in environment variables.

Separate projects rather than one project with three custom domains, because
canonical URLs are baked in at build time. One build serving three hosts would
publish the same canonical on all of them, and two of the three would be wrong.

### Trial domain

| Setting | Value |
| --- | --- |
| Build command | `npm run build:prerender` |
| Output directory | `dist` |
| `VITE_DEPLOY_TARGET` | `trial` |
| `VITE_SITE_URL` | `https://<trial-domain>` |

### Landing-page domain

| Setting | Value |
| --- | --- |
| Build command | `npm run build:prerender` |
| Output directory | `dist` |
| `VITE_DEPLOY_TARGET` | `landingpage` |
| `VITE_SITE_URL` | `https://<landing-domain>` |
| `VITE_TRIAL_URL` | `https://<trial-domain>` |

`VITE_SITE_URL` must be a bare `https` origin with no trailing slash. The build
fails immediately on a malformed value rather than shipping broken canonicals.

### What each target build does differently

| | `main` | `trial` / `landingpage` |
| --- | --- | --- |
| Routes | all 8 | the landing page, promoted to `/` |
| Old sub-path | — | `/trial` (or `/landingpage`) 301s to `/` |
| JS bundle | 760 kB | ~545 kB — the rest of the site is tree-shaken out |
| `sitemap.xml` | published | removed (the page is noindex) |
| `robots.txt` | full policy | minimal, crawlable, no sitemap line |
| `manifest.json` | with shortcuts | shortcuts stripped (they pointed at pages that do not exist there) |
| Footer privacy link | `/privacy` | `https://llamamaps.com/privacy` |
| Global Calendly badge | on the main site | never rendered |

### Things that deliberately stay on `llamamaps.com`

- **schema.org entity `@id`s.** The Organization, WebSite and logo nodes are
  pinned to the brand origin via `BRAND_URL`. If the trial domain published
  `@id: https://<trial-domain>/#organization`, answer engines would see two
  unrelated organizations for one business and split the reputation signals.
- **Cross-page links inside structured data** (`/services`, `/contacts`) — those
  pages only exist on the main site.
- **`ai.json`, `llms.txt`, `agents.json`, `.well-known/*`.** They describe the
  brand and the content it publishes, all of which lives on the main domain.

### After the split — the ad-platform checklist

1. Update the destination URL in Meta Ads to the new domain's `/`.
2. Add the new domain in **Meta Events Manager → Domains** and verify it. The
   pixel ID is unchanged, but Meta scopes domain verification and Aggregated
   Event Measurement per domain — skipping this is the usual cause of "the pixel
   worked yesterday" after a domain move.
3. Confirm one `PageView` beacon on the live domain (see §5).
4. Keep the old `llamamaps.com/trial` URL alive, or add a redirect to the new
   domain, for as long as any ad, QR code or bookmark still points at it.

---

## 4. Commands

`npm run` is broken in this checkout because the folder path contains a `:` —
call the binaries directly instead.

```bash
./node_modules/.bin/vite build          # build
node scripts/prerender.mjs              # snapshot every route + 404.html
node scripts/site-files.mjs             # write _redirects, verify crawler files
node scripts/verify-deploy.mjs          # full pre-deploy verification
node scripts/cf-preview.mjs             # browse the build at localhost:8788
./node_modules/.bin/vitest run          # tests (incl. the route-parity guard)
./node_modules/.bin/tsc -p tsconfig.app.json --noEmit
```

`scripts/cf-preview.mjs` serves `dist/` through the same Pages-rules
implementation the verifier uses, so trailing-slash redirects, the 404 status
and the `_headers` rules all behave as they will in production — unlike
`vite preview`, which knows nothing about any of them. On macOS 13.5+, use
`wrangler pages dev dist` instead; it is the real runtime.

Build a landing-page target locally:

```bash
VITE_DEPLOY_TARGET=trial VITE_SITE_URL=https://example.com \
  ./node_modules/.bin/vite build && node scripts/prerender.mjs && node scripts/site-files.mjs
```

Deploy by direct upload instead of git integration:

```bash
./node_modules/.bin/wrangler pages deploy dist --project-name=<name>
```

---

## 5. Verification

`node scripts/verify-deploy.mjs` serves `dist/` behind an implementation of
Cloudflare's documented request-resolution rules and asserts:

- every route answers 200 at its canonical URL with **no redirect hop**
- canonical, `og:url` and robots match what the route is supposed to declare
- `/<route>/` and `/<route>.html` both redirect to the canonical form
- unknown URLs return a real 404, noindex, that still boots the SPA
- every `href`, `src` and `srcset` on every page resolves (92 targets on `main`)
- the crawler files keep their CORS, `X-Robots-Tag`, `Content-Type` and cache headers
- security headers site-wide; immutable cache on assets; HTML *not* long-cached
- the Meta Pixel: exactly one `fbevents.js` load and one loader tag per page, the
  real library attached, the call queue drained, config fetched once, no
  `__fbeventsModules` error, and no duplicate `PageView`

**Scope, stated honestly:** that server is a faithful implementation of
Cloudflare's *documented* behaviour, not Cloudflare itself. It proves this
build's artifacts are correct for those rules; it cannot prove Cloudflare
implements them. `wrangler pages dev dist` is the stronger check but requires
macOS 13.5+ (workerd), which the machine this was built on does not have. On a
newer machine, run it and point the same assertions at it with
`VERIFY_BASE_URL=http://localhost:8788`.

### Meta Pixel note

The harness records `facebook.com/tr` beacons but **aborts** them, so nothing
reaches Events Manager. It sees zero beacons locally because Meta suppresses
sending from an automated browser on an unrecognised host — expected, not a
defect. The pixel's health is proven by the other checks. Confirm real beacons
on the live domain with the Meta Pixel Helper extension after the first deploy.

### Turn off Cloudflare's AI crawler blocking

**Cloudflare enables "AI Crawl Control" by default on new zones, and it breaks
this site's GEO/AEO setup.** Measured on the first live deployment:

- `GET /robots.txt` was intercepted at the edge and answered with Cloudflare's
  own generated file — prepended above ours, declaring `Content-Signal:
  ai-train=no` and `Disallow: /` for GPTBot, ClaudeBot, CCBot, Amazonbot,
  Bytespider, Google-Extended, Applebot-Extended and meta-externalagent. Our
  `_headers` never applied to it either.
- Worse, the crawlers were **403ed at the HTTP level**, not merely asked not to
  crawl: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User,
  Claude-SearchBot, PerplexityBot, Perplexity-User, DuckAssistBot,
  MistralAI-User, YouBot, CCBot, Amazonbot, Bytespider, meta-externalagent.
  Googlebot, Bingbot, Applebot, LinkedInBot and Twitterbot were unaffected.

`OAI-SearchBot`, `ChatGPT-User`, `Claude-User` and `PerplexityBot` are *answer
engine* fetchers, not training crawlers — blocking them removes the site from
ChatGPT, Claude and Perplexity answers entirely, which is the opposite of what
`ai.json`, `llms.txt`, `agents.json` and `.well-known/agent-card.json` exist for.

Fix in the dashboard: **the zone → Security → Bots → AI Crawl Control** —
disable the managed `robots.txt` and the block rule. Nothing in this repo can
override it. `scripts/verify-deploy.mjs` detects the managed file and says so.

### After every deploy, check by hand

```bash
curl -sI https://<domain>/trial | head -1        # expect: HTTP/2 200, not 301
curl -sI https://<domain>/trial/ | head -1       # expect: HTTP/2 301 -> /trial
curl -s  https://<domain>/nope -o /dev/null -w '%{http_code}\n'   # expect: 404
curl -sI https://<domain>/ai.json | grep -i 'content-type\|x-robots'
```

---

## 6. Prerendering in the Cloudflare build container

`scripts/prerender.mjs` drives a headless Chromium. Cloudflare's build image has
no usable local Chromium, so when `CF_PAGES` is set the script switches to
`@sparticuz/chromium`, the same bundled build that already worked on Vercel.
Force it anywhere else with `PRERENDER_BUNDLED_CHROMIUM=1`.

If the Pages build ever fails to launch a browser, the fallback is to build and
prerender in CI (or locally, where a real Chromium is installed) and ship the
finished directory with `wrangler pages deploy dist`. The output is identical;
only the machine that produced it differs.

The script retries each page up to three times. Navigation waits for `load`, and
these pages pull in Google Fonts, Calendly and YouTube from the open internet —
one slow third party was enough to fail a whole build during development.

It also refuses to write a snapshot that is missing its `#root` content, title
or canonical, or that contains a baked-in `fbevents.js` tag. A prerender that
"succeeds" while producing empty shells is the one failure mode that would
otherwise deploy green and silently show crawlers a blank page.
