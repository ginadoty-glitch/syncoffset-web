import type { DocumentRow } from "@/lib/ingestion/document-rows";
import { isMissingRelation } from "@/lib/operations/is-missing-relation";
import {
  CLOSED_WORK_ORDER_STATUSES,
  SETTLED_TRANSPORT_STATUSES,
  type TransportOrderRow,
  type WorkOrderRow,
} from "@/lib/operations/workspace-rows";
import { resolveHeroImageDisplayUrl } from "@/lib/sets/hero-photo";
import type {
  AssetRow,
  ProductionSetRow,
  SceneRow,
  SetDocumentItem,
  SetWorkspaceData,
} from "@/lib/sets/workspace-types";
import { createServiceClient } from "@/lib/supabase/server";

export async function loadSetWorkspace(setId: string): Promise<SetWorkspaceData> {
  const empty: SetWorkspaceData = {
    setId,
    set: null,
    heroImageDisplayUrl: null,
    episode: null,
    assets: [],
    scenes: [],
    documents: [],
    openWorkOrders: [],
    pendingDeliveries: [],
    persistenceAvailable: false,
    operationsTablesAvailable: false,
  };

  let supabase: ReturnType<typeof createServiceClient>;
  try {
    supabase = createServiceClient();
  } catch {
    return empty;
  }

  const { data: setRow, error: setError } = await supabase
    .from("production_sets")
    .select("*")
    .eq("id", setId)
    .maybeSingle();

  if (isMissingRelation(setError)) {
    return empty;
  }

  if (setError || !setRow) {
    return { ...empty, persistenceAvailable: !setError };
  }

  const set = setRow as ProductionSetRow;
  const heroImageUrl = (setRow as { hero_image_url?: string | null }).hero_image_url ?? null;

  const [heroImageDisplayUrl, assetsResult, scenesResult, documentsResult, workOrdersResult, transportResult] =
    await Promise.all([
      resolveHeroImageDisplayUrl(heroImageUrl),
      supabase.from("assets").select("*").eq("set_id", setId).order("asset_name"),
      supabase.from("scenes").select("*").eq("set_id", setId).order("scene_number"),
      supabase.from("documents").select("*").eq("set_id", setId).order("created_at", { ascending: false }),
      supabase
        .from("work_orders")
        .select("id, title, assigned_to, status_id, priority_id, required_by_date, work_order_number")
        .eq("set_id", setId)
        .order("required_by_date", { ascending: true, nullsFirst: false }),
      supabase
        .from("transport_orders")
        .select("id, ref, title, origin_label, destination_label, status, assigned_driver, completed_at, created_at")
        .eq("set_id", setId)
        .order("created_at", { ascending: false }),
    ]);

  const assets = isMissingRelation(assetsResult.error) ? [] : ((assetsResult.data ?? []) as AssetRow[]);
  const scenes = isMissingRelation(scenesResult.error) ? [] : ((scenesResult.data ?? []) as SceneRow[]);
  const documents = isMissingRelation(documentsResult.error)
    ? []
    : mapDocuments((documentsResult.data ?? []) as DocumentRow[]);

  const episode = scenes[0]?.episode_number?.trim() || null;

  const workOrdersMissing = isMissingRelation(workOrdersResult.error);
  const transportMissing = isMissingRelation(transportResult.error);
  const operationsTablesAvailable = !workOrdersMissing && !transportMissing;

  const allWorkOrders = workOrdersMissing ? [] : ((workOrdersResult.data ?? []) as WorkOrderRow[]);
  const openWorkOrders = allWorkOrders.filter((wo) => !CLOSED_WORK_ORDER_STATUSES.includes(wo.status_id));

  const allTransport = transportMissing ? [] : ((transportResult.data ?? []) as TransportOrderRow[]);
  const pendingDeliveries = allTransport.filter((t) => !SETTLED_TRANSPORT_STATUSES.includes(t.status));

  return {
    setId,
    set: { ...set, hero_image_url: heroImageUrl },
    heroImageDisplayUrl,
    episode,
    assets,
    scenes,
    documents,
    openWorkOrders,
    pendingDeliveries,
    persistenceAvailable: true,
    operationsTablesAvailable,
  };
}

function mapDocuments(rows: DocumentRow[]): SetDocumentItem[] {
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    category_id: row.category_id,
    status_id: row.status_id,
    uploadDate: row.created_at,
  }));
}
