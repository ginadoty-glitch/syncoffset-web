/**
 * Export 24×36 landscape PDF from the production calendar print route.
 * Usage: node scripts/export-production-calendar-pdf.mjs [url] [output]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const url =
  process.argv[2] ?? "http://localhost:3002/dashboard/production-calendar/print/mock";
const output = resolve(
  process.argv[3] ??
    ".verification-screenshots/production-calendar-24x36-mock.pdf",
);

async function main() {
  mkdirSync(dirname(output), { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(2000);
  await page.emulateMedia({ media: "print" });

  await page.pdf({
    path: output,
    width: "36in",
    height: "24in",
    printBackground: true,
    margin: { top: "0.25in", right: "0.35in", bottom: "0.25in", left: "0.35in" },
    preferCSSPageSize: true,
  });

  await browser.close();
  console.log(`PDF written: ${output}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
