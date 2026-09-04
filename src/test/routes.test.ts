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

/** Pulls the <Route path="..."> literals out of AppRoutes' single <Routes>
 * element. No JSX parser needed — there is exactly one branch now that this
 * project builds only "main" (see CLEANUP-TRIAL-ONLY-PROMPT.md). */
function declaredPaths(): string[] {
  const match = APP_SOURCE.match(/<Routes>([\s\S]*?)<\/Routes>/);
  if (!match) throw new Error("No <Routes> block found in App.tsx");

  return [...match[1].matchAll(/path="([^"]+)"/g)]
    .map((m) => m[1])
    // The catch-all is not a page; it is prerendered separately to 404.html.
    .filter((p) => p !== "*");
}

describe("deploy targets", () => {
  it("this project builds only the main target", () => {
    expect([...DEPLOY_TARGETS]).toEqual(["main"]);
    expect(APP_SOURCE.match(/<Routes>/g)).toHaveLength(1);
  });

  for (const target of DEPLOY_TARGETS) {
    it(`every route "${target}" serves is either prerendered or redirected`, () => {
      const { routes, redirects } = targetConfig(target);
      const redirectSources = redirects.map((rule) => rule[0]);

      for (const declared of declaredPaths()) {
        // A path is safe to ship if Cloudflare has a static file for it
        // (prerendered) or answers it with a 301 before the SPA loads.
        const covered = routes.includes(declared) || redirectSources.includes(declared);
        expect(covered, `App.tsx routes "${declared}" on target "${target}" but nothing serves it`).toBe(true);
      }
    });

    it(`"${target}" prerenders nothing App.tsx cannot render`, () => {
      const declared = declaredPaths();
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
