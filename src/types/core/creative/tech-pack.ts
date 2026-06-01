/**
 * SyncOffset Creative Authority — tech pack (technical implementation)
 *
 * Constitutional object: kind "tech-pack"
 * Implements approved department intent with versioned source lineage.
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { ApprovalStatus } from "./approval-record";
import type { TechPackFormat } from "./creative-category";

export type TechPackRevision = {
  readonly revisionNumber: number;
  readonly revisionLabel?: string;
  readonly sourceDocumentId: ObjectId;
  readonly issuedAt: Timestamp;
  readonly issuedBy: string;
  readonly supersededByTechPackId?: ObjectId;
};

export type TechPack = AuditableCoreObject & {
  readonly kind: "tech-pack";
  readonly title: string;
  readonly departmentPackageId: ObjectId;
  readonly format: TechPackFormat;
  readonly revisions: ReadonlyArray<TechPackRevision>;
  readonly currentRevisionNumber: number;
  readonly sourceDocumentIds: ReadonlyArray<ObjectId>;
  readonly mediaAssetIds: ReadonlyArray<ObjectId>;
  readonly approvalStatus: ApprovalStatus;
  readonly approvalRecordIds: ReadonlyArray<ObjectId>;
  readonly notes?: string;
};
