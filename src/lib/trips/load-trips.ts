import { getDefaultProductionId } from "@/lib/ingestion/production";
import { isMissingRelation } from "@/lib/operations/is-missing-relation";
import { emptyReadResult, type ProductionReadResult } from "@/lib/production-read/empty-result";
import { createClient } from "@/lib/supabase/server";

import type { TripRow, TripStopRow } from "./types";

const TRIP_SELECT = "id, show_id, driver_sub, designation, status, po_number, ros, created_at, updated_at" as const;

const STOP_SELECT = "id, trip_id, kind, vendor_name, address, status, position, notes" as const;

export async function loadTrips(): Promise<ProductionReadResult<TripRow>> {
  let showId: string;

  try {
    showId = getDefaultProductionId();
  } catch (error) {
    return emptyReadResult(error instanceof Error ? error.message : "Missing NEXT_PUBLIC_DEFAULT_PRODUCTION_ID.");
  }

  let supabase: Awaited<ReturnType<typeof createClient>>;
  try {
    supabase = await createClient();
  } catch (error) {
    return emptyReadResult(
      error instanceof Error ? error.message : "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  const { data: tripRows, error: tripError } = await supabase
    .from("trips")
    .select(TRIP_SELECT)
    .eq("show_id", showId)
    .order("updated_at", { ascending: false });

  if (isMissingRelation(tripError)) {
    return emptyReadResult("Trips persistence is not available on this project.");
  }

  if (tripError) {
    return { showId, rows: [], loadError: tripError.message };
  }

  const trips = tripRows ?? [];
  const tripIds = trips.map((t) => t.id as string);

  let stops: TripStopRow[] = [];

  if (tripIds.length > 0) {
    const { data: stopRows, error: stopError } = await supabase
      .from("trip_stops")
      .select(STOP_SELECT)
      .in("trip_id", tripIds)
      .order("position", { ascending: true });

    if (stopError && !isMissingRelation(stopError)) {
      return { showId, rows: [], loadError: stopError.message };
    }

    stops = (stopRows ?? []) as TripStopRow[];
  }

  const stopsByTrip = new Map<string, TripStopRow[]>();
  for (const stop of stops) {
    const list = stopsByTrip.get(stop.trip_id) ?? [];
    list.push(stop);
    stopsByTrip.set(stop.trip_id, list);
  }

  const rows: TripRow[] = trips.map((trip) => ({
    ...(trip as Omit<TripRow, "stops">),
    stops: stopsByTrip.get(trip.id as string) ?? [],
  }));

  return { showId, rows, loadError: null };
}
