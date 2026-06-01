/**
 * SyncOffset Crew Authority — crew member (actual crew person)
 *
 * No payroll, timecards, or rate tracking in this layer.
 * Constitutional object: kind "crew-member"
 */

import type { ObjectId } from "../../operations/shared";
import type { AuditableCoreObject } from "../base";
import type { CrewMemberAvailabilityStatus, CrewMemberUnionStatus } from "./crew-status";

export type CrewMemberContact = {
  readonly phone?: string;
  readonly email?: string;
  readonly emergencyContactName?: string;
  readonly emergencyContactPhone?: string;
};

export type CrewMember = AuditableCoreObject & {
  readonly kind: "crew-member";
  readonly crewMemberName: string;
  readonly departmentId: ObjectId;
  readonly role: string;
  readonly unionStatus: CrewMemberUnionStatus;
  readonly contactInformation: CrewMemberContact;
  readonly availabilityStatus: CrewMemberAvailabilityStatus;
  readonly notes?: string;
};
