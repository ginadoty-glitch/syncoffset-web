/**
 * SyncOffset Creative Authority — relationship contracts (no execution logic)
 *
 * @see docs/SYNCOFFSET_CREATIVE_AUTHORITY.md
 */

import type { CoreObjectKind } from "../kinds";
import type { CanonicalRelationshipPath } from "../relationships/relationship-path";
import type { RelationshipSchemaEntry } from "../relationships/relationship-schema-registry";

export const CREATIVE_CANONICAL_RELATIONSHIP_PATHS: ReadonlyArray<CanonicalRelationshipPath> = [
  {
    pathId: "scriptrevision-directornote",
    label: "Script Revision → Director Note",
    steps: [
      { nodeKind: "script-revision", relationshipKind: "derived-from" },
      { nodeKind: "director-note", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "directornote-departmentpackage",
    label: "Director Note → Department Package",
    steps: [
      { nodeKind: "director-note", relationshipKind: "references" },
      { nodeKind: "department-package", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "departmentpackage-techpack",
    label: "Department Package → Tech Pack",
    steps: [
      { nodeKind: "department-package", relationshipKind: "requires" },
      { nodeKind: "tech-pack", relationshipKind: "derived-from" },
    ],
  },
  {
    pathId: "departmentpackage-creativereference",
    label: "Department Package → Creative Reference",
    steps: [
      { nodeKind: "department-package", relationshipKind: "references" },
      { nodeKind: "creative-reference", relationshipKind: "attached-to" },
    ],
  },
  {
    pathId: "departmentpackage-scene",
    label: "Department Package → Scene",
    steps: [
      { nodeKind: "department-package", relationshipKind: "references" },
      { nodeKind: "scene", relationshipKind: "requires" },
    ],
  },
  {
    pathId: "departmentpackage-location",
    label: "Department Package → Location",
    steps: [
      { nodeKind: "department-package", relationshipKind: "references" },
      { nodeKind: "location", relationshipKind: "occurs-at" },
    ],
  },
  {
    pathId: "techpack-media",
    label: "Tech Pack → Media",
    steps: [
      { nodeKind: "tech-pack", relationshipKind: "attached-to" },
      { nodeKind: "media", relationshipKind: "attached-to" },
    ],
  },
];

export const CREATIVE_RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> = [
  { kind: "derived-from", fromKind: "script-revision", toKind: "director-note", label: "Note from Script Revision" },
  {
    kind: "derived-from",
    fromKind: "director-note",
    toKind: "department-package",
    label: "Package from Director Note",
  },
  { kind: "derived-from", fromKind: "department-package", toKind: "tech-pack", label: "Tech Pack from Package" },
  {
    kind: "attached-to",
    fromKind: "department-package",
    toKind: "creative-reference",
    label: "Reference attached to Package",
  },
  { kind: "references", fromKind: "department-package", toKind: "scene", label: "Package for Scene" },
  { kind: "references", fromKind: "department-package", toKind: "location", label: "Package for Location" },
  { kind: "attached-to", fromKind: "tech-pack", toKind: "media", label: "Tech Pack Media Assets" },
  { kind: "attached-to", fromKind: "creative-reference", toKind: "media", label: "Reference Media" },
  { kind: "references", fromKind: "approval-record", toKind: "department-package", label: "Package Approval" },
];

/** Future linkage targets for CreativeReference (documentation). */
export const CREATIVE_REFERENCE_RELATIONSHIP_TARGETS: ReadonlyArray<{
  readonly kind: CoreObjectKind;
  readonly role: string;
}> = [
  { kind: "script-revision", role: "script-context" },
  { kind: "scene", role: "scene-look" },
  { kind: "location", role: "location-look" },
  { kind: "cast-member", role: "character-look" },
  { kind: "shoot-day", role: "day-look" },
  { kind: "department-package", role: "package-reference" },
  { kind: "media", role: "media-asset" },
];
