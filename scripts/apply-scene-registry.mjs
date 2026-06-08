/**
 * Apply scene_registry migration via raw fetch to Supabase.
 * Executes DDL statements one at a time using the pg_net or direct REST workaround.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing env vars");
  process.exit(1);
}

const REST = `${SUPABASE_URL}/rest/v1`;
const H = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };
const HW = { ...H, "Content-Type": "application/json", Prefer: "return=minimal" };

// Check if table already exists
const probe = await fetch(`${REST}/scene_registry?select=id&limit=0`, { headers: H });
if (probe.ok) {
  console.log("scene_registry table already exists. Skipping migration.");
  const { rows } = await fetch(`${REST}/scene_registry?select=id`, { headers: H }).then(r => r.json()).then(d => ({ rows: d }));
  console.log(`Current rows: ${Array.isArray(rows) ? rows.length : 0}`);
  process.exit(0);
}

console.log("Table does not exist. Migration must be applied via SQL Editor.");
console.log("");
console.log("Instructions:");
console.log("1. Open https://supabase.com/dashboard/project/yddwznlclkcfqqgmorye/sql");
console.log("2. Paste the contents of: supabase/migrations/20260607000000_scene_registry.sql");
console.log("3. Click Run");
console.log("4. Re-run this script to verify");
console.log("");

// Output the SQL for easy copy
const fs = await import("node:fs");
const sql = fs.readFileSync("supabase/migrations/20260607000000_scene_registry.sql", "utf8");
console.log("=== SQL TO EXECUTE ===");
console.log(sql);
console.log("=== END SQL ===");
