const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const productionId = process.env.NEXT_PUBLIC_DEFAULT_PRODUCTION_ID || "a6bd49da-b65c-4e7a-8ef0-42f86eaef84c";
const base = process.env.SHOT_URL || "http://localhost:3000";
const outDir = path.join(__dirname, "../.verification-screenshots");
const vendorQuery = process.env.VENDOR_QUERY || "WireVendor";

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  await context.addCookies([
    { name: "syncoffset_active_production", value: productionId, domain: "localhost", path: "/" },
  ]);
  const page = await context.newPage();

  async function openVendorPickerSearch() {
    const trigger = page.getByRole("dialog").getByText("Search vendors…").first();
    if (await trigger.count()) {
      await trigger.click();
    } else {
      await page.getByText("Search vendors…").first().click();
    }
    await page.getByPlaceholder("Search vendors…").fill(vendorQuery);
    await page.waitForTimeout(800);
  }

  await page.goto(`${base}/dashboard/budget`, { waitUntil: "networkidle", timeout: 120000 });
  await page.getByRole("button", { name: /Add Budget Line/i }).click();
  await page.getByRole("dialog").waitFor({ state: "visible" });
  await openVendorPickerSearch();
  await page.screenshot({ path: path.join(outDir, "vendor-wire-03-budget-picker.png"), fullPage: true });

  await page.goto(`${base}/dashboard/commercial-invoices`, { waitUntil: "networkidle", timeout: 120000 });
  await openVendorPickerSearch();
  await page.screenshot({ path: path.join(outDir, "vendor-wire-04-ci-picker.png"), fullPage: true });

  await page.goto(`${base}/dashboard/logistics/shipment-tracking`, { waitUntil: "networkidle", timeout: 120000 });
  await openVendorPickerSearch();
  await page.screenshot({ path: path.join(outDir, "vendor-wire-05-shipment-picker.png"), fullPage: true });

  console.log("Picker screenshots saved to", outDir);
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
