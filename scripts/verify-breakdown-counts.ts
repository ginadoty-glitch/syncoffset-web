/**
 * Verify loadScriptHub-style counts after breakdown extraction.
 * Usage: npx tsx scripts/verify-breakdown-counts.ts
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
  const scripts = await rest(`production_scripts?show_id=eq.${showId}&select=id,title&order=updated_at.desc&limit=1`);
  const script = scripts[0];
  const scenes = await rest(`production_script_scenes?script_id=eq.${script.id}&select=id`);
  const items = await rest(`production_breakdown_items?script_id=eq.${script.id}&select=scene_id`);
  const byScene: Record<string, number> = {};
  for (const item of items) byScene[item.scene_id] = (byScene[item.scene_id] ?? 0) + 1;
  const scenesWithItems = Object.keys(byScene).length;
  console.log(
    JSON.stringify(
      {
        scriptId: script.id,
        title: script.title,
        sceneCount: scenes.length,
        breakdownItemCount: items.length,
        scenesWithItems,
        sampleSceneCounts: Object.entries(byScene)
          .slice(0, 5)
          .map(([sceneId, count]) => ({ sceneId, count })),
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
