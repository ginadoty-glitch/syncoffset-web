/**
 * SyncOffset Production Accounting Authority v1.1.1 — relationship contracts (no execution logic)
 *
 * @see docs/SYNCOFFSET_PRODUCTION_ACCOUNTING_V1_1_1.md
 */

import type { CoreObjectKind } from "../kinds";
import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-entry";

export const ACCOUNTING_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "production-financial-rollup",
    label: "Production → Episode → Set → Department → Production Cost",
    steps: [
      { nodeKind: "show", relationshipKind: "references" },
      { nodeKind: "episode", relationshipKind: "references" },
      { nodeKind: "set", relationshipKind: "references" },
      { nodeKind: "department", relationshipKind: "references" },
      { nodeKind: "production-cost", relationshipKind: "derived-from" },
    ],
    notes: "Rule 1 — financial rollups follow production activity, not calendar months.",
  },
  {
    pathId: "authorization-ladder",
    label: "Budget → Authorized (NTF) → Committed → Actual → Paid",
    steps: [
      { nodeKind: "budget-requirement", relationshipKind: "derived-from" },
      { nodeKind: "document", relationshipKind: "references" },
      { nodeKind: "production-cost", relationshipKind: "derived-from" },
    ],
    notes: "Rule 1 — planned → authorized (NTF document) → committed (PO) → actual/paid (receipt).",
  },
  {
    pathId: "standing-set-amortization",
    label: "Primary Production Cost → Episode Allocation Lines",
    steps: [
      { nodeKind: "production-cost", relationshipKind: "references" },
      { nodeKind: "production-cost", relationshipKind: "references" },
    ],
    notes: "Rule 3 — one primary line; children use costLineRole episode-allocation + allocationOfProductionCostId.",
  },
  {
    pathId: "budget-to-cost",
    label: "Budget Requirement → Production Cost → Department Cost → Cost Report",
    steps: [
      { nodeKind: "budget-requirement", relationshipKind: "derived-from" },
      { nodeKind: "production-cost", relationshipKind: "derived-from" },
      { nodeKind: "department-cost", relationshipKind: "derived-from" },
      { nodeKind: "cost-report", relationshipKind: "derived-from" },
    ],
    notes: "Rule 2 — budget creates planned spend, not actual spend.",
  },
  {
    pathId: "procurement-to-cost",
    label: "Purchase Order → Production Cost",
    steps: [
      { nodeKind: "purchase-order", relationshipKind: "derived-from" },
      { nodeKind: "production-cost", relationshipKind: "derived-from" },
    ],
    notes: "Rule 3 — PO creates commitments until actualized on Production Cost.",
  },
  {
    pathId: "logistics-to-cost",
    label: "Transport Order → Production Cost",
    steps: [
      { nodeKind: "transport-order", relationshipKind: "derived-from" },
      { nodeKind: "production-cost", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "shipment-to-cost",
    label: "Shipment → Production Cost",
    steps: [
      { nodeKind: "shipment", relationshipKind: "derived-from" },
      { nodeKind: "production-cost", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "brokerage-to-cost",
    label: "Brokerage Record → Production Cost",
    steps: [
      { nodeKind: "brokerage-record", relationshipKind: "derived-from" },
      { nodeKind: "production-cost", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "return-to-cost",
    label: "Return → Production Cost",
    steps: [
      { nodeKind: "return", relationshipKind: "derived-from" },
      { nodeKind: "production-cost", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "execution-cost",
    label: "Shoot Day → Production Cost",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "derived-from" },
      { nodeKind: "production-cost", relationshipKind: "derived-from" },
    ],
    notes: "Execution-day spend trace — Rule 4.",
  },
  {
    pathId: "receipt-document-cost",
    label: "Receipt (Document) → Production Cost",
    steps: [
      { nodeKind: "document", relationshipKind: "references" },
      { nodeKind: "production-cost", relationshipKind: "derived-from" },
    ],
    notes: "Rule 5 — actual spend provenance via Document Authority (receipt / invoice).",
  },
  {
    pathId: "episode-cost-report",
    label: "Episode → Department Cost → Cost Report (episode scope)",
    steps: [
      { nodeKind: "episode", relationshipKind: "references" },
      { nodeKind: "department-cost", relationshipKind: "derived-from" },
      { nodeKind: "cost-report", relationshipKind: "derived-from" },
    ],
    notes: "Episode-level “where are we financially right now?”",
  },
  {
    pathId: "cost-report-package-output",
    label: "Cost Report → Cost Report Package → Generated Output",
    steps: [
      { nodeKind: "cost-report", relationshipKind: "attached-to" },
      { nodeKind: "cost-report-package", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
    notes: "Rule 7 — reports summarize; external ERP remains integration only.",
  },
];

export const ACCOUNTING_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  {
    kind: "derived-from",
    fromKind: "budget-requirement",
    toKind: "production-cost",
    label: "Production Cost from Budget",
  },
  {
    kind: "derived-from",
    fromKind: "purchase-order",
    toKind: "production-cost",
    label: "Production Cost from Purchase Order",
  },
  { kind: "references", fromKind: "vendor", toKind: "production-cost", label: "Vendor on Production Cost" },
  { kind: "references", fromKind: "asset", toKind: "production-cost", label: "Asset on Production Cost" },
  {
    kind: "derived-from",
    fromKind: "transport-order",
    toKind: "production-cost",
    label: "Production Cost from Transport Order",
  },
  {
    kind: "derived-from",
    fromKind: "shipment",
    toKind: "production-cost",
    label: "Production Cost from Shipment",
  },
  {
    kind: "derived-from",
    fromKind: "brokerage-record",
    toKind: "production-cost",
    label: "Production Cost from Brokerage",
  },
  { kind: "derived-from", fromKind: "return", toKind: "production-cost", label: "Production Cost from Return" },
  {
    kind: "derived-from",
    fromKind: "shoot-day",
    toKind: "production-cost",
    label: "Production Cost on Shoot Day",
  },
  {
    kind: "derived-from",
    fromKind: "production-cost",
    toKind: "department-cost",
    label: "Department Cost Aggregation",
  },
  {
    kind: "derived-from",
    fromKind: "department-cost",
    toKind: "cost-report",
    label: "Cost Report from Department Cost",
  },
  {
    kind: "attached-to",
    fromKind: "cost-report",
    toKind: "cost-report-package",
    label: "Cost Report Package",
  },
  {
    kind: "generated-from",
    fromKind: "cost-report-package",
    toKind: "generated-output",
    label: "Cost Report Package Output",
  },
  { kind: "references", fromKind: "show", toKind: "production-cost", label: "Production Cost on Show" },
  { kind: "references", fromKind: "episode", toKind: "production-cost", label: "Production Cost on Episode" },
  { kind: "references", fromKind: "production-cost", toKind: "set", label: "Production Cost on Set" },
  { kind: "references", fromKind: "production-cost", toKind: "department", label: "Production Cost Department" },
  { kind: "references", fromKind: "production-cost", toKind: "scene", label: "Production Cost for Scene" },
  { kind: "references", fromKind: "show", toKind: "department-cost", label: "Department Cost on Show" },
  { kind: "references", fromKind: "episode", toKind: "department-cost", label: "Department Cost on Episode" },
  { kind: "references", fromKind: "show", toKind: "cost-report", label: "Cost Report on Show" },
  { kind: "references", fromKind: "episode", toKind: "cost-report", label: "Cost Report on Episode" },
  { kind: "references", fromKind: "production-cost", toKind: "document", label: "Production Cost Document" },
  {
    kind: "references",
    fromKind: "production-cost",
    toKind: "production-cost",
    label: "Episode allocation of primary Production Cost",
  },
  {
    kind: "references",
    fromKind: "generated-output",
    toKind: "cost-report",
    label: "Output references Cost Report",
  },
];

export const ACCOUNTING_RELATIONSHIP_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "show", role: "production" },
  { kind: "episode", role: "episode" },
  { kind: "set", role: "set" },
  { kind: "department", role: "department" },
  { kind: "scene", role: "scene" },
  { kind: "budget-requirement", role: "budget" },
  { kind: "purchase-order", role: "purchase-order" },
  { kind: "vendor", role: "vendor" },
  { kind: "asset", role: "asset" },
  { kind: "shipment", role: "shipment" },
  { kind: "brokerage-record", role: "brokerage" },
  { kind: "return", role: "return" },
  { kind: "transport-order", role: "transport-order" },
  { kind: "shoot-day", role: "shoot-day" },
  { kind: "document", role: "document" },
  { kind: "production-cost", role: "production-cost" },
  { kind: "department-cost", role: "department-cost" },
  { kind: "cost-report", role: "cost-report" },
  { kind: "cost-report-package", role: "cost-report-package" },
  { kind: "generated-output", role: "generated-output" },
];
