/**
 * SyncOffset Production Calendar Authority — lifecycle and vocabulary (registry only)
 * @see docs/SYNCOFFSET_PRODUCTION_CALENDAR_AUTHORITY.md
 */

export type ProductionCalendarStatus = "draft" | "planning" | "review" | "approved" | "active" | "wrapped" | "archived";

export type ProductionCalendarStatusDefinition = {
  readonly status: ProductionCalendarStatus;
  readonly label: string;
};

export const PRODUCTION_CALENDAR_STATUS_REGISTRY: Record<ProductionCalendarStatus, ProductionCalendarStatusDefinition> =
  {
    draft: { status: "draft", label: "Draft" },
    planning: { status: "planning", label: "Planning" },
    review: { status: "review", label: "Review" },
    approved: { status: "approved", label: "Approved" },
    active: { status: "active", label: "Active" },
    wrapped: { status: "wrapped", label: "Wrapped" },
    archived: { status: "archived", label: "Archived" },
  };

export type CalendarPackageKind = "production-calendar-package" | "calendar-revision-package" | "distribution-package";

export type CalendarPackageKindDefinition = {
  readonly kind: CalendarPackageKind;
  readonly label: string;
};

export const CALENDAR_PACKAGE_KIND_REGISTRY: Record<CalendarPackageKind, CalendarPackageKindDefinition> = {
  "production-calendar-package": {
    kind: "production-calendar-package",
    label: "Production Calendar Package",
  },
  "calendar-revision-package": {
    kind: "calendar-revision-package",
    label: "Calendar Revision Package",
  },
  "distribution-package": {
    kind: "distribution-package",
    label: "Distribution Package",
  },
};

export type CalendarPackageStatus = "draft" | "issued" | "superseded" | "archived";
