/**
 * Simulates Script Breakdown page header + per-scene item counts (loadScriptHub read path).
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
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };

async function rest(pathAndQuery: string) {
  const res = await fetch(`${URL}/rest/v1/${pathAndQuery}`, { headers });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  const scripts = await rest(
    `production_scripts?show_id=eq.${showId}&select=id,title,version_label&order=updated_at.desc&limit=1`,
  );
  const script = scripts[0];
  const scenes = await rest(
    `production_script_scenes?script_id=eq.${script.id}&select=id,scene_number,scene_heading&order=sort_order.asc`,
  );
  const items = await rest(`production_breakdown_items?script_id=eq.${script.id}&select=scene_id`);
  const itemCountBySceneId: Record<string, number> = {};
  for (const item of items) {
    itemCountBySceneId[item.scene_id] = (itemCountBySceneId[item.scene_id] ?? 0) + 1;
  }

  const header = `${scenes.length} scenes · ${items.length} breakdown items · ${script.title} · ${script.version_label ?? ""}`;
  console.log("=== Script Breakdown page header (simulated) ===");
  console.log(header);
  console.log("\n=== Per-scene breakdown item counts (first 8 rows) ===");
  for (const scene of scenes.slice(0, 8)) {
    const count = itemCountBySceneId[scene.id] ?? 0;
    console.log(`Scene ${scene.scene_number ?? "?"} · ${scene.scene_heading.slice(0, 50)} → ${count} items`);
  }
  console.log("\n=== Totals ===");
  console.log(JSON.stringify({ sceneCount: scenes.length, breakdownItemCount: items.length }, null, 2));
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
