/**
 * SyncOffset Return Authority — relationship contracts (no execution logic)
 *
 * @see docs/SYNCOFFSET_RETURN_AUTHORITY.md
 */

import type { CoreObjectKind } from "../kinds";
import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-entry";

export const RETURN_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "asset-recovery",
    label: "Asset → Return",
    steps: [
      { nodeKind: "asset", relationshipKind: "references" },
      { nodeKind: "return", relationshipKind: "attached-to" },
    ],
    notes: "Asset ownership does not imply return completion (Rule 1).",
  },
  {
    pathId: "rental-closeout",
    label: "Purchase Order → Asset → Return",
    steps: [
      { nodeKind: "purchase-order", relationshipKind: "derived-from" },
      { nodeKind: "asset", relationshipKind: "attached-to" },
      { nodeKind: "return", relationshipKind: "references" },
    ],
  },
  {
    pathId: "return-logistics",
    label: "Return → Shipment",
    steps: [
      { nodeKind: "return", relationshipKind: "depends-on" },
      { nodeKind: "shipment", relationshipKind: "depends-on" },
    ],
    notes: "Return movement uses Shipment Authority — not purchase approval.",
  },
  {
    pathId: "cross-border-return",
    label: "Return → Brokerage Record",
    steps: [
      { nodeKind: "return", relationshipKind: "references" },
      { nodeKind: "brokerage-record", relationshipKind: "derived-from" },
    ],
    notes: "Cross-border returns must reference Brokerage Authority (Rule 5).",
  },
  {
    pathId: "return-returnline",
    label: "Return → Return Line",
    steps: [
      { nodeKind: "return", relationshipKind: "derived-from" },
      { nodeKind: "return-line", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "return-returnpackage",
    label: "Return → Return Package",
    steps: [
      { nodeKind: "return", relationshipKind: "attached-to" },
      { nodeKind: "return-package", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "return-asset",
    label: "Return → Asset",
    steps: [
      { nodeKind: "return", relationshipKind: "references" },
      { nodeKind: "asset", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "return-vendor",
    label: "Return → Vendor",
    steps: [
      { nodeKind: "return", relationshipKind: "references" },
      { nodeKind: "vendor", relationshipKind: "assigned-to" },
    ],
    notes: "Returned status does not imply vendor acceptance (Rule 3).",
  },
  {
    pathId: "return-generatedoutput",
    label: "Return → Generated Output",
    steps: [
      { nodeKind: "return", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
  },
  {
    pathId: "returnpackage-generatedoutput",
    label: "Return Package → Generated Output",
    steps: [
      { nodeKind: "return-package", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
  },
];

export const RETURN_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  { kind: "derived-from", fromKind: "return", toKind: "return-line", label: "Return Line" },
  { kind: "attached-to", fromKind: "return", toKind: "return-package", label: "Return Package" },
  { kind: "references", fromKind: "return", toKind: "asset", label: "Return Asset" },
  { kind: "references", fromKind: "return", toKind: "vendor", label: "Return Vendor" },
  { kind: "depends-on", fromKind: "return", toKind: "shipment", label: "Return Shipment" },
  { kind: "references", fromKind: "return", toKind: "purchase-order", label: "Return Purchase Order" },
  { kind: "references", fromKind: "return", toKind: "brokerage-record", label: "Return Brokerage Record" },
  { kind: "generated-from", fromKind: "return", toKind: "generated-output", label: "Return Generated Output" },
  {
    kind: "generated-from",
    fromKind: "return-package",
    toKind: "generated-output",
    label: "Return Package Output",
  },
  { kind: "references", fromKind: "return-line", toKind: "asset", label: "Returned Asset on Line" },
];

export const RETURN_RELATIONSHIP_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "return-line", role: "return-line" },
  { kind: "return-package", role: "return-documentation" },
  { kind: "asset", role: "recovered-asset" },
  { kind: "vendor", role: "vendor" },
  { kind: "shipment", role: "return-shipment" },
  { kind: "purchase-order", role: "purchase-order" },
  { kind: "brokerage-record", role: "cross-border" },
  { kind: "generated-output", role: "generated-output" },
];
