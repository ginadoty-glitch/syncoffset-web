/**
 * Capture Phase 1C read surfaces for verification.
 * Usage: node scripts/capture-phase1c-screenshots.mjs [baseUrl]
 */
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? "http://localhost:3001";
const outDir = resolve(dirname(fileURLToPath(import.meta.url)), "../.verification-screenshots");

const routes = [
  { name: "14-phase1c-locations", path: "/dashboard/locations" },
  { name: "15-phase1c-vendors", path: "/dashboard/vendor-lists" },
  { name: "16-phase1c-transport-orders", path: "/dashboard/logistics/transport-orders" },
  { name: "17-phase1c-trips", path: "/dashboard/logistics/trips" },
  { name: "18-phase1c-tasks", path: "/dashboard/tasks" },
  { name: "19-phase1c-crew", path: "/dashboard/crew" },
];

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const route of routes) {
  const url = `${baseUrl}${route.path}`;
  console.log(`Capturing ${url}`);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForTimeout(3000);
  await page.screenshot({
    path: resolve(outDir, `${route.name}.png`),
    fullPage: false,
  });
}

await browser.close();
console.log(`Saved ${routes.length} screenshots to ${outDir}`);
