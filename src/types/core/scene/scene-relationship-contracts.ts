/**
 * SyncOffset Scene Authority — relationship contracts (no execution logic)
 *
 * Scene is the central production hub. Script Authority owns revision provenance;
 * Scene Authority owns downstream production linkage.
 *
 * @see docs/SYNCOFFSET_SCENE_AUTHORITY.md
 */

import type { CoreObjectKind } from "../kinds";
import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-entry";

export const SCENE_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "scriptrevision-scene",
    label: "Script → Scene",
    steps: [
      { nodeKind: "script-revision", relationshipKind: "derived-from" },
      { nodeKind: "scene", relationshipKind: "derived-from" },
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
    pathId: "scene-budgetrequirement",
    label: "Scene → Budget Requirement",
    steps: [
      { nodeKind: "scene", relationshipKind: "requires" },
      { nodeKind: "budget-requirement", relationshipKind: "derived-from" },
    ],
    notes: "Budget requirements originate from breakdown; scene is the scheduling anchor.",
  },
  {
    pathId: "breakdownelement-budgetrequirement",
    label: "Breakdown Element → Budget Requirement",
    steps: [
      { nodeKind: "breakdown-element", relationshipKind: "requires" },
      { nodeKind: "budget-requirement", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "scene-set",
    label: "Scene → Set",
    steps: [
      { nodeKind: "scene", relationshipKind: "references" },
      { nodeKind: "set", relationshipKind: "derived-from" },
    ],
    notes: "Set is a container derived from script requirements — not parent of Scene.",
  },
  {
    pathId: "scene-locationrequirement",
    label: "Scene → Location Requirement",
    steps: [
      { nodeKind: "scene", relationshipKind: "requires" },
      { nodeKind: "location-requirement", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "scene-crewrequirement",
    label: "Scene → Crew Requirement",
    steps: [
      { nodeKind: "scene", relationshipKind: "requires" },
      { nodeKind: "crew-requirement", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "scene-castrequirement",
    label: "Scene → Cast Requirement",
    steps: [
      { nodeKind: "scene", relationshipKind: "requires" },
      { nodeKind: "cast-requirement", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "scene-bgrequirement",
    label: "Scene → Background Requirement",
    steps: [
      { nodeKind: "scene", relationshipKind: "requires" },
      { nodeKind: "bg-requirement", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "scene-shootday",
    label: "Scene → Shoot Day",
    steps: [
      { nodeKind: "scene", relationshipKind: "scheduled-on" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
    ],
    notes: "ShootDay is calendar authority — consumes Scene, does not define script content.",
  },
  {
    pathId: "production-hierarchy",
    label: "Source → Script → Scene → Breakdown → Budget → Set → Asset → Vendor → Logistics → Shoot Day",
    steps: [
      { nodeKind: "script-revision", relationshipKind: "derived-from" },
      { nodeKind: "scene", relationshipKind: "derived-from" },
      { nodeKind: "breakdown-element", relationshipKind: "derived-from" },
      { nodeKind: "budget-requirement", relationshipKind: "derived-from" },
      { nodeKind: "set", relationshipKind: "references" },
      { nodeKind: "asset", relationshipKind: "attached-to" },
      { nodeKind: "vendor", relationshipKind: "references" },
      { nodeKind: "transport-order", relationshipKind: "depends-on" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
    ],
    notes: "Normative production flow — documented path only.",
  },
];

export const SCENE_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  { kind: "derived-from", fromKind: "script-revision", toKind: "scene", label: "Scenes in Script Revision" },
  { kind: "derived-from", fromKind: "scene", toKind: "breakdown-element", label: "Breakdown Element from Scene" },
  { kind: "derived-from", fromKind: "scene", toKind: "budget-requirement", label: "Budget Requirement from Scene" },
  {
    kind: "derived-from",
    fromKind: "breakdown-element",
    toKind: "budget-requirement",
    label: "Budget Requirement from Breakdown",
  },
  { kind: "references", fromKind: "scene", toKind: "set", label: "Scene on Set" },
  { kind: "derived-from", fromKind: "scene", toKind: "location-requirement", label: "Location Requirement from Scene" },
  { kind: "derived-from", fromKind: "scene", toKind: "crew-requirement", label: "Crew Requirement from Scene" },
  { kind: "derived-from", fromKind: "scene", toKind: "cast-requirement", label: "Cast Requirement from Scene" },
  { kind: "derived-from", fromKind: "scene", toKind: "bg-requirement", label: "Background Requirement from Scene" },
  { kind: "scheduled-on", fromKind: "scene", toKind: "shoot-day", label: "Scene on Shoot Day" },
  { kind: "attached-to", fromKind: "set", toKind: "asset", label: "Set Asset" },
  { kind: "references", fromKind: "set", toKind: "location", label: "Set Location" },
];

/** Scene as central hub — documented relationship targets. */
export const SCENE_RELATIONSHIP_HUB_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "script-revision", role: "script-source" },
  { kind: "revision-change", role: "revision-impact" },
  { kind: "breakdown-element", role: "breakdown" },
  { kind: "budget-requirement", role: "budget-need" },
  { kind: "set", role: "production-set" },
  { kind: "location", role: "primary-location" },
  { kind: "location-requirement", role: "location-need" },
  { kind: "cast-requirement", role: "cast-need" },
  { kind: "bg-requirement", role: "background-need" },
  { kind: "crew-requirement", role: "crew-need" },
  { kind: "asset", role: "set-asset" },
  { kind: "asset-instance", role: "tracked-unit" },
  { kind: "asset-package", role: "asset-documentation" },
  { kind: "vendor", role: "vendor-need" },
  { kind: "transport-order", role: "logistics" },
  { kind: "shoot-day", role: "scheduled-day" },
  { kind: "department-package", role: "creative-intent" },
  { kind: "media", role: "scene-media" },
];
