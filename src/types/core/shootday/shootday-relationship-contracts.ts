/**
 * SyncOffset Shoot Day Authority — relationship contracts (no execution logic)
 *
 * @see docs/SYNCOFFSET_SHOOTDAY_AUTHORITY_V2.md
 */

import type { CoreObjectKind } from "../kinds";
import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-entry";

export const SHOOTDAY_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "production-execution",
    label: "Scene → Shoot Day",
    steps: [
      { nodeKind: "scene", relationshipKind: "scheduled-on" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
    ],
    notes: "Scene owns scheduling intent — Shoot Day executes reality (Rule 1).",
  },
  {
    pathId: "department-execution",
    label: "Crew Requirement → Crew Assignment → Shoot Day",
    steps: [
      { nodeKind: "crew-requirement", relationshipKind: "derived-from" },
      { nodeKind: "crew-assignment", relationshipKind: "assigned-to" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
    ],
  },
  {
    pathId: "asset-execution",
    label: "Asset → Shoot Day",
    steps: [
      { nodeKind: "asset", relationshipKind: "references" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
    ],
    notes: "Often via asset-assignment or shootday-assignment participation records.",
  },
  {
    pathId: "location-execution",
    label: "Location → Shoot Day",
    steps: [
      { nodeKind: "location", relationshipKind: "occurs-at" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
    ],
  },
  {
    pathId: "full-production-day",
    label: "Script Revision → Scene → Shoot Day",
    steps: [
      { nodeKind: "script-revision", relationshipKind: "derived-from" },
      { nodeKind: "scene", relationshipKind: "derived-from" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
    ],
  },
  {
    pathId: "shootday-shootdayassignment",
    label: "Shoot Day → ShootDay Assignment",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "derived-from" },
      { nodeKind: "shootday-assignment", relationshipKind: "derived-from" },
    ],
    notes: "Assignments are participation only — not ownership (Rule 3).",
  },
  {
    pathId: "shootday-shootdaypackage",
    label: "Shoot Day → ShootDay Package",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "attached-to" },
      { nodeKind: "shootday-package", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "shootday-generatedoutput",
    label: "Shoot Day → Generated Output",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
  },
  {
    pathId: "shootday-scene",
    label: "Shoot Day → Scene",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "references" },
      { nodeKind: "scene", relationshipKind: "scheduled-on" },
    ],
    notes: "Execution participation — Scene retains scheduling ownership (Rule 1).",
  },
  {
    pathId: "shootday-set",
    label: "Shoot Day → Set",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "references" },
      { nodeKind: "set", relationshipKind: "references" },
    ],
  },
  {
    pathId: "shootday-location",
    label: "Shoot Day → Location",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "occurs-at" },
      { nodeKind: "location", relationshipKind: "occurs-at" },
    ],
  },
  {
    pathId: "shootday-asset",
    label: "Shoot Day → Asset",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "references" },
      { nodeKind: "asset", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "shootday-cast",
    label: "Shoot Day → Cast",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "references" },
      { nodeKind: "cast-assignment", relationshipKind: "scheduled-on" },
    ],
  },
  {
    pathId: "shootday-background",
    label: "Shoot Day → Background",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "references" },
      { nodeKind: "bg-assignment", relationshipKind: "scheduled-on" },
    ],
  },
  {
    pathId: "shootday-crew",
    label: "Shoot Day → Crew",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "references" },
      { nodeKind: "crew-assignment", relationshipKind: "scheduled-on" },
    ],
  },
];

export const SHOOTDAY_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  { kind: "scheduled-on", fromKind: "scene", toKind: "shoot-day", label: "Scene on Shoot Day" },
  { kind: "references", fromKind: "shoot-day", toKind: "scene", label: "Shoot Day executes Scene" },
  { kind: "references", fromKind: "shoot-day", toKind: "set", label: "Shoot Day executes Set" },
  { kind: "occurs-at", fromKind: "shoot-day", toKind: "location", label: "Shoot Day at Location" },
  { kind: "references", fromKind: "shoot-day", toKind: "asset", label: "Shoot Day Asset" },
  { kind: "references", fromKind: "shoot-day", toKind: "cast-assignment", label: "Shoot Day Cast" },
  { kind: "references", fromKind: "shoot-day", toKind: "bg-assignment", label: "Shoot Day Background" },
  { kind: "references", fromKind: "shoot-day", toKind: "crew-assignment", label: "Shoot Day Crew" },
  { kind: "derived-from", fromKind: "shoot-day", toKind: "shootday-assignment", label: "Shoot Day Assignment" },
  { kind: "attached-to", fromKind: "shoot-day", toKind: "shootday-package", label: "Shoot Day Package" },
  { kind: "generated-from", fromKind: "shoot-day", toKind: "generated-output", label: "Shoot Day Generated Output" },
  { kind: "references", fromKind: "shootday-assignment", toKind: "scene", label: "Scene participation" },
  { kind: "references", fromKind: "shootday-assignment", toKind: "set", label: "Set participation" },
  { kind: "references", fromKind: "shootday-assignment", toKind: "location", label: "Location participation" },
  { kind: "references", fromKind: "shootday-assignment", toKind: "asset", label: "Asset participation" },
  {
    kind: "references",
    fromKind: "shootday-assignment",
    toKind: "cast-assignment",
    label: "Cast participation",
  },
  {
    kind: "references",
    fromKind: "shootday-assignment",
    toKind: "bg-assignment",
    label: "Background participation",
  },
  {
    kind: "references",
    fromKind: "shootday-assignment",
    toKind: "crew-assignment",
    label: "Crew participation",
  },
  { kind: "scheduled-on", fromKind: "crew-assignment", toKind: "shoot-day", label: "Crew Assignment on Day" },
  { kind: "scheduled-on", fromKind: "cast-assignment", toKind: "shoot-day", label: "Cast Assignment on Day" },
  { kind: "scheduled-on", fromKind: "bg-assignment", toKind: "shoot-day", label: "BG Assignment on Day" },
  { kind: "scheduled-on", fromKind: "asset-assignment", toKind: "shoot-day", label: "Asset Assignment on Day" },
  {
    kind: "generated-from",
    fromKind: "shootday-package",
    toKind: "generated-output",
    label: "Shoot Day Package Output",
  },
];

export const SHOOTDAY_RELATIONSHIP_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "scene", role: "scene" },
  { kind: "set", role: "set" },
  { kind: "location", role: "location" },
  { kind: "asset", role: "asset" },
  { kind: "cast-assignment", role: "cast" },
  { kind: "bg-assignment", role: "background" },
  { kind: "crew-assignment", role: "crew" },
  { kind: "shootday-assignment", role: "assignment" },
  { kind: "shootday-package", role: "documentation" },
  { kind: "generated-output", role: "generated-output" },
  { kind: "company-move", role: "company-move" },
];
