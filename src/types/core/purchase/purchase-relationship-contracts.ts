/**
 * SyncOffset Purchase Authority — relationship contracts (no execution logic)
 *
 * @see docs/SYNCOFFSET_PURCHASE_AUTHORITY.md
 */

import type { CoreObjectKind } from "../kinds";
import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-entry";

export const PURCHASE_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "budgetrequirement-purchaseorder",
    label: "Budget Requirement → Purchase Order",
    steps: [
      { nodeKind: "budget-requirement", relationshipKind: "requires" },
      { nodeKind: "purchase-order", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "purchaseorder-vendor",
    label: "Purchase Order → Vendor",
    steps: [
      { nodeKind: "purchase-order", relationshipKind: "references" },
      { nodeKind: "vendor", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "purchaseorder-set",
    label: "Purchase Order → Set",
    steps: [
      { nodeKind: "purchase-order", relationshipKind: "references" },
      { nodeKind: "set", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "purchaseorder-department",
    label: "Purchase Order → Department",
    steps: [
      { nodeKind: "purchase-order", relationshipKind: "assigned-to" },
      { nodeKind: "department", relationshipKind: "assigned-to" },
    ],
  },
  {
    pathId: "purchaseorder-purchaseline",
    label: "Purchase Order → Purchase Line",
    steps: [
      { nodeKind: "purchase-order", relationshipKind: "derived-from" },
      { nodeKind: "purchase-line", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "purchaseline-asset",
    label: "Purchase Line → Asset",
    steps: [
      { nodeKind: "purchase-line", relationshipKind: "references" },
      { nodeKind: "asset", relationshipKind: "attached-to" },
    ],
    notes: "PO may exist without Asset; Asset requires Set (Asset Authority).",
  },
  {
    pathId: "purchaseorder-purchasepackage",
    label: "Purchase Order → Purchase Package",
    steps: [
      { nodeKind: "purchase-order", relationshipKind: "attached-to" },
      { nodeKind: "purchase-package", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "purchaseorder-shipment",
    label: "Purchase Order → Shipment",
    steps: [
      { nodeKind: "purchase-order", relationshipKind: "derived-from" },
      { nodeKind: "shipment", relationshipKind: "depends-on" },
    ],
    notes: "See Shipment Authority — shipment depends on PO; delivery creates availability.",
  },
  {
    pathId: "purchaseorder-return",
    label: "Purchase Order → Return",
    steps: [
      { nodeKind: "purchase-order", relationshipKind: "derived-from" },
      { nodeKind: "return", relationshipKind: "references" },
    ],
    notes: "See Return Authority — rental closeout path.",
  },
  {
    pathId: "purchaseorder-generatedoutput",
    label: "Purchase Order → Generated Output",
    steps: [
      { nodeKind: "purchase-order", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
  },
  {
    pathId: "purchase-provenance",
    label: "Purchase Line → PO → Budget → Set → Scene → Script Revision",
    steps: [
      { nodeKind: "purchase-line", relationshipKind: "derived-from" },
      { nodeKind: "purchase-order", relationshipKind: "derived-from" },
      { nodeKind: "budget-requirement", relationshipKind: "references" },
      { nodeKind: "set", relationshipKind: "references" },
      { nodeKind: "scene", relationshipKind: "derived-from" },
      { nodeKind: "script-revision", relationshipKind: "derived-from" },
    ],
    notes: "Provenance documentation only — not accounting or receiving execution.",
  },
  {
    pathId: "planning-to-execution",
    label: "Budget → Purchase Order → Vendor → Asset → Shipment → Return",
    steps: [
      { nodeKind: "budget-requirement", relationshipKind: "requires" },
      { nodeKind: "purchase-order", relationshipKind: "derived-from" },
      { nodeKind: "vendor", relationshipKind: "references" },
      { nodeKind: "asset", relationshipKind: "attached-to" },
      { nodeKind: "shipment", relationshipKind: "depends-on" },
      { nodeKind: "return", relationshipKind: "references" },
    ],
    notes: "Return Authority governs recovery — see return-logistics path for Shipment.",
  },
];

export const PURCHASE_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  { kind: "references", fromKind: "purchase-order", toKind: "vendor", label: "Purchase Order Vendor" },
  { kind: "references", fromKind: "purchase-order", toKind: "budget-requirement", label: "Purchase Order Budget" },
  { kind: "references", fromKind: "purchase-order", toKind: "set", label: "Purchase Order Set" },
  { kind: "assigned-to", fromKind: "purchase-order", toKind: "department", label: "Purchase Order Department" },
  { kind: "derived-from", fromKind: "purchase-order", toKind: "purchase-line", label: "Purchase Line on Order" },
  { kind: "references", fromKind: "purchase-line", toKind: "asset", label: "Purchase Line Asset" },
  { kind: "attached-to", fromKind: "purchase-order", toKind: "purchase-package", label: "Purchase Package" },
  { kind: "depends-on", fromKind: "shipment", toKind: "purchase-order", label: "Shipment depends on Purchase Order" },
  { kind: "references", fromKind: "return", toKind: "purchase-order", label: "Return Purchase Order" },
  {
    kind: "generated-from",
    fromKind: "purchase-order",
    toKind: "generated-output",
    label: "Purchase Generated Output",
  },
];

export const PURCHASE_RELATIONSHIP_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "budget-requirement", role: "budget-provenance" },
  { kind: "set", role: "production-set" },
  { kind: "department", role: "department" },
  { kind: "vendor", role: "vendor" },
  { kind: "purchase-line", role: "line-item" },
  { kind: "asset", role: "asset" },
  { kind: "purchase-package", role: "documentation" },
  { kind: "shipment", role: "shipment" },
  { kind: "return", role: "return" },
  { kind: "generated-output", role: "generated-output" },
];
