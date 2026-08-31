/**
 * Analytics for /landingpage only.
 *
 * Every event here is namespaced `trial_hormozi_*` and fired through Meta's
 * `trackCustom`, which keeps it in a separate bucket from the standard `Lead`
 * and `Schedule` events the page still sends. That separation is the whole
 * point: /trial is the control, and the two pages have to be countable apart
 * while their existing event names stay byte-identical to what they were.
 *
 * No existing event name is changed, renamed or wrapped.
 */

type EventParams = Record<string, unknown>;

/** Meta Pixel custom event. Standard events keep using lib/metaPixel.ts. */
function trackMetaCustom(event: string, params?: EventParams) {
  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", event, params);
  }
}

/**
 * The site has no GA4/GTM container today. Pushing to dataLayer anyway costs
 * nothing and means these events start flowing the moment one is installed,
 * with no edit here.
 */
function pushDataLayer(event: string, params?: EventParams) {
  const w = window as typeof window & { dataLayer?: unknown[] };
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event, ...params });
  }
}

export function trackHormozi(event: string, params?: EventParams) {
  const payload = { page_variant: "trial-hormozi", ...params };
  trackMetaCustom(event, payload);
  pushDataLayer(event, payload);
}

export const HORMOZI_EVENTS = {
  view: "trial_hormozi_view",
  ctaPrimary: "trial_hormozi_cta_primary",
  ctaSecondary: "trial_hormozi_cta_secondary",
  scroll50: "trial_hormozi_scroll_50",
  scroll90: "trial_hormozi_scroll_90",
} as const;

/** Fires once per page load. */
export function trackHormoziView() {
  trackHormozi(HORMOZI_EVENTS.view);
}

/**
 * Reports 50% and 90% scroll depth, each at most once per page load.
 * Returns a cleanup function for the effect that installs it.
 */
export function installScrollDepthTracking() {
  const fired = new Set<string>();

  const onScroll = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    // A page shorter than the viewport has no depth to measure; reporting 100%
    // for it would inflate the metric with visitors who never scrolled.
    if (scrollable <= 0) return;
    const pct = ((window.scrollY || doc.scrollTop) / scrollable) * 100;

    for (const [threshold, event] of [
      [50, HORMOZI_EVENTS.scroll50],
      [90, HORMOZI_EVENTS.scroll90],
    ] as const) {
      if (pct >= threshold && !fired.has(event)) {
        fired.add(event);
        trackHormozi(event, { depth: threshold });
      }
    }

    if (fired.size === 2) window.removeEventListener("scroll", onScroll);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  return () => window.removeEventListener("scroll", onScroll);
}
