/** RUNTIME CLASSIFICATION: PRODUCTION — read-only locations; live Supabase only. */

import { LocationsIndex } from "@/components/locations/locations-index";
import { loadLocations } from "@/lib/locations/load-locations";
import { getActiveShow } from "@/lib/production/get-active-show";

export const dynamic = "force-dynamic";

export default async function LocationsPage() {
  const [data, show] = await Promise.all([loadLocations(), getActiveShow()]);
  return <LocationsIndex data={data} showName={show.name} />;
}
