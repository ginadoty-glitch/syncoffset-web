/**
 * SyncOffset Asset Authority — relationship contracts (no execution logic)
 *
 * @see docs/SYNCOFFSET_ASSET_AUTHORITY.md
 */

import type { CoreObjectKind } from "../kinds";
import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-entry";

export const ASSET_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "set-asset",
    label: "Set → Asset",
    steps: [
      { nodeKind: "set", relationshipKind: "attached-to" },
      { nodeKind: "asset", relationshipKind: "attached-to" },
    ],
    notes: "Constitutional ownership — Asset belongs to Set, not Scene.",
  },
  {
    pathId: "asset-assetinstance",
    label: "Asset → Asset Instance",
    steps: [
      { nodeKind: "asset", relationshipKind: "derived-from" },
      { nodeKind: "asset-instance", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "asset-vendor",
    label: "Asset → Vendor",
    steps: [
      { nodeKind: "asset", relationshipKind: "references" },
      { nodeKind: "vendor", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "asset-location",
    label: "Asset → Location",
    steps: [
      { nodeKind: "asset", relationshipKind: "occurs-at" },
      { nodeKind: "location", relationshipKind: "occurs-at" },
    ],
  },
  {
    pathId: "asset-budgetrequirement",
    label: "Asset → Budget Requirement",
    steps: [
      { nodeKind: "asset", relationshipKind: "references" },
      { nodeKind: "budget-requirement", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "purchaseline-asset",
    label: "Purchase Line → Asset",
    steps: [
      { nodeKind: "purchase-line", relationshipKind: "references" },
      { nodeKind: "asset", relationshipKind: "attached-to" },
    ],
    notes: "Prefer line-level provenance; PO may exist without Asset.",
  },
  {
    pathId: "asset-shipment",
    label: "Asset → Shipment",
    steps: [
      { nodeKind: "asset-assignment", relationshipKind: "depends-on" },
      { nodeKind: "shipment", relationshipKind: "depends-on" },
    ],
  },
  {
    pathId: "asset-return",
    label: "Asset → Return",
    steps: [
      { nodeKind: "asset", relationshipKind: "references" },
      { nodeKind: "return", relationshipKind: "attached-to" },
    ],
    notes: "See Return Authority — return completion is authoritative.",
  },
  {
    pathId: "asset-shootday",
    label: "Asset → Shoot Day",
    steps: [
      { nodeKind: "asset-assignment", relationshipKind: "scheduled-on" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
    ],
  },
  {
    pathId: "asset-assetpackage",
    label: "Asset → Asset Package",
    steps: [
      { nodeKind: "asset", relationshipKind: "attached-to" },
      { nodeKind: "asset-package", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "scene-set-asset",
    label: "Scene → Set → Asset (indirect)",
    steps: [
      { nodeKind: "scene", relationshipKind: "references" },
      { nodeKind: "set", relationshipKind: "references" },
      { nodeKind: "asset", relationshipKind: "attached-to" },
    ],
    notes: "Scenes consume Sets — never direct Scene → Asset ownership.",
  },
  {
    pathId: "asset-provenance",
    label: "Asset → Set → Budget Requirement → Breakdown → Scene → Script Revision",
    steps: [
      { nodeKind: "asset", relationshipKind: "references" },
      { nodeKind: "set", relationshipKind: "references" },
      { nodeKind: "budget-requirement", relationshipKind: "references" },
      { nodeKind: "breakdown-element", relationshipKind: "derived-from" },
      { nodeKind: "scene", relationshipKind: "derived-from" },
      { nodeKind: "script-revision", relationshipKind: "derived-from" },
    ],
    notes: "Provenance documentation only — no traversal engine in this phase.",
  },
];

export const ASSET_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  { kind: "attached-to", fromKind: "set", toKind: "asset", label: "Asset on Set" },
  { kind: "derived-from", fromKind: "asset", toKind: "asset-instance", label: "Asset Instance" },
  { kind: "references", fromKind: "asset", toKind: "vendor", label: "Asset Vendor" },
  { kind: "occurs-at", fromKind: "asset", toKind: "location", label: "Asset at Location" },
  { kind: "references", fromKind: "asset", toKind: "budget-requirement", label: "Asset Budget Requirement" },
  { kind: "references", fromKind: "purchase-line", toKind: "asset", label: "Purchase Line Asset" },
  { kind: "depends-on", fromKind: "asset-assignment", toKind: "shipment", label: "Asset Shipment" },
  { kind: "references", fromKind: "return", toKind: "asset", label: "Return Asset" },
  { kind: "scheduled-on", fromKind: "asset-assignment", toKind: "shoot-day", label: "Asset on Shoot Day" },
  { kind: "attached-to", fromKind: "asset", toKind: "asset-package", label: "Asset Package" },
  { kind: "references", fromKind: "asset-assignment", toKind: "scene", label: "Asset deployed for Scene" },
];

export const ASSET_RELATIONSHIP_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "set", role: "production-set" },
  { kind: "budget-requirement", role: "budget-provenance" },
  { kind: "breakdown-element", role: "breakdown-provenance" },
  { kind: "vendor", role: "vendor" },
  { kind: "location", role: "location" },
  { kind: "purchase-order", role: "purchase-order" },
  { kind: "purchase-line", role: "purchase-line" },
  { kind: "shipment", role: "shipment" },
  { kind: "return", role: "return" },
  { kind: "shoot-day", role: "shoot-day" },
  { kind: "asset-package", role: "documentation" },
  { kind: "generated-output", role: "generated-output" },
];
