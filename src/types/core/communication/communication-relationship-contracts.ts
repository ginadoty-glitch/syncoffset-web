/**
 * SyncOffset Communication Authority — relationship contracts (no execution logic)
 *
 * @see docs/SYNCOFFSET_COMMUNICATION_AUTHORITY.md
 */

import type { CoreObjectKind } from "../kinds";
import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-entry";

export const COMMUNICATION_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "communication-distribution",
    label: "Communication → Distribution List → Recipients",
    steps: [
      { nodeKind: "communication", relationshipKind: "attached-to" },
      { nodeKind: "distribution-list", relationshipKind: "attached-to" },
      { nodeKind: "crew-member", relationshipKind: "references" },
    ],
    notes: "Recipients via list members — not a separate Recipient core kind in v1.",
  },
  {
    pathId: "callsheet-distribution",
    label: "Callsheet → Communication → Distribution List",
    steps: [
      { nodeKind: "callsheet", relationshipKind: "derived-from" },
      { nodeKind: "communication", relationshipKind: "derived-from" },
      { nodeKind: "distribution-list", relationshipKind: "attached-to" },
    ],
    notes: "Rule 4 — Callsheet remains authority; Communication distributes information.",
  },
  {
    pathId: "work-order-notification",
    label: "Work Order → Communication",
    steps: [
      { nodeKind: "work-order", relationshipKind: "derived-from" },
      { nodeKind: "communication", relationshipKind: "derived-from" },
    ],
    notes: "Rule 6 — Work Orders own work; Communication notifies about work.",
  },
  {
    pathId: "transport-notification",
    label: "Transport Order → Communication",
    steps: [
      { nodeKind: "transport-order", relationshipKind: "derived-from" },
      { nodeKind: "communication", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "production-notification",
    label: "Shoot Day → Communication",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "derived-from" },
      { nodeKind: "communication", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "calendar-communication",
    label: "Production Calendar → Shoot Day → Callsheet → Communication",
    steps: [
      { nodeKind: "production-calendar", relationshipKind: "derived-from" },
      { nodeKind: "shoot-day", relationshipKind: "derived-from" },
      { nodeKind: "callsheet", relationshipKind: "derived-from" },
      { nodeKind: "communication", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "communication-package-output",
    label: "Communication Package → Generated Output",
    steps: [
      { nodeKind: "communication-package", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
  },
];

export const COMMUNICATION_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  {
    kind: "attached-to",
    fromKind: "communication",
    toKind: "distribution-list",
    label: "Communication Distribution List",
  },
  { kind: "references", fromKind: "communication", toKind: "callsheet", label: "Communication for Callsheet" },
  { kind: "references", fromKind: "communication", toKind: "shoot-day", label: "Communication for Shoot Day" },
  { kind: "references", fromKind: "communication", toKind: "work-order", label: "Communication for Work Order" },
  {
    kind: "references",
    fromKind: "communication",
    toKind: "transport-order",
    label: "Communication for Transport Order",
  },
  { kind: "references", fromKind: "communication", toKind: "vendor", label: "Communication for Vendor" },
  { kind: "references", fromKind: "communication", toKind: "location", label: "Communication for Location" },
  { kind: "references", fromKind: "communication", toKind: "asset", label: "Communication for Asset" },
  { kind: "references", fromKind: "communication", toKind: "set", label: "Communication for Set" },
  { kind: "references", fromKind: "communication", toKind: "scene", label: "Communication for Scene" },
  { kind: "references", fromKind: "communication", toKind: "show", label: "Communication for Show" },
  {
    kind: "references",
    fromKind: "communication",
    toKind: "production-calendar",
    label: "Communication for Production Calendar",
  },
  {
    kind: "references",
    fromKind: "communication",
    toKind: "purchase-order",
    label: "Communication for Purchase Order",
  },
  { kind: "references", fromKind: "communication", toKind: "shipment", label: "Communication for Shipment" },
  { kind: "references", fromKind: "communication", toKind: "return", label: "Communication for Return" },
  { kind: "derived-from", fromKind: "callsheet", toKind: "communication", label: "Callsheet Communication" },
  { kind: "derived-from", fromKind: "work-order", toKind: "communication", label: "Work Order Communication" },
  { kind: "derived-from", fromKind: "transport-order", toKind: "communication", label: "Transport Communication" },
  { kind: "derived-from", fromKind: "shoot-day", toKind: "communication", label: "Shoot Day Communication" },
  { kind: "attached-to", fromKind: "communication", toKind: "communication-package", label: "Communication Package" },
  {
    kind: "generated-from",
    fromKind: "communication-package",
    toKind: "generated-output",
    label: "Communication Package Output",
  },
  {
    kind: "references",
    fromKind: "generated-output",
    toKind: "communication",
    label: "Output references Communication",
  },
  { kind: "assigned-to", fromKind: "distribution-list", toKind: "department", label: "Distribution List Department" },
];

export const COMMUNICATION_RELATIONSHIP_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "distribution-list", role: "distribution-list" },
  { kind: "communication-package", role: "package" },
  { kind: "callsheet", role: "callsheet" },
  { kind: "shoot-day", role: "shoot-day" },
  { kind: "work-order", role: "work-order" },
  { kind: "transport-order", role: "transport-order" },
  { kind: "production-calendar", role: "production-calendar" },
  { kind: "generated-output", role: "generated-output" },
  { kind: "department", role: "department" },
  { kind: "crew-member", role: "recipient" },
];
