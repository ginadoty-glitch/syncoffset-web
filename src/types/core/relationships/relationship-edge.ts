/**
 * SyncOffset Relationship Graph — platform edge contract
 *
 * Distinct from AuditableCoreObject.relationships[] (embedded summary edges on objects).
 * The graph layer is the canonical connective tissue for query and propagation.
 *
 * Constitutional rule: relationships never become source-of-truth.
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { CoreObjectKind } from "../kinds";
import type { SourceDocumentKind } from "../source/source-document-kind";
import type { RelationshipDirection } from "./relationship-direction";
import type { RelationshipKind } from "./relationship-kind";
import type { RelationshipStrength } from "./relationship-strength";

/** Endpoint in the graph — core object or immutable source document. */
export type RelationshipNodeKind = CoreObjectKind | "source-document";

export type RelationshipEndpoint = {
  readonly nodeId: ObjectId;
  readonly nodeKind: RelationshipNodeKind;
  /** When nodeKind is source-document, discriminates ingestion kind */
  readonly sourceDocumentKind?: SourceDocumentKind;
};

/**
 * A single directed edge in the production relationship graph.
 */
export type PlatformRelationship = {
  readonly id: ObjectId;
  readonly productionId: ObjectId;
  readonly kind: RelationshipKind;
  readonly direction: RelationshipDirection;
  readonly strength: RelationshipStrength;
  readonly from: RelationshipEndpoint;
  readonly to: RelationshipEndpoint;
  readonly createdAt: Timestamp;
  readonly createdBy: string;
  readonly role?: string;
  /**
   * Constitutional: false — edges describe links; objects hold authoritative state.
   */
  readonly isSourceOfTruth: false;
  /** Optional provenance when edge was created by ingestion or output generation */
  readonly sourceDocumentId?: ObjectId;
  readonly sourceRecordId?: ObjectId;
};
