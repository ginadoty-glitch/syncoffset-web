/**
 * Backfill auto-extracted breakdown items for the latest script on the active show.
 * Usage: npx tsx scripts/backfill-breakdown-items.ts
 */

import {
  BREAKDOWN_EXTRACT_NOTE,
  extractBreakdownItemsFromScene,
} from "../src/lib/script/extract-breakdown-items-from-scene";
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

if (!URL || !KEY || !showId) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or NEXT_PUBLIC_DEFAULT_PRODUCTION_ID");
  process.exit(1);
}

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

async function rest(pathAndQuery: string, init: RequestInit = {}) {
  const res = await fetch(`${URL}/rest/v1/${pathAndQuery}`, { headers, ...init });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
}

async function count(table: string, filter: string) {
  const res = await fetch(`${URL}/rest/v1/${table}?${filter}&select=id`, {
    headers: { ...headers, Prefer: "count=exact", Range: "0-0" },
  });
  if (!res.ok) throw new Error(`${table} count ${res.status}`);
  const range = res.headers.get("content-range") ?? "*/0";
  return Number.parseInt(range.split("/")[1] ?? "0", 10);
}

async function main() {
  const scripts = await rest(
    `production_scripts?show_id=eq.${showId}&select=id,title,updated_at&order=updated_at.desc&limit=1`,
  );
  if (!scripts?.[0]) {
    console.error("No script found for show", showId);
    process.exit(1);
  }

  const script = scripts[0];
  const beforeScenes = await count("production_script_scenes", `script_id=eq.${script.id}`);
  const beforeItems = await count("production_breakdown_items", `script_id=eq.${script.id}`);

  console.log("BEFORE");
  console.log("  script_id:", script.id);
  console.log("  title:", script.title);
  console.log("  scenes:", beforeScenes);
  console.log("  breakdown_items:", beforeItems);

  const scenes = await rest(
    `production_script_scenes?script_id=eq.${script.id}&select=id,script_id,scene_number,scene_heading,location_name,raw_text,breakdown_draft&order=sort_order.asc`,
  );

  await rest(
    `production_breakdown_items?script_id=eq.${script.id}&notes=eq.${encodeURIComponent(BREAKDOWN_EXTRACT_NOTE)}`,
    {
      method: "DELETE",
    },
  );

  const insertRows = (scenes as Array<Record<string, unknown>>).flatMap((scene) =>
    extractBreakdownItemsFromScene({
      scene_number: (scene.scene_number as string | null) ?? null,
      scene_heading: String(scene.scene_heading ?? ""),
      location_name: (scene.location_name as string | null) ?? null,
      raw_text: String(scene.raw_text ?? ""),
      breakdown_draft: (scene.breakdown_draft as Record<string, unknown>) ?? {},
    }).map((item) => ({
      script_id: script.id,
      scene_id: scene.id,
      label: item.label,
      category: item.category,
      department: item.department,
      status: "draft",
      quantity: item.quantity,
      notes: item.notes,
      item_slot: item.item_slot,
    })),
  );

  let inserted = 0;
  if (insertRows.length > 0) {
    const created = await rest("production_breakdown_items", {
      method: "POST",
      body: JSON.stringify(insertRows),
    });
    inserted = Array.isArray(created) ? created.length : 0;
  }

  const afterItems = await count("production_breakdown_items", `script_id=eq.${script.id}`);
  const sample = await rest(
    `production_breakdown_items?script_id=eq.${script.id}&select=id,scene_id,label,category,department,quantity,notes,item_slot&limit=3`,
  );

  console.log("\nAFTER");
  console.log("  scenes:", scenes.length);
  console.log("  breakdown_items:", afterItems);
  console.log("  inserted_this_run:", inserted);

  console.log("\nEXAMPLE RECORDS");
  console.log(JSON.stringify(sample, null, 2));
}

main().catch((e) => {
  console.error("ERR:", e.message);
  process.exit(1);
});
