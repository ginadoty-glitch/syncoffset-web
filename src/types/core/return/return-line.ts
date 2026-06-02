/**
 * SyncOffset Return Authority — return line (individual returned item)
 *
 * Constitutional object: kind "return-line"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";

export type ReturnLine = AuditableCoreObject & {
  readonly kind: "return-line";
  readonly returnId: ObjectId;
  readonly description: string;
  readonly quantity: number;
  readonly notes: string;
  readonly assetId?: ObjectId;
};
