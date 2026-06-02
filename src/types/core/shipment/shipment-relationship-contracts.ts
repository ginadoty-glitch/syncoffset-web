/**
 * SyncOffset Shipment Authority — relationship contracts (no execution logic)
 *
 * @see docs/SYNCOFFSET_SHIPMENT_AUTHORITY.md
 */

import type { CoreObjectKind } from "../kinds";
import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-entry";

export const SHIPMENT_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "purchase-to-delivery",
    label: "Budget Requirement → Purchase Order → Shipment → Asset → Set → Scene",
    steps: [
      { nodeKind: "budget-requirement", relationshipKind: "requires" },
      { nodeKind: "purchase-order", relationshipKind: "derived-from" },
      { nodeKind: "shipment", relationshipKind: "depends-on" },
      { nodeKind: "asset", relationshipKind: "attached-to" },
      { nodeKind: "set", relationshipKind: "references" },
      { nodeKind: "scene", relationshipKind: "derived-from" },
    ],
    notes: "Purchase creates intent; shipment delivery creates availability (Rules 1–3).",
  },
  {
    pathId: "purchaseorder-shipment",
    label: "Purchase Order → Shipment",
    steps: [
      { nodeKind: "purchase-order", relationshipKind: "derived-from" },
      { nodeKind: "shipment", relationshipKind: "depends-on" },
    ],
    notes: "Shipment may not exist without Purchase Order.",
  },
  {
    pathId: "shipment-lifecycle",
    label: "Shipment → Shipment Event",
    steps: [
      { nodeKind: "shipment", relationshipKind: "derived-from" },
      { nodeKind: "shipment-event", relationshipKind: "derived-from" },
    ],
    notes: "Shipment is authoritative source for movement history (Rule 4).",
  },
  {
    pathId: "delivery-chain",
    label: "Shipment → Shipment Stop → Location",
    steps: [
      { nodeKind: "shipment", relationshipKind: "derived-from" },
      { nodeKind: "shipment-stop", relationshipKind: "derived-from" },
      { nodeKind: "location", relationshipKind: "occurs-at" },
    ],
  },
  {
    pathId: "shipment-shipmentstop",
    label: "Shipment → Shipment Stop",
    steps: [
      { nodeKind: "shipment", relationshipKind: "derived-from" },
      { nodeKind: "shipment-stop", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "shipment-shipmentpackage",
    label: "Shipment → Shipment Package",
    steps: [
      { nodeKind: "shipment", relationshipKind: "attached-to" },
      { nodeKind: "shipment-package", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "shipmentpackage-generatedoutput",
    label: "Shipment Package → Generated Output",
    steps: [
      { nodeKind: "shipment-package", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
  },
  {
    pathId: "shipment-vendor",
    label: "Shipment → Vendor",
    steps: [
      { nodeKind: "shipment", relationshipKind: "assigned-to" },
      { nodeKind: "vendor", relationshipKind: "assigned-to" },
    ],
  },
  {
    pathId: "shipment-asset",
    label: "Shipment → Asset",
    steps: [
      { nodeKind: "shipment", relationshipKind: "attached-to" },
      { nodeKind: "asset", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "shipment-location",
    label: "Shipment → Location",
    steps: [
      { nodeKind: "shipment", relationshipKind: "occurs-at" },
      { nodeKind: "location", relationshipKind: "occurs-at" },
    ],
  },
  {
    pathId: "shipment-return",
    label: "Return → Shipment",
    steps: [
      { nodeKind: "return", relationshipKind: "depends-on" },
      { nodeKind: "shipment", relationshipKind: "depends-on" },
    ],
    notes: "See Return Authority return-logistics path.",
  },
  {
    pathId: "shipment-generatedoutput",
    label: "Shipment → Generated Output",
    steps: [
      { nodeKind: "shipment", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
  },
  {
    pathId: "shipmentstop-location",
    label: "Shipment Stop → Location",
    steps: [
      { nodeKind: "shipment-stop", relationshipKind: "occurs-at" },
      { nodeKind: "location", relationshipKind: "occurs-at" },
    ],
  },
];

export const SHIPMENT_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  { kind: "depends-on", fromKind: "shipment", toKind: "purchase-order", label: "Shipment depends on Purchase Order" },
  { kind: "derived-from", fromKind: "shipment", toKind: "shipment-stop", label: "Shipment Stop" },
  { kind: "derived-from", fromKind: "shipment", toKind: "shipment-event", label: "Shipment Event" },
  { kind: "attached-to", fromKind: "shipment", toKind: "shipment-package", label: "Shipment Package" },
  { kind: "assigned-to", fromKind: "shipment", toKind: "vendor", label: "Shipment Vendor" },
  { kind: "attached-to", fromKind: "shipment", toKind: "asset", label: "Shipment Asset" },
  { kind: "occurs-at", fromKind: "shipment", toKind: "location", label: "Shipment Location" },
  { kind: "depends-on", fromKind: "return", toKind: "shipment", label: "Return Shipment" },
  { kind: "generated-from", fromKind: "shipment", toKind: "generated-output", label: "Shipment Generated Output" },
  { kind: "occurs-at", fromKind: "shipment-stop", toKind: "location", label: "Stop at Location" },
  {
    kind: "generated-from",
    fromKind: "shipment-package",
    toKind: "generated-output",
    label: "Shipment Package Output",
  },
];

export const SHIPMENT_RELATIONSHIP_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "purchase-order", role: "purchase-order" },
  { kind: "shipment-stop", role: "stop" },
  { kind: "shipment-event", role: "movement-history" },
  { kind: "shipment-package", role: "documentation" },
  { kind: "vendor", role: "carrier" },
  { kind: "asset", role: "cargo" },
  { kind: "location", role: "location" },
  { kind: "return", role: "return" },
  { kind: "generated-output", role: "generated-output" },
  { kind: "transport-order", role: "transport-order" },
];
