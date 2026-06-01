/**
 * SyncOffset Script Authority — status and revision color vocabulary
 */

/** Lifecycle of a script revision authority record. */
export type ScriptRevisionStatus = "draft" | "active" | "locked" | "superseded" | "archived";

/**
 * Revision color / phase — includes draft and shooting script markers
 * plus standard WGA revision colors.
 */
export type ScriptRevisionColor =
  | "draft"
  | "shooting"
  | "white"
  | "blue"
  | "pink"
  | "yellow"
  | "green"
  | "goldenrod"
  | "buff"
  | "salmon"
  | "cherry"
  | "tan"
  | "gray"
  | "ivory"
  | "custom";

export type ScriptRevisionColorDefinition = {
  readonly color: ScriptRevisionColor;
  readonly label: string;
  readonly isDraftPhase: boolean;
  readonly isShootingPhase: boolean;
};

export const SCRIPT_REVISION_COLOR_REGISTRY: Record<ScriptRevisionColor, ScriptRevisionColorDefinition> = {
  draft: { color: "draft", label: "Draft Script", isDraftPhase: true, isShootingPhase: false },
  shooting: {
    color: "shooting",
    label: "Shooting Script",
    isDraftPhase: false,
    isShootingPhase: true,
  },
  white: { color: "white", label: "White", isDraftPhase: false, isShootingPhase: false },
  blue: { color: "blue", label: "Blue", isDraftPhase: false, isShootingPhase: false },
  pink: { color: "pink", label: "Pink", isDraftPhase: false, isShootingPhase: false },
  yellow: { color: "yellow", label: "Yellow", isDraftPhase: false, isShootingPhase: false },
  green: { color: "green", label: "Green", isDraftPhase: false, isShootingPhase: false },
  goldenrod: { color: "goldenrod", label: "Goldenrod", isDraftPhase: false, isShootingPhase: false },
  buff: { color: "buff", label: "Buff", isDraftPhase: false, isShootingPhase: false },
  salmon: { color: "salmon", label: "Salmon", isDraftPhase: false, isShootingPhase: false },
  cherry: { color: "cherry", label: "Cherry", isDraftPhase: false, isShootingPhase: false },
  tan: { color: "tan", label: "Tan", isDraftPhase: false, isShootingPhase: false },
  gray: { color: "gray", label: "Gray", isDraftPhase: false, isShootingPhase: false },
  ivory: { color: "ivory", label: "Ivory", isDraftPhase: false, isShootingPhase: false },
  custom: { color: "custom", label: "Custom", isDraftPhase: false, isShootingPhase: false },
};
