# CHANGES — `/trial-hormozi` vs `/trial`

Control = `/trial`. Every change below is scoped to `/trial-hormozi`.

**Value Equation** — each change notes which variable it moves:

```
Value = (Dream Outcome × Perceived Likelihood of Achievement)
        ─────────────────────────────────────────────────────
              (Time Delay × Effort & Sacrifice)
```

`DREAM↑` · `BELIEF↑` · `TIME↓` · `EFFORT↓`

---

## 1. Hero rebuilt

| # | Change | Variable |
|---|---|---|
| 1.1 | New H1: *"The Calls You're Missing Are Going to the Shop Down the Road"*. The old H1 sold a ranking; this one sells the lost money a ranking represents. | `DREAM↑` |
| 1.2 | New subheadline leading with the mechanism and the three things the reader does **not** have to do (no account access, no website changes, no contract). | `EFFORT↓` `BELIEF↑` |
| 1.3 | Rank widget moved **below** the CTA, badges and social proof. It previously occupied the first screen and pushed the headline down — a visual cannot answer "why should I care?", only a sentence can. Animation and logic untouched; position only. | `DREAM↑` |
| 1.4 | Three trust badges directly under the CTA. | `EFFORT↓` |
| 1.5 | Social-proof line moved up, next to the CTA. | `BELIEF↑` |
| 1.6 | Removed from the hero: 🏆 "Top 3 Google Maps in 90 days" pill, "Clinic & Local Business Owners:" eyebrow, `HeroRankClimb` panel, Google Partner strip (relocated — see 4.3). Four competing elements before the headline meant the headline was not the first thing read. | `DREAM↑` |
| 1.7 | Mobile: hero vertical rhythm and H1 size tightened; secondary CTA stacks under the primary at ≤480px. Desktop spacing untouched. | `EFFORT↓` |

Measured fold fit (H1 → social proof, under the fixed 72px navbar):

| Device | Social proof ends | Fold | Headroom |
|---|---|---|---|
| iPhone SE 375×667 | 509px | 667 | **+158px** |
| iPhone 13 390×844 | 486px | 844 | +358px |
| iPhone 15 393×852 | 486px | 852 | +366px |

The rank widget also clears the fold on all three (638px on SE).

## 2. Section order

Strongest proof moved directly under the hero and made statically visible; weakest moved down.

| # | Section | vs `/trial` |
|---|---|---|
| 1 | Hero | rebuilt |
| 2 | Case studies (before/after) | **moved up** from 7 |
| 3 | Video testimonials | **moved up** from 10 |
| 4 | Problem — "Why aren't you visible" | — |
| 5 | Statistics (93/76/50/28) | — |
| 6 | What we do (4 cards) | copy rewritten |
| 7 | **Guarantee** | **new** |
| 8 | Comparison | — |
| 9 | 4 Simple Steps | — |
| 10 | Plans | — |
| 11 | **Objections** | **new** |
| 12 | Text testimonials | **moved down** from 4 |
| 13 | FAQ | reordered, not rewritten |
| 14 | Final CTA + logos | — |

`BELIEF↑` `TIME↓` — roughly 60% of visitors never scroll, and nothing behind a carousel gets seen. The placeholder text testimonials are the weakest asset on the page and no longer occupy the second screen.

Also removed: the **duplicate logo strip**. `/trial` renders it twice; one instance carries the same information.

## 3. CTA unification

| | `/trial` | `/trial-hormozi` |
|---|---|---|
| Unique conversion CTA strings | **9** | **2** |

All primary buttons → `Start My Free 7-Day Trial`. All secondary → `Book a 15-Min Call` (ghost styling, visible everywhere, including the floating button). `EFFORT↓` — nine different labels for two actions forces the reader to re-decide what each button does.

Replaced: `Get Free Trial` (nav ×2), `Get Ranked Free` (×6), `Get Your Free Trial`, `Start Your Free 7-Day Trial`, `Get 7-Day Free Trial!`, `Start For Free!` (×2), `Schedule Time for Meeting` (×3), `Schedule Time With Us`, `Schedule time with us`.

## 4. Risk reversal

| # | Change | Variable |
|---|---|---|
| 4.1 | Guarantee lifted out of the pricing-card small print into its own bordered block: headline, promise, three bullets, CTA + badges. | `BELIEF↑` |
| 4.2 | **Honest caveat added inside the guarantee** — "nobody controls Google's algorithm, so we can't promise a specific position on a specific day". Previously the page promised "Guaranteed Top 3" while the FAQ quietly walked it back; a guarantee the FAQ contradicts is worse than none. | `BELIEF↑` |
| 4.3 | Google Partner badge relocated from above the H1 into the guarantee block — third-party proof does its job next to the claim it vouches for. Corners fully rounded (the bottom-only radius existed to hang off the navbar). | `BELIEF↑` |
| 4.4 | Guarantee wording unified page-wide to **"Top 3 in 90 days — or you don't pay"**: plan badges, plan feature list, comparison row (`~3 Months` → `90 Days`), onboarding step 4, and two FAQ answers. | `BELIEF↑` |

