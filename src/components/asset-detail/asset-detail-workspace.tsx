import type { AssetWorkspaceData } from "@/lib/assets/load-asset-workspace";

import { AssetDetailHeader } from "./asset-detail-header";
import { AssetMovementHistoryPanel } from "./asset-movement-history-panel";
import { AssetWorkOrdersPanel } from "./asset-work-orders-panel";

export function AssetDetailWorkspace({ data }: { data: AssetWorkspaceData }) {
  const hasAsset = data.asset !== null;

  return (
    <div className="flex flex-col gap-8 pb-12">
      <AssetDetailHeader asset={data.asset} setId={data.setId} setName={data.setName} setNumber={data.setNumber} />

      <AssetWorkOrdersPanel
        workOrders={data.relatedWorkOrders}
        hasAsset={hasAsset}
        tablesAvailable={data.operationsTablesAvailable}
      />

      <AssetMovementHistoryPanel
        movements={data.movementHistory}
        hasAsset={hasAsset}
        tablesAvailable={data.operationsTablesAvailable}
      />
    </div>
  );
}
