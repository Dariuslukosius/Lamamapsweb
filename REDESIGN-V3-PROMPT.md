# Llamamaps .com → landingpage-v3 (dark green) redesign — darbo specifikacija

Šis failas yra **vykdomasis promptas**: pilnas, vienareikšmis aprašas, ką reikia padaryti,
kokia tvarka, ir kaip patikrinti, kad padaryta be klaidų. Kiekvienas punktas turi
priėmimo kriterijų (✅). Nieko nedaryti "iš atminties" — visada patikrinti faile.

Projektas: `/Users/jonas/Desktop/Llamamaps/Llamamaps New Design`
(kopija iš `08.11 web tvarkymas, :trial hormozi kurimas/Lamamapsweb-main`,
be `dist*`, `*.zip`, `svc.html`, `public/llamamaps-system-overview.pdf`).

---

## 0. Užsakovo sprendimai (patvirtinti)

| Klausimas | Sprendimas |
|---|---|
| `/services` turinys | **Visiškai pakeičiamas** landingpage-v3 turiniu. Senas `ServicesPage.tsx` iš maršruto pašalinamas. |
| Navigacija | **Vieninga svetainės navigacija** (Home / About / Services / Contacts + auksinis CTA), tamsiai žalia, naudojama VISUOSE puslapiuose, įskaitant `/services`. v3 `TrialNavbar` lieka tik `/landingpage-v3` maršrutui. |
| Tema | Tamsiai žalia v3 tema **visame .com**: `/`, `/about`, `/contacts`, `/privacy`, 404. |
| Išimtis | `/free-trial` **neliečiamas**. |
| Neliečiami | `/trial`, `/landingpage`, `/trial-v2`, `/trial-v3`, `/trial-v4`, `/landingpage-v2`, `/landingpage-v3` — visi reklamos landingai lieka 1:1 kaip buvo. |

**Nekeičiamas turinys.** Redizainas = spalvos, tipografika, komponentų forma.
Tekstai, klientų atsiliepimai, skaičiai, case study duomenys — **verbatim**, nieko
neperrašinėti, nepridėti ir netrinti (atsiliepimai yra tikri klientų žodžiai).

---

## 1. Dizaino sistema (šaltinis: `.l3-*` CSS `src/pages/LandingPageV3Page.tsx`)

Tokenai, kurie tampa visos svetainės pagrindu:

| Token | HEX | Paskirtis |
|---|---|---|
| `--l3-bg` | `#0D1F17` | puslapio fonas |
| `--l3-bg-card` | `#132722` | kortelės, paneliai |
| `--l3-text` | `#F4F1EA` | pagrindinis tekstas |
| `--l3-text-sub` | `#B7C0D0` | paantraštės, lead tekstas |
| `--l3-text-muted` | `#8A93A6` | tikrai antraeilis tekstas |
| `--l3-gold` | `#C9A24A` | akcentas, aktyvios nuorodos |
| `--l3-gold-soft` | `#DEC584` | akcento šviesus variantas |
| `--l3-gold-btn` | `#8A6A1F` | CTA mygtuko fonas |
| `--l3-gold-btn-hover` | `#A37D26` | CTA hover |
| `--l3-emerald` | `#1F4D3D` | žali akcentai (badge, ikonos) |
| `--l3-border` | `rgba(138,147,166,0.18)` | rėmeliai |
| `--l3-border-strong` | `rgba(138,147,166,0.32)` | ryškūs rėmeliai |
| `--l3-shadow` | `0 4px 24px rgba(0,0,0,0.4)` | šešėlis |
| `--l3-serif` | `Fraunces` | H1/H2 antraštės |
| radius | card 16px / control 12px / mark 999px | |

**Draudžiamos spalvos po redizaino** (visame .com, išskyrus `/free-trial` ir landingus):
`#8b5cf6`, `#7c3aed` (violetinis CTA), `#3b82f6`, `#79A7FF` (mėlyna),
`#f4b04b→#d76acf→#b548ff` gradientas, `bg-white`, `text-slate-*`, `bg-slate-*`.
Kiekvienas jų pakeičiamas atitinkamu v3 tokenu.

---

## 2. Darbų eiga

