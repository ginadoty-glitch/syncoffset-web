/**
 * SyncOffset Crew Authority — relationship contracts (no execution logic)
 *
 * @see docs/SYNCOFFSET_CREW_AUTHORITY.md
 */

import type { CoreObjectKind } from "../kinds";
import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-registry";

export const CREW_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "scriptrevision-scene-breakdown-crewrequirement",
    label: "Script Revision → Scene → Breakdown Element → Crew Requirement",
    steps: [
      { nodeKind: "script-revision", relationshipKind: "derived-from" },
      { nodeKind: "scene", relationshipKind: "derived-from" },
      { nodeKind: "breakdown-element", relationshipKind: "derived-from" },
      { nodeKind: "crew-requirement", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "scene-crewrequirement",
    label: "Scene → Crew Requirement",
    steps: [
      { nodeKind: "scene", relationshipKind: "requires" },
      { nodeKind: "crew-requirement", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "breakdownelement-crewrequirement",
    label: "Breakdown Element → Crew Requirement",
    steps: [
      { nodeKind: "breakdown-element", relationshipKind: "requires" },
      { nodeKind: "crew-requirement", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "departmentpackage-crewrequirement",
    label: "Department Package → Crew Requirement",
    steps: [
      { nodeKind: "department-package", relationshipKind: "requires" },
      { nodeKind: "crew-requirement", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "crewrequirement-department",
    label: "Crew Requirement → Department",
    steps: [
      { nodeKind: "crew-requirement", relationshipKind: "assigned-to" },
      { nodeKind: "department", relationshipKind: "references" },
    ],
  },
  {
    pathId: "crewmember-crewassignment",
    label: "Crew Member → Crew Assignment",
    steps: [
      { nodeKind: "crew-member", relationshipKind: "assigned-to" },
      { nodeKind: "crew-assignment", relationshipKind: "assigned-to" },
    ],
  },
  {
    pathId: "crewassignment-shootday",
    label: "Crew Assignment → Shoot Day",
    steps: [
      { nodeKind: "crew-assignment", relationshipKind: "scheduled-on" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
    ],
  },
  {
    pathId: "crewassignment-callsheet",
    label: "Crew Assignment → Callsheet",
    steps: [
      { nodeKind: "crew-assignment", relationshipKind: "references" },
      { nodeKind: "shoot-day", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
    notes: "Callsheet crew call times come from assignments on the shoot day.",
  },
  {
    pathId: "constitutional-crew-chain",
    label: "Script Revision → Scene → Breakdown → Crew Requirement → Crew Assignment → Shoot Day → Callsheet",
    steps: [
      { nodeKind: "script-revision", relationshipKind: "derived-from" },
      { nodeKind: "scene", relationshipKind: "derived-from" },
      { nodeKind: "breakdown-element", relationshipKind: "derived-from" },
      { nodeKind: "crew-requirement", relationshipKind: "requires" },
      { nodeKind: "crew-assignment", relationshipKind: "assigned-to" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
  },
];

export const CREW_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  { kind: "derived-from", fromKind: "scene", toKind: "crew-requirement", label: "Crew Requirement from Scene" },
  {
    kind: "derived-from",
    fromKind: "breakdown-element",
    toKind: "crew-requirement",
    label: "Crew Requirement from Breakdown Element",
  },
  {
    kind: "derived-from",
    fromKind: "department-package",
    toKind: "crew-requirement",
    label: "Crew Requirement from Department Package",
  },
  { kind: "assigned-to", fromKind: "crew-requirement", toKind: "department", label: "Requirement owned by Department" },
  { kind: "assigned-to", fromKind: "crew-member", toKind: "crew-assignment", label: "Crew Member on Assignment" },
  { kind: "scheduled-on", fromKind: "crew-assignment", toKind: "shoot-day", label: "Crew Assignment on Shoot Day" },
  {
    kind: "references",
    fromKind: "crew-assignment",
    toKind: "crew-requirement",
    label: "Assignment fulfills Requirement",
  },
  { kind: "assigned-to", fromKind: "crew-member", toKind: "department", label: "Crew Member in Department" },
];

export const CREW_MEMBER_RELATIONSHIP_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "department", role: "home-department" },
  { kind: "crew-assignment", role: "fulfillment" },
  { kind: "shoot-day", role: "shoot-day" },
  { kind: "generated-output", role: "callsheet" },
];

export const DEPARTMENT_OWNERSHIP_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "crew-member", role: "department-roster" },
  { kind: "crew-requirement", role: "open-positions" },
  { kind: "department-package", role: "department-package" },
  { kind: "crew-assignment", role: "day-assignments" },
];
