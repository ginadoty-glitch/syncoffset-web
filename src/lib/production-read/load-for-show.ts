import { getDefaultProductionId } from "@/lib/ingestion/production";
import { isMissingRelation } from "@/lib/operations/is-missing-relation";
import { createClient } from "@/lib/supabase/server";

import { emptyReadResult, type ProductionReadResult } from "./empty-result";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function loadForShow<T>(
  table: string,
  select: string,
  order: { column: string; ascending?: boolean },
): Promise<ProductionReadResult<T>> {
  let showId: string;

  try {
    showId = getDefaultProductionId();
  } catch (error) {
    return emptyReadResult(error instanceof Error ? error.message : "Missing NEXT_PUBLIC_DEFAULT_PRODUCTION_ID.");
  }

  let supabase: SupabaseClient;

  try {
    supabase = await createClient();
  } catch (error) {
    return emptyReadResult(
      error instanceof Error ? error.message : "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
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
