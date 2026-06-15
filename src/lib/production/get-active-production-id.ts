import { cookies } from "next/headers";

import { createServiceClient } from "@/lib/supabase/server";

const COOKIE_KEY = "syncoffset_active_production";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export { COOKIE_KEY as ACTIVE_PRODUCTION_COOKIE };

/**
 * Verify a production ID exists and is not archived.
 * Returns the ID if valid, null otherwise.
 */
async function verifyActiveProduction(
  supabase: ReturnType<typeof createServiceClient>,
  id: string,
): Promise<string | null> {
  const { data } = await supabase.from("shows").select("id").eq("id", id).is("archived_at", null).maybeSingle();
  return data?.id ? (data.id as string) : null;
}

/**
 * Try to heal the cookie to a validated production ID.
 * Silently fails in Server Component context (read-only cookies).
 */
async function tryHealCookie(cookieStore: Awaited<ReturnType<typeof cookies>>, id: string): Promise<void> {
  try {
    cookieStore.set(COOKIE_KEY, id, { path: "/", maxAge: 60 * 60 * 24 * 30 });
  } catch {
    // Server Component context — cookie is read-only, healed on next action
  }
}

/**
 * Resolve the active production ID with archive-awareness.
 *
 * Resolution order:
 *   1. Cookie — if set and points to an active (non-archived) production
 *   2. Auto-select — if exactly one active production exists
 *   3. Env bootstrap — NEXT_PUBLIC_DEFAULT_PRODUCTION_ID, only if active
 *   4. Throw — requires explicit selection
 *
 * When multiple active productions exist and no valid cookie is set,
 * the user must explicitly select a production.
 */
export async function getActiveProductionId(): Promise<string> {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(COOKIE_KEY)?.value;

  let supabase: ReturnType<typeof createServiceClient>;
  try {
    supabase = createServiceClient();
  } catch {
    // Supabase not configured — fall back to env-only (dev bootstrap)
    const fromEnv = process.env.NEXT_PUBLIC_DEFAULT_PRODUCTION_ID;
    if (fromEnv && UUID_RE.test(fromEnv)) return fromEnv;
    throw new Error("No active production — Supabase is not configured.");
  }

  // 1. Cookie → validate against DB
  if (fromCookie && UUID_RE.test(fromCookie)) {
    const verified = await verifyActiveProduction(supabase, fromCookie);
    if (verified) return verified;
    // Cookie points to archived/deleted production — fall through
  }

  // 2. Auto-select if exactly one active production exists
  const { data: activeShows } = await supabase.from("shows").select("id").is("archived_at", null).limit(2);

  if (activeShows?.length === 1) {
    const onlyId = activeShows[0].id as string;
    await tryHealCookie(cookieStore, onlyId);
    return onlyId;
  }

  // 3. Env var bootstrap — only if the referenced production is active
  const fromEnv = process.env.NEXT_PUBLIC_DEFAULT_PRODUCTION_ID;
  if (fromEnv && UUID_RE.test(fromEnv)) {
    const verified = await verifyActiveProduction(supabase, fromEnv);
    if (verified) {
      await tryHealCookie(cookieStore, verified);
      return verified;
    }
  }

  // 4. No valid production found
  if (activeShows?.length === 0) {
    throw new Error("No active productions. Create or restore a production to continue.");
  }

  throw new Error("No production selected. Open a production from the Productions page.");
}
