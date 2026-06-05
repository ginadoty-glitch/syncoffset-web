/** RUNTIME CLASSIFICATION: PRODUCTION — read-only production_tasks; live Supabase only. */

import { OperationsIndex } from "@/components/operations/operations-index";
import { loadProductionTasks } from "@/lib/operations/load-production-tasks";

export const dynamic = "force-dynamic";

export default async function OperationsPage() {
  const data = await loadProductionTasks();
  return <OperationsIndex data={data} />;
}
