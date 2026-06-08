import { getActiveProductionId } from "@/lib/production/get-active-production-id";

/**
 * Active production tenant — resolves from cookie, then env fallback.
 *
 * Previously synchronous and env-only (Phase 3 single-production dev).
 * Now delegates to getActiveProductionId() for cookie-based production switching.
 */
export async function getDefaultProductionId(): Promise<string> {
  return getActiveProductionId();
}
