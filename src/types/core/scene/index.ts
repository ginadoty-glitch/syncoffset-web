/**
 * SyncOffset Scene Authority Layer — barrel export
 *
 * Scene — central production unit
 * ProductionSet — container supporting scenes (not parent authority)
 * BudgetRequirement — budget need from breakdown (no calculations here)
 */

export type { BudgetRequirement, BudgetRequirementStatus } from "./budget-requirement";
export type { Scene } from "./scene";
export type { InteriorExterior, SceneRevisionColor, TimeOfDay } from "./scene-production";
export {
  SCENE_CANONICAL_RELATIONSHIP_PATHS,
  SCENE_RELATIONSHIP_HUB_TARGETS,
  SCENE_RELATIONSHIP_SCHEMA_REGISTRY,
} from "./scene-relationship-contracts";
export type { ProductionSet, SetStatus } from "./set";
