/** RUNTIME CLASSIFICATION: FINANCE — read-only production_check_requests; live Supabase only. */

import { CheckRequestsIndex } from "@/components/check-requests/check-requests-index";
import { loadCheckRequests } from "@/lib/check-requests/load-check-requests";
import { getActiveShow } from "@/lib/production/get-active-show";

export const dynamic = "force-dynamic";

export default async function CheckRequestsPage() {
  const [data, show] = await Promise.all([loadCheckRequests(), getActiveShow()]);
  return <CheckRequestsIndex data={data} showName={show.name} />;
}
