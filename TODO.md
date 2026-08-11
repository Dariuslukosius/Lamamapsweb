# TODO — separate tasks, deliberately out of scope here

Nothing below was done as part of building `/trial-hormozi`. Each is listed with why it was left.

---

## 1. Conversion flow: 6 user actions, not ≤3

The rule was a maximum of 3 actions before conversion. Counted in a real browser:

| # | Action |
|---|---|
| 1 | Click the page CTA |
| 2 | Pick a day (14 offered) |
| 3 | Pick a time (13 offered) |
| 4 | Confirm the slot |
| 5 | Fill name + email |
| 6 | Click "Schedule Event" |

Steps 2–6 are **Calendly's**, not ours. Options, roughly in order of effort:

- **a.** Tighten the Calendly event — fewer slots per day, no confirmation step. Cheapest, smallest gain.
- **b.** Prefill from URL parameters so step 5 is partly done.
- **c.** Replace booking with a 2-field form (email + business name) and arrange the time by email. Biggest reduction — 6 actions to 2.

**Not done deliberately.** This changes the conversion mechanism, not the copy. Shipping it alongside a copy rewrite would make the A/B result unreadable. Scheduled as `TESTING.md` week 8.

## 2. Message-match gap: "free trial" button → calendar

The primary CTA promises a trial; the click produces a scheduling widget. Worth a test, not a rushed fix. Detail in `TESTING.md`.

## 3. Rating mismatch on `/trial` and site-wide

| Where | Value |
|---|---|
| `lib/structuredData.ts` (`/about` only page emitting it) | **4.9** / 45 reviews |
| `/trial` visible text (×2) | **4.8** / 45 reviews |
| `/trial-hormozi` visible text | **4.9** / 45 ✅ aligned |

Two things to resolve, both outside this task:

1. **Confirm 4.9 / 45 against the real review source.** Both numbers are currently marked `TODO: update rating and review count with real data` in the code. One of them is wrong and nobody knows which.
2. **Then align `/trial`** so the whole site publishes one number. Touching `/trial` was forbidden here — it is the A/B control.

Also unverified: the second `AggregateRating` in `structuredData.ts` (Trustpilot, 4.5 / 22).

## 4. Five pre-existing TypeScript errors

`npx tsc --noEmit` fails on files unrelated to this work, and did so before it started:

| File | Error |
|---|---|
| `src/components/BrandsSection.tsx:46` | TS17001 duplicate JSX attribute |
| `src/components/TestimonialsSection.tsx:144` | TS17001 duplicate JSX attribute |
| `src/components/WhiteHatSection.tsx:21` | TS17001 duplicate JSX attribute |
| `src/pages/ServicesPage.tsx:988` | TS17001 duplicate JSX attribute |
| `src/pages/CaseStudiesPage.tsx:221,223,227` | TS2339 `logo` / `icon` missing on union member |

The build is unaffected — Vite uses SWC and does not typecheck. Left alone: all are in shared or unrelated files. Zero errors in any `trial-hormozi` file.

Note `CaseStudiesPage.tsx` has no route in `App.tsx` — check whether it is still wanted before fixing.

## 5. Jargon still present (§3.8 partially unmet)

Terms a local business owner may not know, at the same count as the control:

| Term | Occurrences | Where |
|---|---|---|
| `GBP` | 1 | FAQ — "What happens if I cancel?" |
| `GMB SEO` | 1 | FAQ — "Is this different from Google Ads or PPC?" |
| `map pack` | 1 | "Increase Your Local Visibility" (copy-deck text, verbatim) |
| `citations` | 4 | FAQ, comparison table |
| `on-page` / `off-page` | 6 | Comparison table, plan feature list |

All sit in sections whose copy was to be left unchanged, so they were not touched. Worth a pass once the copy freeze lifts — `GBP` and `GMB` are the two worth fixing first, since both have a plain-English expansion already used elsewhere on the page.

## 6. Placeholder content

Unchanged by instruction; each is marked `TODO:` in the source.

- **Text testimonials** — Lina Petrova / Omar Farouq / Emily Carter, all "Placeholder …" companies. Position changed, content untouched.
- **Before/after screenshots** — marked "replace with verified before/after screenshots per case". Files untouched.
- **HD / retina before/after** — `srcset` support not added. `BeforeAfterSlider` is a byte-identical copy of the control's; adding `srcset` without higher-resolution source files would change nothing visible.
- **Brand logo strip** — marked "replace with international/UK+Dubai client logos when available".
- **Hero demo video** — `HeroRankClimb` was the CSS placeholder for it. It is removed from `/trial-hormozi`'s hero; if a real demo video arrives, decide where it goes rather than restoring the placeholder.

## 7. Lighthouse scores not produced

The protocol asks for Performance ≥85 and Accessibility ≥90. Lighthouse is not a dependency and installing it needs approval.

Measured directly instead:

- **LCP** 608–676ms desktop, ~544ms mobile (target <2500ms) — LCP element is the H1 on both pages
- **Contrast** all new text 5.56–15.2:1 against WCAG AA
- **Structure** one `<h1>`, no heading-level skips, 33/33 images with `alt`, `lang="en"`

Say the word and I will add `lighthouse` as a devDependency and produce real scores.

## 8. Bundle size warning (pre-existing)

`dist/assets/index-*.js` is ~739 kB (224 kB gzipped), over Vite's 500 kB warning. Present before this work. Route-level code splitting would help most; `/trial` and `/trial-hormozi` are both large single-file pages now bundled together.
