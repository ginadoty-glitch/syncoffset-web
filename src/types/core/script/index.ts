/**
 * SyncOffset Script Authority Layer — barrel export
 *
 * Constitutional root: Script Revision → Scene → Breakdown → downstream graph
 */

export type { BreakdownCategory, BreakdownCategoryDefinition } from "./breakdown-category";
export { BREAKDOWN_CATEGORY_REGISTRY, isBreakdownCategory } from "./breakdown-category";
export type { BreakdownElement } from "./breakdown-element";
export type { RevisionChange } from "./revision-change";
export type { RevisionChangeKind, RevisionChangeKindDefinition } from "./revision-change-kind";
export { REVISION_CHANGE_KIND_REGISTRY } from "./revision-change-kind";
export type { Scene } from "./scene";
export type { SceneDayNight, SceneIntExt } from "./scene-type";
export {
  SCENE_RELATIONSHIP_HUB_TARGETS,
  SCRIPT_CANONICAL_RELATIONSHIP_PATHS,
  SCRIPT_RELATIONSHIP_SCHEMA_REGISTRY,
} from "./script-relationship-contracts";
export type { ScriptRevision } from "./script-revision";
export type { ScriptRevisionColor, ScriptRevisionColorDefinition, ScriptRevisionStatus } from "./script-status";
export { SCRIPT_REVISION_COLOR_REGISTRY } from "./script-status";
