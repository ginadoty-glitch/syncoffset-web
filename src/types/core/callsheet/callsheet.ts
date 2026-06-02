/**
 * SyncOffset Callsheet Authority — daily operational package (production object)
 *
 * A Callsheet is NOT a PDF or document — it is the operational record for a Shoot Day.
 * PDF, email, SMS, and mobile delivery are outputs via CallsheetPackage (Rule 4).
 *
 * Constitutional object: kind "callsheet"
 *
 * @see docs/SYNCOFFSET_CALLSHEET_AUTHORITY.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { CallsheetRevisionColor, CallsheetStatus } from "./callsheet-status";

export type Callsheet = AuditableCoreObject & {
  readonly kind: "callsheet";
  readonly status: CallsheetStatus;
  readonly showId: ObjectId;
  readonly shootDayId: ObjectId;
  readonly callsheetNumber: string;
  readonly issueDate: string;
  readonly revisionNumber: number;
  readonly revisionColor: CallsheetRevisionColor;
  readonly notes: string;
  readonly callsheetRevisionIds: ReadonlyArray<ObjectId>;
  readonly callsheetDistributionIds: ReadonlyArray<ObjectId>;
  readonly callsheetPackageIds: ReadonlyArray<ObjectId>;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
};
