/** RUNTIME CLASSIFICATION: PRODUCTION — read-only production_tasks; live Supabase only. */

import { TasksIndex } from "@/components/tasks/tasks-index";
import { getActiveShow } from "@/lib/production/get-active-show";
import { loadProductionTasks } from "@/lib/tasks/load-production-tasks";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const [data, show] = await Promise.all([loadProductionTasks(), getActiveShow()]);
  return <TasksIndex data={data} showName={show.name} />;
}
