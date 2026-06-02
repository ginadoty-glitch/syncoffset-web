/**
 * SyncOffset Relationship Graph — canonical propagation paths (documentation only)
 *
 * Describes intended multi-hop paths for a future propagation engine.
 * No path evaluation, traversal, or runtime logic in this module.
 *
 * Existing application propagation (logistics) remains separate until migrated.
 */

import type { CoreObjectKind } from "../kinds";
import type { SourceDocumentKind } from "../source/source-document-kind";
import type { RelationshipKind } from "./relationship-kind";

/** One hop in a documented canonical path. */
export type RelationshipPathStep = {
  readonly nodeKind: CoreObjectKind | SourceDocumentKind;
  readonly relationshipKind: RelationshipKind;
  readonly description?: string;
};

/**
 * A named multi-hop path through the graph — specification only.
 */
export type CanonicalRelationshipPath = {
  readonly pathId: string;
  readonly label: string;
  readonly steps: ReadonlyArray<RelationshipPathStep>;
  readonly notes?: string;
};

/**
 * Deprecated paths — documentation only; do not use for new propagation or UI.
 * @see docs/SYNCOFFSET_NAMING_REGISTRY.md
 */
export const LEGACY_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "schedule-shootday-callsheet",
    label: "Shoot Schedule (source) → Shoot Day → Callsheet (legacy source terminal)",
    steps: [
      { nodeKind: "shoot-schedule", relationshipKind: "derived-from" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
      { nodeKind: "callsheet-revision", relationshipKind: "generated-from" },
    ],
    notes: "Deprecated — use full-production-timeline + callsheet-document-chain.",
  },
  {
    pathId: "callsheetrevision-generated-output",
    label: "Source Callsheet Revision → Generated Output (legacy)",
    steps: [
      { nodeKind: "callsheet-revision", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
    notes:
      "Deprecated SourceDocumentKind terminal — use callsheet → callsheet-package → generated-output and document chain.",
  },
];

/**
 * Active canonical paths referenced by platform constitution and workspaces.
 * Order: source → intermediate → terminal (left-to-right).
 */
export const CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
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
    notes:
      "Production Calendar → Callsheet Authority. See SYNCOFFSET_PRODUCTION_CALENDAR_AUTHORITY.md and SYNCOFFSET_CALLSHEET_AUTHORITY.md.",
  },
  {
    pathId: "asset-inventory",
    label: "Asset → Inventory Record",
    steps: [
      { nodeKind: "asset", relationshipKind: "references" },
      { nodeKind: "inventory-record", relationshipKind: "derived-from" },
    ],
    notes: "Inventory Authority Rule 1 — Asset identity; Inventory possession.",
  },
  {
    pathId: "callsheet-distribution",
    label: "Callsheet → Communication → Distribution List",
    steps: [
      { nodeKind: "callsheet", relationshipKind: "derived-from" },
      { nodeKind: "communication", relationshipKind: "derived-from" },
      { nodeKind: "distribution-list", relationshipKind: "attached-to" },
    ],
    notes: "Communication Authority Rule 4 — Callsheet owns execution; Communication distributes.",
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
    notes: "Production Accounting Authority — planned / committed / actual; not corporate GL.",
  },
  {
    pathId: "procurement-to-cost",
    label: "Purchase Order → Production Cost",
    steps: [
      { nodeKind: "purchase-order", relationshipKind: "derived-from" },
      { nodeKind: "production-cost", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "planning-to-execution",
    label: "Budget Requirement → Work Order → Work Order Task → Shoot Day",
    steps: [
      { nodeKind: "budget-requirement", relationshipKind: "derived-from" },
      { nodeKind: "work-order", relationshipKind: "derived-from" },
      { nodeKind: "work-order-task", relationshipKind: "derived-from" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
    ],
    notes: "Work Order Authority — executes the need; does not create it.",
  },
  {
    pathId: "scene-work",
    label: "Scene → Set → Work Order",
    steps: [
      { nodeKind: "scene", relationshipKind: "references" },
      { nodeKind: "set", relationshipKind: "references" },
      { nodeKind: "work-order", relationshipKind: "references" },
    ],
  },
  {
    pathId: "execution-package",
    label: "Work Order → Work Order Package → Generated Output",
    steps: [
      { nodeKind: "work-order", relationshipKind: "attached-to" },
      { nodeKind: "work-order-package", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
  },
  {
    pathId: "shootday-callsheet",
    label: "Shoot Day → Callsheet",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "derived-from" },
      { nodeKind: "callsheet", relationshipKind: "derived-from" },
    ],
    notes: "Callsheet Authority Rule 1 — consumes Shoot Day.",
  },
  {
    pathId: "callsheet-callsheetpackage-generatedoutput",
    label: "Callsheet → Callsheet Package → Generated Output",
    steps: [
      { nodeKind: "callsheet", relationshipKind: "attached-to" },
      { nodeKind: "callsheet-package", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
    notes: "Rule 4 — PDF is pdf-package output, not the Callsheet object.",
  },
  {
    pathId: "shootingschedule-productioncalendar",
    label: "Shooting Schedule → Production Calendar",
    steps: [
      { nodeKind: "shooting-schedule", relationshipKind: "derived-from" },
      { nodeKind: "production-calendar", relationshipKind: "derived-from" },
    ],
    notes:
      "Shooting Schedule Authority Rule 3 — calendar consumes schedule. See SYNCOFFSET_SHOOTING_SCHEDULE_AUTHORITY.md.",
  },
  {
    pathId: "scriptrevision-scene-shootingschedule",
    label: "Script Revision → Scene → Shooting Schedule",
    steps: [
      { nodeKind: "script-revision", relationshipKind: "derived-from" },
      { nodeKind: "scene", relationshipKind: "derived-from" },
      { nodeKind: "shooting-schedule", relationshipKind: "derived-from" },
    ],
    notes: "Shooting Schedule Authority Rule 2 — schedule consumes scene intent.",
  },
  {
    pathId: "sourcedocument-shootingschedule",
    label: "Source shoot-schedule → Shooting Schedule",
    steps: [
      { nodeKind: "shoot-schedule", relationshipKind: "derived-from" },
      { nodeKind: "source-document", relationshipKind: "derived-from" },
      { nodeKind: "shooting-schedule-revision", relationshipKind: "derived-from" },
      { nodeKind: "shooting-schedule", relationshipKind: "derived-from" },
    ],
    notes: "Rule 1 — shoot-schedule is SourceDocumentKind only; constitutional term is shooting-schedule.",
  },
  {
    pathId: "shootingschedule-shootingschedulerevision",
    label: "Shooting Schedule → Shooting Schedule Revision",
    steps: [
      { nodeKind: "shooting-schedule", relationshipKind: "derived-from" },
      { nodeKind: "shooting-schedule-revision", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "shootingschedule-shootingschedulepackage",
    label: "Shooting Schedule → Shooting Schedule Package",
    steps: [
      { nodeKind: "shooting-schedule", relationshipKind: "attached-to" },
      { nodeKind: "shooting-schedule-package", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "calendarday-shootday",
    label: "Calendar Day → Shoot Day",
    steps: [
      { nodeKind: "calendar-day", relationshipKind: "derived-from" },
      { nodeKind: "shoot-day", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "schedule-shootday-transport",
    label: "Shoot Schedule → Shoot Day → Transport Order",
    steps: [
      { nodeKind: "shoot-schedule", relationshipKind: "derived-from" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
      { nodeKind: "transport-order", relationshipKind: "depends-on" },
    ],
    notes: "Aligns with Workspace 04 Operations; distinct from logistics UI propagation.ts until unified.",
  },
  {
    pathId: "schedule-shootday-company-move",
    label: "Shoot Schedule → Shoot Day → Company Move",
    steps: [
      { nodeKind: "shoot-schedule", relationshipKind: "derived-from" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
      { nodeKind: "company-move", relationshipKind: "scheduled-on" },
    ],
  },
  {
    pathId: "scriptrevision-scene-shootday",
    label: "Script Revision → Scene → Shoot Day",
    steps: [
      { nodeKind: "script-revision", relationshipKind: "derived-from" },
      { nodeKind: "scene", relationshipKind: "scheduled-on" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
    ],
  },
  {
    pathId: "shootday-scene",
    label: "Shoot Day ↔ Scene",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
      { nodeKind: "scene", relationshipKind: "scheduled-on" },
    ],
  },
  {
    pathId: "shootday-location",
    label: "Shoot Day ↔ Location",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "occurs-at" },
      { nodeKind: "location", relationshipKind: "occurs-at" },
    ],
  },
  {
    pathId: "shootday-media",
    label: "Shoot Day ↔ Media",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "attached-to" },
      { nodeKind: "media", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "scene-location",
    label: "Scene ↔ Location",
    steps: [
      { nodeKind: "scene", relationshipKind: "occurs-at" },
      { nodeKind: "location", relationshipKind: "occurs-at" },
    ],
  },
  {
    pathId: "scene-cast",
    label: "Scene ↔ Cast",
    steps: [
      { nodeKind: "scene", relationshipKind: "assigned-to" },
      { nodeKind: "cast-member", relationshipKind: "assigned-to" },
    ],
  },
  {
    pathId: "scene-set-asset",
    label: "Scene → Set → Asset",
    steps: [
      { nodeKind: "scene", relationshipKind: "references" },
      { nodeKind: "set", relationshipKind: "references" },
      { nodeKind: "asset", relationshipKind: "attached-to" },
    ],
    notes: "Assets belong to Sets — not Scenes. See Asset Authority.",
  },
  {
    pathId: "location-permits",
    label: "Location ↔ Permits",
    steps: [
      { nodeKind: "location", relationshipKind: "requires" },
      { nodeKind: "permit", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "source-document-chain",
    label: "Source Document → Document Revision → Document",
    steps: [
      { nodeKind: "source-document", relationshipKind: "derived-from" },
      { nodeKind: "document-revision", relationshipKind: "derived-from" },
      { nodeKind: "document", relationshipKind: "derived-from" },
    ],
    notes: "Canonical document architecture — all uploads resolve through this chain.",
  },
  {
    pathId: "generated-output-document-chain",
    label: "Generated Output → Document → Document Revision → Source Document",
    steps: [
      { nodeKind: "generated-output", relationshipKind: "references" },
      { nodeKind: "document", relationshipKind: "derived-from" },
      { nodeKind: "document-revision", relationshipKind: "derived-from" },
      { nodeKind: "source-document", relationshipKind: "derived-from" },
    ],
    notes: "Provenance trace from output back to Article I file.",
  },
  {
    pathId: "callsheet-document-chain",
    label: "Shoot Day → Callsheet → Document",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "derived-from" },
      { nodeKind: "callsheet", relationshipKind: "derived-from" },
      { nodeKind: "document", relationshipKind: "references" },
    ],
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
    label: "Production Cost → Document",
    steps: [
      { nodeKind: "production-cost", relationshipKind: "references" },
      { nodeKind: "document", relationshipKind: "references" },
    ],
  },
  {
    pathId: "generated-output-authority-records",
    label: "Generated Output ↔ Authority Records",
    steps: [
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
      { nodeKind: "shoot-day", relationshipKind: "references" },
    ],
    notes: "Authority records include Production Calendar, Calendar Day, Shoot Day, and related outputs.",
  },
];

export type RelationshipPathId = (typeof CANONICAL_RELATIONSHIP_PATHS)[number]["pathId"];

export function getCanonicalRelationshipPath(pathId: RelationshipPathId): CanonicalRelationshipPath | undefined {
  return CANONICAL_RELATIONSHIP_PATHS.find((p) => p.pathId === pathId);
}
