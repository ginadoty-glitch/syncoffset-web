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
  // Shoot Day authority (execution)
  | "shoot-day"
  | "shootday-assignment"
  | "shootday-package"
  // Callsheet authority (daily operational package)
  | "callsheet"
  | "callsheet-revision"
  | "callsheet-distribution"
  | "callsheet-package"
  // Production Calendar authority (planning)
  | "production-calendar"
  | "calendar-day"
  | "calendar-revision"
  | "calendar-package"
  // Shooting Schedule authority (what gets shot — not calendar dates)
  | "shooting-schedule"
  | "shooting-schedule-revision"
  | "shooting-schedule-package"
  // Legacy scheduling kinds (prefer calendar-day + dayType)
  | "prep-day"
  | "wrap-day"
  | "company-move"
  // Script authority
  | "script"
  | "script-revision"
  | "revision-change"
  | "scene"
  | "set"
  | "budget-requirement"
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
  // Location authority
  | "location"
  | "location-requirement"
  | "location-package"
  | "location-assignment"
  | "permit"
  // Asset authority
  | "asset"
  | "asset-instance"
  | "asset-assignment"
  | "asset-package"
  // Inventory authority (possession — distinct from asset identity)
  | "inventory-record"
  | "inventory-movement"
  | "inventory-audit"
  | "inventory-package"
  // Vendor authority
  | "vendor"
  | "vendor-contact"
  | "vendor-agreement"
  // Purchase authority
  | "purchase-order"
  | "purchase-line"
  | "purchase-package"
  // Shipment authority
  | "shipment"
  | "shipment-stop"
  | "shipment-event"
  | "shipment-package"
  // Brokerage authority (customs / clearance — distinct from shipment movement)
  | "brokerage-record"
  | "brokerage-line"
  | "brokerage-package"
  // Return authority (recovery / strike / closeout)
  | "return"
  | "return-line"
  | "return-package"
  // Work Order authority (inter-department production services)
  | "work-order"
  | "work-order-task"
  | "work-order-package"
  // Production Accounting authority (planned / committed / actual — not corporate GL)
  | "production-cost"
  | "department-cost"
  | "cost-report"
  | "cost-report-package"
  // Communication authority (platform-independent production communications)
  | "communication"
  | "distribution-list"
  | "communication-package"
  // Operations (logistics dispatch — distinct from shipment movement record)
  | "transport-order"
  // Document authority (logical production documents)
  | "document"
  | "document-revision"
  | "document-package"
  | "document-link"
  // Source ingestion (Article I immutable file — kind migrated from legacy `document`)
  | "source-document"
  // Derived outputs
  | "generated-output"
  // Media
  | "media"
  // Intelligence (derived only)
  | "risk-evaluation";
