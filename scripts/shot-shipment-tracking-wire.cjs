const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const productionId = process.env.NEXT_PUBLIC_DEFAULT_PRODUCTION_ID || "a6bd49da-b65c-4e7a-8ef0-42f86eaef84c";
const base = process.env.SHOT_URL || "http://localhost:3000";
const outDir = path.join(__dirname, "../.verification-screenshots");
const trackingNo = `ONT-${Date.now().toString().slice(-8)}`;

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  await context.addCookies([
    { name: "syncoffset_active_production", value: productionId, domain: "localhost", path: "/" },
  ]);
  const page = await context.newPage();

  await page.goto(`${base}/dashboard/logistics/shipment-tracking`, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outDir, "shipment-tracking-01-page.png"), fullPage: true });

  const logBtn = page.getByRole("button", { name: /Log Shipment/i }).first();
  await logBtn.click();
  await page.getByRole("dialog").waitFor({ state: "visible" });

  await page.getByRole("dialog").getByText("Search vendors…").click();
  await page.getByPlaceholder("Search vendors…").fill("William F. White");
  await page.waitForTimeout(800);
  const vendorItem = page.locator('[data-slot="popover-content"]').getByText(/William F\. White/i);
  if (await vendorItem.count()) {
    await vendorItem.first().click();
  } else {
    await page.getByRole("button", { name: /Add vendor/i }).first().click();
    await page.waitForTimeout(1200);
  }

  await page.getByLabel(/^Origin/i).fill("Ontario, Canada");
  await page.getByLabel(/^Destination/i).fill("Runaway Stage");
  await page.getByLabel(/^Carrier/i).fill("FedEx");
  await page.getByLabel(/^Tracking number/i).fill(trackingNo);

  const runsheetSelect = page.locator("#ship-runsheet");
  if (await runsheetSelect.count()) {
    const options = await runsheetSelect.locator("option").allTextContents();
    const match = options.findIndex((t) => t && t !== "None");
    if (match > 0) await runsheetSelect.selectOption({ index: match });
  }

  await page.screenshot({ path: path.join(outDir, "shipment-tracking-02-form-filled.png"), fullPage: true });
  await page.getByRole("button", { name: "Save Shipment" }).click();
  await page.waitForTimeout(3500);
  await page.screenshot({ path: path.join(outDir, "shipment-tracking-03-after-create.png"), fullPage: true });

  await page.getByPlaceholder("Search origin, destination, carrier, tracking…").fill("Ontario");
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, "shipment-tracking-04-search.png"), fullPage: true });

  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.getByPlaceholder("Search origin, destination, carrier, tracking…").fill(trackingNo.slice(-6));
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, "shipment-tracking-05-after-refresh.png"), fullPage: true });

  console.log("Shipment tracking screenshots saved to", outDir);
  console.log("Tracking number:", trackingNo);
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
