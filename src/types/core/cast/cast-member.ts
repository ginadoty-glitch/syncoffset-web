/**
 * SyncOffset Cast Authority — cast member (performer)
 *
 * Represents the person who may fulfill characters.
 * No payroll, deal memos, or contract implementation in this layer.
 *
 * Constitutional object: kind "cast-member"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { CastMemberAvailabilityStatus, CastMemberUnionStatus } from "./cast-contract-status";

export type CastMemberContact = {
  readonly phone?: string;
  readonly email?: string;
  readonly emergencyContactName?: string;
  readonly emergencyContactPhone?: string;
};

export type CastMember = AuditableCoreObject & {
  readonly kind: "cast-member";
  readonly performerName: string;
  readonly agency?: string;
  readonly unionStatus: CastMemberUnionStatus;
  readonly contactInformation: CastMemberContact;
  readonly availabilityStatus: CastMemberAvailabilityStatus;
  readonly notes?: string;
};
