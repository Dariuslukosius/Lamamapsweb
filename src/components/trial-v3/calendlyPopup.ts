/**
 * Calendly popup for the V2 landing pages, themed to the page palette.
 *
 * A copy of lib/calendlyPopup.ts rather than a change to it: that module is
 * what the V1 /trial and /landingpage pages open, and restyling it would
 * restyle their booking flow too.
 *
 * THEMING
 * The booking UI is a cross-origin iframe, so its fonts and background cannot
 * be reached with CSS from this page. Calendly's own embed query parameters are
 * the supported way in, and they take bare hex with no leading "#":
 *
 *   background_color  the sheet behind the calendar
 *   text_color        all body and heading text
 *   primary_color     selected day, buttons, links
 *
 * background_color is the page's CARD colour, not its page colour. The brief
 * asked for a booking panel that belongs to the page but still reads as its own
 * surface; #111C2B against the #0B1420 page is exactly the separation every
 * card on the page already uses, so the popup lands as one more card rather
 * than as a hole in the background or a white flash.
 *
 * Calendly renders its own text at these colours, so text_color #FFFFFF is what
 * makes every font inside the widget white.
 */
const CALENDLY_URL = "https://calendly.com/llamamaps/30min";

const THEME = {
  background_color: "111C2B",
  text_color: "FFFFFF",
  primary_color: "C9A24A",
  // The widget's own cookie notice duplicates the site's and lands on top of
  // the first date row on a phone.
  hide_gdpr_banner: "1",
};

const themedUrl = () => `${CALENDLY_URL}?${new URLSearchParams(THEME).toString()}`;

function ensureCalendlyAssets(onReady: () => void) {
  if (!document.querySelector('link[href="https://assets.calendly.com/assets/external/widget.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);
  }

  if (window.Calendly) {
    onReady();
    return;
  }

  const existingScript = document.querySelector(
    'script[src="https://assets.calendly.com/assets/external/widget.js"]'
  ) as HTMLScriptElement | null;

  if (existingScript) {
    existingScript.addEventListener("load", onReady, { once: true });
    return;
  }

  const script = document.createElement("script");
  script.src = "https://assets.calendly.com/assets/external/widget.js";
  script.async = true;
  script.addEventListener("load", onReady, { once: true });
  document.body.appendChild(script);
}

export function openCalendlyPopup() {
  ensureCalendlyAssets(() => {
    window.Calendly?.initPopupWidget({ url: themedUrl() });
  });
}
