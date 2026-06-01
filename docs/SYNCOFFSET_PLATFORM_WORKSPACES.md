# SyncOffset Platform Workspaces

Version 1.0 — Platform taxonomy (sources, outputs, views)

**Companions:** [`SYNCOFFSET_LAYOUT_CONSTITUTION.md`](./SYNCOFFSET_LAYOUT_CONSTITUTION.md) (UI shell); [`SYNCOFFSET_DATA_CONSTITUTION.md`](./SYNCOFFSET_DATA_CONSTITUTION.md) (sources, objects, relationships, propagation).

**Rule:** Workspaces are **domain boundaries**, not layout inventions. New routes inherit layout primitives from the constitution; they do not create new chrome.

---

## Workspace 01 — Production Calendar

**Purpose:** Master operational timeline for the entire production.

**Sources:** Shooting Schedule, One-Liner, Day Out of Days, Prep Schedules, Wrap Schedules, Company Moves, Location Availability, Crew Availability.

**Produces:** Callsheets, Logistics Tasks, Department Notifications, Vendor Deadlines, Asset Deadlines, Calendar Feeds.

**Departments:** Production, AD, Locations, Transportation, Art, Set Decoration, Props, Construction, Costume, Hair & Makeup, Camera, Grip, Electric, Sound.

**Core views:** Calendar, Stripboard, Timeline, Production Day Detail, Conflict Dashboard.

**Layout binding:** `PageHeader` + `MetricBar` (day pressure) + **exception layout** — timeline/grid primary; Production Day Detail in drawer/sheet; Conflict Dashboard as intelligence-first or dedicated two-column (no manifest queue).

---

## Workspace 02 — Script Breakdown

**Purpose:** Convert script pages into operational requirements.

**Sources:** Scripts, Script Revisions, Revision Pages, Breakdown Sheets.

**Produces:** Element Lists, Department Breakdowns, Asset Requests, Location Requirements, Cast Requirements, Vendor Requirements.

**Departments:** All.

**Core views:** Script Viewer, Scene Breakdown, Element Browser, Department Lens, Revision Compare.

**Script authority types:** `ScriptRevision`, `RevisionChange`, `Scene`, `BreakdownElement` — [`SYNCOFFSET_SCRIPT_AUTHORITY.md`](./SYNCOFFSET_SCRIPT_AUTHORITY.md)

**Layout binding:** **Grid + detail drawer** — Script Viewer left or top; Element Browser manifest; Scene/element detail center; Department Lens as tab or filter rail; Revision Compare split view.

---

## Workspace 03 — Callsheet Studio

**Purpose:** Generate and manage daily production packets.

**Sources:** Calendar, Shooting Schedule, DOOD, Cast Availability, Crew Availability, Locations, Weather, Company Moves.

**Produces:** Callsheets, Department Calls, Distribution Lists, PDFs, Mobile Callsheets.

**Core views:** Callsheet Builder, Preview, Revision History, Distribution Tracking, Acknowledgements.

**Layout binding:** **Document-centric** — Builder (form) + Preview (center); Distribution/Acknowledgements as side intelligence or tabs; Preview/print uses **print layout exception** (not three-column shell).

---

## Workspace 04 — Operations

**Purpose:** Track physical movement of production resources.

**Sources:** Production Calendar, Breakdown Requirements, Purchase Orders, Rentals, Vendor Requests.

**Produces:** Runsheets, Pickups, Deliveries, Asset Reports, Returns, Customs Packages.

**Modules:** Logistics, Brokerage, Inventory, Assets, Receipts, Returns, Damage Reports.

**Layout binding:** **Three-column operational shell** (canonical) — Manifest / Detail / Intelligence. **Implemented today:** Logistics (`/dashboard/logistics/*`), Brokerage (`/dashboard/logistics/brokerage`). Placeholders: rush, holdbacks, transport-orders, shipments. Future modules reuse same shell.

---

## Workspace 05 — Media Hub

**Purpose:** Central repository for production media and documents.

**Supported files:** PDF, DOCX, XLSX, CSV, JPG, PNG, HEIC, TIFF, MP4, MOV, WAV, MP3.

**Examples:** Callsheets, One-Liners, Schedules, Dailies, Concept Art, Storyboards, Reference/Set/Continuity Photos, Vendor Documents.

**Core views:** Library, Preview, Department Lens, Metadata, Version History.

**Creative authority types:** `DirectorNote`, `CreativeReference`, `DepartmentPackage`, `TechPack`, `ApprovalRecord` — [`SYNCOFFSET_CREATIVE_AUTHORITY.md`](./SYNCOFFSET_CREATIVE_AUTHORITY.md)

**Layout binding:** **Library manifest + preview detail** — same shell as Media=ManifestPanel + Preview=DetailPanel; Metadata/Version History=IntelligencePanel or detail tabs.

---

## Workspace 06 — Cast & Crew

**Purpose:** Manage all people attached to the production.

**Sources:** Deal Memos, Crew Lists, Cast Lists, Availability, DOOD.

**Produces:** Contact Lists, Department Rosters, Call Tracking, Turnaround Monitoring, French Hours Monitoring.

**Sections:** Cast (`Character`, `CastRequirement`, `CastMember`, `CastAssignment`), Stunts, Background (`BgRequirement`, `BackgroundPerformer`, `BgAssignment`), Stand-Ins, Photo Doubles, Crew (`Department`, `CrewRequirement`, `CrewMember`, `CrewAssignment`).