## 5. Objection block (new, before the final CTA)

Four cards answering *burned before* · *no time* · *is it safe* · *will it work for me*, each followed by the primary CTA and badges. `EFFORT↓` `BELIEF↑`

## 6. "What we do for you" rewrite

Four card bodies rewritten so the work reads as ours, not the reader's. Headings unchanged.

- ❌ "Businesses with a verified profile … usually scale faster."
- ✅ "If your profile is verified and you have reviews, we move faster. If something's missing, we tighten it up for you — no work on your side."

`EFFORT↓`

## 7. Trust badges

One `<TrustBadges />` component, **9 placements** — hero, problem, statistics, case studies, guarantee, 4 Steps, plans, objections, final CTA. Not under the four small in-card buttons, and one row under the plans grid rather than one per card. `EFFORT↓`

## 8. FAQ

Order only — no answer text changed except the two guarantee-wording fixes in 4.4. First four are now the fear questions: account access → speed → contract → "is this black hat". `BELIEF↑`

## 9. Visible rating aligned to schema

`4.8` → **`4.9`**, matching the `AggregateRating` in `lib/structuredData.ts` (4.9 / 45). The same 45-review set was being published as two different scores; a visible number that contradicts the schema is what makes Google drop a rich result.

⚠️ `/trial` still shows 4.8. See `TODO.md`.

## 10. SEO / GEO / AEO

| Item | Value |
|---|---|
| `robots` | `noindex, follow` (matches the repo's ad-landing-page convention) |
| `canonical` | `https://llamamaps.com/trial` — the original absorbs the authority |
| `og:url`, WebPage `@id` | also `/trial`, so the duplicate declares one identity consistently |
| `sitemap.xml` | not listed (verified in build output) |
| `<h1>` | exactly 1, no heading-level skips |
| `alt` | 33/33 images |
| JSON-LD | `WebPage` + `Organization/ProfessionalService` + `FAQPage` (13 Q&A) |
| GEO | `areaServed`, Utena and Kaunas mentions preserved — nothing added or removed |
| Meta description | rewritten to the unified guarantee wording |

## 11. Tracking isolation

**No existing event name, payload or firing condition was changed.** `Lead` and `Schedule` fire exactly as before.

Added alongside them, via `fbq("trackCustom", …)`, all carrying `page_variant: "trial-hormozi"`:

`trial_hormozi_view` · `trial_hormozi_cta_primary` · `trial_hormozi_cta_secondary` · `trial_hormozi_scroll_50` · `trial_hormozi_scroll_90`

The site has no GA4/GTM container today; the same events are also pushed to `window.dataLayer` when one exists, so they start flowing the moment GA4 is installed, with no code change.

## 12. Accessibility fix found during testing

The honest-caveat paragraph was introduced at `opacity: 0.85`, giving 4.38:1 against the card — below the 4.5:1 AA floor. Opacity removed; now 5.56:1. All new text elements verified 5.56–15.2:1.

---

## Files

**Created (14)**

```
src/pages/TrialHormoziPage.tsx
src/components/trial-hormozi/copy.ts            ← all swappable copy
src/components/trial-hormozi/TrustBadges.tsx
src/components/trial-hormozi/tracking.ts
src/components/trial-hormozi/SeoHormozi.tsx     ← SEO.tsx copy + canonicalPath
src/components/trial-hormozi/{TrialNavbar, TrialFooter, TrialModalContext,
  TrialFloatingCta, TrialInvisibilitySection, BeforeAfterSlider, RankCounter,
  HeroRankClimb, CountUpStat, RankCrossfadeBadge}.tsx
```

**Modified — 2 existing files, both explicitly approved**

- `src/App.tsx` — import, `<Route path="/trial-hormozi">`, and `ISOLATED_LANDING_PATHS` so the site-wide Calendly badge is suppressed on both landing pages (otherwise the variant would carry an extra CTA the control lacks).
- `scripts/prerender.mjs` — `/trial-hormozi` added to `ROUTES`, so first-paint timing stays comparable.

**Untouched:** `SEO.tsx`, `lib/structuredData.ts`, `lib/calendlyPopup.ts`, `lib/metaPixel.ts`, `components/ui/*`, `components/trial/*`, `sitemap.xml`, `robots.txt`, `index.html`, `tailwind.config.ts`, global styles, all other routes. Verified by checksum against a pre-work snapshot of all 199 files.

## Deliberately not done

- **Booking flow untouched** — 6 user actions to conversion, not ≤3. Changing the conversion mechanism at the same time as the copy would make the A/B result unreadable. See `TODO.md` and `TESTING.md` week 8.
- **Reduced navigation** not applied — proposed as week 7's test instead.
- **Jargon** (`GBP`, `map pack`, `citations`, `on-page`, `GMB`) still present at the same count as the control, entirely inside sections whose copy was to be left alone. See `TODO.md`.
