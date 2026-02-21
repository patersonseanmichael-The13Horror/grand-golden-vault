import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const errors = [];
const warnings = [];

const SECRET_PATTERNS = [
  { label: "private-key", pattern: /-----BEGIN (?:RSA |EC |)PRIVATE KEY-----/ },
  { label: "google-api-key", pattern: /AIza[0-9A-Za-z\-_]{20,}/ },
  { label: "generic-secret-assignment", pattern: /(?:api[_-]?key|secret|token|password)\s*[:=]\s*["'][^"'\n]{8,}["']/i },
  { label: "firebase-service-account-json", pattern: /"type"\s*:\s*"service_account"/ },
];

const ALLOWLIST_FILES = new Set([
  ".env.example",
  "docs/DEPLOYMENT_FINAL_STAGE.md",
]);

function getTrackedFiles() {
  const res = spawnSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" });
  if (res.status !== 0) {
    throw new Error(`Unable to list tracked files: ${res.stderr || "unknown git error"}`);
  }
  const raw = res.stdout || "";
  return raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function isTextFile(file) {
  return /\.(ts|tsx|js|mjs|json|md|css|yml|yaml|txt|html)$/.test(file) || file.startsWith(".");
}

function checkTrackedEnvFiles(files) {
  const trackedDotEnv = files.filter((file) => /^\.env(\.|$)/.test(path.basename(file)));
  const disallowed = trackedDotEnv.filter((file) => file !== ".env.example");
  if (disallowed.length > 0) {
    errors.push(`Tracked environment files detected: ${disallowed.join(", ")}`);
  }
}

function checkGitignore() {
  const p = path.join(ROOT, ".gitignore");
  if (!fs.existsSync(p)) {
    errors.push(".gitignore missing");
    return;
  }
  const text = fs.readFileSync(p, "utf8");
  const required = [".env", ".env*.local", "serviceAccountKey.json", "firebase-service-account*.json"];
  for (const token of required) {
    if (!text.includes(token)) {
      errors.push(`.gitignore missing required ignore rule: ${token}`);
    }
  }
}

function checkSourceForSecrets(files) {
  for (const file of files) {
    if (file === "package-lock.json" || file.endsWith(".tsbuildinfo")) continue;
    if (!isTextFile(file)) continue;
    if (ALLOWLIST_FILES.has(file)) continue;
    const fullPath = path.join(ROOT, file);
    let text = "";
    try {
      text = fs.readFileSync(fullPath, "utf8");
    } catch {
      continue;
    }

    for (const { label, pattern } of SECRET_PATTERNS) {
      if (pattern.test(text)) {
        errors.push(`Potential ${label} leak in tracked file: ${file}`);
      }
    }

    if (file.startsWith("app/") || file.startsWith("components/") || file.startsWith("lib/")) {
      if (/process\.env\.(?!NEXT_PUBLIC_)[A-Z0-9_]+/.test(text)) {
        warnings.push(`Server-only env var used in client/source tree review: ${file}`);
      }
    }
  }
}

function checkLegacyFolders() {
  const legacyPath = path.join(ROOT, "legacy_from_zip");
  if (fs.existsSync(legacyPath)) {
    warnings.push("legacy_from_zip exists; ensure no legacy deployment path is accidentally active.");
  }
}

function main() {
  const trackedFiles = getTrackedFiles();

  checkTrackedEnvFiles(trackedFiles);
  checkGitignore();
  checkSourceForSecrets(trackedFiles);
  checkLegacyFolders();

  if (warnings.length > 0) {
    console.log("Warnings:");
    warnings.forEach((warning) => console.log(`- ${warning}`));
  }

  if (errors.length > 0) {
    console.error("Errors:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("Security audit passed.");
}

main();
