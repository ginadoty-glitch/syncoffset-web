/**
 * SyncOffset Brokerage Authority — relationship contracts (no execution logic)
 *
 * @see docs/SYNCOFFSET_BROKERAGE_AUTHORITY.md
 */

import type { CoreObjectKind } from "../kinds";
import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-entry";

export const BROKERAGE_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "import-chain",
    label: "Purchase Order → Shipment → Brokerage Record → Asset",
    steps: [
      { nodeKind: "purchase-order", relationshipKind: "derived-from" },
      { nodeKind: "shipment", relationshipKind: "depends-on" },
      { nodeKind: "brokerage-record", relationshipKind: "derived-from" },
      { nodeKind: "asset", relationshipKind: "references" },
    ],
    notes: "Movement (shipment) and legality (brokerage) are separate authorities.",
  },
  {
    pathId: "customs-clearance",
    label: "Shipment → Brokerage Record → Brokerage Package",
    steps: [
      { nodeKind: "shipment", relationshipKind: "derived-from" },
      { nodeKind: "brokerage-record", relationshipKind: "derived-from" },
      { nodeKind: "brokerage-package", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "return-import-export",
    label: "Asset → Return → Brokerage Record",
    steps: [
      { nodeKind: "asset", relationshipKind: "references" },
      { nodeKind: "return", relationshipKind: "attached-to" },
      { nodeKind: "brokerage-record", relationshipKind: "references" },
    ],
  },
  {
    pathId: "cross-border-return",
    label: "Return → Brokerage Record",
    steps: [
      { nodeKind: "return", relationshipKind: "references" },
      { nodeKind: "brokerage-record", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "shipment-brokeragerecord",
    label: "Shipment → Brokerage Record",
    steps: [
      { nodeKind: "shipment", relationshipKind: "derived-from" },
      { nodeKind: "brokerage-record", relationshipKind: "derived-from" },
    ],
    notes: "Shipment movement does not imply customs clearance (Rule 1).",
  },
  {
    pathId: "brokeragerecord-brokerageline",
    label: "Brokerage Record → Brokerage Line",
    steps: [
      { nodeKind: "brokerage-record", relationshipKind: "derived-from" },
      { nodeKind: "brokerage-line", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "brokeragerecord-brokeragepackage",
    label: "Brokerage Record → Brokerage Package",
    steps: [
      { nodeKind: "brokerage-record", relationshipKind: "attached-to" },
      { nodeKind: "brokerage-package", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "brokeragerecord-vendor",
    label: "Brokerage Record → Vendor",
    steps: [
      { nodeKind: "brokerage-record", relationshipKind: "references" },
      { nodeKind: "vendor", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "brokeragerecord-asset",
    label: "Brokerage Record → Asset",
    steps: [
      { nodeKind: "brokerage-record", relationshipKind: "references" },
      { nodeKind: "asset", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "brokeragerecord-purchaseorder",
    label: "Brokerage Record → Purchase Order",
    steps: [
      { nodeKind: "brokerage-record", relationshipKind: "references" },
      { nodeKind: "purchase-order", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "brokeragerecord-generatedoutput",
    label: "Brokerage Record → Generated Output",
    steps: [
      { nodeKind: "brokerage-record", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
  },
  {
    pathId: "brokeragepackage-generatedoutput",
    label: "Brokerage Package → Generated Output",
    steps: [
      { nodeKind: "brokerage-package", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
  },
];

export const BROKERAGE_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  { kind: "derived-from", fromKind: "shipment", toKind: "brokerage-record", label: "Brokerage Record from Shipment" },
  { kind: "derived-from", fromKind: "brokerage-record", toKind: "brokerage-line", label: "Brokerage Line" },
  { kind: "attached-to", fromKind: "brokerage-record", toKind: "brokerage-package", label: "Brokerage Package" },
  { kind: "references", fromKind: "brokerage-record", toKind: "vendor", label: "Brokerage Vendor" },
  { kind: "references", fromKind: "brokerage-record", toKind: "asset", label: "Brokerage Asset" },
  { kind: "references", fromKind: "brokerage-record", toKind: "purchase-order", label: "Brokerage Purchase Order" },
  { kind: "references", fromKind: "return", toKind: "brokerage-record", label: "Return Brokerage Record" },
  {
    kind: "generated-from",
    fromKind: "brokerage-record",
    toKind: "generated-output",
    label: "Brokerage Generated Output",
  },
  {
    kind: "generated-from",
    fromKind: "brokerage-package",
    toKind: "generated-output",
    label: "Brokerage Package Output",
  },
  { kind: "references", fromKind: "brokerage-line", toKind: "asset", label: "Declared Asset on Line" },
];

export const BROKERAGE_RELATIONSHIP_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "shipment", role: "shipment" },
  { kind: "vendor", role: "customs-broker" },
  { kind: "asset", role: "declared-asset" },
  { kind: "purchase-order", role: "purchase-order" },
  { kind: "return", role: "return" },
  { kind: "brokerage-line", role: "declared-line" },
  { kind: "brokerage-package", role: "customs-documentation" },
  { kind: "generated-output", role: "generated-output" },
];
