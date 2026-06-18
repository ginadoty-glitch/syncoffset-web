const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const productionId = process.env.NEXT_PUBLIC_DEFAULT_PRODUCTION_ID || "a6bd49da-b65c-4e7a-8ef0-42f86eaef84c";
const base = process.env.SHOT_URL || "http://localhost:3000";
const outDir = path.join(__dirname, "../.verification-screenshots");
const stamp = `WireVendor-${Date.now()}`;

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  await context.addCookies([
    { name: "syncoffset_active_production", value: productionId, domain: "localhost", path: "/" },
  ]);
  const page = await context.newPage();

  // 1. Empty state — Add Vendor in header + empty panel
  await page.goto(`${base}/dashboard/vendor-lists`, { waitUntil: "networkidle", timeout: 120000 });
  await page.screenshot({ path: path.join(outDir, "vendor-wire-01-empty-with-add-button.png"), fullPage: true });

  // Create vendor via header Add Vendor
  await page.getByRole("button", { name: "Add Vendor" }).first().click();
  await page.getByLabel(/^Name/i).fill(stamp);
  await page.getByRole("button", { name: "Add Vendor" }).last().click();
  await page.waitForTimeout(2500);

  // 2. After create — refresh — vendor listed, Add Vendor still in header
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outDir, "vendor-wire-02-listed-after-refresh.png"), fullPage: true });

  const vendorQuery = stamp.slice(0, 14);

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

  // 3. Budget picker
  await page.goto(`${base}/dashboard/budget`, { waitUntil: "networkidle", timeout: 120000 });
  await page.getByRole("button", { name: /Add Budget Line/i }).click();
  await page.getByRole("dialog").waitFor({ state: "visible" });
  await openVendorPickerSearch();
  await page.screenshot({ path: path.join(outDir, "vendor-wire-03-budget-picker.png"), fullPage: true });

  // 4. Commercial invoice picker
  await page.goto(`${base}/dashboard/commercial-invoices`, { waitUntil: "networkidle", timeout: 120000 });
  await openVendorPickerSearch();
  await page.screenshot({ path: path.join(outDir, "vendor-wire-04-ci-picker.png"), fullPage: true });

  // 5. Shipment tracking picker
  await page.goto(`${base}/dashboard/logistics/shipment-tracking`, { waitUntil: "networkidle", timeout: 120000 });
  await openVendorPickerSearch();
  await page.screenshot({ path: path.join(outDir, "vendor-wire-05-shipment-picker.png"), fullPage: true });

  console.log("Vendor wire screenshots saved to", outDir);
  console.log("Created vendor:", stamp);
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
