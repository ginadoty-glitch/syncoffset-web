import type { SetWorkspaceData } from "@/lib/sets/workspace-types";

import { SetActivityTimeline } from "./set-activity-timeline";
import { SetAssetBoard } from "./set-asset-board";
import { SetDetailHeader } from "./set-detail-header";
import { SetDocumentsPanel } from "./set-documents-panel";
import { SetDrawingsPanel } from "./set-drawings-panel";
import { SetFinancialPanel } from "./set-financial-panel";
import { SetOpenWorkOrdersPanel } from "./set-open-work-orders-panel";
import { SetOperationalActions } from "./set-operational-actions";
import { SetOverviewCards } from "./set-overview-cards";
import { SetPendingDeliveriesPanel } from "./set-pending-deliveries-panel";
import { SetScenesPanel } from "./set-scenes-panel";
import { UploadSetPhoto } from "./upload-set-photo";

type SetOption = { id: string; setNumber: string; setName: string };

export function SetDetailWorkspace({ data, allSets }: { data: SetWorkspaceData; allSets: SetOption[] }) {
  const hasSet = data.set !== null;
  const currentSet = data.set ? { id: data.set.id, setNumber: data.set.set_number, setName: data.set.set_name } : null;

  return (
    <div className="flex flex-col gap-8 pb-12" data-content-padding="false">
      <SetDetailHeader set={data.set} episode={data.episode} heroImageDisplayUrl={data.heroImageDisplayUrl} />

      {hasSet && data.set && (
        <div className="flex flex-wrap items-center gap-2">
          <UploadSetPhoto setId={data.set.id} />
          <span className="text-muted-foreground text-xs">JPG, PNG, or WEBP · replaces current hero</span>
        </div>
      )}

      <SetOverviewCards assets={data.assets} documents={data.documents} scenes={data.scenes} hasSet={hasSet} />

      <SetOperationalActions hasSet={hasSet} currentSet={currentSet} allSets={allSets} />

      <div className="grid gap-8 lg:grid-cols-10">
        <div className="flex min-w-0 flex-col gap-10 lg:col-span-7">
          <SetAssetBoard assets={data.assets} hasSet={hasSet} />
          <SetDocumentsPanel documents={data.documents} hasSet={hasSet} />
          <SetScenesPanel scenes={data.scenes} hasSet={hasSet} />
          <SetDrawingsPanel documents={data.documents} hasSet={hasSet} />
          <SetPendingDeliveriesPanel
            deliveries={data.pendingDeliveries}
            hasSet={hasSet}
            tablesAvailable={data.operationsTablesAvailable}
          />
        </div>

        <aside className="flex flex-col gap-8 lg:col-span-3">
          <SetFinancialPanel />
          <SetOpenWorkOrdersPanel
            workOrders={data.openWorkOrders}
            hasSet={hasSet}
            tablesAvailable={data.operationsTablesAvailable}
          />
          <SetActivityTimeline />
        </aside>
      </div>
    </div>
  );
}
