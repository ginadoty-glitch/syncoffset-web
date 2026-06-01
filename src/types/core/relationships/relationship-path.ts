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
 * Canonical paths referenced by platform constitution and workspaces.
 * Order: source → intermediate → terminal (left-to-right).
 */
export const CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "schedule-shootday-callsheet",
    label: "Shoot Schedule → Shoot Day → Callsheet",
    steps: [
      { nodeKind: "shoot-schedule", relationshipKind: "derived-from" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
      { nodeKind: "callsheet-revision", relationshipKind: "generated-from" },
    ],
    notes: "Source document ingestion; ShootDay is calendar authority for committed schedule state.",
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
    pathId: "callsheetrevision-generated-output",
    label: "Callsheet Revision → Generated Output",
    steps: [
      { nodeKind: "callsheet-revision", relationshipKind: "generated-from" },
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
    ],
    notes: "Source callsheet revision (immutable file) to derived callsheet output (Article VI).",
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
    pathId: "scene-assets",
    label: "Scene ↔ Assets",
    steps: [
      { nodeKind: "scene", relationshipKind: "requires" },
      { nodeKind: "asset", relationshipKind: "requires" },
    ],
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
    pathId: "generated-output-source-documents",
    label: "Generated Output ↔ Source Documents",
    steps: [
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
      { nodeKind: "document", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "generated-output-authority-records",
    label: "Generated Output ↔ Authority Records",
    steps: [
      { nodeKind: "generated-output", relationshipKind: "generated-from" },
      { nodeKind: "shoot-day", relationshipKind: "references" },
    ],
    notes: "Authority records include ShootDay and other calendar-owned objects (Article VII).",
  },
];

export type RelationshipPathId = (typeof CANONICAL_RELATIONSHIP_PATHS)[number]["pathId"];

export function getCanonicalRelationshipPath(pathId: RelationshipPathId): CanonicalRelationshipPath | undefined {
  return CANONICAL_RELATIONSHIP_PATHS.find((p) => p.pathId === pathId);
}
