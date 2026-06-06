export type UnitIndicatorKind = "main" | "second-unit" | "splinter-unit";

export type UnitIndicator = {
  kind: UnitIndicatorKind;
  label: string;
  className: string;
};

const UNIT_CLASS: Record<UnitIndicatorKind, string> = {
  main: "wall-unit-main",
  "second-unit": "wall-unit-second",
  "splinter-unit": "wall-unit-splinter",
};

export function resolveUnitIndicator(unitLabel: string): UnitIndicator | null {
  const normalized = unitLabel.trim();
  if (!normalized) return null;

  const upper = normalized.toUpperCase();

  if (upper.includes("SPLINTER")) {
    return { kind: "splinter-unit", label: normalized, className: UNIT_CLASS["splinter-unit"] };
  }

  if (upper.includes("2ND") || upper.includes("SECOND UNIT") || upper.includes("B2")) {
    return { kind: "second-unit", label: normalized, className: UNIT_CLASS["second-unit"] };
  }

  return { kind: "main", label: normalized, className: UNIT_CLASS.main };
}

export function isSecondOrSplinterUnit(unitLabel: string): boolean {
  const kind = resolveUnitIndicator(unitLabel)?.kind;
  return kind === "second-unit" || kind === "splinter-unit";
}
