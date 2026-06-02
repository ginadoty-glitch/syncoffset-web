/**
 * SyncOffset Brokerage Authority — brokerage line (declared item)
 *
 * Constitutional object: kind "brokerage-line"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";

export type BrokerageLine = AuditableCoreObject & {
  readonly kind: "brokerage-line";
  readonly brokerageRecordId: ObjectId;
  readonly description: string;
  readonly quantity: number;
  readonly countryOfOrigin: string;
  readonly declaredValue: number;
  readonly notes: string;
  readonly assetId?: ObjectId;
};
