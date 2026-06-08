/** RUNTIME CLASSIFICATION: FINANCE — read-only production_budget_lines; live Supabase only. */

import { LiveBudgetIndex } from "@/components/live-budget/live-budget-index";
import { loadLiveBudgetLines } from "@/lib/live-budget/load-live-budget-lines";
import { getActiveShow } from "@/lib/production/get-active-show";

export const dynamic = "force-dynamic";

export default async function LiveBudgetPage() {
  const [data, show] = await Promise.all([loadLiveBudgetLines(), getActiveShow()]);
  return <LiveBudgetIndex data={data} showName={show.name} />;
}
