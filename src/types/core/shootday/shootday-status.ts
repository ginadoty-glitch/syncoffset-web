/**
 * SyncOffset Shoot Day Authority — lifecycle and package vocabulary (registry only)
 * @see docs/SYNCOFFSET_SHOOTDAY_AUTHORITY_V2.md
 */

export type ShootDayStatus = "draft" | "planned" | "scheduled" | "active" | "wrapped" | "completed" | "cancelled";

export type ShootDayStatusDefinition = {
  readonly status: ShootDayStatus;
  readonly label: string;
};

export const SHOOTDAY_STATUS_REGISTRY: Record<ShootDayStatus, ShootDayStatusDefinition> = {
  draft: { status: "draft", label: "Draft" },
  planned: { status: "planned", label: "Planned" },
  scheduled: { status: "scheduled", label: "Scheduled" },
  active: { status: "active", label: "Active" },
  wrapped: { status: "wrapped", label: "Wrapped" },
  completed: { status: "completed", label: "Completed" },
  cancelled: { status: "cancelled", label: "Cancelled" },
};

export type ShootDayPackageKind =
  | "shootday-package"
  | "production-package"
  | "department-package"
  | "execution-package";

export type ShootDayPackageKindDefinition = {
  readonly kind: ShootDayPackageKind;
  readonly label: string;
};

export const SHOOTDAY_PACKAGE_KIND_REGISTRY: Record<ShootDayPackageKind, ShootDayPackageKindDefinition> = {
  "shootday-package": { kind: "shootday-package", label: "Shoot Day Package" },
  "production-package": { kind: "production-package", label: "Production Package" },
  "department-package": {
    kind: "department-package",
    label: "Department Package",
  },
  "execution-package": { kind: "execution-package", label: "Execution Package" },
};

export type ShootDayPackageStatus = "draft" | "issued" | "superseded" | "archived";

export type ShootDayAssignmentStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled";
