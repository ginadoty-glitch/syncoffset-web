/**
 * SyncOffset Communication Authority — production communication record
 *
 * Communication is a production object — not Email, Outlook, Gmail, or SMS (Rule 1).
 * Distributes information; does not replace Callsheet, Calendar, Work Order, or Transport (Rule 4).
 *
 * Constitutional object: kind "communication"
 *
 * @see docs/SYNCOFFSET_COMMUNICATION_AUTHORITY.md
 */

import type { ObjectId, Timestamp } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { CommunicationChannel } from "./communication-channel";
import type { CommunicationStatus } from "./communication-status";

export type Communication = AuditableCoreObject & {
  readonly kind: "communication";
  readonly communicationNumber: string;
  readonly subject: string;
  readonly body: string;
  readonly channelId: CommunicationChannel;
  readonly statusId: CommunicationStatus;
  readonly createdBy: string;
  readonly sentAt?: Timestamp;
  readonly notes: string;
  readonly distributionListIds: ReadonlyArray<ObjectId>;
  readonly communicationPackageIds: ReadonlyArray<ObjectId>;
  readonly generatedOutputIds: ReadonlyArray<ObjectId>;
  /** Rule 2 — optional production references */
  readonly showId?: ObjectId;
  readonly sceneId?: ObjectId;
  readonly setId?: ObjectId;
  readonly shootDayId?: ObjectId;
  readonly callsheetId?: ObjectId;
  readonly workOrderId?: ObjectId;
  readonly transportOrderId?: ObjectId;
  readonly vendorId?: ObjectId;
  readonly locationId?: ObjectId;
  readonly assetId?: ObjectId;
  readonly purchaseOrderId?: ObjectId;
  readonly shipmentId?: ObjectId;
  readonly returnId?: ObjectId;
  readonly productionCalendarId?: ObjectId;
};
