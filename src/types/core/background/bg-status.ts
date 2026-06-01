/**
 * SyncOffset Background — lifecycle status vocabulary
 */

/** Production need lifecycle (requirement, not a person). */
export type BgRequirementStatus =
  | "draft"
  | "open"
  | "partially-booked"
  | "fully-booked"
  | "confirmed"
  | "cancelled"
  | "archived";

/** Performer availability for casting — no payroll semantics. */
export type BackgroundPerformerAvailabilityStatus = "available" | "hold" | "booked" | "unavailable" | "archived";

/** Assignment of a performer to a requirement on a shoot day. */
export type BgAssignmentStatus =
  | "pending"
  | "confirmed"
  | "checked-in"
  | "wrapped"
  | "no-show"
  | "released"
  | "cancelled";
