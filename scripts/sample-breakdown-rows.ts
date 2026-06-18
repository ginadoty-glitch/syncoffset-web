import fs from "node:fs";
import path from "node:path";

const env: Record<string, string> = {};
for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

async function main() {
  const URL = env.NEXT_PUBLIC_SUPABASE_URL;
  const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
  const sid = "bd0ac278-e01d-4024-87af-e9dcd49b3ca3";
  const res = await fetch(
    `${URL}/rest/v1/production_breakdown_items?script_id=eq.${sid}&notes=eq.script-import-extract&select=id,label,category,department,notes,item_slot,scene_id&limit=5`,
    { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } },
  );
  console.log(JSON.stringify(await res.json(), null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
