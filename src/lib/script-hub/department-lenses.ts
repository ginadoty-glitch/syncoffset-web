import type { DepartmentLensId, ScriptHubBreakdownItemRow } from "./types";

export type DepartmentLensDefinition = {
  id: Exclude<DepartmentLensId, "all">;
  label: string;
};

/** Client-side department lenses — one master breakdown, filter only. */
export const DEPARTMENT_LENSES: readonly DepartmentLensDefinition[] = [
  { id: "props", label: "Props" },
  { id: "set_decoration", label: "Set Decoration" },
  { id: "construction", label: "Construction" },
  { id: "paint", label: "Paint" },
  { id: "greens", label: "Greens" },
  { id: "costumes", label: "Costumes" },
  { id: "hair", label: "Hair" },
  { id: "makeup", label: "Makeup" },
  { id: "vehicles", label: "Vehicles" },
  { id: "background", label: "Background" },
  { id: "stunts", label: "Stunts" },
] as const;

function norm(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function haystack(item: ScriptHubBreakdownItemRow): string {
  return [item.department, item.category, item.item_slot].map(norm).filter(Boolean).join(" ");
}

function matchesAny(hay: string, patterns: string[]): boolean {
  return patterns.some((p) => hay.includes(p));
}

export function itemMatchesDepartmentLens(item: ScriptHubBreakdownItemRow, lens: DepartmentLensId): boolean {
  if (lens === "all") return true;

  const hay = haystack(item);

  switch (lens) {
    case "props":
      return matchesAny(hay, ["prop", "props"]);
    case "set_decoration":
      return matchesAny(hay, ["set decoration", "set dec", "set_dec", "set_dressing", "set dressing", "setdec"]);
    case "construction":
      return matchesAny(hay, ["construction"]);
    case "paint":
      return matchesAny(hay, ["paint"]);
    case "greens":
      return matchesAny(hay, ["green", "greens", "greenery"]);
    case "costumes":
      return matchesAny(hay, ["wardrobe", "costume", "costumes"]);
    case "hair":
      return matchesAny(hay, ["hair"]);
    case "makeup":
      return matchesAny(hay, ["makeup", "make-up", "mufx"]);
    case "vehicles":
      return matchesAny(hay, ["vehicle", "vehicles", "transport", "picture car", "picture_car"]);
    case "background":
      return matchesAny(hay, ["background", "bg", "extras", "atmos"]);
    case "stunts":
      return matchesAny(hay, ["stunt", "stunts"]);
    default:
      return true;
  }
}

export function filterItemsByDepartmentLens(
  items: ScriptHubBreakdownItemRow[],
  lens: DepartmentLensId,
): ScriptHubBreakdownItemRow[] {
  if (lens === "all") return items;
  return items.filter((item) => itemMatchesDepartmentLens(item, lens));
}
