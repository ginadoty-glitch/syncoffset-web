export type ScriptImportKind = "full_script" | "revision_pages" | "pdf_breakdown";

export type ScriptSourceType = "pasted" | "uploaded" | "pdf_breakdown";

export type SceneStatus = "active" | "superseded" | "omitted";

export type BreakdownItemStatus = "draft" | "approved" | "ignored";

export type ScriptHubScriptSummary = {
  id: string;
  title: string;
  version_label: string;
  revision_color: string | null;
  show_id: string;
  updated_at: string;
  source_type: ScriptSourceType;
  import_kind: ScriptImportKind;
  previous_script_id: string | null;
  source_document_name: string | null;
};

export type ScriptHubSceneRow = {
  id: string;
  script_id: string;
  scene_number: string | null;
  scene_heading: string;
  location_name: string | null;
  time_of_day: string | null;
  sort_order: number;
  raw_text: string;
  scene_status: SceneStatus;
  change_summary: string | null;
  int_ext: string | null;
  episode: string | null;
  page_count: string | null;
  eighths: string | null;
};

export type ScriptHubBreakdownItemRow = {
  id: string;
  script_id: string;
  scene_id: string;
  label: string;
  department: string | null;
  category: string | null;
  element_type: string | null;
  status: BreakdownItemStatus;
  quantity: number;
  unit: string | null;
  estimated_unit_cost: number | null;
  notes: string | null;
  item_slot: string | null;
  source_column: string | null;
};

export type ScriptHubBudgetLink = {
  budgetLineId: string;
  status: string;
  estimated_cost: number;
};

export type ScriptHubData = {
  showId: string | null;
  scripts: ScriptHubScriptSummary[];
  selectedScript: ScriptHubScriptSummary | null;
  previousScriptTitle: string | null;
  scenes: ScriptHubSceneRow[];
  breakdownItems: ScriptHubBreakdownItemRow[];
  selectedSceneId: string | null;
  sceneCount: number;
  breakdownItemCount: number;
  budgetByItemId: Record<string, ScriptHubBudgetLink>;
  loadError: string | null;
};

export type DepartmentLensId =
  | "all"
  | "props"
  | "set_decoration"
  | "construction"
  | "paint"
  | "greens"
  | "costumes"
  | "hair"
  | "makeup"
  | "vehicles"
  | "background"
  | "stunts";
