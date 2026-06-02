/**
 * SyncOffset Callsheet Authority — relationship contracts (no execution logic)
 *
 * @see docs/SYNCOFFSET_CALLSHEET_AUTHORITY.md
 */

import type { CoreObjectKind } from "../kinds";
import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-entry";

export const CALLSHEET_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "productioncalendar-calendarday-shootday-callsheet",
    label: "Production Calendar → Calendar Day → Shoot Day → Callsheet",
    steps: [
      { nodeKind: "production-calendar", relationshipKind: "derived-from" },
      { nodeKind: "calendar-day", relationshipKind: "derived-from" },
      { nodeKind: "shoot-day", relationshipKind: "derived-from" },
      { nodeKind: "callsheet", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "shootday-callsheet",
    label: "Shoot Day → Callsheet",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "derived-from" },
      { nodeKind: "callsheet", relationshipKind: "derived-from" },
    ],
    notes: "Rule 1 — Callsheet consumes Shoot Day; does not create it.",
  },
  {
    pathId: "callsheet-callsheetrevision",
    label: "Callsheet → Callsheet Revision",
    steps: [
      { nodeKind: "callsheet", relationshipKind: "derived-from" },
      { nodeKind: "callsheet-revision", relationshipKind: "derived-from" },
    ],
    notes: "Rule 3 — multiple revisions supported.",
  },
  {
    pathId: "callsheet-callsheetdistribution",
    label: "Callsheet → Callsheet Distribution",
    steps: [
      { nodeKind: "callsheet", relationshipKind: "attached-to" },
      { nodeKind: "callsheet-distribution", relationshipKind: "attached-to" },
    ],
    notes: "Rule 5 — distribution is not ownership.",
  },
  {
    pathId: "callsheet-callsheetpackage",
    label: "Callsheet → Callsheet Package",
    steps: [
      { nodeKind: "callsheet", relationshipKind: "attached-to" },
      { nodeKind: "callsheet-package", relationshipKind: "attached-to" },
    ],
    notes: "Rule 4 — PDF/email/SMS/mobile are packages, not the Callsheet.",
  },
  {
    pathId: "callsheet-generatedoutput",
    label: "Callsheet → Generated Output",
    steps: [
      { nodeKind: "callsheet", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
  },
  {
    pathId: "callsheetpackage-generatedoutput",
    label: "Callsheet Package → Generated Output",
    steps: [
      { nodeKind: "callsheet-package", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
    notes: "Rule 4 — pdf-package kind produces generated-output; not the constitutional Callsheet.",
  },
  {
    pathId: "callsheet-operational-consumption",
    label: "Callsheet consumes production authorities",
    steps: [
      { nodeKind: "callsheet", relationshipKind: "references" },
      { nodeKind: "cast-assignment", relationshipKind: "references" },
    ],
    notes: "Rule 2 — also references crew, background, assets, locations, transport, schedule via schema edges.",
  },
];

export const CALLSHEET_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  { kind: "derived-from", fromKind: "shoot-day", toKind: "callsheet", label: "Callsheet for Shoot Day" },
  { kind: "derived-from", fromKind: "callsheet", toKind: "callsheet-revision", label: "Callsheet Revision" },
  { kind: "attached-to", fromKind: "callsheet", toKind: "callsheet-distribution", label: "Callsheet Distribution" },
  { kind: "attached-to", fromKind: "callsheet", toKind: "callsheet-package", label: "Callsheet Package" },
  { kind: "generated-from", fromKind: "callsheet", toKind: "generated-output", label: "Callsheet Generated Output" },
  {
    kind: "generated-from",
    fromKind: "callsheet-package",
    toKind: "generated-output",
    label: "Callsheet Package Output",
  },
  { kind: "references", fromKind: "callsheet", toKind: "show", label: "Callsheet for Show" },
  { kind: "references", fromKind: "callsheet", toKind: "production-calendar", label: "Callsheet Schedule Context" },
  { kind: "references", fromKind: "callsheet", toKind: "calendar-day", label: "Callsheet Calendar Day" },
  { kind: "references", fromKind: "callsheet", toKind: "shooting-schedule", label: "Callsheet Shooting Schedule" },
  { kind: "references", fromKind: "callsheet", toKind: "cast-assignment", label: "Callsheet Cast" },
  { kind: "references", fromKind: "callsheet", toKind: "bg-assignment", label: "Callsheet Background" },
  { kind: "references", fromKind: "callsheet", toKind: "crew-assignment", label: "Callsheet Crew" },
  { kind: "references", fromKind: "callsheet", toKind: "asset-assignment", label: "Callsheet Assets" },
  { kind: "references", fromKind: "callsheet", toKind: "location-assignment", label: "Callsheet Locations" },
  { kind: "references", fromKind: "callsheet", toKind: "transport-order", label: "Callsheet Transportation" },
  { kind: "references", fromKind: "generated-output", toKind: "callsheet", label: "Output references Callsheet" },
  {
    kind: "references",
    fromKind: "generated-output",
    toKind: "callsheet-package",
    label: "Output references Callsheet Package",
  },
];

export const CALLSHEET_RELATIONSHIP_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "shoot-day", role: "shoot-day" },
  { kind: "callsheet-revision", role: "revision" },
  { kind: "callsheet-distribution", role: "distribution" },
  { kind: "callsheet-package", role: "package" },
  { kind: "generated-output", role: "generated-output" },
  { kind: "cast-assignment", role: "cast" },
  { kind: "bg-assignment", role: "background" },
  { kind: "crew-assignment", role: "crew" },
  { kind: "asset-assignment", role: "asset" },
  { kind: "location-assignment", role: "location" },
  { kind: "transport-order", role: "transportation" },
  { kind: "shooting-schedule", role: "schedule" },
  { kind: "production-calendar", role: "calendar" },
];
