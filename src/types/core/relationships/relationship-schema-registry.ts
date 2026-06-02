/**
 * SyncOffset Relationship Graph — allowed edge schema (registry integration)
 *
 * RELATIONSHIP_SCHEMA_REGISTRY is merged from authority contract modules only.
 * Add or change edges in the relevant `*-relationship-contracts.ts` file.
 *
 * @see docs/SYNCOFFSET_IMPLEMENTATION_SPRINT.md Phase 1
 * @see src/types/core/relationships/relationship-schema-merge.ts
 */

import type { RelationshipSchemaEntry } from "./relationship-schema-entry";
import { CONSTITUTIONAL_RELATIONSHIP_SCHEMA_REGISTRY } from "./relationship-schema-merge";

export type { RelationshipSchemaEntry } from "./relationship-schema-entry";

/**
 * Normative allowed edges for the constitutional graph.
 * Derived from authority *_RELATIONSHIP_SCHEMA_REGISTRY exports (no inline duplicates).
 */
export const RELATIONSHIP_SCHEMA_REGISTRY: ReadonlyArray<RelationshipSchemaEntry> =
  CONSTITUTIONAL_RELATIONSHIP_SCHEMA_REGISTRY;
