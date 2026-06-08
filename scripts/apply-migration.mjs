/**
 * Apply scene_registry migration using direct Postgres connection.
 * The Supabase database password is derived from the JWT secret in the service role key.
 * Connection uses the pooler endpoint.
 */

import pg from "pg";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing env vars. Source .env.local first.");
  process.exit(1);
}

const projectRef = new URL(SUPABASE_URL).hostname.split(".")[0];

// Try transaction-mode pooler connection (port 6543)
// Password must be provided via DB_PASSWORD env or prompt
const DB_PASSWORD = process.env.DB_PASSWORD;
if (!DB_PASSWORD) {
  console.error("Set DB_PASSWORD env var to your Supabase database password.");
  console.error("Find it at: https://supabase.com/dashboard/project/" + projectRef + "/settings/database");
  console.error("");
  console.error('Usage: DB_PASSWORD="your-password" node scripts/apply-migration.mjs');
  process.exit(1);
}

const connString = `postgresql://postgres.${projectRef}:${encodeURIComponent(DB_PASSWORD)}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;

const sql = readFileSync(resolve(__dirname, "../supabase/migrations/20260607000000_scene_registry.sql"), "utf-8");

const client = new pg.Client({ connectionString: connString, ssl: { rejectUnauthorized: false } });

try {
  console.log("Connecting to database...");
  await client.connect();
  console.log("Connected. Applying migration...\n");
  await client.query(sql);
  console.log("✓ Migration applied successfully.\n");

  // Verify table exists
  const { rows } = await client.query(
    "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'scene_registry' ORDER BY ordinal_position"
  );
  console.log("scene_registry columns:");
  for (const r of rows) {
    console.log(`  ${r.column_name.padEnd(24)} ${r.data_type.padEnd(20)} ${r.is_nullable === "YES" ? "NULL" : "NOT NULL"}`);
  }
} catch (err) {
  console.error("Migration failed:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
