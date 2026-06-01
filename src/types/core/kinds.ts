/**
 * SyncOffset Core Object Registry — canonical kind identifiers.
 * @see docs/SYNCOFFSET_CORE_OBJECT_REGISTRY.md
 */

export type CoreObjectKind =
  // Production
  | "show"
  | "season"
  | "episode"
  | "department"
  // Scheduling
  | "shoot-day"
  | "prep-day"
  | "wrap-day"
  | "company-move"
  // Script authority
  | "script"
  | "script-revision"
  | "revision-change"
  | "scene"
  | "element"
  | "breakdown-element"
  | "bg-requirement"
  // Creative authority
  | "director-note"
  | "creative-reference"
  | "department-package"
  | "tech-pack"
  | "approval-record"
  // People
  | "person"
  | "character"
  | "cast-requirement"
  | "cast-member"
  | "cast-assignment"
  | "background-performer"
  | "bg-assignment"
  | "stunt-performer"
  | "crew-requirement"
  | "crew-member"
  | "crew-assignment"
  // Locations
  | "location"
  | "permit"
  // Assets
  | "asset"
  // Vendors
  | "vendor"
  | "purchase-order"
  // Operations
  | "transport-order"
  | "shipment"
  | "return"
  // Documents & outputs
  | "document"
  | "generated-output"
  // Media
  | "media"
  // Intelligence (derived only)
  | "risk-evaluation";
