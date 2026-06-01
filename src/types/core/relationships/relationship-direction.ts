/**
 * SyncOffset Relationship Graph — direction semantics
 *
 * All edges are stored in canonical from → to orientation.
 * Query contracts may traverse inbound, outbound, or both.
 */

/** Persistence orientation of a single graph edge. */
export type RelationshipDirection = "directed";

/**
 * Traversal mode for relationship queries (future graph service).
 */
export type RelationshipTraversal = "outbound" | "inbound" | "both";

/**
 * Resolved perspective when presenting an edge relative to a query anchor.
 */
export type RelationshipPerspective = "from-anchor" | "to-anchor";

export type RelationshipOrientation = {
  readonly direction: RelationshipDirection;
  readonly traversal: RelationshipTraversal;
  readonly perspective?: RelationshipPerspective;
};
