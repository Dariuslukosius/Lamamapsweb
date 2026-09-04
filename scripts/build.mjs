// Build the "com" deployment (llamamaps.com), the only one this project
// produces now — see CLEANUP-TRIAL-ONLY-PROMPT.md for why llamamaps.eu and
// llamamaps.co.uk (built from a different codebase) are no longer here.
//
//   node scripts/build.mjs            # llamamaps.com -> dist/
//   node scripts/build.mjs com        # same, named explicitly
//   node scripts/build.mjs com --verify
//   node scripts/build.mjs com --zip    # also produce dist.zip for upload
//
// This also calls ./node_modules/.bin/vite directly rather than going through
// npm, because this checkout's path contains a ":" and npm run cannot cope
// with it.
import { spawnSync } from "node:child_process";
import { rmSync, statSync } from "node:fs";
import { DEPLOYMENTS, deployment } from "./deployTargets.mjs";

// The bare, no-argument invocation ("npm run build:all") is the production
// build command — CI and the release checklist both call it unattended.
const PRODUCTION_DEPLOYMENTS = ["com"];

const args = process.argv.slice(2);
const verify = args.includes("--verify");
const zip = args.includes("--zip");
const names = args.filter((a) => !a.startsWith("--"));
const selected = names.length ? names : PRODUCTION_DEPLOYMENTS;

for (const name of selected) {
  if (!DEPLOYMENTS[name]) {
    console.error(`Unknown deployment "${name}". Expected: ${Object.keys(DEPLOYMENTS).join(", ")}`);
    process.exit(1);
  }
}

function run(command, commandArgs, env) {
  const result = spawnSync(command, commandArgs, { stdio: "inherit", env: { ...process.env, ...env } });
  if (result.status !== 0) {
    console.error(`\nFAILED: ${command} ${commandArgs.join(" ")}`);
    process.exit(result.status ?? 1);
  }
}

for (const name of selected) {
  const config = deployment(name);
  const env = {
    VITE_DEPLOY_TARGET: config.target,
    VITE_SITE_URL: config.siteUrl,
    BUILD_OUT_DIR: config.outDir,
    // Only the A/B variant deployment sets this. Leaving it undefined elsewhere
    // matters: siteConfig falls back to a self-canonical when it is absent, and
    // an empty string would look "set" while producing a canonical of "/".
    ...(config.trialUrl ? { VITE_TRIAL_URL: config.trialUrl } : {}),
  };

  console.log(`\n${"=".repeat(70)}`);
  console.log(`  ${config.domain}  —  ${config.description}`);
  console.log(`  target=${config.target}  ->  ${config.outDir}/`);
  console.log("=".repeat(70));

  run("./node_modules/.bin/vite", ["build", "--outDir", config.outDir, "--emptyOutDir"], env);
  run("node", ["scripts/prerender.mjs"], env);
  run("node", ["scripts/site-files.mjs"], env);
  if (verify) run("node", ["scripts/verify-deploy.mjs"], env);
  if (zip) makeZip(config);
}

// Hostinger's File Manager uploads one file at a time, and a landing build is
// ~70 files. Zipping the folder turns the upload into one file plus "Extract".
//
// `zip -r <archive> .` from *inside* the folder is what makes the archive
// extract as loose files into public_html rather than into a nested directory —
// and it is also what includes .htaccess and .well-known/, which a glob of `*`
// would silently skip. Losing .htaccess would mean no redirects, no security
// headers, and Apache's default 404 page instead of the prerendered one.
function makeZip(config) {
  const archive = `${config.outDir}.zip`;
  rmSync(archive, { force: true });
  const result = spawnSync("zip", ["-r", "-q", `../${archive}`, "."], { cwd: config.outDir, stdio: "inherit" });
  if (result.status !== 0) {
    console.error(`\nFAILED to create ${archive}`);
    process.exit(result.status ?? 1);
  }
  const size = (statSync(archive).size / 1048576).toFixed(1);
  console.log(`\n  ${archive} (${size} MB) — upload to ${config.domain} public_html and Extract`);
}

console.log(`\nBuilt ${selected.length} deployment(s):`);
for (const name of selected) {
  const config = deployment(name);
  console.log(`  ${config.outDir.padEnd(12)} -> ${config.domain}`);
  console.log(`    ./node_modules/.bin/wrangler pages deploy ${config.outDir} --project-name=<project>`);
}
