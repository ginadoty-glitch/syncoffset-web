/**
 * SyncOffset Communication Authority — distribution group
 *
 * Department, production, vendor, or show-level recipient groups.
 * Distinct from Callsheet `callsheet-distribution` delivery records.
 *
 * Constitutional object: kind "distribution-list"
 *
 * @see docs/SYNCOFFSET_COMMUNICATION_AUTHORITY.md
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { DepartmentMailboxSlug, MailboxEndpointKind } from "./communication-channel";

export type DistributionList = AuditableCoreObject & {
  readonly kind: "distribution-list";
  readonly name: string;
  readonly description: string;
  readonly departmentId?: ObjectId;
  readonly showId?: ObjectId;
  readonly vendorId?: ObjectId;
  /** Example: art@ — production mailbox slug when list maps to department mailbox (Rule 3). */
  readonly departmentMailboxSlug?: DepartmentMailboxSlug;
  readonly mailboxEndpointKind?: MailboxEndpointKind;
  readonly memberPersonIds: ReadonlyArray<ObjectId>;
  readonly memberCrewMemberIds: ReadonlyArray<ObjectId>;
};
