/** RUNTIME CLASSIFICATION: PRODUCTION — read-only trips + trip_stops; live Supabase only. */

import { TripsIndex } from "@/components/trips/trips-index";
import { getActiveShow } from "@/lib/production/get-active-show";
import { loadTrips } from "@/lib/trips/load-trips";

export const dynamic = "force-dynamic";

export default async function TripsPage() {
  const [data, show] = await Promise.all([loadTrips(), getActiveShow()]);
  return <TripsIndex data={data} showName={show.name} />;
}
