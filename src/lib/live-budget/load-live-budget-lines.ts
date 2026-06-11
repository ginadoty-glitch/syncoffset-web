import { loadForShow } from "@/lib/production-read/load-for-show";

import type { ProductionBudgetLineRow } from "./types";

const SELECT =
  "id, show_id, source_type, source_id, category, department, description, vendor, quantity, unit_cost, estimated_cost, actual_cost, status, updated_at" as const;

export async function loadLiveBudgetLines() {
  return loadForShow<ProductionBudgetLineRow>("production_budget_lines", SELECT, {
    column: "updated_at",
    ascending: false,
  });
}
