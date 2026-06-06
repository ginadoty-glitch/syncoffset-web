/** RUNTIME CLASSIFICATION: PRODUCTION — read-only production_tasks; live Supabase only. */

import { TasksIndex } from "@/components/tasks/tasks-index";
import { loadProductionTasks } from "@/lib/tasks/load-production-tasks";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const data = await loadProductionTasks();
  return <TasksIndex data={data} />;
}
