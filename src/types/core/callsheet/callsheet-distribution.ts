/**
 * SyncOffset Callsheet Authority — distribution delivery record
 *
 * Distribution is not ownership — a Callsheet may exist without distributions (Rule 5).
 * Constitutional object: kind "callsheet-distribution"
 *
 * @see docs/SYNCOFFSET_CALLSHEET_AUTHORITY.md
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { CallsheetDistributionMethod, CallsheetRecipientGroup } from "./callsheet-status";

export type CallsheetDistribution = AuditableCoreObject & {
  readonly kind: "callsheet-distribution";
  readonly callsheetId: ObjectId;
  readonly distributionMethod: CallsheetDistributionMethod;
  readonly recipientGroup: CallsheetRecipientGroup;
  readonly distributedAt: Timestamp;
  readonly notes?: string;
};