**Core views:** Roster, Department View, DOOD, Availability, Attachments.

**Layout binding:** **Roster table + detail** — DOOD as timeline/strip exception; Turnaround/French Hours feed **Workspace 10** signals; person detail uses DetailPanel pattern.

---

## Workspace 07 — Locations

**Purpose:** Manage filming locations and related logistics.

**Sources:** Location Agreements, Permits, Scout Reports, Maps, Photos.

**Produces:** Company Moves, Parking Plans, Permit Packages, Location Contacts, Restriction Notices.

**Core views:** Map, Location Profile, Permits, Photos, Restrictions, Company Moves.

**Layout binding:** **Map + list hybrid** — Map may occupy DetailPanel center; location list as ManifestPanel; Restrictions/Permits in IntelligencePanel (feeds Operations propagation today).

---

## Workspace 08 — Vendors & Purchasing

**Purpose:** Manage procurement and external suppliers.

**Sources:** Purchase Orders, Rental Agreements, Vendor Contracts, Budget Lines.

**Produces:** Orders, Deliveries, Return Schedules, Vendor Performance.

**Core views:** Vendors, Orders, Rentals, Deliveries, Compliance.

**Layout binding:** **Table-primary** with optional three-column for order detail; Compliance in IntelligencePanel.

---

## Workspace 09 — Finance

**Purpose:** Track production spend and financial obligations.

**Sources:** Budgets, Purchase Orders, Receipts, Invoices, Petty Cash.

**Produces:** Cost Reports, Check Requests, Forecasts, Variance Reports.

**Core views:** Budget, Actuals, Cost Report, Petty Cash, Vendor Spend.

**Layout binding:** **Card dashboard + tables** — `MetricBar` for KPIs; ledger tables; detail drawer for line items. Legacy template at `/dashboard/finance` preserved separately until productized.

---

## Workspace 10 — Production Intelligence

**Purpose:** Operational awareness across the entire show. **Consumes every workspace; produces nothing.**

**Examples:** Company move conflicts, permit expiration, missing assets, unscheduled scenes, vendor delays, cast conflicts, weather impacts, budget overruns.

**Core views:** Production Pulse, Risk Center, Timeline Impacts, Department Readiness.

**Layout binding:** **Not a fourth column everywhere** — (1) Global **Risk Center** as dedicated full-width or intelligence-first page; (2) **Per-record IntelligencePanel** in operational shells (current `OperationalIntelligence`, brokerage intelligence, comms digest); (3) **StatusStrip** / propagation banners in DetailPanel. Avoid duplicating full intelligence UI in both Workspace 10 and every module right rail.

---

## Cross-cutting: Communications

Not numbered in workspace list but required for operations:

**Purpose:** Chat, email, notifications across departments and linked records.

**Layout binding:** Three-column operational shell (implemented: `/dashboard/communications/*`).

**Feeds:** Workspace 01 notifications, Workspace 04 task updates, Workspace 10 alerts.

---

## Workspace → layout shell quick reference

| Workspace | Primary shell | Manifest | Detail | Intelligence |
|-----------|---------------|----------|--------|--------------|
| 01 Calendar | Timeline/grid exception | Days/events list | Day detail | Conflicts, readiness |
| 02 Breakdown | Grid + drawer | Elements/scenes | Scene/element | Dept lens, revision blast |
| 03 Callsheet Studio | Builder + print exception | Day list | Preview/PDF | Distribution, acks |
| 04 Operations | **Three-column** ✓ | Queue/docs | Order/doc + map | Conditions, clearance |
| 05 Media Hub | Three-column | Library | Preview | Metadata, versions |
| 06 Cast & Crew | Table + drawer | Roster | Person | Turnaround, calls |
| 07 Locations | Map + list hybrid | Locations | Profile/map | Permits, restrictions |
| 08 Vendors | Table (+ shell for order) | Vendors/orders | PO/rental | Compliance |
| 09 Finance | KPI + table | Accounts/lines | Transaction | Variance, anomalies |
| 10 Intelligence | Dedicated + embedded rails | Risk queues | Impact detail | N/A (is the insight layer) |

---

## Current codebase alignment (syncoffset-web)

| Workspace | Status | Routes / notes |
|-----------|--------|----------------|
| 04 Operations | **Partial live** | `/dashboard/logistics`, `/dashboard/logistics/brokerage`, sub-route placeholders |
| Communications | **Live** | `/dashboard/communications/{chat,email,notifications}` |
| 01–03, 06–09 | **Nav stubs** | Sidebar → `/dashboard/coming-soon` (Production, Finance groups) |
| 05 Media | **Nav stub** | Wrap Archive / References in System group → coming-soon |
| 09 Finance | **Hidden legacy** | `/dashboard/finance` (template, not sidebar) |
| 10 Intelligence | **Embedded** | Right rails + propagation in Logistics; no global Risk Center yet |

**Recommended nav evolution (architecture only):** Group sidebar by workspace (01–10), not by legacy template names. Keep Logistics under Workspace 04 until rename migration is approved.

---

*Preserves platform workspace definitions supplied for SyncOffset. Layout rules authoritative in SYNCOFFSET_LAYOUT_CONSTITUTION.md.*
