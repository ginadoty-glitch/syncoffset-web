import { isMissingRelation } from "@/lib/operations/is-missing-relation";
import { getActiveProductionId } from "@/lib/production/get-active-production-id";
import { createServiceClient } from "@/lib/supabase/server";

import { emptyReadResult, type ProductionReadResult } from "./empty-result";

export async function loadForShow<T>(
  table: string,
  select: string,
  order: { column: string; ascending?: boolean },
): Promise<ProductionReadResult<T>> {
  let showId: string;

  try {
    showId = await getActiveProductionId();
  } catch (error) {
    return emptyReadResult(error instanceof Error ? error.message : "No active production selected.");
  }

  let supabase: ReturnType<typeof createServiceClient>;
  try {
    supabase = createServiceClient();
  } catch (error) {
    return emptyReadResult(error instanceof Error ? error.message : "Supabase not configured.");
  }

  const { data, error } = await supabase
    .from(table)
    .select(select)
    .eq("show_id", showId)
    .order(order.column, { ascending: order.ascending ?? true });

  if (isMissingRelation(error)) {
    return emptyReadResult(error?.message ?? `relation "${table}" does not exist`);
  }

  if (error) {
    return { showId, rows: [], loadError: error.message };
  }

  return { showId, rows: (data ?? []) as T[], loadError: null };
}
