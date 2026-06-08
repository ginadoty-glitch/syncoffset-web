/** RUNTIME CLASSIFICATION: PRODUCTION — read-only production_tasks; live Supabase only. */

import { OperationsIndex } from "@/components/operations/operations-index";
import { loadProductionTasks } from "@/lib/operations/load-production-tasks";
import { getActiveShow } from "@/lib/production/get-active-show";

export const dynamic = "force-dynamic";

export default async function OperationsPage() {
  const [data, show] = await Promise.all([loadProductionTasks(), getActiveShow()]);
  return <OperationsIndex data={data} showName={show.name} />;
}
