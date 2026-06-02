/**
 * SyncOffset Production Calendar Authority — relationship contracts (no execution logic)
 *
 * @see docs/SYNCOFFSET_PRODUCTION_CALENDAR_AUTHORITY.md
 */

import type { CoreObjectKind } from "../kinds";
import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-entry";

export const PRODUCTION_CALENDAR_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "scriptrevision-scene-shootingschedule-calendar",
    label: "Script Revision → Scene → Shooting Schedule → Production Calendar",
    steps: [
      { nodeKind: "script-revision", relationshipKind: "derived-from" },
      { nodeKind: "scene", relationshipKind: "derived-from" },
      { nodeKind: "shooting-schedule", relationshipKind: "derived-from" },
      { nodeKind: "production-calendar", relationshipKind: "derived-from" },
    ],
    notes: "Schedule Strip / Schedule Day kinds are future scheduling authority — not in v1 paths.",
  },
  {
    pathId: "shootingschedule-productioncalendar",
    label: "Shooting Schedule → Production Calendar",
    steps: [
      { nodeKind: "shooting-schedule", relationshipKind: "derived-from" },
      { nodeKind: "production-calendar", relationshipKind: "derived-from" },
    ],
    notes: "Rule 1 — Production Calendar consumes Shooting Schedule; does not create scenes.",
  },
  {
    pathId: "productioncalendar-calendarday",
    label: "Production Calendar → Calendar Day",
    steps: [
      { nodeKind: "production-calendar", relationshipKind: "derived-from" },
      { nodeKind: "calendar-day", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "productioncalendar-calendarrevision",
    label: "Production Calendar → Calendar Revision",
    steps: [
      { nodeKind: "production-calendar", relationshipKind: "derived-from" },
      { nodeKind: "calendar-revision", relationshipKind: "derived-from" },
    ],
    notes: "Rule 5 — multiple revisions supported.",
  },
  {
    pathId: "productioncalendar-calendarpackage",
    label: "Production Calendar → Calendar Package",
    steps: [
      { nodeKind: "production-calendar", relationshipKind: "attached-to" },
      { nodeKind: "calendar-package", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "calendarday-shootday",
    label: "Calendar Day → Shoot Day",
    steps: [
      { nodeKind: "calendar-day", relationshipKind: "derived-from" },
      { nodeKind: "shoot-day", relationshipKind: "derived-from" },
    ],
    notes:
      "Rule 2 — Shoot Days generated from Calendar Days when dayType is shoot (or execution types). Rule 3 — prep/holiday/travel days may omit Shoot Day.",
  },
  {
    pathId: "shootday-callsheet",
    label: "Shoot Day → Callsheet",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "derived-from" },
      { nodeKind: "callsheet", relationshipKind: "derived-from" },
    ],
    notes: "Callsheet Authority — operational package consumes Shoot Day (not a calendar object).",
  },
  {
    pathId: "full-production-timeline",
    label: "Script Revision → Scene → Shooting Schedule → Production Calendar → Calendar Day → Shoot Day → Callsheet",
    steps: [
      { nodeKind: "script-revision", relationshipKind: "derived-from" },
      { nodeKind: "scene", relationshipKind: "derived-from" },
      { nodeKind: "shooting-schedule", relationshipKind: "derived-from" },
      { nodeKind: "production-calendar", relationshipKind: "derived-from" },
      { nodeKind: "calendar-day", relationshipKind: "derived-from" },
      { nodeKind: "shoot-day", relationshipKind: "derived-from" },
      { nodeKind: "callsheet", relationshipKind: "derived-from" },
    ],
  },
];

export const PRODUCTION_CALENDAR_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  {
    kind: "derived-from",
    fromKind: "production-calendar",
    toKind: "shooting-schedule",
    label: "Calendar consumes Shooting Schedule",
  },
  {
    kind: "derived-from",
    fromKind: "production-calendar",
    toKind: "calendar-day",
    label: "Calendar Day on Production Calendar",
  },
  {
    kind: "derived-from",
    fromKind: "production-calendar",
    toKind: "calendar-revision",
    label: "Calendar Revision",
  },
  {
    kind: "attached-to",
    fromKind: "production-calendar",
    toKind: "calendar-package",
    label: "Calendar Package",
  },
  {
    kind: "derived-from",
    fromKind: "calendar-day",
    toKind: "shoot-day",
    label: "Shoot Day from Calendar Day",
  },
  {
    kind: "references",
    fromKind: "production-calendar",
    toKind: "show",
    label: "Calendar for Show",
  },
  {
    kind: "generated-from",
    fromKind: "calendar-package",
    toKind: "generated-output",
    label: "Calendar Package Output",
  },
  {
    kind: "references",
    fromKind: "generated-output",
    toKind: "production-calendar",
    label: "Output references Production Calendar",
  },
  {
    kind: "references",
    fromKind: "generated-output",
    toKind: "calendar-day",
    label: "Output references Calendar Day",
  },
];

export const PRODUCTION_CALENDAR_RELATIONSHIP_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "show", role: "show" },
  { kind: "shooting-schedule", role: "shooting-schedule" },
  { kind: "calendar-day", role: "calendar-day" },
  { kind: "calendar-revision", role: "calendar-revision" },
  { kind: "calendar-package", role: "calendar-package" },
  { kind: "shoot-day", role: "shoot-day" },
  { kind: "callsheet", role: "callsheet" },
  { kind: "scene", role: "scene" },
];
