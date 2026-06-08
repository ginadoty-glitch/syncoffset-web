import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:3001";
const OUT = "/tmp/syncoffset-convergence";
mkdirSync(OUT, { recursive: true });

const routes = [
  { path: "/dashboard/crew", name: "01-crew" },
  { path: "/dashboard/locations", name: "02-locations" },
  { path: "/dashboard/vendor-lists", name: "03-vendors" },
  { path: "/dashboard/tasks", name: "04-tasks" },
  { path: "/dashboard/logistics/trips", name: "05-trips" },
];

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  colorScheme: "dark",
});

for (const route of routes) {
  const page = await ctx.newPage();
  try {
    console.log(`→ ${route.name}: ${BASE}${route.path}`);
    await page.goto(`${BASE}${route.path}`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);
    const file = `${OUT}/${route.name}.png`;
    await page.screenshot({ path: file, fullPage: false });
    console.log(`  ✓ saved ${file}`);
  } catch (err) {
    console.error(`  ✗ ${route.name}: ${err.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log(`\nDone. Screenshots in ${OUT}/`);
