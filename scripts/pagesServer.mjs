// A local stand-in for `wrangler pages dev`, implementing Cloudflare Pages'
// documented request-resolution rules over a build output directory.
//
// It exists because workerd — and therefore `wrangler pages dev` — requires
// macOS 13.5+, which the machine this project is developed on does not have.
// Used by scripts/verify-deploy.mjs for its assertions and by
// scripts/cf-preview.mjs to browse the build.
//
// SCOPE: this is a faithful implementation of Cloudflare's *documented*
// behaviour, not Cloudflare itself. It shows how this build's artifacts behave
// under those rules; it cannot prove Cloudflare implements them. On a machine
// that can run `wrangler pages dev dist`, prefer that.
//
// Resolution order, per developers.cloudflare.com/pages/configuration/{redirects,serving-pages}:
//   1. _redirects is consulted FIRST — "redirects are always followed,
//      regardless of whether or not an asset matches the incoming request".
//   2. Exact asset match.
//   3. HTML handling in the default "auto-trailing-slash" mode: /foo serves
//      foo.html; /foo/ serves foo/index.html; /foo.html 308s to /foo; and /foo
//      308s to /foo/ when only foo/index.html exists.
//   4. No match: the nearest 404.html, with a 404 status.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8", ".xml": "application/xml; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif",
  ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".woff": "font/woff", ".woff2": "font/woff2", ".pdf": "application/pdf",
  ".json5": "application/json", ".map": "application/json",
};

function parseRedirects(text) {
  return text.split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const [from, to, status] = l.split(/\s+/);
      return { from, to, status: Number(status || 302) };
    });
}

function parseHeaders(text) {
  const rules = [];
  let current = null;
  for (const raw of text.split("\n")) {
    if (!raw.trim() || raw.trim().startsWith("#")) continue;
    if (!/^\s/.test(raw)) {
      current = { pattern: raw.trim(), headers: {} };
      rules.push(current);
    } else if (current) {
      const idx = raw.indexOf(":");
      current.headers[raw.slice(0, idx).trim()] = raw.slice(idx + 1).trim();
    }
  }
  return rules;
}

const matchesPattern = (pattern, pathname) => {
  if (!pattern.includes("*")) return pattern === pathname;
  const rx = new RegExp(`^${pattern.split("*").map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*")}$`);
  return rx.test(pathname);
};

/**
 * @param {object} options
 * @param {string} [options.dist] build output directory (default "dist")
 * @param {number} [options.port]
 * @param {(line: string) => void} [options.onRequest] called with a log line per request
 */
export async function startPagesServer({ dist = "dist", port = 8791, onRequest } = {}) {
  const redirects = existsSync(path.join(dist, "_redirects"))
    ? parseRedirects(readFileSync(path.join(dist, "_redirects"), "utf-8")) : [];
  const headerRules = existsSync(path.join(dist, "_headers"))
    ? parseHeaders(readFileSync(path.join(dist, "_headers"), "utf-8")) : [];

  const isFile = async (p) => { try { return (await stat(p)).isFile(); } catch { return false; } };

  async function resolveAsset(pathname) {
    const rel = decodeURIComponent(pathname).replace(/^\/+/, "");
    const abs = path.join(dist, rel);

    if (rel && await isFile(abs)) {
      // Pages canonicalises .html URLs to their extensionless form.
      if (abs.endsWith(".html") && !abs.endsWith("index.html")) {
        return { redirect: pathname.replace(/\.html$/, ""), status: 308 };
      }
      return { file: abs };
    }
    if (pathname.endsWith("/")) {
      const idx = path.join(abs, "index.html");
      if (await isFile(idx)) return { file: idx };
    } else {
      if (await isFile(`${abs}.html`)) return { file: `${abs}.html` };
      if (await isFile(path.join(abs, "index.html"))) return { redirect: `${pathname}/`, status: 308 };
    }
    return { notFound: true };
  }

  function headersFor(pathname, file) {
    const out = {
      "Content-Type": MIME[path.extname(file || "")] ?? "application/octet-stream",
      // Pages sets these on every response by default.
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=0, must-revalidate",
    };
    for (const rule of headerRules) {
      if (matchesPattern(rule.pattern, pathname)) Object.assign(out, rule.headers);
    }
    return out;
  }

  const server = createServer(async (req, res) => {
    const pathname = new URL(req.url, `http://localhost:${port}`).pathname;
    const log = (status, extra = "") => onRequest?.(`${String(status).padEnd(3)} ${pathname}${extra}`);

    for (const rule of redirects) {
      if (matchesPattern(rule.from, pathname)) {
        res.writeHead(rule.status, { Location: rule.to });
        log(rule.status, ` -> ${rule.to}`);
        return res.end();
      }
    }

    const resolved = await resolveAsset(pathname);
    if (resolved.redirect) {
      res.writeHead(resolved.status, { Location: resolved.redirect });
      log(resolved.status, ` -> ${resolved.redirect}`);
      return res.end();
    }
    if (resolved.notFound) {
      const notFoundPage = path.join(dist, "404.html");
      if (existsSync(notFoundPage)) {
        res.writeHead(404, headersFor(pathname, notFoundPage));
        log(404, " (404.html)");
        return res.end(await readFile(notFoundPage));
      }
      res.writeHead(404, { "Content-Type": "text/plain" });
      log(404, " (no 404.html!)");
      return res.end("Not found");
    }
    res.writeHead(200, headersFor(pathname, resolved.file));
    log(200);
    res.end(await readFile(resolved.file));
  });

  await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));
  return server;
}
