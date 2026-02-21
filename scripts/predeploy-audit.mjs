import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "app");
const SLOTS_DIR = path.join(ROOT, "slots");
const LOCAL_ENV = path.join(ROOT, ".env.local");

const REQUIRED_PUBLIC_ENV = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_CONCIERGE_ADMIN_UID",
  "NEXT_PUBLIC_CONCIERGE_ADMIN_EMAIL",
  "NEXT_PUBLIC_DEPOSIT_NAME",
  "NEXT_PUBLIC_DEPOSIT_PAYID",
];

const REQUIRED_ADMIN_ENV = [
  "FIREBASE_SERVICE_ACCOUNT_KEY_PATH",
  "FIREBASE_CONCIERGE_ADMIN_UID",
];

const errors = [];
const warnings = [];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function routeExists(route) {
  if (route === "/") return fs.existsSync(path.join(APP_DIR, "page.tsx"));
  const parts = route.replace(/^\//, "").split("/");
  const dir = path.join(APP_DIR, ...parts);
  return fs.existsSync(path.join(dir, "page.tsx")) || fs.existsSync(path.join(APP_DIR, ...parts, "route.ts"));
}

function checkHeroAssets(files) {
  const srcPattern = /HeroBackdrop\s+src="([^"]+)"/g;
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    let m;
    while ((m = srcPattern.exec(text))) {
      const src = m[1];
      if (!src.startsWith("/")) continue;
      const assetPath = path.join(ROOT, "public", src.replace(/^\//, ""));
      if (!fs.existsSync(assetPath)) {
        errors.push(`Missing hero asset: ${src} referenced in ${path.relative(ROOT, file)}`);
      }
    }
  }
}

function checkInternalLinks(files) {
  const hrefPattern = /href="(\/[^\"]*)"/g;
  const ignore = [/^\/mailto:/, /^\/assets\//, /^\/api\//];
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    let m;
    while ((m = hrefPattern.exec(text))) {
      const href = m[1];
      if (ignore.some((r) => r.test(href))) continue;
      if (href.includes("[") || href.includes("]")) continue;
      if (href.startsWith("/slots/") && href.length > "/slots/".length) continue;
      if (!routeExists(href)) {
        warnings.push(`Route target may be missing: ${href} referenced in ${path.relative(ROOT, file)}`);
      }
    }
  }
}

function checkSlots() {
  const files = fs.readdirSync(SLOTS_DIR).filter((f) => /^slot_\d+\.json$/.test(f)).sort();
  if (files.length !== 25) {
    errors.push(`Expected 25 slot configs, found ${files.length}`);
  }
  const expectedIds = Array.from({ length: 25 }, (_, idx) => String(idx + 1).padStart(2, "0"));
  const actualIds = files.map((f) => f.replace("slot_", "").replace(".json", ""));
  for (const id of expectedIds) {
    if (!actualIds.includes(id)) {
      errors.push(`Missing slot config slot_${id}.json`);
    }
  }
  const seen = new Map();
  const seenNamespaces = new Map();
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(SLOTS_DIR, file), "utf8"));
    if (!Array.isArray(data.symbols) || data.symbols.length < 9) {
      errors.push(`Slot ${file} has invalid symbols array`);
    }
    if (data.reels !== 5 || data.rows !== 3) {
      errors.push(`Slot ${file} must be 5x3 (found reels=${String(data.reels)}, rows=${String(data.rows)})`);
    }
    if (typeof data.paylines !== "number" || data.paylines < 20) {
      errors.push(`Slot ${file} must define Vegas paylines (found ${String(data.paylines)})`);
    }
    const key = JSON.stringify(data.symbols);
    if (seen.has(key)) {
      errors.push(`Slot ${file} shares identical symbol order with ${seen.get(key)}; each slot must have unique symbols.`);
    }
    seen.set(key, file);
    const namespaces = [...new Set(data.symbols.map((sym) => String(sym).split("__")[0]))];
    if (namespaces.length !== 1 || !namespaces[0]) {
      errors.push(`Slot ${file} must use one namespaced symbol family (found: ${namespaces.join(", ") || "none"})`);
    } else {
      const namespace = namespaces[0];
      if (seenNamespaces.has(namespace)) {
        errors.push(`Slot ${file} reuses namespace ${namespace} already used by ${seenNamespaces.get(namespace)}.`);
      } else {
        seenNamespaces.set(namespace, file);
      }
    }
    if (typeof data.minBet !== "number" || typeof data.maxBet !== "number" || data.minBet <= 0 || data.maxBet < data.minBet) {
      errors.push(`Slot ${file} has invalid min/max bet values`);
    }
  }
}

function checkCssCollision() {
  const globalCss = fs.existsSync(path.join(APP_DIR, "global.css"));
  const globalsCss = fs.existsSync(path.join(APP_DIR, "globals.css"));
  if (globalCss && globalsCss) {
    errors.push("Both app/global.css and app/globals.css exist; this can create style collisions.");
  }
}

function walkRepoForArtifacts(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules", ".next", "out"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkRepoForArtifacts(full));
      continue;
    }
    if (/\.swp$|\.swo$|~$/.test(entry.name)) {
      out.push(path.relative(ROOT, full));
    }
  }
  return out;
}

function parseDotEnv(text) {
  const vars = {};
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .forEach((line) => {
      if (!line || line.startsWith("#")) return;
      const idx = line.indexOf("=");
      if (idx <= 0) return;
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      vars[key] = value;
    });
  return vars;
}

function checkEnvReadiness() {
  if (!fs.existsSync(LOCAL_ENV)) {
    warnings.push(".env.local is missing; local Firebase/Auth testing will fail until environment values are provided.");
    return;
  }

  const env = parseDotEnv(fs.readFileSync(LOCAL_ENV, "utf8"));
  const missingPublic = REQUIRED_PUBLIC_ENV.filter((k) => !env[k]);
  const missingAdmin = REQUIRED_ADMIN_ENV.filter((k) => !env[k]);

  if (missingPublic.length > 0) {
    warnings.push(`.env.local missing required public values: ${missingPublic.join(", ")}`);
  }
  if (missingAdmin.length > 0) {
    warnings.push(`.env.local missing admin-script values: ${missingAdmin.join(", ")}`);
  }
}

function main() {
  const sourceFiles = walk(path.join(ROOT, "app"))
    .concat(walk(path.join(ROOT, "components")))
    .filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"));

  checkHeroAssets(sourceFiles);
  checkInternalLinks(sourceFiles);
  checkSlots();
  checkCssCollision();
  checkEnvReadiness();

  const artifacts = walkRepoForArtifacts(ROOT);
  if (artifacts.length) {
    errors.push(`Editor/swap artifacts detected: ${artifacts.join(", ")}`);
  }

  if (warnings.length) {
    console.log("Warnings:");
    warnings.forEach((w) => console.log(`- ${w}`));
  }

  if (errors.length) {
    console.error("Errors:");
    errors.forEach((e) => console.error(`- ${e}`));
    process.exit(1);
  }

  console.log("Predeploy audit passed.");
}

main();
