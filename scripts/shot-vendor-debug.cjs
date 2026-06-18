const { chromium } = require("playwright");

const productionId = "a6bd49da-b65c-4e7a-8ef0-42f86eaef84c";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  await context.addCookies([
    { name: "syncoffset_active_production", value: productionId, domain: "localhost", path: "/" },
  ]);
  const page = await context.newPage();
  await page.goto("http://localhost:3000/dashboard/budget", { waitUntil: "networkidle", timeout: 120000 });
  await page.getByRole("button", { name: /Add Budget Line/i }).click();
  await page.waitForTimeout(1500);
  const dialog = page.getByRole("dialog");
  console.log("dialog visible", await dialog.isVisible());
  const comboboxes = await page.getByRole("combobox").all();
  console.log("combobox count", comboboxes.length);
  for (let i = 0; i < comboboxes.length; i++) {
    console.log(i, await comboboxes[i].innerText(), await comboboxes[i].getAttribute("aria-expanded"));
  }
  const byText = page.getByText("Search vendors…");
  console.log("search text count", await byText.count());
  await browser.close();
})();
