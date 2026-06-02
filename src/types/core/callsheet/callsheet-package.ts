/**
 * SyncOffset Callsheet Authority — generated output package (PDF, print, mobile, etc.)
 *
 * `packageKind` `pdf-package` is an output channel — not the Callsheet itself (Rule 4).
 * Constitutional object: kind "callsheet-package"
 *
 * @see docs/SYNCOFFSET_CALLSHEET_AUTHORITY.md
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { CallsheetPackageKind, CallsheetPackageStatus } from "./callsheet-status";

export type CallsheetPackage = AuditableCoreObject & {
  readonly kind: "callsheet-package";
  readonly status: CallsheetPackageStatus;
  readonly callsheetId: ObjectId;
  readonly packageKind: CallsheetPackageKind;
  readonly generatedAt: Timestamp;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
  readonly sourceDocumentIds: ReadonlyArray<ObjectId>;
};
