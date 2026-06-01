/**
 * SyncOffset Background — relationship contracts (no execution logic)
 *
 * Integrates with the platform relationship graph.
 * @see docs/SYNCOFFSET_BACKGROUND_AUTHORITY.md
 */

import type { CoreObjectKind } from "../kinds";
import type { RelationshipKind } from "../relationships/relationship-kind";
import type { CanonicalRelationshipPath, RelationshipPathStep } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-registry";
import type { SourceDocumentKind } from "../source/source-document-kind";

export type BgRelationshipPathStep = RelationshipPathStep;

export type BgCanonicalRelationshipPath = CanonicalRelationshipPath;

/**
 * Constitutional BG graph paths (documentation + future propagation input).
 */
export const BG_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<BgCanonicalRelationshipPath> = [
  {
    pathId: "scriptrevision-scene-breakdown",
    label: "Script Revision → Scene",
    steps: [
      { nodeKind: "script-revision", relationshipKind: "derived-from" },
      { nodeKind: "scene", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "scene-element-bgrequirement",
    label: "Scene → Breakdown Element → BG Requirement",
    steps: [
      { nodeKind: "scene", relationshipKind: "requires" },
      { nodeKind: "element", relationshipKind: "requires" },
      { nodeKind: "bg-requirement", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "bgrequirement-bgassignment",
    label: "BG Requirement → BG Assignment",
    steps: [
      { nodeKind: "bg-requirement", relationshipKind: "requires" },
      { nodeKind: "bg-assignment", relationshipKind: "assigned-to" },
    ],
  },
  {
    pathId: "backgroundperformer-bgassignment",
    label: "Background Performer → BG Assignment",
    steps: [
      { nodeKind: "background-performer", relationshipKind: "assigned-to" },
      { nodeKind: "bg-assignment", relationshipKind: "assigned-to" },
    ],
  },
  {
    pathId: "bgassignment-shootday",
    label: "BG Assignment → Shoot Day",
    steps: [
      { nodeKind: "bg-assignment", relationshipKind: "scheduled-on" },
      { nodeKind: "shoot-day", relationshipKind: "scheduled-on" },
    ],
  },
  {
    pathId: "shootday-callsheet-bg",
    label: "Shoot Day → Callsheet",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "generated-from" },
      { nodeKind: "callsheet-revision" as SourceDocumentKind, relationshipKind: "generated-from" },
    ],
    notes: "Callsheet source/output consumes ShootDay authority; BG counts flow via assignments.",
  },
  {
    pathId: "shootday-dood-bg",
    label: "Shoot Day → DOOD",
    steps: [
      { nodeKind: "shoot-day", relationshipKind: "generated-from" },
      { nodeKind: "dood", relationshipKind: "generated-from" },
    ],
  },
];

/**
 * BG-specific edges for RELATIONSHIP_SCHEMA_REGISTRY integration.
 */
export const BG_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  { kind: "derived-from", fromKind: "script-revision", toKind: "scene", label: "Scenes from Script Revision" },
  { kind: "requires", fromKind: "scene", toKind: "element", label: "Scene Breakdown Element" },
  { kind: "derived-from", fromKind: "element", toKind: "bg-requirement", label: "BG Requirement from Element" },
  {
    kind: "requires",
    fromKind: "bg-requirement",
    toKind: "bg-assignment",
    label: "Requirement fulfilled by Assignment",
  },
  { kind: "assigned-to", fromKind: "background-performer", toKind: "bg-assignment", label: "Performer on Assignment" },
  { kind: "scheduled-on", fromKind: "bg-assignment", toKind: "shoot-day", label: "Assignment on Shoot Day" },
  { kind: "references", fromKind: "bg-assignment", toKind: "scene", label: "Assignment for Scene" },
  { kind: "generated-from", fromKind: "shoot-day", toKind: "generated-output", label: "Shoot Day drives BG outputs" },
];

/** Supported future relationship targets for BackgroundPerformer (documentation). */
export const BACKGROUND_PERFORMER_RELATIONSHIP_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind | SourceDocumentKind;
  readonly relationshipKind: RelationshipKind;
  readonly role: string;
}> = [
  { kind: "shoot-day", relationshipKind: "scheduled-on", role: "scheduled-day" },
  { kind: "scene", relationshipKind: "assigned-to", role: "scene-work" },
  { kind: "bg-assignment", relationshipKind: "assigned-to", role: "fulfillment" },
  { kind: "generated-output", relationshipKind: "references", role: "callsheet-dood-output" },
];
