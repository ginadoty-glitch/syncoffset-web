/**
 * SyncOffset Location Authority — relationship contracts (no execution logic)
 *
 * No maps, permits, or scheduling engine in this phase.
 * @see docs/SYNCOFFSET_LOCATION_AUTHORITY.md
 */

import type { CoreObjectKind } from "../kinds";
import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-entry";

export const LOCATION_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "scene-locationrequirement",
    label: "Scene → Location Requirement",
    steps: [
      { nodeKind: "scene", relationshipKind: "requires" },
      { nodeKind: "location-requirement", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "breakdownelement-locationrequirement",
    label: "Breakdown Element → Location Requirement",
    steps: [
      { nodeKind: "breakdown-element", relationshipKind: "requires" },
      { nodeKind: "location-requirement", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "locationrequirement-location",
    label: "Location Requirement → Location",
    steps: [
      { nodeKind: "location-requirement", relationshipKind: "references" },
      { nodeKind: "location", relationshipKind: "occurs-at" },
    ],
  },
  {
    pathId: "location-shootday",
    label: "Location → Shoot Day",
    steps: [
      { nodeKind: "location-assignment", relationshipKind: "scheduled-on" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
    ],
    notes: "Assignment binds location to shoot day; ShootDay is calendar authority.",
  },
  {
    pathId: "location-callsheet",
    label: "Location → Callsheet",
    steps: [
      { nodeKind: "location", relationshipKind: "references" },
      { nodeKind: "shoot-day", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
  },
  {
    pathId: "location-vendor",
    label: "Location → Vendor",
    steps: [
      { nodeKind: "location", relationshipKind: "references" },
      { nodeKind: "vendor", relationshipKind: "occurs-at" },
    ],
  },
  {
    pathId: "location-asset",
    label: "Location → Asset",
    steps: [
      { nodeKind: "location", relationshipKind: "attached-to" },
      { nodeKind: "asset", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "location-package-approved",
    label: "Location Package → Location",
    steps: [
      { nodeKind: "location-package", relationshipKind: "attached-to" },
      { nodeKind: "location", relationshipKind: "references" },
    ],
  },
];

export const LOCATION_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  { kind: "derived-from", fromKind: "scene", toKind: "location-requirement", label: "Location Requirement from Scene" },
  {
    kind: "derived-from",
    fromKind: "breakdown-element",
    toKind: "location-requirement",
    label: "Location Requirement from Breakdown",
  },
  {
    kind: "references",
    fromKind: "location-requirement",
    toKind: "location",
    label: "Requirement fulfilled by Location",
  },
  { kind: "scheduled-on", fromKind: "location-assignment", toKind: "shoot-day", label: "Location on Shoot Day" },
  { kind: "references", fromKind: "location-assignment", toKind: "scene", label: "Location Assignment for Scene" },
  { kind: "references", fromKind: "location", toKind: "vendor", label: "Location Vendor" },
  { kind: "attached-to", fromKind: "location", toKind: "asset", label: "Asset at Location" },
  { kind: "attached-to", fromKind: "location-package", toKind: "location", label: "Approved Location Package" },
  { kind: "occurs-at", fromKind: "scene", toKind: "location", label: "Scene at Location" },
];

export const LOCATION_RELATIONSHIP_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "scene", role: "scene-need" },
  { kind: "breakdown-element", role: "breakdown-need" },
  { kind: "shoot-day", role: "shoot-day" },
  { kind: "generated-output", role: "callsheet" },
  { kind: "vendor", role: "vendor" },
  { kind: "asset", role: "asset" },
  { kind: "company-move", role: "company-move" },
];
