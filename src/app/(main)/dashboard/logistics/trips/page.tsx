/** RUNTIME CLASSIFICATION: PRODUCTION — read-only trips + trip_stops; live Supabase only. */

import { TripsIndex } from "@/components/trips/trips-index";
import { loadTrips } from "@/lib/trips/load-trips";

export const dynamic = "force-dynamic";

export default async function TripsPage() {
  const data = await loadTrips();
  return <TripsIndex data={data} />;
}
