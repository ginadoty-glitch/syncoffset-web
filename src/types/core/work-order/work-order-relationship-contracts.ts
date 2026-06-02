/**
 * SyncOffset Work Order Authority — relationship contracts (no execution logic)
 *
 * @see docs/SYNCOFFSET_WORK_ORDER_AUTHORITY.md
 */

import type { CoreObjectKind } from "../kinds";
import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-entry";

export const WORK_ORDER_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "planning-to-execution",
    label: "Budget Requirement → Work Order → Work Order Task → Shoot Day",
    steps: [
      { nodeKind: "budget-requirement", relationshipKind: "derived-from" },
      { nodeKind: "work-order", relationshipKind: "derived-from" },
      { nodeKind: "work-order-task", relationshipKind: "derived-from" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
    ],
    notes: "Work orders execute the need — they do not create it.",
  },
  {
    pathId: "scene-work",
    label: "Scene → Set → Work Order",
    steps: [
      { nodeKind: "scene", relationshipKind: "references" },
      { nodeKind: "set", relationshipKind: "references" },
      { nodeKind: "work-order", relationshipKind: "references" },
    ],
    notes: "Rule 5 — Scene creates need; Work Order always on Set (Rule 4).",
  },
  {
    pathId: "department-work",
    label: "Department → Work Order → Department",
    steps: [
      { nodeKind: "department", relationshipKind: "derived-from" },
      { nodeKind: "work-order", relationshipKind: "derived-from" },
      { nodeKind: "department", relationshipKind: "assigned-to" },
    ],
    notes: "Requesting department initiates; assigned department executes.",
  },
  {
    pathId: "execution-package",
    label: "Work Order → Work Order Package → Generated Output",
    steps: [
      { nodeKind: "work-order", relationshipKind: "attached-to" },
      { nodeKind: "work-order-package", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
    notes: "Documentation packages only — no workflow engine.",
  },
];

export const WORK_ORDER_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  { kind: "derived-from", fromKind: "department", toKind: "work-order", label: "Department Work Order Request" },
  { kind: "derived-from", fromKind: "work-order", toKind: "work-order-task", label: "Work Order Task" },
  { kind: "attached-to", fromKind: "work-order", toKind: "work-order-package", label: "Work Order Package" },
  { kind: "references", fromKind: "work-order", toKind: "set", label: "Work Order on Set" },
  { kind: "references", fromKind: "work-order", toKind: "scene", label: "Work Order for Scene" },
  { kind: "references", fromKind: "work-order", toKind: "budget-requirement", label: "Work Order Budget Trace" },
  { kind: "scheduled-on", fromKind: "work-order", toKind: "shoot-day", label: "Work Order on Shoot Day" },
  { kind: "generated-from", fromKind: "work-order", toKind: "generated-output", label: "Work Order Generated Output" },
  {
    kind: "generated-from",
    fromKind: "work-order-package",
    toKind: "generated-output",
    label: "Work Order Package Output",
  },
  { kind: "assigned-to", fromKind: "work-order", toKind: "department", label: "Assigned Department" },
  { kind: "derived-from", fromKind: "budget-requirement", toKind: "work-order", label: "Work Order from Budget" },
  { kind: "references", fromKind: "generated-output", toKind: "work-order", label: "Output references Work Order" },
];

export const WORK_ORDER_RELATIONSHIP_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "department", role: "department" },
  { kind: "scene", role: "scene" },
  { kind: "set", role: "set" },
  { kind: "budget-requirement", role: "budget-requirement" },
  { kind: "work-order-task", role: "task" },
  { kind: "work-order-package", role: "package" },
  { kind: "shoot-day", role: "shoot-day" },
  { kind: "generated-output", role: "generated-output" },
];
