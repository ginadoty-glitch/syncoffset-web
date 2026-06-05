import { loadForShow } from "@/lib/production-read/load-for-show";

import type { ProductionTaskRow } from "./types";

const SELECT =
  "id, show_id, title, notes, status, priority, due_at, assignee_name, link_type, linked_id, updated_at" as const;

export async function loadProductionTasks() {
  return loadForShow<ProductionTaskRow>("production_tasks", SELECT, { column: "updated_at", ascending: false });
}
