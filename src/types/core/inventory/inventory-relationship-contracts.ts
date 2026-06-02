/**
 * SyncOffset Inventory Authority — relationship contracts (no execution logic)
 *
 * @see docs/SYNCOFFSET_INVENTORY_AUTHORITY.md
 */

import type { CoreObjectKind } from "../kinds";
import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-entry";

export const INVENTORY_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "asset-inventory",
    label: "Asset → Inventory Record",
    steps: [
      { nodeKind: "asset", relationshipKind: "references" },
      { nodeKind: "inventory-record", relationshipKind: "derived-from" },
    ],
    notes: "Rule 1 — Asset identity; Inventory possession.",
  },
  {
    pathId: "inventory-movement-history",
    label: "Inventory Record → Inventory Movement",
    steps: [
      { nodeKind: "inventory-record", relationshipKind: "derived-from" },
      { nodeKind: "inventory-movement", relationshipKind: "derived-from" },
    ],
    notes: "Rule 4 — immutable movement provenance.",
  },
  {
    pathId: "inventory-audit",
    label: "Location → Inventory Audit → Inventory Record",
    steps: [
      { nodeKind: "location", relationshipKind: "occurs-at" },
      { nodeKind: "inventory-audit", relationshipKind: "derived-from" },
      { nodeKind: "inventory-record", relationshipKind: "references" },
    ],
  },
  {
    pathId: "inventory-execution",
    label: "Set → Inventory Record → Shoot Day",
    steps: [
      { nodeKind: "set", relationshipKind: "references" },
      { nodeKind: "inventory-record", relationshipKind: "references" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
    ],
    notes: "Possession and availability for execution days.",
  },
  {
    pathId: "inventory-package-output",
    label: "Inventory Package → Generated Output",
    steps: [
      { nodeKind: "inventory-package", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
  },
  {
    pathId: "inventory-logistics-movement",
    label: "Shipment / Transport Order → Inventory Movement",
    steps: [
      { nodeKind: "shipment", relationshipKind: "derived-from" },
      { nodeKind: "inventory-movement", relationshipKind: "derived-from" },
    ],
  },
];

export const INVENTORY_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  { kind: "derived-from", fromKind: "asset", toKind: "inventory-record", label: "Inventory for Asset" },
  {
    kind: "derived-from",
    fromKind: "inventory-record",
    toKind: "inventory-movement",
    label: "Inventory Movement History",
  },
  { kind: "derived-from", fromKind: "location", toKind: "inventory-audit", label: "Inventory Audit at Location" },
  { kind: "references", fromKind: "inventory-audit", toKind: "inventory-record", label: "Audit Inventory Records" },
  { kind: "references", fromKind: "inventory-record", toKind: "set", label: "Inventory on Set" },
  { kind: "occurs-at", fromKind: "inventory-record", toKind: "location", label: "Inventory at Location" },
  { kind: "scheduled-on", fromKind: "inventory-record", toKind: "shoot-day", label: "Inventory on Shoot Day" },
  {
    kind: "derived-from",
    fromKind: "inventory-movement",
    toKind: "transport-order",
    label: "Movement via Transport Order",
  },
  { kind: "derived-from", fromKind: "inventory-movement", toKind: "shipment", label: "Movement via Shipment" },
  { kind: "attached-to", fromKind: "inventory-record", toKind: "inventory-package", label: "Inventory Package" },
  {
    kind: "generated-from",
    fromKind: "inventory-package",
    toKind: "generated-output",
    label: "Inventory Package Output",
  },
  {
    kind: "references",
    fromKind: "generated-output",
    toKind: "inventory-record",
    label: "Output references Inventory",
  },
];

export const INVENTORY_RELATIONSHIP_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "asset", role: "asset" },
  { kind: "set", role: "set" },
  { kind: "location", role: "location" },
  { kind: "inventory-movement", role: "movement" },
  { kind: "inventory-audit", role: "audit" },
  { kind: "inventory-package", role: "package" },
  { kind: "shoot-day", role: "shoot-day" },
  { kind: "transport-order", role: "transport-order" },
  { kind: "shipment", role: "shipment" },
  { kind: "generated-output", role: "generated-output" },
];
