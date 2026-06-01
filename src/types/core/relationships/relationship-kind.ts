/**
 * SyncOffset Relationship Graph — edge kind vocabulary
 *
 * Relationships connect authoritative core objects; they are not sources of truth.
 * Article III: objects exist through relationships.
 *
 * @see docs/SYNCOFFSET_RELATIONSHIP_GRAPH.md
 */

/**
 * Canonical relationship kinds for the platform graph.
 * Types only — no persistence or evaluation engine.
 */
export type RelationshipKind =
  | "references"
  | "derived-from"
  | "generated-from"
  | "scheduled-on"
  | "occurs-at"
  | "assigned-to"
  | "requires"
  | "attached-to"
  | "supersedes"
  | "impacts"
  | "depends-on";

export type RelationshipKindDefinition = {
  readonly kind: RelationshipKind;
  readonly label: string;
  readonly description: string;
  /** True when edge implies lineage from an immutable source or parent record */
  readonly isProvenanceEdge: boolean;
  /** True when edge may feed a future propagation evaluation (not an engine) */
  readonly supportsPropagation: boolean;
};

/**
 * Registry of relationship kinds — metadata for services and documentation.
 */
export const RELATIONSHIP_KIND_REGISTRY: Record<RelationshipKind, RelationshipKindDefinition> = {
  references: {
    kind: "references",
    label: "References",
    description: "Non-owning pointer between records (display, linkage, audit).",
    isProvenanceEdge: false,
    supportsPropagation: false,
  },
  "derived-from": {
    kind: "derived-from",
    label: "Derived From",
    description: "Target record was extracted or computed from the source object or document.",
    isProvenanceEdge: true,
    supportsPropagation: true,
  },
  "generated-from": {
    kind: "generated-from",
    label: "Generated From",
    description: "Generated output lineage to source documents and authority records.",
    isProvenanceEdge: true,
    supportsPropagation: false,
  },
  "scheduled-on": {
    kind: "scheduled-on",
    label: "Scheduled On",
    description: "Activity or requirement is bound to a shoot day (calendar authority).",
    isProvenanceEdge: false,
    supportsPropagation: true,
  },
  "occurs-at": {
    kind: "occurs-at",
    label: "Occurs At",
    description: "Event, scene, or move is tied to a location or place.",
    isProvenanceEdge: false,
    supportsPropagation: true,
  },
  "assigned-to": {
    kind: "assigned-to",
    label: "Assigned To",
    description: "Person, asset, or resource assignment to scene, day, or department.",
    isProvenanceEdge: false,
    supportsPropagation: true,
  },
  requires: {
    kind: "requires",
    label: "Requires",
    description: "Dependency — target cannot proceed without source clearance or availability.",
    isProvenanceEdge: false,
    supportsPropagation: true,
  },
  "attached-to": {
    kind: "attached-to",
    label: "Attached To",
    description: "Media or document attachment to a core object.",
    isProvenanceEdge: false,
    supportsPropagation: false,
  },
  supersedes: {
    kind: "supersedes",
    label: "Supersedes",
    description: "Version chain — newer record replaces operational view of prior (source files remain immutable).",
    isProvenanceEdge: true,
    supportsPropagation: true,
  },
  impacts: {
    kind: "impacts",
    label: "Impacts",
    description: "Change or condition affects another record (future propagation input).",
    isProvenanceEdge: false,
    supportsPropagation: true,
  },
  "depends-on": {
    kind: "depends-on",
    label: "Depends On",
    description: "Ordering or hard dependency between operational records.",
    isProvenanceEdge: false,
    supportsPropagation: true,
  },
};

export function isRelationshipKind(value: string): value is RelationshipKind {
  return value in RELATIONSHIP_KIND_REGISTRY;
}
