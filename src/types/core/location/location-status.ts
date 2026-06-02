/**
 * SyncOffset Location Authority — lifecycle and classification vocabulary
 */

export type LocationStatus = "scouting" | "hold" | "approved" | "active" | "wrapped" | "archived";

export type LocationTypeId =
  | "studio"
  | "stage"
  | "practical"
  | "warehouse"
  | "vendor-facility"
  | "office"
  | "exterior"
  | "backlot"
  | "custom";

export type LocationTypeDefinition = {
  readonly id: LocationTypeId;
  readonly label: string;
  readonly description: string;
};

export const LOCATION_TYPE_REGISTRY: Record<LocationTypeId, LocationTypeDefinition> = {
  studio: { id: "studio", label: "Studio", description: "Sound stage facility or studio lot." },
  stage: { id: "stage", label: "Stage", description: "Individual stage within a studio." },
  practical: {
    id: "practical",
    label: "Practical Location",
    description: "Real-world location used for filming.",
  },
  warehouse: { id: "warehouse", label: "Warehouse", description: "Warehouse or industrial practical." },
  "vendor-facility": {
    id: "vendor-facility",
    label: "Vendor Facility",
    description: "Vendor-owned facility used for production activity.",
  },
  office: { id: "office", label: "Office", description: "Office or commercial interior." },
  exterior: { id: "exterior", label: "Exterior Location", description: "Exterior street, park, or outdoor set." },
  backlot: { id: "backlot", label: "Backlot", description: "Studio backlot or standing sets." },
  custom: { id: "custom", label: "Custom", description: "Production-defined location type." },
};

export type LocationRequirementStatus = "open" | "shortlisted" | "approved" | "cancelled" | "archived";

export type LocationPackageStatus = "draft" | "approved" | "superseded" | "archived";

export type LocationAssignmentStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled";
