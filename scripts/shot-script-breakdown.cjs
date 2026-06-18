const { chromium } = require("playwright");

(async () => {
  const url = process.env.SHOT_URL || "http://localhost:3001/dashboard/script-breakdown";
  const out = ".verification-screenshots/script-breakdown-items-wired.png";
  const productionId = process.env.NEXT_PUBLIC_DEFAULT_PRODUCTION_ID || "a6bd49da-b65c-4e7a-8ef0-42f86eaef84c";
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
  });
  await context.addCookies([
    {
      name: "syncoffset_active_production",
      value: productionId,
      domain: "localhost",
      path: "/",
    },
  ]);
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: out, fullPage: true });
  const text = await page.locator("body").innerText();
  const itemMatches = text.match(/\b\d+\s+items?\b/gi) ?? [];
  const headerMatch = text.match(/\d+\s+scenes[\s\S]{0,80}breakdown items/i);
  console.log("saved:", out);
  console.log("header:", headerMatch ? headerMatch[0] : "(none)");
  console.log("item count snippets:", itemMatches.slice(0, 15));
  await browser.close();
})();
