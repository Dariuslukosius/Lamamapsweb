import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  DEPLOY_TARGETS,
  NOT_FOUND_PRERENDER_PATH,
  targetConfig,
} from "../../scripts/deployTargets.mjs";

// Why this test exists.
//
// On Vercel every unknown path was rewritten to index.html, so a route added to
// App.tsx worked immediately whether or not anything else knew about it. On
// Cloudflare Pages there is deliberately no such catch-all: a blanket
// `/* /index.html 200` would be evaluated BEFORE asset matching and would
// shadow every prerendered snapshot, serving the home page's HTML — title,
// canonical and JSON-LD included — on every URL.
//
// The cost of dropping the catch-all is that App.tsx and deployTargets.mjs must
// stay in sync by hand: a <Route> that nothing prerenders is a hard 404 in
// production. This test is what makes that impossible to ship.

const APP_SOURCE = readFileSync(path.resolve(__dirname, "../App.tsx"), "utf-8");

/**
 * Pulls the <Route path="..."> literals out of one target's branch of
 * AppRoutes. Each branch is a self-contained <Routes> element, so slicing on
 * the element boundaries is enough — no JSX parser needed.
 */
function declaredPaths(target: string): string[] {
  const branches = [...APP_SOURCE.matchAll(/<Routes>([\s\S]*?)<\/Routes>/g)].map((m) => m[1]);
  // Branches appear in source order: trial, landingpage, trial-v2, trial-v3,
  // trial-v4, landingpage-v2, landingpage-v3, then main (the fallback
  // return). Matching that order here keeps the mapping explicit.
  const byTarget: Record<string, string> = {
    trial: branches[0],
    landingpage: branches[1],
    "trial-v2": branches[2],
    "trial-v3": branches[3],
    "trial-v4": branches[4],
    "landingpage-v2": branches[5],
    "landingpage-v3": branches[6],
    main: branches[7],
  };
  const branch = byTarget[target];
  if (!branch) throw new Error(`No <Routes> branch found in App.tsx for target "${target}"`);

  return [...branch.matchAll(/path="([^"]+)"/g)]
    .map((m) => m[1])
    // The catch-all is not a page; it is prerendered separately to 404.html.
    .filter((p) => p !== "*");
}

describe("deploy targets", () => {
  it("App.tsx declares exactly the targets deployTargets.mjs knows about", () => {
    expect([...DEPLOY_TARGETS].sort()).toEqual([
      "landingpage",
      "landingpage-v2",
      "landingpage-v3",
      "main",
      "trial",
      "trial-v2",
      "trial-v3",
      "trial-v4",
    ]);
    expect(APP_SOURCE.match(/<Routes>/g)).toHaveLength(DEPLOY_TARGETS.length);
  });

  for (const target of DEPLOY_TARGETS) {
    it(`every route "${target}" serves is either prerendered or redirected`, () => {
      const { routes, redirects } = targetConfig(target);
      const redirectSources = redirects.map((rule) => rule[0]);

      for (const declared of declaredPaths(target)) {
        // A path is safe to ship if Cloudflare has a static file for it
        // (prerendered) or answers it with a 301 before the SPA loads.
        const covered = routes.includes(declared) || redirectSources.includes(declared);
        expect(covered, `App.tsx routes "${declared}" on target "${target}" but nothing serves it`).toBe(true);
      }
    });

    it(`"${target}" prerenders nothing App.tsx cannot render`, () => {
      const declared = declaredPaths(target);
      for (const route of targetConfig(target).routes) {
        expect(declared, `deployTargets.mjs prerenders "${route}" but App.tsx has no route for it`).toContain(route);
      }
    });

    it(`"${target}" lists only prerendered pages as indexable`, () => {
      const { routes, indexable } = targetConfig(target);
      for (const route of indexable) {
        expect(routes, `"${route}" is in sitemap.xml but is not prerendered`).toContain(route);
      }
    });
  }

  it("reserves /404 for the catch-all snapshot rather than a real page", () => {
    expect(NOT_FOUND_PRERENDER_PATH).toBe("/404");
    for (const target of DEPLOY_TARGETS) {
      expect(targetConfig(target).routes).not.toContain(NOT_FOUND_PRERENDER_PATH);
    }
  });
});
