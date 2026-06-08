import { cookies } from "next/headers";

const COOKIE_KEY = "syncoffset_active_production";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export { COOKIE_KEY as ACTIVE_PRODUCTION_COOKIE };

/**
 * Resolve the active production ID from (in order):
 *   1. `syncoffset_active_production` cookie
 *   2. `NEXT_PUBLIC_DEFAULT_PRODUCTION_ID` env var
 *
 * Throws if neither source provides a valid UUID.
 */
export async function getActiveProductionId(): Promise<string> {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(COOKIE_KEY)?.value;

  if (fromCookie && UUID_RE.test(fromCookie)) {
    return fromCookie;
  }

  const fromEnv = process.env.NEXT_PUBLIC_DEFAULT_PRODUCTION_ID;
  if (fromEnv && UUID_RE.test(fromEnv)) {
    return fromEnv;
  }

  throw new Error(
    "No active production — set syncoffset_active_production cookie or NEXT_PUBLIC_DEFAULT_PRODUCTION_ID env var",
  );
}
