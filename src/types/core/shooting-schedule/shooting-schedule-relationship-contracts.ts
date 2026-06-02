/**
 * SyncOffset Shooting Schedule Authority — relationship contracts (no execution logic)
 *
 * @see docs/SYNCOFFSET_SHOOTING_SCHEDULE_AUTHORITY.md
 */

import type { CoreObjectKind } from "../kinds";
import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-entry";

export const SHOOTING_SCHEDULE_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "scriptrevision-scene-shootingschedule",
    label: "Script Revision → Scene → Shooting Schedule",
    steps: [
      { nodeKind: "script-revision", relationshipKind: "derived-from" },
      { nodeKind: "scene", relationshipKind: "derived-from" },
      { nodeKind: "shooting-schedule", relationshipKind: "derived-from" },
    ],
    notes: "Rule 2 — schedule consumes script/scene intent; does not create scenes.",
  },
  {
    pathId: "shootingschedule-productioncalendar",
    label: "Shooting Schedule → Production Calendar",
    steps: [
      { nodeKind: "shooting-schedule", relationshipKind: "derived-from" },
      { nodeKind: "production-calendar", relationshipKind: "derived-from" },
    ],
    notes: "Rule 3 — Production Calendar consumes Shooting Schedule; calendar does not create scenes.",
  },
  {
    pathId: "scriptrevision-scene-shootingschedule-productioncalendar",
    label: "Script Revision → Scene → Shooting Schedule → Production Calendar",
    steps: [
      { nodeKind: "script-revision", relationshipKind: "derived-from" },
      { nodeKind: "scene", relationshipKind: "derived-from" },
      { nodeKind: "shooting-schedule", relationshipKind: "derived-from" },
      { nodeKind: "production-calendar", relationshipKind: "derived-from" },
    ],
    notes: "Constitutional planning hierarchy — see SYNCOFFSET_PRODUCTION_CALENDAR_AUTHORITY.md.",
  },
  {
    pathId: "shootingschedule-shootingschedulerevision",
    label: "Shooting Schedule → Shooting Schedule Revision",
    steps: [
      { nodeKind: "shooting-schedule", relationshipKind: "derived-from" },
      { nodeKind: "shooting-schedule-revision", relationshipKind: "derived-from" },
    ],
    notes: "Rule 5 — multiple revisions supported.",
  },
  {
    pathId: "shootingschedule-shootingschedulepackage",
    label: "Shooting Schedule → Shooting Schedule Package",
    steps: [
      { nodeKind: "shooting-schedule", relationshipKind: "attached-to" },
      { nodeKind: "shooting-schedule-package", relationshipKind: "attached-to" },
    ],
    notes: "Rule 4 — exported files are packages, not the schedule object.",
  },
  {
    pathId: "sourcedocument-shootingschedule",
    label: "Source shoot-schedule → Shooting Schedule Revision",
    steps: [
      { nodeKind: "shoot-schedule", relationshipKind: "derived-from" },
      { nodeKind: "source-document", relationshipKind: "derived-from" },
      { nodeKind: "shooting-schedule-revision", relationshipKind: "derived-from" },
      { nodeKind: "shooting-schedule", relationshipKind: "derived-from" },
    ],
    notes: "Rule 1 — shoot-schedule is SourceDocumentKind only; constitutional term is shooting-schedule.",
  },
  {
    pathId: "shootingschedule-calendarday-shootday",
    label: "Shooting Schedule → Production Calendar → Calendar Day → Shoot Day",
    steps: [
      { nodeKind: "shooting-schedule", relationshipKind: "derived-from" },
      { nodeKind: "production-calendar", relationshipKind: "derived-from" },
      { nodeKind: "calendar-day", relationshipKind: "derived-from" },
      { nodeKind: "shoot-day", relationshipKind: "derived-from" },
    ],
    notes:
      "Rule 6 — Shoot Day does not derive directly from Shooting Schedule; execution flows through Production Calendar.",
  },
];

export const SHOOTING_SCHEDULE_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  {
    kind: "derived-from",
    fromKind: "shooting-schedule",
    toKind: "shooting-schedule-revision",
    label: "Shooting Schedule Revision",
  },
  {
    kind: "attached-to",
    fromKind: "shooting-schedule",
    toKind: "shooting-schedule-package",
    label: "Shooting Schedule Package",
  },
  { kind: "references", fromKind: "shooting-schedule", toKind: "show", label: "Schedule for Show" },
  {
    kind: "references",
    fromKind: "shooting-schedule",
    toKind: "script-revision",
    label: "Schedule for Script Revision",
  },
  { kind: "derived-from", fromKind: "shooting-schedule", toKind: "scene", label: "Schedule consumes Scene ordering" },
  {
    kind: "generated-from",
    fromKind: "shooting-schedule-package",
    toKind: "generated-output",
    label: "Shooting Schedule Package Output",
  },
  {
    kind: "references",
    fromKind: "generated-output",
    toKind: "shooting-schedule",
    label: "Output references Shooting Schedule",
  },
  {
    kind: "references",
    fromKind: "generated-output",
    toKind: "shooting-schedule-package",
    label: "Output references Shooting Schedule Package",
  },
  {
    kind: "references",
    fromKind: "shooting-schedule-revision",
    toKind: "source-document",
    label: "Revision provenance from source file",
  },
  {
    kind: "references",
    fromKind: "shooting-schedule-revision",
    toKind: "document",
    label: "Revision linked to logical document",
  },
  {
    kind: "references",
    fromKind: "shooting-schedule-revision",
    toKind: "document-revision",
    label: "Revision linked to document revision",
  },
];

export const SHOOTING_SCHEDULE_RELATIONSHIP_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "show", role: "show" },
  { kind: "script-revision", role: "script-revision" },
  { kind: "scene", role: "scene" },
  { kind: "shooting-schedule-revision", role: "shooting-schedule-revision" },
  { kind: "shooting-schedule-package", role: "shooting-schedule-package" },
  { kind: "production-calendar", role: "production-calendar" },
  { kind: "source-document", role: "source-document" },
  { kind: "document", role: "document" },
  { kind: "document-revision", role: "document-revision" },
  { kind: "generated-output", role: "generated-output" },
];
