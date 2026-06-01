/**
 * SyncOffset Cast Authority — cast member and assignment status
 *
 * No payroll or deal memo fields — contract status is informational only.
 */

export type CastMemberUnionStatus = "union" | "non-union" | "mixed" | "unknown";

export type CastMemberAvailabilityStatus = "available" | "hold" | "booked" | "unavailable" | "archived";

export type CastAssignmentStatus = "pending" | "confirmed" | "on-set" | "wrapped" | "released" | "cancelled";
