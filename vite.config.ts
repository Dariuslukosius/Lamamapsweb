import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Deployment variables are read here as well as in src/lib/siteConfig.ts, and
// validated here rather than there. import.meta.env values are inlined as
// string literals at build time, so a typo in VITE_DEPLOY_TARGET would not
// surface until a visitor's browser hit an unmatched route on the live site.
// This turns it into a failed build instead.
const DEPLOY_TARGETS = ["main", "trial", "landingpage"];

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
  const TRIAL_TARGETS = ["trial", "landingpage"];
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
    plugins: [react(), preloadDisplayFont()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
    },
  };
});