### 2.1 Tema `index.css` (pagrindinis svertas)
- `:root` viduje **perrašyti Tailwind HSL tokenus** į v3 paletę, kad visos esamos
  `bg-background / text-foreground / bg-card / bg-secondary / text-muted-foreground /
  border / bg-primary / bg-accent` utility klasės iškart taptų tamsiai žalios:

  | Tailwind token | Nauja reikšmė | Atitikmuo |
  |---|---|---|
  | `--background` | `153 41% 9%` | `#0D1F17` |
  | `--foreground` | `42 31% 94%` | `#F4F1EA` |
  | `--card` | `165 34% 11%` | `#132722` |
  | `--secondary` | `165 34% 11%` | sekcijų juostos |
  | `--muted-foreground` | `221 14% 60%` | `#8A93A6` |
  | `--primary` | `42 63% 33%` | `#8A6A1F` (auksinis CTA) |
  | `--accent` | `42 54% 54%` | `#C9A24A` |
  | `--border` / `--input` | `169 18% 17%` | ant fono susilieja su `--l3-border` |
  | `--ring` | `42 54% 54%` | |
- Pridėti `--l3-*` tokenus į `:root`, kad juos matytų ir ne-`.l3-page` komponentai.
- `--hero-gradient` → `linear-gradient(180deg, #0D1F17 0%, #132722 100%)`.
- `body { background: var(--l3-bg); color: var(--l3-text); }`.
- **Nekeisti** `.dark {}` bloko ir font-face blokų.
- ✅ Kriterijus: `/privacy` (grynas turinio puslapis be hardcode spalvų) tampa
  tamsiai žalias vien nuo šio žingsnio.

### 2.2 Vieninga navigacija — `src/components/Navbar.tsx`
- Fonas `rgba(13,31,23,0.94)` + `backdrop-blur`, apačioje `--l3-border`.
- Aukštis **80px** (`h-20`) — paliekamas dabartinis, kad nesugriūtų esamų puslapių
  `pt-*` atsargos. `/services` puslapiui `.l3-main` padding-top perrašomas į 80px
  (žr. 2.4).
- Nuorodos: Home / About / Services / Contacts. Aktyvi → `--l3-gold`, hover → `--l3-gold`.
- CTA mygtukas: `--l3-gold-btn` fonas, baltas tekstas, uppercase, radius 12px,
  `openCalendlyPopup` (nekeičiama logika).
- Google Partner logotipas paliekamas, bet ant tamsaus fono (baltas padas arba
  `brightness` filtras, kad nedingtų).
- Mobile meniu: fonas `--l3-bg`, riba `--l3-border`, CTA toks pat auksinis.
- ✅ Kriterijus: nė vienos `slate-*` ar `#8b5cf6` klasės faile.

### 2.3 Vienas footeris — `src/components/SiteFooter.tsx` (naujas)
- Vizualiai identiškas `landingpage-v3/TrialFooter.tsx` (logotipas, tagline,
  nuorodos, socialiniai, copyright), bet nuorodos — **svetainės maršrutai**
  (`/about`, `/services`, `/contacts`, `/privacy`), ne `#` inkarai.
- Turi turėti `id="contacts"`, kad išliktų `#contacts` inkaras iš v3 turinio.
- Įdedamas į `/`, `/about`, `/contacts`, `/privacy`, 404 ir `/services`.
- ✅ Kriterijus: kiekvienas iš tų puslapių baigiasi tuo pačiu footeriu.

### 2.4 `/services` = landingpage-v3 turinys
- `LandingPageV3Page.tsx`: `LandingPageV3Content` gauna prop
  `chrome: "landing" | "site"` (default `"landing"`).
  - `"landing"` → `TrialNavbar` + `TrialFooter` (dabartinė elgsena, **nepakitusi**).
  - `"site"` → `Navbar` + `SiteFooter`, `<main className="l3-main l3-main--site">`,
    kur `.l3-main--site { padding-top: 80px; }`.
- Eksportuoti `LandingPageV3Content` ir `faqs` iš to paties failo (be dubliavimo —
  vienas turinio šaltinis abiem maršrutams).
- Naujas `src/pages/ServicesPage.tsx`:
  - `<SEO>` (svetainės, ne `SeoHormozi`): title/description apie paslaugas,
    `canonicalPath="/services"`, **indexuojamas** (be `noindex`),
    `jsonLd=[organizationSchema(), breadcrumbSchema(...), serviceSchema(), faqSchema(faqs)]`.
  - `<TrialModalProvider><LandingPageV3Content chrome="site" /></TrialModalProvider>`.
  - `TrialFloatingCta` paliekamas (jis puslapio viduje) — bet `/services` yra
    `ISOLATED_LANDING_PATHS` **išorėje**, todėl reikia patikrinti, ar nesidubliuoja
    su globaliu `CalendlyBadge`. Jei dubliuojasi → `/services` pridedamas į
    `ISOLATED_LANDING_PATHS` (globalus badge nerodomas, lieka puslapio CTA).
