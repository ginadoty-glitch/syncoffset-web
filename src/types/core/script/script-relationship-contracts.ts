/**
 * SyncOffset Script Authority — relationship contracts (no execution logic)
 *
 * Script Authority is the constitutional root of the production graph.
 * @see docs/SYNCOFFSET_SCRIPT_AUTHORITY.md
 */

import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-entry";

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
  { kind: "derived-from", fromKind: "breakdown-element", toKind: "bg-requirement", label: "BG need from breakdown" },
  { kind: "derived-from", fromKind: "scene", toKind: "department-package", label: "Creative package from scene" },
  { kind: "derived-from", fromKind: "breakdown-element", toKind: "department-package", label: "Package from element" },
];
