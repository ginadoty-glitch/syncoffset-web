/** RUNTIME CLASSIFICATION: PRODUCTION — read-only crew contacts; live Supabase only. */

import { CrewIndex } from "@/components/crew/crew-index";
import { loadCrewDirectory } from "@/lib/crew/load-crew-directory";
import { getActiveShow } from "@/lib/production/get-active-show";

export const dynamic = "force-dynamic";

export default async function CrewPage() {
  const [data, show] = await Promise.all([loadCrewDirectory(), getActiveShow()]);
  return <CrewIndex data={data} showName={show.name} />;
}
