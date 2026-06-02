/**
 * SyncOffset Vendor Authority — relationship contracts (no execution logic)
 *
 * @see docs/SYNCOFFSET_VENDOR_AUTHORITY.md
 */

import type { CoreObjectKind } from "../kinds";
import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-entry";

/** Operational targets vendors link to in Workspace 08 / Operations. */
export type VendorOperationalTargetKind = Extract<
  CoreObjectKind,
  | "shipment"
  | "transport-order"
  | "purchase-order"
  | "return"
  | "asset"
  | "location"
  | "document"
  | "generated-output"
  | "brokerage-record"
  | "brokerage-package"
>;

export const VENDOR_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "vendor-shipment",
    label: "Vendor → Shipment",
    steps: [
      { nodeKind: "vendor", relationshipKind: "references" },
      { nodeKind: "shipment", relationshipKind: "assigned-to" },
    ],
  },
  {
    pathId: "vendor-transport-order",
    label: "Vendor → Transport Order",
    steps: [
      { nodeKind: "vendor", relationshipKind: "references" },
      { nodeKind: "transport-order", relationshipKind: "depends-on" },
    ],
  },
  {
    pathId: "vendor-brokeragerecord",
    label: "Vendor → Brokerage Record",
    steps: [
      { nodeKind: "vendor", relationshipKind: "references" },
      { nodeKind: "brokerage-record", relationshipKind: "references" },
    ],
    notes: "See Brokerage Authority — customs legality is not Shipment movement.",
  },
  {
    pathId: "vendor-purchase",
    label: "Vendor → Purchase",
    steps: [
      { nodeKind: "vendor", relationshipKind: "requires" },
      { nodeKind: "purchase-order", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "vendor-rental",
    label: "Vendor → Rental",
    steps: [
      { nodeKind: "vendor", relationshipKind: "requires" },
      { nodeKind: "purchase-order", relationshipKind: "derived-from" },
    ],
    notes: "Rental orders are purchase-order records with rental agreement provenance.",
  },
  {
    pathId: "vendor-return",
    label: "Return → Vendor",
    steps: [
      { nodeKind: "return", relationshipKind: "references" },
      { nodeKind: "vendor", relationshipKind: "assigned-to" },
    ],
    notes: "See Return Authority — returned status ≠ vendor acceptance.",
  },
  {
    pathId: "vendor-asset",
    label: "Vendor → Asset",
    steps: [
      { nodeKind: "vendor", relationshipKind: "references" },
      { nodeKind: "asset", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "vendor-location",
    label: "Vendor → Location",
    steps: [
      { nodeKind: "vendor", relationshipKind: "occurs-at" },
      { nodeKind: "location", relationshipKind: "references" },
    ],
  },
  {
    pathId: "vendor-brokeragepackage",
    label: "Vendor → Brokerage Package",
    steps: [
      { nodeKind: "vendor", relationshipKind: "references" },
      { nodeKind: "brokerage-package", relationshipKind: "attached-to" },
    ],
  },
];

export const VENDOR_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  { kind: "assigned-to", fromKind: "vendor", toKind: "shipment", label: "Vendor on Shipment" },
  { kind: "depends-on", fromKind: "vendor", toKind: "transport-order", label: "Vendor on Transport Order" },
  { kind: "references", fromKind: "vendor", toKind: "brokerage-record", label: "Vendor Brokerage Record" },
  { kind: "derived-from", fromKind: "vendor", toKind: "purchase-order", label: "Vendor Purchase Order" },
  { kind: "derived-from", fromKind: "vendor", toKind: "purchase-order", label: "Vendor Rental Order" },
  { kind: "references", fromKind: "return", toKind: "vendor", label: "Return Vendor" },
  { kind: "attached-to", fromKind: "vendor", toKind: "asset", label: "Vendor supplies Asset" },
  { kind: "references", fromKind: "vendor", toKind: "location", label: "Vendor at Location" },
  { kind: "references", fromKind: "vendor", toKind: "brokerage-package", label: "Vendor Brokerage Package" },
  { kind: "references", fromKind: "vendor-contact", toKind: "vendor", label: "Contact at Vendor" },
  { kind: "references", fromKind: "vendor-agreement", toKind: "vendor", label: "Agreement with Vendor" },
];

export const VENDOR_RELATIONSHIP_TARGETS: ReadonlyArray<{
  readonly kind: VendorOperationalTargetKind;
  readonly role: string;
}> = [
  { kind: "shipment", role: "shipment" },
  { kind: "transport-order", role: "transport" },
  { kind: "brokerage-record", role: "brokerage-record" },
  { kind: "brokerage-package", role: "brokerage-package" },
  { kind: "purchase-order", role: "purchase" },
  { kind: "purchase-order", role: "rental" },
  { kind: "return", role: "return" },
  { kind: "asset", role: "asset" },
  { kind: "location", role: "location" },
];
