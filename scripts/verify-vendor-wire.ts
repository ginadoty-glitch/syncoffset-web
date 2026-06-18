/**
 * End-to-end vendor wire verification via Supabase REST.
 * Usage: npx tsx scripts/verify-vendor-wire.ts [vendorName]
 */
import fs from "node:fs";
import path from "node:path";

const env: Record<string, string> = {};
for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const showId = env.NEXT_PUBLIC_DEFAULT_PRODUCTION_ID;
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

async function rest(pathAndQuery: string, init?: RequestInit) {
  const res = await fetch(`${URL}/rest/v1/${pathAndQuery}`, { headers: { ...headers, ...init?.headers }, ...init });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  if (res.status === 204) return null;
  return res.json();
}

async function main() {
  const stamp = process.argv[2] || `WireTest Vendor ${Date.now()}`;
  const vendorRes = await rest("vendors", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ show_id: showId, name: stamp, category: "other", phone: "604-555-0199" }),
  });
  const vendor = vendorRes[0];
  console.log("1. vendor created:", vendor.id, vendor.name);

  const budgetRes = await rest("production_budget_lines", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      show_id: showId,
      source_type: "manual",
      department: "Art",
      category: "Rentals",
      description: `Wire test line — ${stamp}`,
      vendor: vendor.name,
      quantity: 1,
      unit_cost: 100,
      estimated_cost: 100,
      status: "draft",
    }),
  });
  console.log("2. budget line vendor:", budgetRes[0].vendor);

  const ciRes = await rest("pai_assets", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      show_id: showId,
      asset_type: "document",
      subtype: "commercial_invoice",
      title: `CI — ${stamp}`,
      status: "active",
      metadata: { vendor_id: vendor.id, vendor_name: vendor.name, invoice_no: "WIRE-001" },
    }),
  });
  console.log("3. CI metadata vendor:", ciRes[0].metadata?.vendor_name);

  const shipRes = await rest("shipments", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      show_id: showId,
      direction: "inbound",
      origin: vendor.name,
      destination: "Stage 4",
      status: "preparing",
    }),
  });
  console.log("4. shipment origin (vendor):", shipRes[0].origin);

  const listed = await rest(`vendors?show_id=eq.${showId}&name=eq.${encodeURIComponent(stamp)}&select=id,name`);
  console.log("5. vendor listed:", listed.length === 1);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
