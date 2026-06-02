/**
 * SyncOffset Relationship Graph — schema entry type (shared, no authority imports)
 */

import type { CoreObjectKind } from "../kinds";
import type { RelationshipKind } from "./relationship-kind";

export type RelationshipSchemaEntry = {
  readonly kind: RelationshipKind;
  readonly fromKind: CoreObjectKind | "source-document";
  readonly toKind: CoreObjectKind | "source-document";
  readonly label: string;
};
