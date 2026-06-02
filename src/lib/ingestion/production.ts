/**
 * Default production tenant for Phase 3 (single-production dev).
 * Replace with session production scope when Auth + RBAC land.
 */
export function getDefaultProductionId(): string {
  const id = process.env.NEXT_PUBLIC_DEFAULT_PRODUCTION_ID;
  if (!id) {
    throw new Error("Missing NEXT_PUBLIC_DEFAULT_PRODUCTION_ID");
  }
  return id;
}
