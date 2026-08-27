// Refreshes the self-hosted webfonts in public/fonts.
//
// The site used to @import fonts.googleapis.com at the top of src/index.css.
// That import is render-blocking AND late-discovered — the browser only learns
// about it after index.css has downloaded, and only learns about the woff2
// after the googleapis CSS has downloaded. Two serial round trips ahead of
// first paint, on a page whose traffic arrives from paid mobile ads.
//
// Serving the files ourselves removes both hops and lets index.html preload
// them during HTML parse. The cost is that the files are now checked into the
// repo, so this script exists to regenerate them rather than leaving the next
// person to reverse-engineer which subset and axis range they came from.
//
// Run: node scripts/fetch-fonts.mjs
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "fonts");

// A modern desktop UA. css2 serves woff2 with variable-font axis ranges to
// browsers it recognises and legacy per-weight ttf to ones it does not, so
// asking as Node would silently fetch the wrong, much larger format.
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// One variable file per family, latin subset only. The pages are English-only,
// so latin-ext/vietnamese/cyrillic cuts are pure waste; and a 400..700 axis
// range is one file where four static weights would be four.
const FAMILIES = [
  { file: "dm-sans-latin.woff2", query: "DM+Sans:opsz,wght@9..40,400..700" },
  { file: "fraunces-latin.woff2", query: "Fraunces:opsz,wght@9..144,400..700" },
  { file: "space-grotesk-latin.woff2", query: "Space+Grotesk:wght@400..700" },
];

/** Pulls the woff2 URL out of the `/* latin *\/` block, ignoring the other subsets. */
function latinWoff2(css, family) {
  const block = css.split("/* latin */")[1];
  if (!block) throw new Error(`No latin subset in the CSS for ${family}`);
  const url = block.match(/https:\/\/[^)]+\.woff2/)?.[0];
  if (!url) throw new Error(`No woff2 in the latin block for ${family}`);
  return url;
}

await mkdir(OUT_DIR, { recursive: true });

for (const { file, query } of FAMILIES) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${query}&display=swap`;
  const css = await fetch(cssUrl, { headers: { "user-agent": UA } }).then((r) => {
    if (!r.ok) throw new Error(`${cssUrl} -> HTTP ${r.status}`);
    return r.text();
  });

  const woff2Url = latinWoff2(css, query);
  const bytes = Buffer.from(await fetch(woff2Url).then((r) => {
    if (!r.ok) throw new Error(`${woff2Url} -> HTTP ${r.status}`);
    return r.arrayBuffer();
  }));

  await writeFile(path.join(OUT_DIR, file), bytes);
  console.log(`${file.padEnd(28)} ${(bytes.length / 1024).toFixed(1)} kB  <- ${woff2Url}`);
}

console.log(
  "\nIf a unicode-range changed upstream, update the matching @font-face in src/index.css too.",
);
