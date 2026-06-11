import { BudgetWorkspace } from "@/components/budget/budget-workspace";
import { loadLiveBudgetLines } from "@/lib/live-budget/load-live-budget-lines";
import { getActiveShow } from "@/lib/production/get-active-show";

export const dynamic = "force-dynamic";

export default async function BudgetPage() {
  const [data, show] = await Promise.all([loadLiveBudgetLines(), getActiveShow()]);
  return <BudgetWorkspace rows={data.rows} showName={show.name} loadError={data.loadError} />;
}
