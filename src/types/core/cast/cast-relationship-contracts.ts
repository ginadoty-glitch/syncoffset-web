/**
 * SyncOffset Cast Authority — relationship contracts (no execution logic)
 *
 * @see docs/SYNCOFFSET_CAST_AUTHORITY.md
 */

import type { CoreObjectKind } from "../kinds";
import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-registry";

export const CAST_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "scriptrevision-character",
    label: "Script Revision → Character",
    steps: [
      { nodeKind: "script-revision", relationshipKind: "derived-from" },
      { nodeKind: "character", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "character-castrequirement",
    label: "Character → Cast Requirement",
    steps: [
      { nodeKind: "character", relationshipKind: "requires" },
      { nodeKind: "cast-requirement", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "castrequirement-scene",
    label: "Cast Requirement → Scene",
    steps: [
      { nodeKind: "cast-requirement", relationshipKind: "scheduled-on" },
      { nodeKind: "scene", relationshipKind: "requires" },
    ],
  },
  {
    pathId: "castmember-castassignment",
    label: "Cast Member → Cast Assignment",
    steps: [
      { nodeKind: "cast-member", relationshipKind: "assigned-to" },
      { nodeKind: "cast-assignment", relationshipKind: "assigned-to" },
    ],
  },
  {
    pathId: "character-castassignment",
    label: "Character → Cast Assignment",
    steps: [
      { nodeKind: "character", relationshipKind: "assigned-to" },
      { nodeKind: "cast-assignment", relationshipKind: "assigned-to" },
    ],
  },
  {
    pathId: "castassignment-shootday",
    label: "Cast Assignment → Shoot Day",
    steps: [
      { nodeKind: "cast-assignment", relationshipKind: "scheduled-on" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
    ],
  },
  {
    pathId: "shootday-callsheet-cast",
    label: "Shoot Day → Callsheet",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
    notes: "Callsheet lists cast assignments for the day; ShootDay is calendar authority.",
  },
  {
    pathId: "scene-character-cast-chain",
    label: "Scene → Character → Cast Requirement → Cast Assignment",
    steps: [
      { nodeKind: "scene", relationshipKind: "requires" },
      { nodeKind: "character", relationshipKind: "requires" },
      { nodeKind: "cast-requirement", relationshipKind: "requires" },
      { nodeKind: "cast-assignment", relationshipKind: "assigned-to" },
    ],
  },
];

export const CAST_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  { kind: "derived-from", fromKind: "script-revision", toKind: "character", label: "Character from Script" },
  { kind: "derived-from", fromKind: "character", toKind: "cast-requirement", label: "Cast Requirement for Character" },
  { kind: "requires", fromKind: "cast-requirement", toKind: "scene", label: "Requirement on Scene" },
  { kind: "assigned-to", fromKind: "cast-member", toKind: "cast-assignment", label: "Performer on Assignment" },
  { kind: "assigned-to", fromKind: "character", toKind: "cast-assignment", label: "Character on Assignment" },
  { kind: "scheduled-on", fromKind: "cast-assignment", toKind: "shoot-day", label: "Assignment on Shoot Day" },
  { kind: "references", fromKind: "cast-assignment", toKind: "scene", label: "Assignment for Scene" },
];

export const CAST_MEMBER_RELATIONSHIP_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "cast-assignment", role: "fulfillment" },
  { kind: "shoot-day", role: "scheduled-day" },
  { kind: "scene", role: "scene-work" },
  { kind: "generated-output", role: "callsheet-output" },
];

export const CHARACTER_RELATIONSHIP_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "script-revision", role: "script-origin" },
  { kind: "scene", role: "appears-in" },
  { kind: "cast-requirement", role: "production-need" },
  { kind: "cast-assignment", role: "casting-fulfillment" },
];
