/**
 * SyncOffset Crew Authority — lifecycle status vocabulary
 */

export type CrewRequirementStatus = "open" | "partially-filled" | "filled" | "cancelled" | "archived";

export type CrewMemberUnionStatus = "union" | "non-union" | "mixed" | "unknown";

export type CrewMemberAvailabilityStatus = "available" | "hold" | "booked" | "unavailable" | "archived";

export type CrewAssignmentStatus = "pending" | "confirmed" | "on-set" | "wrapped" | "released" | "cancelled";
