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
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
    },
  };
});
