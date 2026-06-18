const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const productionId = process.env.NEXT_PUBLIC_DEFAULT_PRODUCTION_ID || "a6bd49da-b65c-4e7a-8ef0-42f86eaef84c";
const base = process.env.SHOT_URL || "http://localhost:3000";
const outDir = path.join(__dirname, "../.verification-screenshots");

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  await context.addCookies([
    { name: "syncoffset_active_production", value: productionId, domain: "localhost", path: "/" },
  ]);
  const page = await context.newPage();

  await page.goto(`${base}/dashboard/logistics/transport-orders`, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outDir, "transport-order-01-page-with-new-button.png"), fullPage: true });

  const emptyCreate = page
    .locator("text=No transport orders in runsheets")
    .locator("..")
    .getByRole("button", { name: "New Transport Order" });
  if (await emptyCreate.count()) {
    await emptyCreate.click();
  } else {
    await page.locator("text=TRANSPORT ORDERS").locator("..").getByRole("button", { name: "New Transport Order" }).click();
  }
  await page.getByRole("dialog").waitFor({ state: "visible" });

  const orderNo = `TO-ONTARIO-${Date.now().toString().slice(-6)}`;
  await page.getByLabel(/^Order number/i).fill(orderNo);
  await page.getByRole("dialog").getByText("Search vendors…").click();
  await page.getByPlaceholder("Search vendors…").fill("William F. White");
  await page.waitForTimeout(800);
  const vendorMatch = page.getByRole("option", { name: /William F\. White/i });
  if (await vendorMatch.count()) {
    await vendorMatch.first().click();
  } else {
    await page.getByRole("button", { name: /Add vendor/i }).first().click();
    await page.waitForTimeout(1200);
  }

  await page.getByLabel(/^Pickup location/i).fill("Burnaby Warehouse");
  await page.getByLabel(/^Delivery location/i).fill("Runaway Stage");
  await page.getByLabel(/^Notes/i).fill("Ontario shipment arrival");
  await page.screenshot({ path: path.join(outDir, "transport-order-02-form-filled.png"), fullPage: true });

  await page.getByRole("button", { name: "Save Transport Order" }).click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(outDir, "transport-order-03-manifest-after-create.png"), fullPage: true });

  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(outDir, "transport-order-04-after-refresh.png"), fullPage: true });

  await page.getByText(orderNo).first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, "transport-order-05-detail-panel.png"), fullPage: true });

  console.log("Transport order wire screenshots saved to", outDir);
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
