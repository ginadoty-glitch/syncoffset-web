/**
 * SyncOffset Shooting Schedule Authority — lifecycle, revision colors, package vocabulary (registry only)
 * @see docs/SYNCOFFSET_SHOOTING_SCHEDULE_AUTHORITY.md
 */

export type ShootingScheduleStatus =
  | "draft"
  | "planning"
  | "review"
  | "approved"
  | "issued"
  | "active"
  | "locked"
  | "superseded"
  | "archived";

export type ShootingScheduleStatusDefinition = {
  readonly status: ShootingScheduleStatus;
  readonly label: string;
};

export const SHOOTING_SCHEDULE_STATUS_REGISTRY: Record<ShootingScheduleStatus, ShootingScheduleStatusDefinition> = {
  draft: { status: "draft", label: "Draft" },
  planning: { status: "planning", label: "Planning" },
  review: { status: "review", label: "Review" },
  approved: { status: "approved", label: "Approved" },
  issued: { status: "issued", label: "Issued" },
  active: { status: "active", label: "Active" },
  locked: { status: "locked", label: "Locked" },
  superseded: { status: "superseded", label: "Superseded" },
  archived: { status: "archived", label: "Archived" },
};

/** Industry schedule revision colors (aligned with calendar revision convention). */
export type ShootingScheduleRevisionColor =
  | "white"
  | "blue"
  | "pink"
  | "yellow"
  | "green"
  | "goldenrod"
  | "buff"
  | "salmon"
  | "cherry"
  | "tan"
  | "gray"
  | "ivory"
  | "double-white";

export type ShootingScheduleRevisionColorDefinition = {
  readonly color: ShootingScheduleRevisionColor;
  readonly label: string;
};

export const SHOOTING_SCHEDULE_REVISION_COLOR_REGISTRY: Record<
  ShootingScheduleRevisionColor,
  ShootingScheduleRevisionColorDefinition
> = {
  white: { color: "white", label: "White" },
  blue: { color: "blue", label: "Blue" },
  pink: { color: "pink", label: "Pink" },
  yellow: { color: "yellow", label: "Yellow" },
  green: { color: "green", label: "Green" },
  goldenrod: { color: "goldenrod", label: "Goldenrod" },
  buff: { color: "buff", label: "Buff" },
  salmon: { color: "salmon", label: "Salmon" },
  cherry: { color: "cherry", label: "Cherry" },
  tan: { color: "tan", label: "Tan" },
  gray: { color: "gray", label: "Gray" },
  ivory: { color: "ivory", label: "Ivory" },
  "double-white": { color: "double-white", label: "Double White" },
};

export type ShootingSchedulePackageKind =
  | "shooting-schedule-package"
  | "schedule-revision-package"
  | "distribution-package";

export type ShootingSchedulePackageKindDefinition = {
  readonly kind: ShootingSchedulePackageKind;
  readonly label: string;
};

export const SHOOTING_SCHEDULE_PACKAGE_KIND_REGISTRY: Record<
  ShootingSchedulePackageKind,
  ShootingSchedulePackageKindDefinition
> = {
  "shooting-schedule-package": {
    kind: "shooting-schedule-package",
    label: "Shooting Schedule Package",
  },
  "schedule-revision-package": {
    kind: "schedule-revision-package",
    label: "Schedule Revision Package",
  },
  "distribution-package": {
    kind: "distribution-package",
    label: "Distribution Package",
  },
};

export type ShootingSchedulePackageStatus = "draft" | "issued" | "superseded" | "archived";
