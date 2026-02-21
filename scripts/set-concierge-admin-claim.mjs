import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;
const targetUid = process.env.FIREBASE_CONCIERGE_ADMIN_UID;

if (!serviceAccountPath) {
  console.error("Missing FIREBASE_SERVICE_ACCOUNT_KEY_PATH.");
  process.exit(1);
}

if (!targetUid) {
  console.error("Missing FIREBASE_CONCIERGE_ADMIN_UID.");
  process.exit(1);
}

const resolvedPath = path.resolve(process.cwd(), serviceAccountPath);
if (!fs.existsSync(resolvedPath)) {
  console.error(`Service account file not found: ${resolvedPath}`);
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
} catch (error) {
  console.error(`Failed to parse service account JSON at ${resolvedPath}`);
  console.error(error);
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const auth = getAuth();

try {
  await auth.setCustomUserClaims(targetUid, { conciergeAdmin: true });
  console.log(`Set custom claim conciergeAdmin=true for uid: ${targetUid}`);
} catch (error) {
  console.error("Failed to set custom claim.");
  console.error(error);
  process.exit(1);
}
