/** RUNTIME CLASSIFICATION: PRODUCTION — read-only crew contacts; live Supabase only. */

import { CrewIndex } from "@/components/crew/crew-index";
import { loadCrewDirectory } from "@/lib/crew/load-crew-directory";

export const dynamic = "force-dynamic";

export default async function CrewPage() {
  const data = await loadCrewDirectory();
  return <CrewIndex data={data} />;
}
