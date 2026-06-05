/** RUNTIME CLASSIFICATION: FINANCE — read-only production_check_requests; live Supabase only. */

import { CheckRequestsIndex } from "@/components/check-requests/check-requests-index";
import { loadCheckRequests } from "@/lib/check-requests/load-check-requests";

export const dynamic = "force-dynamic";

export default async function CheckRequestsPage() {
  const data = await loadCheckRequests();
  return <CheckRequestsIndex data={data} />;
}
