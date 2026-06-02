/**
 * SyncOffset Core Object Layer — Base Contracts
 *
 * Every persisted record must extend AuditableCoreObject and declare a CoreObjectKind.
 * Aligns with docs/SYNCOFFSET_CORE_OBJECT_REGISTRY.md and SYNCOFFSET_DATA_CONSTITUTION.md.
 *
 * Do NOT import UI or fixture modules here.
 */

import type { ObjectId, Timestamp } from "../operations/shared";
import type { CoreObjectKind } from "./kinds";

/** Lifecycle status — refine per kind at the service layer. */
export type CoreObjectStatus = "draft" | "active" | "issued" | "superseded" | "archived" | "cancelled";

/**
 * Lightweight relationship summary embedded on an object (denormalized hints).
 * Canonical graph edges use PlatformRelationship in src/types/core/relationships/.
 * Embedding related objects is for display only — the graph store is authoritative for traversal.
 */
export type CoreRelationship = {
  readonly id: ObjectId;
  readonly kind: CoreObjectKind;
  readonly role: string;
};

/**
 * Required audit envelope for every core object (Registry — Audit section).
 */
export type AuditableCoreObject = {
  readonly id: ObjectId;
  readonly productionId: ObjectId;
  readonly kind: CoreObjectKind;
  readonly status: CoreObjectStatus;
  readonly createdBy: string;
  readonly createdAt: Timestamp;
  readonly modifiedBy: string;
  readonly modifiedAt: Timestamp;
  /** FK to Article I `source-document` ingestion record and/or Document Authority revision */
  readonly sourceDocumentId?: ObjectId;
  readonly sourceVersionId?: ObjectId;
  readonly relationships: ReadonlyArray<CoreRelationship>;
};
