import { getActiveProductionId } from "@/lib/production/get-active-production-id";
import { listProductions } from "@/server/production-actions";

import { ProductionsWorkspace } from "./_components/productions-workspace";

export const dynamic = "force-dynamic";

export default async function ProductionsPage() {
  const [productions, activeId] = await Promise.all([listProductions(), getActiveProductionId().catch(() => null)]);

  return <ProductionsWorkspace productions={productions} activeProductionId={activeId} />;
}
