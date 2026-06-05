/** RUNTIME CLASSIFICATION: FINANCE — read-only production_budget_lines; live Supabase only. */

import { LiveBudgetIndex } from "@/components/live-budget/live-budget-index";
import { loadLiveBudgetLines } from "@/lib/live-budget/load-live-budget-lines";

export const dynamic = "force-dynamic";

export default async function LiveBudgetPage() {
  const data = await loadLiveBudgetLines();
  return <LiveBudgetIndex data={data} />;
}