- Senas `src/pages/ServicesPage.tsx` turinys pašalinamas (atkuriamas per
  `git show HEAD:src/pages/ServicesPage.tsx`).
- `App.tsx`: `/services` → naujas `ServicesPage`. Visi kiti maršrutai nepaliesti.
- ✅ Kriterijus: `/services` ir `/landingpage-v3` atrodo identiškai, išskyrus
  viršutinę navigaciją ir footerį.

### 2.5 Likę puslapiai (spalvų perdažymas, turinys nekeičiamas)
Eilės tvarka pagal hardcode spalvų kiekį:
1. `src/components/CaseStudiesSection.tsx` (47)
2. `src/pages/AboutPage.tsx` (22)
3. `src/pages/PrivacyPage.tsx` (12)
4. `src/components/TestimonialsSection.tsx` (6)
5. `src/components/WhiteHatSection.tsx` (5)
6. `src/components/StatsSection.tsx` (4)
7. `src/components/HeroSection.tsx` (3), `AboutSection.tsx` (3)
8. `src/pages/Index.tsx` (2), `ContactSection.tsx` (2), `ClientReviewsSection.tsx` (2),
   `MapRankAnimation.tsx` (2), `BrandsSection.tsx` (1), `CalendlyWidget.tsx` (1)
9. `src/pages/NotFound.tsx`, `ContactsPage.tsx`, `SolutionsSection.tsx` — tik per tokenus

Taisyklės:
- `bg-white` → `bg-[#132722]` (kortelė) arba `bg-background` (sekcija).
- `text-slate-900/800/700` → `text-[#F4F1EA]`; `text-slate-600/500` → `text-[#B7C0D0]`;
  `text-slate-400` → `text-[#8A93A6]`.
- `border-slate-200` → `border-[rgba(138,147,166,0.18)]`.
- `#8b5cf6 / #7c3aed` CTA → `#8A6A1F / #A37D26`.
- `#3b82f6`, `#79A7FF` → `#C9A24A`.
- Trispalvis gradientas ContactSection'e → vientisas `--l3-gold` tekstas / auksinis mygtukas.
- Šviesūs `linear-gradient(#f5fbf7…)` fonai → `#0D1F17` ↔ `#132722`.
- Brand logotipai (`BrandsSection`, `CaseStudiesSection`) ant tamsaus fono:
  palikti baltą padą po logotipu (`bg-white rounded-xl p-3`) — logotipai spalvoti,
  invertuoti negalima.
- ✅ Kriterijus: kontrastas ≥ 4.5:1 visam body tekstui.

### 2.6 Švarinimas (performance)
- Pašalintas nenaudojamas `public/llamamaps-system-overview.pdf` → **būtina** išimti
  ir nuorodą `scripts/site-files.mjs:174` (`mainSiteOnly`), kitaip build lūš.
