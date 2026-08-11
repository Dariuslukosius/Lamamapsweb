# TESTING — weekly A/B cycle

**Control = `/trial`.** Every test is measured against it.
**One element per week.** Never two at once — change two things and you learn nothing about either.

> One landing page never works first time. Expect dozens of iterations before one converts. The cycle below is the point; any individual week is not.

---

## Where to edit

All swappable copy lives in **`src/components/trial-hormozi/copy.ts`**. H1, subheadline, CTA labels and badges each change in exactly one place. If a test ever requires editing a component, stop — the constant is missing and should be added first.

## Metrics

Primary: **booked calls ÷ unique visitors.** Secondary: primary-CTA click rate, `scroll_50`, `scroll_90`.

Events (Meta Pixel `trackCustom`, all with `page_variant: "trial-hormozi"`):

`trial_hormozi_view` · `trial_hormozi_cta_primary` · `trial_hormozi_cta_secondary` · `trial_hormozi_scroll_50` · `trial_hormozi_scroll_90`

`/trial` keeps emitting only the standard `Lead` / `Schedule`, unchanged — split the two pages by URL in reporting.

## End-of-week ritual

1. Which variant won?
2. Did it beat the control?
3. **Yes** → the winner becomes the new control. **No** → control stands, move to the next test.
4. Record the result in the log below, including losses. A loss is a finding.

⚠️ Do not call a week on a handful of conversions. Below ~100 conversions per arm, a "winner" is usually noise. If traffic is thin, run the test two or three weeks rather than shortening it.

---

## Schedule

| Week | Test | Control | Challenger |
|---|---|---|---|
| 1 | **H1** | `v1_money` (active) | `v2_result_time` |
| 2 | **Hero visual** | rank widget below CTA | before/after map below CTA |
| 3 | **Primary CTA** | Start My Free 7-Day Trial | See My Free Ranking Report |
| 4 | **Badges under CTA** | with | without |
| 5 | **Social proof order** | case studies first | video testimonials first |
| 6 | **CTA hierarchy** | primary + ghost secondary | two equal-weight buttons |
| 7 | **Navigation** | full nav | logo + one CTA only |
| 8 | **Conversion mechanism** | Calendly booking | 2-field form (email + business) |

### Week 6 — note

Equal weighting for trial and call was requested. It ships as **primary + visible ghost** instead, because two buttons of equal weight force an extra decision and raise perceived effort — the denominator of the value equation. Week 6 settles it with data rather than opinion.

### Week 8 — note

This is the only week that changes **mechanics**, not copy. Run it strictly alone, after the copy tests have settled, or you will not know which change moved the number. Background in `TODO.md` (§1).

---

## Open question worth its own test

The primary CTA promises a **free trial**, and clicking it opens a **calendar**. That is a message-match gap between the button and what happens next — the reader expects to start something and is asked to schedule something.

Not a bug, and not worth a rushed fix. Candidate tests once the schedule above is done:

- CTA label matching the destination ("Book My Free Trial Setup Call")
- an interstitial explaining that the trial starts on a 15-minute call
- week 8's 2-field form, which removes the mismatch entirely

---

## Regression gate before shipping any variant

Run these every time, not just the first time:

```bash
npm run build                 # must pass
node scripts/prerender.mjs    # must emit dist/trial-hormozi/index.html
```

- [ ] `/` and `/trial` unchanged (full-page pixel diff at 375 / 768 / 1280 / 1440 / 1920)
- [ ] No existing file modified beyond `App.tsx` and `scripts/prerender.mjs`
- [ ] Exactly 2 unique conversion-CTA strings in the DOM
- [ ] Hero fits the fold on iPhone SE (375×667)
- [ ] `canonical` → `https://llamamaps.com/trial`, `robots` → `noindex, follow`
- [ ] `/trial-hormozi` absent from `sitemap.xml`
- [ ] Console clean
- [ ] Visible rating matches `lib/structuredData.ts`

## Result log

| Week | Test | Winner | Lift | Beat control? | New control |
|---|---|---|---|---|---|
| | | | | | |
