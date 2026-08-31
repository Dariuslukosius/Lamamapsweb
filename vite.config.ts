import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Deployment variables are read here as well as in src/lib/siteConfig.ts, and
// validated here rather than there. import.meta.env values are inlined as
// string literals at build time, so a typo in VITE_DEPLOY_TARGET would not
// surface until a visitor's browser hit an unmatched route on the live site.
// This turns it into a failed build instead.
const DEPLOY_TARGETS = [
  "main",
  "trial",
  "landingpage",
  "trial-v2",
  "trial-v3",
  "trial-v4",
  "landingpage-v2",
  "landingpage-v3",
];

function validateDeployEnv() {
  const target = process.env.VITE_DEPLOY_TARGET;
  if (target && !DEPLOY_TARGETS.includes(target)) {
    throw new Error(
      `VITE_DEPLOY_TARGET="${target}" is invalid. Expected one of: ${DEPLOY_TARGETS.join(", ")}`,
    );
  }

  const siteUrl = process.env.VITE_SITE_URL;
  if (siteUrl && !/^https:\/\/[^/]+$/.test(siteUrl.replace(/\/+$/, ""))) {
    throw new Error(
      `VITE_SITE_URL="${siteUrl}" must be a bare https origin, e.g. "https://example.com" ` +
        "— it is concatenated with paths that already start with a slash.",
    );
  }
}

/**
 * Preloads the display font, but only on the builds whose "/" actually renders
 * it. Fraunces is `--tp-serif` — the face the trial hero's <h1> is set in, and
 * that <h1> is the LCP element on both landing pages. Without a preload the
 * browser cannot discover it until it has downloaded the stylesheet, matched a
 * rule and laid out the text, which puts three serial hops in front of the
 * largest paint.
 *
 * The main build is deliberately excluded: its "/" is the marketing homepage,
 * which is set in Space Grotesk and DM Sans. It still routes /trial and
 * /landingpage, and those still render Fraunces correctly — they just discover
 * it the normal way rather than paying 67 kB of preload on every homepage hit.
 * @returns {import("vite").Plugin}
 */
function preloadDisplayFont() {
  const TRIAL_TARGETS = [
    "trial",
    "landingpage",
    "trial-v2",
    "trial-v3",
    "trial-v4",
    "landingpage-v2",
    "landingpage-v3",
  ];
  return {
    name: "llamamaps-preload-display-font",
    transformIndexHtml() {
      if (!TRIAL_TARGETS.includes(process.env.VITE_DEPLOY_TARGET ?? "")) return [];
      return [
        {
          tag: "link",
          attrs: {
            rel: "preload",
            href: "/fonts/fraunces-latin.woff2",
            as: "font",
            type: "font/woff2",
            crossorigin: "",
          },
          injectTo: "head-prepend" as const,
        },
      ];
    },
  };
}

/**
 * Google Analytics (GA4). One Measurement ID per deployment target, injected
 * as a raw <script> block the same way Meta Pixel already is in index.html —
 * inline in the <head> rather than added by a React component, so it is
 * present in the prerendered HTML itself (see scripts/prerender.mjs's own
 * fbq('init') assertion for why that distinction matters: a client-inserted
 * tag would be invisible to anything that reads the static snapshot instead
 * of running the page's JS).
 *
 * Keyed on VITE_DEPLOY_TARGET rather than on the deployment name (com/eu/couk)
 * because that is what every other target-conditional in this file and in
 * src/lib/siteConfig.ts already keys on, and — as of scripts/deployTargets.mjs
 * — the three deployments and the three targets are in exact 1:1
 * correspondence (com -> main, eu -> trial, couk -> landingpage). If that ever
 * stops being true (say, a second domain is added on the "trial" target), this
 * map needs to move to keying on deployment name instead, because two domains
 * sharing one target must not end up sharing one GA property.
 *
 * All three properties were created 2026-08-29 under the "LamaLocal" GA4
 * account as fresh properties for the llamamaps.* domains — the account's
 * pre-existing lamalocal.com/.lt properties are an unrelated, differently
 * branded site and were left alone.
 * @returns {import("vite").Plugin}
 */
function injectGoogleAnalytics() {
  const MEASUREMENT_ID = {
    main: "G-0SQNS6XPTR", // llamamaps.com
    trial: "G-8KQKQFLFCP", // llamamaps.eu
    landingpage: "G-KH8804YVNL", // llamamaps.co.uk
  };

  return {
    name: "llamamaps-google-analytics",
    transformIndexHtml() {
      const id = MEASUREMENT_ID[process.env.VITE_DEPLOY_TARGET ?? "main"];
      if (!id) return [];
      return [
        {
          tag: "script",
          attrs: { async: true, src: `https://www.googletagmanager.com/gtag/js?id=${id}` },
          injectTo: "head" as const,
        },
        {
          tag: "script",
          children:
            "window.dataLayer = window.dataLayer || [];\n" +
            "function gtag(){dataLayer.push(arguments);}\n" +
            "gtag('js', new Date());\n" +
            `gtag('config', '${id}');`,
          injectTo: "head" as const,
        },
      ];
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(() => {
  validateDeployEnv();

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react(), preloadDisplayFont(), injectGoogleAnalytics()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
    },
  };
});