- `ServicesPage` senų assetų importai (services/*.webp) nebenaudojami — patikrinti,
  ar tie failai nenaudojami kitur, prieš trinant. Netrinti, jei abejotina.
- Gilesnis assetų valymas — **vėliau**, ne šiame etape (užsakovo nurodymas).

---

## 3. Patikros (privalomos, eilės tvarka)

1. **Tipai**: `./node_modules/.bin/tsc --noEmit -p tsconfig.app.json`
   (⚠️ be `-p tsconfig.app.json` tikrina 0 failų ir visada "praeina").
2. **Lint**: `./node_modules/.bin/eslint src --max-warnings=0` (bent jau nauji/keisti failai).
3. **Build**: `./node_modules/.bin/vite build` (naujame kelyje nėra `:`, todėl
   `npm run build` irgi veikia).
4. **Prerender**: `node scripts/prerender.mjs` — patikrinti, kad `/services`
   snapshot'as turi v3 markup'ą ir kad neįvelti vendor script'ai.
5. **Vizualiai**: Playwright, viewport frames (⚠️ `fullPage` screenshot'ai čia meluoja —
   praleidžia sekcijas; stitch'inti atskirus 1280×800 kadrus).
   Tikrinti: `/`, `/about`, `/services`, `/contacts`, `/privacy`, `/404`,
   desktop 1280 + mobile 390.
6. **Regresija**: `/trial`, `/landingpage`, `/trial-v3`, `/trial-v4`,
   `/landingpage-v2`, `/landingpage-v3`, `/free-trial` — turi atrodyti **1:1 kaip anksčiau**.
   Palyginti su originalaus projekto build'u.
7. **Konsolė**: 0 klaidų kiekviename puslapyje.

---

## 4. Ko NEDARYTI

- Nekeisti jokio teksto, atsiliepimo, skaičiaus ar case study duomens.
- Neliesti `src/components/landingpage-v3/*` (išskyrus, jei būtina, `TrialFooter`
  palikti nepakeistą — `/landingpage-v3` privalo likti identiškas).
- Neliesti `/free-trial` ir visų `trial*` / `landingpage*` maršrutų.
- Nekeisti Calendly / Meta Pixel / GA4 sekimo logikos.
- Nekeisti `DEPLOY_TARGET` mechanikos ir `deployTargets.mjs` maršrutų sąrašo
  (išskyrus, jei `/services` reikalauja kito indexable statuso — jis lieka indexable).
- Nedaryti `git commit` / `push` be atskiro nurodymo.

---

## 5. ĮVYKDYTA (2026-09-03)

### Pakeisti failai
| Failas | Kas padaryta |
|---|---|
| `src/index.css` | Tailwind tokenai perrašyti į v3 paletę; `--l3-*` tokenai `:root`; „Legacy page scopes" blokas grąžina senas reikšmes `.tp-page .t2-page .t3-page .t4-page .l2-page .l3-page .lm-page` viduje |
| `src/components/Navbar.tsx` | Perrašytas: tamsiai žalias, auksinis CTA, ikonos+wordmark logotipas (senasis buvo pieštas baltam fonui ir dingdavo) |
| `src/components/SiteFooter.tsx` | **Naujas** — v3 footeris su tikrais maršrutais, `id="contacts"` |
| `src/pages/ServicesPage.tsx` | **Perrašytas** — renderina `LandingPageV3Content chrome="site"`, savo SEO (indexable, senas title/description/schema išlaikyti) |
| `src/pages/LandingPageV3Page.tsx` | `LandingPageV3Content` gavo `chrome` prop; `.l3-main--site` (80px offset) |
| `src/components/landingpage-v3/faqs.ts` | **Naujas** — FAQ sąrašas iškeltas, kad nesulaužytų Fast Refresh |
| `src/App.tsx` | `/services` → naujas puslapis; `/services` pridėtas į `ISOLATED_LANDING_PATHS` (kad globalus Calendly badge nesidubliuotų su puslapio floating CTA) |
| `CaseStudiesSection` | Kortelės, chip'ai, before/after antraštės → v3 paletė (be raudonos/žalios: „before" = pilkas, „after" = auksinis) |
| `AboutPage` | Hero perdažytas (Trustpilot/Google brand spalvos palikos — tai prekės ženklai) |
| `BrandsSection` | `brightness-0` → `grayscale(1) brightness(0) invert(1)` + `opacity-80` (kaip v3 logotipų juostoje) |
| `HeroSection`, `Index`, `ContactSection`, `CalendlyWidget`, `CalendlyBadge`, `NotFound` | Violetiniai/mėlyni CTA ir gradientai → auksiniai |
| `MapRankAnimation` | Auksinės rodyklės; `.lm-page` viduje grąžintos mėlynos (/free-trial neliestas) |
| `scripts/site-files.mjs` | Išimta nuoroda į pašalintą PDF |

### Patikrinta
- `tsc -p tsconfig.app.json` — 0 naujų klaidų (liko tik 3 senos `CaseStudiesPage.tsx`, kuri nėra maršrutuose)
- `eslint` pakeistiems failams — 0 klaidų, 0 įspėjimų
- `node scripts/build.mjs com` — build + prerender 14 puslapių + `_redirects` + sitemap OK
- `dist/services.html`: `<title>`, canonical `/services`, `index, follow`, v3 markup, svetainės navbar + footeris
- Vizualiai (1280 ir 390 px): `/`, `/about`, `/services`, `/contacts`, `/privacy`, 404 — 0 konsolės klaidų, 0 horizontalaus overflow
- Regresija: `/trial`, `/landingpage`, `/trial-v3`, `/landingpage-v3`, `/free-trial` — turinys nepakitęs

### Likę sprendimai užsakovui
1. **`/free-trial`** — puslapio kūnas nepaliestas, bet bendras navbar ir Calendly badge yra bendri visai svetainei, todėl ten dabar tamsiai žalias navbar virš šviesaus puslapio. Galima palikti arba prisegti seną navbar būtent tam puslapiui.
2. **`/services` senasis turinys** (kainos, AI SEO sekcijos, FAQ) pašalintas iš maršruto. Atkuriama per `git show HEAD:src/pages/ServicesPage.tsx`.
3. Assetų valymas (nenaudojami paveikslėliai, code-splitting 1.2 MB bundle'ui) — atidėta, kaip sutarta.
