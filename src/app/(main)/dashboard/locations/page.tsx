/** RUNTIME CLASSIFICATION: PRODUCTION — read-only locations; live Supabase only. */

import { LocationsIndex } from "@/components/locations/locations-index";
import { loadLocations } from "@/lib/locations/load-locations";

export const dynamic = "force-dynamic";

export default async function LocationsPage() {
  const data = await loadLocations();
  return <LocationsIndex data={data} />;
}
