const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const productionId = process.env.NEXT_PUBLIC_DEFAULT_PRODUCTION_ID || "a6bd49da-b65c-4e7a-8ef0-42f86eaef84c";
const baseUrl = process.env.SHOT_URL?.replace(/\/dashboard.*/, "") || "http://localhost:3000";
const outDir = path.join(process.cwd(), ".verification-screenshots");

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  const url = `${baseUrl}/dashboard/production-calendar?year=2026&month=6&productionId=${productionId}`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(3000);
  const text = await page.locator("body").innerText();
  const hasHospital = /HOSPITAL|Hospital/i.test(text);
  const hasSawmill = /SAWMILL|Sawmill/i.test(text);
  const hasAfterLunch = /Company Move After Lunch/i.test(text);
  console.log("calendar text signals:", { hasHospital, hasSawmill, hasAfterLunch });
  await page.screenshot({ path: path.join(outDir, "company-move-day6-june-2026.png"), fullPage: true });
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
