import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "app");
const SLOTS_DIR = path.join(ROOT, "slots");

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
  const hrefPattern = /href="(\/[^"]*)"/g;
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
  const seen = new Set();
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(SLOTS_DIR, file), "utf8"));
    if (!Array.isArray(data.symbols) || data.symbols.length < 9) {
      errors.push(`Slot ${file} has invalid symbols array`);
    }
    const key = JSON.stringify(data.symbols);
    if (seen.has(key)) {
      warnings.push(`Slot ${file} shares identical symbol order with another machine`);
    }
    seen.add(key);
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

function main() {
  const sourceFiles = walk(path.join(ROOT, "app"))
    .concat(walk(path.join(ROOT, "components")))
    .filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"));

  checkHeroAssets(sourceFiles);
  checkInternalLinks(sourceFiles);
  checkSlots();
  checkCssCollision();

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
