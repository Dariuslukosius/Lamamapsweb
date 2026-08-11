# COPY — `/trial-hormozi`

Every string below lives in **`src/components/trial-hormozi/copy.ts`** and nowhere else.
To run a weekly test, edit that one file — never a component.

---

## Active copy

| Slot | Value |
|---|---|
| **H1** | The Calls You're Missing Are Going to the Shop Down the Road |
| **Subheadline** | We move your business into the Top 3 on Google Maps — usually within 90 days. No access to your Google account. No website changes. No contract. |
| **Primary CTA** | Start My Free 7-Day Trial |
| **Secondary CTA** | Book a 15-Min Call |
| **Badges** | No card required · No account access needed · Cancel anytime |
| **Social proof** | 4.9 ★ from 45 reviews |
| **Guarantee (short)** | Top 3 in 90 days — or you don't pay |

---

## H1 variants — `COPY.h1Variants`

| Key | Angle | Text |
|---|---|---|
| `v1_money` ✅ **active** | Lost revenue | The Calls You're Missing Are Going to the Shop Down the Road |
| `v2_result_time` | Result + speed | Get Into the Top 3 on Google Maps in 90 Days — Guaranteed |
| `v3_effortless` | Zero effort | Top 3 on Google Maps — Without Giving Us Access to Anything |
| `v4_proof` | Evidence | Rank 9 to Rank 1 in Six Weeks. Here's Exactly How We Did It. |
| `v5_ads` | Paid-vs-organic | Stop Paying for Clicks You Should Be Getting for Free |

**To swap:** set `COPY.hero.h1` to the chosen variant's value.

## Subheadline variants — `COPY.subheadlineVariants`

| Key | Text |
|---|---|
| `a` ✅ **active** | We move your business into the Top 3 on Google Maps — usually within 90 days. No access to your Google account. No website changes. No contract. |
| `b` | Local customers search, tap one of the top three results, and call. We get you into that list — and you don't lift a finger. |
| `c` | Everything is done for you. You keep full control of your Google profile, your website, and your money until you see movement. |

## CTA variants for week 3

| | Text |
|---|---|
| Control | Start My Free 7-Day Trial |
| Challenger | See My Free Ranking Report |

## Badge set

Active: `No card required` · `No account access needed` · `Cancel anytime`

Week 4 tests badges **present vs absent**, not alternative wording.

> `Cancel anytime` is used rather than `No commitment`: it names a concrete action the reader can take, where "no commitment" is an abstraction.

---

## Guarantee block — `COPY.guarantee`

**Eyebrow** OUR GUARANTEE
**H2** Top 3 on Google Maps in 90 Days — or You Don't Pay

> If your business isn't in the Top 3 for your agreed keywords within 90 days, you don't pay for that period. You keep every ranking gain we made. We take the risk, not you.

> To be straight with you: nobody controls Google's algorithm, so we can't promise a specific position on a specific day. What we can promise is the Top 3 inside 90 days — and if we miss it, that period is free.

- No long-term contract — cancel any time
- You never hand over access to your Google account
- You see ranking movement during the free trial, before you pay

⚠️ The second paragraph is load-bearing. Without it the block contradicts the FAQ answer *"Can you guarantee #1 rankings?"*. Do not delete it while testing.

## Objections — `COPY.objections`

**Eyebrow** BEFORE YOU DECIDE · **H2** Still Not Sure? Here's the Honest Answer.

| Question | Answer |
|---|---|
| "I've been burned by SEO before." | Fair. That's why you see ranking movement during a free trial, before you pay anything — and why we guarantee Top 3 in 90 days or you don't pay. |
| "I don't have time for this." | You need 15 minutes once. We handle the profile work, the local signals and the reporting. There is nothing for you to build or manage. |
| "Is this safe? Sounds like black hat." | We never access your Google account or your website. Nothing can be penalised, suspended or broken, because we don't touch it. |
| "Will it work for my type of business?" | It has worked for a dental clinic, an auto service and a spa — all local, all previously invisible on the map. See the results above. |

## "What we do" card bodies — `COPY.leadCardBodies`

Headings are unchanged from `/trial`; only bodies differ.

| Card | Body |
|---|---|
| Increase Your Local Visibility | We build authority around your Google Business Profile and generate the local signals that push you into the map pack. You don't touch anything. |
| Improve Your Search Performance | We handle the keyword targeting, the service pages and the local relevance work — so ready-to-buy customers find you first. |
| No Direct Access Required | We never log into your accounts. Nothing on your website breaks. Nothing is at risk — and rankings still move. |
| What's Needed for Best Results | If your profile is verified and you have reviews, we move faster. If something's missing, we tighten it up for you — no work on your side. |

---

## Rules

1. **One primary + one secondary CTA.** Adding a third label reintroduces the problem this rebuild removed. Verify with the DOM check in `TESTING.md`.
2. **Guarantee wording is fixed:** "Top 3 in 90 days — or you don't pay". It appears in the guarantee block, plan badges, the plan feature list, the comparison table, onboarding step 4 and two FAQ answers. Change it in `COPY.guaranteeShort` and check the other spots.
3. **Visible rating must match `lib/structuredData.ts`** (currently 4.9 / 45).
4. **Never invent** numbers, names, locations or quotes. No real content → leave a `TODO:`.
