import { isMissingRelation } from "@/lib/operations/is-missing-relation";
import type { TransportOrderRow, WorkOrderRow } from "@/lib/operations/workspace-rows";
import type { AssetRow } from "@/lib/sets/workspace-types";
import { createServiceClient } from "@/lib/supabase/server";

export type AssetWorkspaceData = {
  assetId: string;
  asset: AssetRow | null;
  setId: string | null;
  setName: string | null;
  setNumber: string | null;
  relatedWorkOrders: WorkOrderRow[];
  movementHistory: TransportOrderRow[];
  persistenceAvailable: boolean;
  operationsTablesAvailable: boolean;
};

export async function loadAssetWorkspace(assetId: string): Promise<AssetWorkspaceData> {
  const empty: AssetWorkspaceData = {
    assetId,
    asset: null,
    setId: null,
    setName: null,
    setNumber: null,
    relatedWorkOrders: [],
    movementHistory: [],
    persistenceAvailable: false,
    operationsTablesAvailable: false,
  };

  let supabase: ReturnType<typeof createServiceClient>;
  try {
    supabase = createServiceClient();
  } catch {
    return empty;
  }

  const { data: assetRow, error: assetError } = await supabase
    .from("assets")
    .select("*")
    .eq("id", assetId)
    .maybeSingle();

  if (isMissingRelation(assetError)) {
    return empty;
  }

  if (assetError || !assetRow) {
    return { ...empty, persistenceAvailable: !assetError };
  }

  const asset = assetRow as AssetRow;

  const [setResult, workOrdersResult, transportResult] = await Promise.all([
    supabase.from("production_sets").select("set_name, set_number").eq("id", asset.set_id).maybeSingle(),
    supabase
      .from("work_orders")
      .select("id, title, assigned_to, status_id, priority_id, required_by_date, work_order_number")
      .eq("asset_id", assetId)
      .order("required_by_date", { ascending: true, nullsFirst: false }),
    supabase
      .from("transport_orders")
      .select("id, ref, title, origin_label, destination_label, status, assigned_driver, completed_at, created_at")
      .eq("asset_id", assetId)
      .order("completed_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false }),
  ]);

  const workOrdersMissing = isMissingRelation(workOrdersResult.error);
  const transportMissing = isMissingRelation(transportResult.error);

  const setMeta = setResult.data as { set_name: string; set_number: string } | null;

  return {
    assetId,
    asset,
    setId: asset.set_id,
    setName: setMeta?.set_name ?? null,
    setNumber: setMeta?.set_number ?? null,
    relatedWorkOrders: workOrdersMissing ? [] : ((workOrdersResult.data ?? []) as WorkOrderRow[]),
    movementHistory: transportMissing ? [] : ((transportResult.data ?? []) as TransportOrderRow[]),
    persistenceAvailable: true,
    operationsTablesAvailable: !workOrdersMissing && !transportMissing,
  };
}
