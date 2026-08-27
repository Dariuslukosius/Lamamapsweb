// Re-encodes the image assets that /trial and /landingpage actually render, at
// a size and quality matched to how big they appear on screen.
//
// The pages had accumulated assets encoded at whatever came out of the source
// tool: a 648 kB PNG drawn as a 52 px avatar, an 861 px logo drawn 30 px tall,
// and 34 map screenshots at ~150 kB each in a frame capped at 460 px. None of
// that is visible to the visitor — it is visible in the bandwidth bill and in
// the timeouts that ad traffic was hitting.
//
// Rewrites in place, keeping every path and extension, so no import changes.
// Safe to re-run: a file already at or under its target width and byte ceiling
// is skipped rather than re-compressed, which would stack generational loss.
//
// Run: node scripts/optimize-images.mjs [--dry]
import sharp from "sharp";
import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");

/**
 * `maxWidth` (or `maxHeight`, whichever the layout actually constrains) is the
 * intrinsic size to encode at: the largest the asset is ever drawn, times ~3
 * for high-DPR phones. `ceilingKb` is what a correctly-sized file should
 * already weigh — anything under it is treated as already done.
 */
const GROUPS = [
  {
    what: "case-study grid scans",
    dir: "src/assets/results",
    // .tp-baf-frame is max-width: 460px, so 800px is already the 2x size —
    // these are not too big, only encoded far too richly for what they are.
    maxWidth: 800,
    quality: 72,
    ceilingKb: 90,
  },
  {
    what: "testimonial avatars",
    dir: "src/assets/testimonials",
    // .tp-testimonial-avatar is 52px square.
    maxWidth: 128,
    quality: 80,
    ceilingKb: 20,
  },
  {
    what: "brand logos",
    dir: "src/assets/brands",
    // Constrained by height, not width: .tp-logos-row draws these at a fixed
    // 42px height with `width: auto`, so a wide wordmark and a square badge
    // need very different pixel widths to look equally sharp. They are also
    // rendered through `grayscale(1) brightness(0) invert(1)` — flat white
    // silhouettes — so only the alpha edge survives and colour fidelity is
    // worth nothing here.
    maxHeight: 128,
    quality: 80,
    ceilingKb: 20,
  },
  {
    what: "site logo",
    files: ["src/assets/llama-logo.webp", "src/assets/llama-logo-icon.webp"],
    // Drawn 30px tall in the navbar, footer and comparison heading.
    maxWidth: 160,
    quality: 85,
    ceilingKb: 12,
  },
];

const IMAGE_EXT = new Set([".webp", ".png", ".jpg", ".jpeg"]);
const kb = (bytes) => bytes / 1024;

/** Re-encodes to the file's own format, so callers' import paths keep working. */
function encode(pipeline, ext, quality) {
  if (ext === ".png") return pipeline.png({ quality, compressionLevel: 9, palette: true });
  if (ext === ".jpg" || ext === ".jpeg") return pipeline.jpeg({ quality, mozjpeg: true });
  return pipeline.webp({ quality, effort: 6, smartSubsample: true });
}

async function filesIn(group) {
  if (group.files) return group.files.map((f) => path.join(ROOT, f));
  const dir = path.join(ROOT, group.dir);
  const names = await readdir(dir);
  return names
    .filter((n) => IMAGE_EXT.has(path.extname(n).toLowerCase()))
    .map((n) => path.join(dir, n));
}

let savedTotal = 0;
let touched = 0;

for (const group of GROUPS) {
  const files = await filesIn(group);
  let groupSaved = 0;

  for (const file of files) {
    const before = (await stat(file)).size;
    const meta = await sharp(file).metadata();
    const rel = path.relative(ROOT, file);

    const axis = group.maxHeight ? "height" : "width";
    const limit = group.maxHeight ?? group.maxWidth;
    if (meta[axis] <= limit && kb(before) <= group.ceilingKb) continue;

    const ext = path.extname(file).toLowerCase();
    // Never upscale: an asset already smaller than its target keeps its size
    // and is only re-encoded because it is over the byte ceiling.
    const resized = sharp(file).resize({ [axis]: Math.min(meta[axis], limit) });
    const out = await encode(resized, ext, group.quality).toBuffer();

    // Re-encoding is only worth the quality loss if it actually pays. A file
    // that comes out no smaller keeps its original bytes.
    if (out.length >= before) continue;

    if (!DRY) await writeFile(file, out);
    groupSaved += before - out.length;
    touched += 1;
    console.log(
      `  ${rel.padEnd(56)} ${axis[0]}${meta[axis]}px ${kb(before).toFixed(0).padStart(4)} kB ` +
        `-> ${axis[0]}${Math.min(meta[axis], limit)}px ${kb(out.length).toFixed(0).padStart(4)} kB`,
    );
  }

  console.log(`${group.what}: saved ${kb(groupSaved).toFixed(0)} kB\n`);
  savedTotal += groupSaved;
}

console.log(
  `${DRY ? "[dry run] would rewrite" : "rewrote"} ${touched} files, ` +
    `saving ${(savedTotal / 1024 / 1024).toFixed(2)} MB`,
);
