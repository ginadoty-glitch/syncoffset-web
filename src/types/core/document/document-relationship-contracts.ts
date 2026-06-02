/**
 * SyncOffset Document Authority — relationship contracts (no execution logic)
 *
 * @see docs/SYNCOFFSET_DOCUMENT_AUTHORITY.md
 */

import type { CoreObjectKind } from "../kinds";
import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-entry";

export const DOCUMENT_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "document-revision-history",
    label: "Document → Document Revision",
    steps: [
      { nodeKind: "document", relationshipKind: "derived-from" },
      { nodeKind: "document-revision", relationshipKind: "derived-from" },
    ],
    notes: "Rule 3 — immutable revision provenance; may link source-document ingestion id.",
  },
  {
    pathId: "document-production-context",
    label: "Document → Scene / Set / Callsheet / Production Calendar",
    steps: [
      { nodeKind: "document", relationshipKind: "references" },
      { nodeKind: "scene", relationshipKind: "references" },
    ],
    notes: "Rule 4 — production hierarchy trace.",
  },
  {
    pathId: "document-logistics-context",
    label: "Document → Shipment / Return / Asset",
    steps: [
      { nodeKind: "document", relationshipKind: "references" },
      { nodeKind: "shipment", relationshipKind: "references" },
    ],
  },
  {
    pathId: "document-financial-context",
    label: "Document → Purchase Order / Vendor / Brokerage",
    steps: [
      { nodeKind: "document", relationshipKind: "references" },
      { nodeKind: "purchase-order", relationshipKind: "references" },
    ],
  },
  {
    pathId: "document-package-output",
    label: "Document → Document Package → Generated Output",
    steps: [
      { nodeKind: "document", relationshipKind: "attached-to" },
      { nodeKind: "document-package", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
  },
  {
    pathId: "source-ingestion-document",
    label: "Source Document (ingestion) → Document Revision → Document",
    steps: [
      { nodeKind: "source-document", relationshipKind: "derived-from" },
      { nodeKind: "document-revision", relationshipKind: "derived-from" },
      { nodeKind: "document", relationshipKind: "derived-from" },
    ],
    notes:
      "Article I file upload resolves to Document Authority (Rule 1). Target: SourceDocument → DocumentRevision → Document.",
  },
  {
    pathId: "callsheet-document-chain",
    label: "Callsheet → Document (provenance)",
    steps: [
      { nodeKind: "callsheet", relationshipKind: "references" },
      { nodeKind: "document", relationshipKind: "references" },
    ],
    notes: "Replaces legacy source-terminal paths on callsheet-revision SourceDocumentKind.",
  },
  {
    pathId: "purchase-order-document-chain",
    label: "Purchase Order → Document",
    steps: [
      { nodeKind: "purchase-order", relationshipKind: "references" },
      { nodeKind: "document", relationshipKind: "references" },
    ],
  },
  {
    pathId: "shipment-document-chain",
    label: "Shipment → Document",
    steps: [
      { nodeKind: "shipment", relationshipKind: "references" },
      { nodeKind: "document", relationshipKind: "references" },
    ],
  },
  {
    pathId: "brokerage-document-chain",
    label: "Brokerage Record → Document",
    steps: [
      { nodeKind: "brokerage-record", relationshipKind: "references" },
      { nodeKind: "document", relationshipKind: "references" },
    ],
  },
  {
    pathId: "communication-document-chain",
    label: "Communication → Document",
    steps: [
      { nodeKind: "communication", relationshipKind: "references" },
      { nodeKind: "document", relationshipKind: "references" },
    ],
  },
  {
    pathId: "production-cost-document-chain",
    label: "Production Cost → Document (receipt / invoice)",
    steps: [
      { nodeKind: "production-cost", relationshipKind: "references" },
      { nodeKind: "document", relationshipKind: "references" },
    ],
    notes: "Accounting Authority — receipts and invoices via Document provenance.",
  },
];

export const DOCUMENT_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  { kind: "derived-from", fromKind: "document", toKind: "document-revision", label: "Document Revision" },
  { kind: "attached-to", fromKind: "document", toKind: "document-package", label: "Document Package" },
  { kind: "references", fromKind: "document", toKind: "document-link", label: "Document Link" },
  { kind: "references", fromKind: "document", toKind: "scene", label: "Document for Scene" },
  { kind: "references", fromKind: "document", toKind: "set", label: "Document for Set" },
  { kind: "references", fromKind: "document", toKind: "asset", label: "Document for Asset" },
  { kind: "references", fromKind: "document", toKind: "shipment", label: "Document for Shipment" },
  { kind: "references", fromKind: "document", toKind: "brokerage-record", label: "Document for Brokerage" },
  { kind: "references", fromKind: "document", toKind: "return", label: "Document for Return" },
  { kind: "references", fromKind: "document", toKind: "vendor", label: "Document for Vendor" },
  { kind: "references", fromKind: "document", toKind: "purchase-order", label: "Document for Purchase Order" },
  { kind: "references", fromKind: "document", toKind: "location", label: "Document for Location" },
  { kind: "references", fromKind: "document", toKind: "callsheet", label: "Document for Callsheet" },
  {
    kind: "references",
    fromKind: "document",
    toKind: "production-calendar",
    label: "Document for Production Calendar",
  },
  { kind: "references", fromKind: "document-link", toKind: "scene", label: "Link to Scene" },
  { kind: "references", fromKind: "document-link", toKind: "asset", label: "Link to Asset" },
  {
    kind: "generated-from",
    fromKind: "document-package",
    toKind: "generated-output",
    label: "Document Package Output",
  },
  {
    kind: "derived-from",
    fromKind: "source-document",
    toKind: "document-revision",
    label: "Revision from Source Ingestion",
  },
  { kind: "references", fromKind: "generated-output", toKind: "document", label: "Output references Document" },
  { kind: "references", fromKind: "purchase-order", toKind: "document", label: "Purchase Order Document" },
  { kind: "references", fromKind: "shipment", toKind: "document", label: "Shipment Document" },
  { kind: "references", fromKind: "brokerage-record", toKind: "document", label: "Brokerage Document" },
  { kind: "references", fromKind: "return", toKind: "document", label: "Return Document" },
  { kind: "references", fromKind: "communication", toKind: "document", label: "Communication Document" },
  { kind: "references", fromKind: "production-cost", toKind: "document", label: "Production Cost Document" },
  { kind: "references", fromKind: "callsheet", toKind: "document", label: "Callsheet Document Provenance" },
];

export const DOCUMENT_RELATIONSHIP_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "document-revision", role: "revision" },
  { kind: "document-package", role: "package" },
  { kind: "document-link", role: "link" },
  { kind: "source-document", role: "source-ingestion" },
  { kind: "scene", role: "scene" },
  { kind: "set", role: "set" },
  { kind: "generated-output", role: "generated-output" },
];
