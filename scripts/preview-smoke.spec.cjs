const fs = require("node:fs");
const path = require("node:path");
const { test, expect } = require("@playwright/test");

const PREVIEW_URL =
  process.env.PREVIEW_URL ||
  "https://grand-golden-vault-60udivya9-sean-patersons-projects-0e1c7734.vercel.app";

const routes = [
  "/",
  "/slots",
  "/slots/01",
  "/blackjack",
  "/poker",
  "/roulette",
  "/bonus",
  "/login",
  "/register",
  "/members",
  "/review",
];

const screenshotDir = path.resolve("output/preview-smoke");

function toSlug(route) {
  return route === "/" ? "home" : route.replace(/\//g, "_").replace(/^_/, "");
}

test("deployed preview smoke walkthrough", async ({ page }) => {
  fs.mkdirSync(screenshotDir, { recursive: true });
  const issues = [];
  await page.setViewportSize({ width: 1440, height: 900 });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      issues.push(`console.error (${page.url()}): ${msg.text()}`);
    }
  });
  page.on("pageerror", (err) => {
    issues.push(`pageerror (${page.url()}): ${String(err)}`);
  });

  for (const route of routes) {
    const url = new URL(route, PREVIEW_URL).toString();
    const resp = await page.goto(url, { waitUntil: "domcontentloaded" });
    expect(resp, `No response for ${url}`).not.toBeNull();
    expect(resp.status(), `HTTP ${resp.status()} for ${url}`).toBeLessThan(400);

    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(750);
    const shotPath = path.join(screenshotDir, `${toSlug(route)}.png`);
    try {
      await page.screenshot({
        path: shotPath,
        fullPage: false,
        timeout: 15000,
      });
    } catch (err) {
      issues.push(`screenshot_error (${url}): ${String(err)}`);
    }
  }

  // Exercise key forms/buttons if present.
  await page.goto(new URL("/login", PREVIEW_URL).toString(), {
    waitUntil: "domcontentloaded",
  });
  if ((await page.locator("input[type='email']").count()) > 0) {
    await page.locator("input[type='email']").first().fill("smoke@example.com");
  }
  if ((await page.locator("input[type='password']").count()) > 0) {
    await page.locator("input[type='password']").first().fill("not-a-real-password");
  }
  if ((await page.locator("button[type='submit']").count()) > 0) {
    await page.locator("button[type='submit']").first().click();
    await page.waitForTimeout(800);
  }
  await page.screenshot({
    path: path.join(screenshotDir, "login_submit.png"),
    fullPage: false,
    timeout: 15000,
  });

  const filteredIssues = issues.filter(
    (line) =>
      !line.includes("ERR_BLOCKED_BY_CLIENT") &&
      !line.includes("favicon.ico") &&
      !line.includes("Failed to load resource: the server responded with a status of 404")
  );
  expect(filteredIssues, filteredIssues.join("\n")).toEqual([]);
});
