/**
 * SyncOffset Script Authority — relationship contracts (no execution logic)
 *
 * Script Authority is the constitutional root of the production graph.
 * @see docs/SYNCOFFSET_SCRIPT_AUTHORITY.md
 */

import type { CoreObjectKind } from "../kinds";
import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-registry";

export const SCRIPT_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "scriptrevision-revisionchange",
    label: "Script Revision → Revision Change",
    steps: [
      { nodeKind: "script-revision", relationshipKind: "references" },
      { nodeKind: "revision-change", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "scriptrevision-scene",
    label: "Script Revision → Scene",
    steps: [
      { nodeKind: "script-revision", relationshipKind: "derived-from" },
      { nodeKind: "scene", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "revisionchange-scene",
    label: "Revision Change → Scene",
    steps: [
      { nodeKind: "revision-change", relationshipKind: "impacts" },
      { nodeKind: "scene", relationshipKind: "impacts" },
    ],
  },
  {
    pathId: "scene-breakdownelement",
    label: "Scene → Breakdown Element",
    steps: [
      { nodeKind: "scene", relationshipKind: "requires" },
      { nodeKind: "breakdown-element", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "scene-bgrequirement",
    label: "Scene → BG Requirement",
    steps: [
      { nodeKind: "scene", relationshipKind: "requires" },
      { nodeKind: "bg-requirement", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "breakdownelement-bgrequirement",
    label: "Breakdown Element → BG Requirement",
    steps: [
      { nodeKind: "breakdown-element", relationshipKind: "requires" },
      { nodeKind: "bg-requirement", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "scene-departmentpackage",
    label: "Scene → Department Package",
    steps: [
      { nodeKind: "scene", relationshipKind: "references" },
      { nodeKind: "department-package", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "breakdownelement-departmentpackage",
    label: "Breakdown Element → Department Package",
    steps: [
      { nodeKind: "breakdown-element", relationshipKind: "requires" },
      { nodeKind: "department-package", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "scene-location",
    label: "Scene → Location",
    steps: [
      { nodeKind: "scene", relationshipKind: "occurs-at" },
      { nodeKind: "location", relationshipKind: "occurs-at" },
    ],
  },
  {
    pathId: "scene-media",
    label: "Scene → Media",
    steps: [
      { nodeKind: "scene", relationshipKind: "attached-to" },
      { nodeKind: "media", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "scene-shootday",
    label: "Scene → Shoot Day",
    steps: [
      { nodeKind: "scene", relationshipKind: "scheduled-on" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
    ],
    notes: "Schedule and ShootDay consume scene authority; ShootDay does not define script content.",
  },
  {
    pathId: "script-hierarchy-to-operations",
    label: "Script Revision → Scene → Shoot Day → Operations",
    steps: [
      { nodeKind: "script-revision", relationshipKind: "derived-from" },
      { nodeKind: "scene", relationshipKind: "derived-from" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
      { nodeKind: "transport-order", relationshipKind: "depends-on" },
    ],
  },
];

export const SCRIPT_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  { kind: "derived-from", fromKind: "script-revision", toKind: "revision-change", label: "Changes between revisions" },
  { kind: "derived-from", fromKind: "script-revision", toKind: "scene", label: "Scenes in revision" },
  { kind: "impacts", fromKind: "revision-change", toKind: "scene", label: "Change impacts scene" },
  { kind: "derived-from", fromKind: "scene", toKind: "breakdown-element", label: "Breakdown from scene" },
  { kind: "derived-from", fromKind: "breakdown-element", toKind: "bg-requirement", label: "BG need from breakdown" },
  { kind: "derived-from", fromKind: "scene", toKind: "bg-requirement", label: "BG need from scene" },
  { kind: "derived-from", fromKind: "scene", toKind: "department-package", label: "Creative package from scene" },
  { kind: "derived-from", fromKind: "breakdown-element", toKind: "department-package", label: "Package from element" },
  { kind: "occurs-at", fromKind: "scene", toKind: "location", label: "Scene location" },
  { kind: "attached-to", fromKind: "scene", toKind: "media", label: "Scene media" },
  { kind: "scheduled-on", fromKind: "scene", toKind: "shoot-day", label: "Scene scheduled on day" },
];

/** Scene as central hub — documented relationship targets. */
export const SCENE_RELATIONSHIP_HUB_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "script-revision", role: "script-source" },
  { kind: "revision-change", role: "revision-impact" },
  { kind: "breakdown-element", role: "requirements" },
  { kind: "bg-requirement", role: "background-need" },
  { kind: "department-package", role: "creative-intent" },
  { kind: "location", role: "shoot-location" },
  { kind: "media", role: "scene-media" },
  { kind: "shoot-day", role: "scheduled-day" },
  { kind: "character", role: "scripted-character" },
  { kind: "cast-requirement", role: "cast-need" },
  { kind: "cast-member", role: "performer" },
  { kind: "cast-assignment", role: "cast-fulfillment" },
  { kind: "crew-requirement", role: "crew-need" },
  { kind: "crew-assignment", role: "crew-fulfillment" },
  { kind: "transport-order", role: "operations" },
];
