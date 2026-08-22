/// <reference types="vite/client" />

// Build-time deployment variables. See src/lib/siteConfig.ts for what they
// select and cloudflare/README.md for the per-target values to set in the
// Cloudflare Pages dashboard.
interface ImportMetaEnv {
  /** "main" | "trial" | "landingpage". Defaults to "main" when unset. */
  readonly VITE_DEPLOY_TARGET?: string;
  /** Absolute origin this build is served from, e.g. "https://llamamaps.com". */
  readonly VITE_SITE_URL?: string;
  /** Permanent brand origin used for schema.org entity @ids. Rarely overridden. */
  readonly VITE_BRAND_URL?: string;
  /**
   * Absolute URL of the /trial page once it has its own domain. Only read by
   * the "landingpage" target, which declares it as its canonical.
   */
  readonly VITE_TRIAL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
