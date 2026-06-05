/** RUNTIME CLASSIFICATION: PRODUCTION — read-only crew contacts; live Supabase only. */

import { CrewIndex } from "@/components/crew/crew-index";
import { loadCrewContacts } from "@/lib/crew/load-crew-contacts";

export const dynamic = "force-dynamic";

export default async function CrewPage() {
  const data = await loadCrewContacts();
  return <CrewIndex data={data} />;
}
