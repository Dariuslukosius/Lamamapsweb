# „New Design" tampa vien .com svetaine — /trial konsolidacija

Vykdomasis promptas šiam etapui. Ankstesnis etapas (REDESIGN-V3-PROMPT.md) pritaikė
v3 temą visai svetainei ir padarė `/services` = landingpage-v3 turinys su svetainės
navigacija. Šis etapas pašalina visus atskirus reklamos landingus iš šio projekto
kopijos ir palieka **tik pagrindinę svetainę** + **vieną** `/trial` landing puslapį.

## 0. Sprendimas (patvirtintas pokalbyje)

- Pašalinti iš šio folderio: `/free-trial`, `/landingpage`, `/trial` (senas),
  `/trial-v2`, `/trial-v3`, `/trial-v4`, `/landingpage-v2`, `/landingpage-v3`
  kaip atskirus maršrutus/puslapius/build target'us.
- **Palikti** landingpage-v3 turinį — bet dabar jis pasiekiamas per `/trial`
  (ne `/landingpage-v3`). Turinys identiškas tam, kas anksčiau buvo prie
  `/landingpage-v3` (own navbar/footer/floating CTA, ne svetainės chrome).
- `/services` (svetainės chrome + tas pats v3 turinys) — **nepaliesta**, lieka.
- Šis projekto folderis nuo šiol yra **vienas deployment**: `main` →
  llamamaps.com. Jokių atskirų `.eu`/`.co.uk`/review build'ų iš šios kopijos.
  (Originalus projektas kitame folderyje šito neliečia.)

## 1. Galutinis maršrutų žemėlapis

| Kelias | Puslapis | SEO |
|---|---|---|
| `/` | Index | indexable |
| `/about` | AboutPage | indexable |
| `/services` | ServicesPage (v3 turinys, svetainės chrome) | indexable |
| `/contacts` | ContactsPage | indexable |
| `/privacy` | PrivacyPage | indexable |
| `/trial` | LandingPageV3Page (v3 turinys, landing chrome) | **noindex**, canonical → `/services` |
| `*` | NotFound (404) | noindex |

`/trial` lieka noindex dėl to paties principo, kaip anksčiau `/landingpage`
turėjo canonical → `/trial`: du identiški body turiniai (skiriasi tik chrome)
negali abu būti indeksuojami — dubliavimosi rizika. `/services` yra „tikroji"
versija svetainės navigacijoje, `/trial` — izoliuotas reklamos taikinys.

**301 nukreipimai** senoms nuorodoms (SEO/GEO higiena — niekas neturi gauti 404):
`/free-trial`, `/landingpage`, `/trial-v2`, `/trial-v3`, `/trial-v4` → `/trial`;
`/landingpage-v2` → `/services`; `/landingpage-v3` → `/trial`;
`/trial-hormozi` → `/trial` (jau buvo toks redirect anksčiau, atnaujintas tikslas).

## 2. Pašalinta (patikrinta programiškai, kad niekas kitas nenaudoja)

- Puslapiai: `TrialPage.tsx`, `TrialHormoziPage.tsx`, `TrialV2Page.tsx`,
  `TrialV3Page.tsx`, `TrialV4Page.tsx`, `LandingPageV2Page.tsx`, `FreeTrialPage.tsx`.
- Komponentų folderiai: `components/trial`, `trial-hormozi`, `trial-v2`, `trial-v3`,
  `trial-v4`, `landingpage-v2` (kiekvienas turėjo savo atskirą komponentų kopiją,
  nesidalino su landingpage-v3).
- Asset'ai, kurie tapo be jokio importerio: `assets/results-home/`, `assets/services/`
  (senos ServicesPage liekanos), `assets/trial-v3/`, `assets/trial-v4/`
  (po vieną rank-climb-demo.webm kopiją), 5 pavieniai `assets/brands/*.webp` +
  `brands-v2/gera-dovana.svg` (Home dabar naudoja bendrą `brandLogos.ts`, kuris
  renkasi `brands-v2/` variantus).
