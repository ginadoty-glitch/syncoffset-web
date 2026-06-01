/**
 * SyncOffset Creative Authority — approval lifecycle
 *
 * Approvals gate departmental interpretation before operations execute.
 * Constitutional object: kind "approval-record"
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";

export type ApprovalStatus = "pending" | "approved" | "rejected" | "superseded";

/**
 * Approval event on a director note, department package, or tech pack.
 */
export type ApprovalRecord = AuditableCoreObject & {
  readonly kind: "approval-record";
  readonly status: ApprovalStatus;
  readonly approver: string;
  readonly decidedAt: Timestamp;
  readonly notes?: string;
  /** Object under review (director-note, department-package, tech-pack) */
  readonly subjectId: ObjectId;
  readonly subjectKind: "director-note" | "department-package" | "tech-pack";
  readonly supersededByApprovalId?: ObjectId;
};
