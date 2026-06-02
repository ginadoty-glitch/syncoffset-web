import type { TransportOrderRow, WorkOrderRow } from "@/lib/operations/workspace-rows";
import type { AssetCategoryId } from "@/types/core/asset/asset-category";
import type { AssetStatus } from "@/types/core/asset/asset-status";
import type { DocumentCategory } from "@/types/core/document/document-category";
import type { DocumentStatus } from "@/types/core/document/document-status";
import type { SetStatus } from "@/types/core/scene/set";

/** Postgres row → constitutional ProductionSet shape for UI. */
export type ProductionSetRow = {
  id: string;
  production_id: string;
  kind: "set";
  status: SetStatus;
  set_number: string;
  set_name: string;
  related_scene_ids: string[];
  asset_ids: string[];
  location_ids: string[];
  budget_line_ids: string[];
  department_id: string | null;
  notes: string | null;
  /** Storage ref `set-photos/...` — workspace media, not Document Authority. */
  hero_image_url: string | null;
};

export type AssetRow = {
  id: string;
  asset_name: string;
  asset_number: string;
  status: AssetStatus;
  category_id: AssetCategoryId;
  set_id: string;
  photo_storage_ref: string | null;
  vendor_display_name: string | null;
  cost_display_amount: number | null;
};

export type SceneRow = {
  id: string;
  scene_number: string;
  description: string;
  episode_number: string;
  cast_count: number;
  asset_count: number;
};

export type SetDocumentItem = {
  id: string;
  title: string;
  category_id: DocumentCategory;
  status_id: DocumentStatus;
  uploadDate: string | null;
};

export type SetWorkspaceData = {
  setId: string;
  set: ProductionSetRow | null;
  /** Signed URL for header display when `hero_image_url` is set. */
  heroImageDisplayUrl: string | null;
  episode: string | null;
  assets: AssetRow[];
  scenes: SceneRow[];
  documents: SetDocumentItem[];
  /** Constitutional WorkOrder rows — open (non-completed) for this set. */
  openWorkOrders: WorkOrderRow[];
  /** TransportOrder rows pending delivery to this set. */
  pendingDeliveries: TransportOrderRow[];
  /** True when persistence tables are not deployed or query failed. */
  persistenceAvailable: boolean;
  operationsTablesAvailable: boolean;
};