- **Nepaliesta sąmoningai** (jau prieš šią sesiją buvęs, nesusijęs mirštantis
  kodas): `CaseStudiesPage.tsx` (niekada nebuvo maršrute), `SolutionsSection.tsx`
  (taip pat), ir jų asset'ai. Nešalinu jų, nes tai ne šios užduoties apimtis.

## 3. Ką dar reikia padaryti (vykdoma dabar)

1. `App.tsx` — vienas be-šakų `Routes` blokas (jokio `DEPLOY_TARGET` ladder),
   `/trial` → `LandingPageV3Page`, `ISOLATED_LANDING_PATHS` sutrumpinamas iki
   `/trial` + `/services`.
2. `LandingPageV3Page.tsx` — SEO blokas: `canonicalPath="/trial"`, title/desc
   atnaujinti (nebe „V2" duplikato aprašas), `noindex` paliktas, canonical
   nurodo `/services`.
3. `src/lib/siteConfig.ts` — `DeployTarget` tipas susiaurinamas iki `"main"`;
   pašalinamos nebenaudojamos funkcijos (`trialPath`, `landingPagePath`,
   `isLandingOnlyTarget`, `landingPageCanonical` — jei daugiau niekas
   nekvies) arba supaprastinamos.
4. `scripts/deployTargets.mjs` — `DEPLOYMENTS` lieka tik `com`; `TARGETS` lieka
   tik `main`, su atnaujintu `routes`/`indexable`/`redirects` pagal §1.
5. `scripts/prerender.mjs`, `scripts/site-files.mjs`, `scripts/verify-deploy.mjs`,
   `vite.config.ts` — pašalinti nuorodas į išnykusius target'us (ROUTE_PROMOTIONS,
   Fraunces preload conditionals ir pan.), jei jos tapo mirusiu kodu.
6. `src/test/routes.test.ts` — patikrinti, kad sutampa su nauju maršrutų sąrašu.
7. `package.json` — build skriptai, kurie rėmėsi pašalintais target'ais
   (`build:eu`, `build:couk`, `build:hostinger`), NELIEČIAMI paliekami tik jeigu
   jie tikrai priklauso nuo `deployTargets.mjs` DEPLOYMENTS, kurie dabar
   pašalinti — reikia arba pašalinti tuos scripts, arba juos aiškiai pažymėti
   kaip nebeveikiančius šioje kopijoje.

## 4. Kartu vykdoma optimizacija (užklausta anksčiau šiame pokalbyje)

- `src/assets/results-v2/` (34 failai, 3.4 MB, 1600×1486px) yra 2× per didelio
  dydžio tam, ką `.l3-baf-frame` realiai piešia (max-width 460px, aspect-ratio
  800/743 — tikslus dydis yra 800px pločio, ne 1600px). Šie scan'ai dabar
  rodomi ir `/services`, ir `/trial`, ir Home (`LandingV3CaseHighlights`) —
  taigi svarbiausi puslapiai. Pritaikyti tą patį `scripts/optimize-images.mjs`
  metodą, kuris jau naudojamas `results/` (maxWidth 800, quality 72,
  ceilingKb 90) — nauja grupė `results-v2`.
- Patikrinti, ar dar yra kitų per didelių/nebenaudojamų asset'ų po šio
  pašalinimo etapo.

## 5. Patikros prieš baigiant (SEO/GA4/GEO/AEO privalo išlikti)

1. `tsc --noEmit -p tsconfig.app.json` — 0 klaidų.
2. `eslint src` — be naujų klaidų.
3. `node scripts/build.mjs com` — build + prerender visiems 6 maršrutams
   (`/`, `/about`, `/services`, `/contacts`, `/privacy`, `/trial`) + 404.
4. `node scripts/verify-deploy.mjs` (arba jo lokalus pages-server variantas) —
   patikrina canonical, robots meta, GA4 (`gtag`), Meta Pixel (`fbq`), JSON-LD,
   `ai.json`/`llms.txt`/`agents.json`/`.well-known/*` (GEO/AEO failai),
   `robots.txt`/`sitemap.xml`.
5. Vizualiai patikrinti `/trial` (turi atrodyti identiškai buvusiam
   `/landingpage-v3`) ir kad senos nuorodos (`/free-trial` ir pan.) tikrai
   301 nukreipia, o ne 404.
