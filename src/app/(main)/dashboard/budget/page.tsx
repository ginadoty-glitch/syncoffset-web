import { BudgetWorkspace } from "@/components/budget/budget-workspace";
import { loadLiveBudgetLines } from "@/lib/live-budget/load-live-budget-lines";
import { getActiveShow } from "@/lib/production/get-active-show";
import { loadVendors } from "@/lib/vendors/load-vendors";

export const dynamic = "force-dynamic";

export default async function BudgetPage() {
  const [data, show, vendors] = await Promise.all([loadLiveBudgetLines(), getActiveShow(), loadVendors()]);
  return <BudgetWorkspace rows={data.rows} vendors={vendors.rows} showName={show.name} loadError={data.loadError} />;
}
