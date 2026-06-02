# SyncOffset Callsheet Authority v1.0

**Workspace 15** — daily operational package distributed to the entire production.

**Code:** `src/types/core/callsheet/`

**Out of scope:** UI · pages · PDF/email/SMS generation · push notifications · distribution engines · scheduling engines · Supabase · automations.

---

## Constitutional purpose

The **Callsheet** is the **daily operational package** for a **Shoot Day**. Every upstream authority eventually converges here:

```
Script Revision → Scene → Set → Budget → Cast → Background → Crew
  → Locations → Assets → Vendors → Purchase → Shipment → Brokerage → Return
  → Shooting Schedule → Production Calendar → Calendar Day → Shoot Day
  → CALLSHEET
```

---

## Critical distinction (Rule 4)

| Is a Callsheet | Is NOT a Callsheet |
|----------------|-------------------|
| Constitutional `callsheet` core object | Generated PDF file |
| Operational record for a shoot day | `document` row alone |
| Parent of revisions, distribution, packages | `generated-output` alone |

**Output chain:**

```
Callsheet
  → CallsheetRevision
  → CallsheetDistribution
  → CallsheetPackage (pdf-package, print-package, …)
  → Generated Output (PDF, email payload, SMS, mobile)
```

---

## Constitutional hierarchy

```
Production Calendar
  → Calendar Day
  → Shoot Day
  → Callsheet
```

Full upstream chain includes Scene, Cast, Crew, Locations, Assets, Schedule, etc. — consumed via `references` edges (Rule 2).

---

## Critical rules

### Rule 1 — Consumes Shoot Day

**Callsheet** consumes **Shoot Day**. It does **not** create Shoot Day.

### Rule 2 — Consumes production authorities

A Callsheet **references** (does not own): Cast, Background, Crew, Assets, Locations, Transportation, Schedule.

### Rule 3 — Multiple revisions

**CallsheetRevision** supports **multiple revisions** — no single-revision assumption.

### Rule 4 — PDF is not the Callsheet

**PDF** is a **`callsheet-package`** with `packageKind` **`pdf-package`** → **`generated-output`**.

### Rule 5 — Distribution is not ownership

A **Callsheet** exists even if **never distributed**. **CallsheetDistribution** records are optional delivery events.

---

## Objects

| Object | `CoreObjectKind` | Role |
|--------|------------------|------|
| **Callsheet** | `callsheet` | Official operational package for a Shoot Day |
| **CallsheetRevision** | `callsheet-revision` | Issued revision history |
| **CallsheetDistribution** | `callsheet-distribution` | Delivery to recipient groups |
| **CallsheetPackage** | `callsheet-package` | Generated output bundles (PDF, print, mobile, …) |

---

## Callsheet — required fields

| Field | Notes |
|-------|-------|
| `showId` | Parent show |
| `shootDayId` | Execution day consumed (Rule 1) |
| `callsheetNumber` | Production callsheet number |
| `status` | `CALLSHEET_STATUS_REGISTRY` |
| `issueDate` | ISO date issued |
| `revisionNumber` | Current revision index |
| `revisionColor` | `CALLSHEET_REVISION_COLOR_REGISTRY` |
| `notes` | May be empty string |

---

## CallsheetRevision — required fields

| Field | Notes |
|-------|-------|
| `callsheetId` | Parent callsheet |
| `revisionNumber` | Revision index |
| `revisionColor` | Industry revision color |
| `createdAt` | Issue timestamp |
| `changeSummary` | Human-readable change log |

---

## CallsheetDistribution — required fields

| Field | Notes |
|-------|-------|
| `callsheetId` | Parent callsheet |
| `distributionMethod` | `CALLSHEET_DISTRIBUTION_METHOD_REGISTRY` |
| `recipientGroup` | `CALLSHEET_RECIPIENT_GROUP_REGISTRY` |
| `distributedAt` | Delivery timestamp |

---

## CallsheetPackage — required fields

| Field | Notes |
|-------|-------|
| `callsheetId` | Parent callsheet |
| `packageKind` | `CALLSHEET_PACKAGE_KIND_REGISTRY` |
| `generatedAt` | Issue timestamp |

---

## Registries

### `CALLSHEET_STATUS_REGISTRY`

`draft` · `review` · `approved` · `issued` · `revised` · `superseded` · `archived`

### `CALLSHEET_DISTRIBUTION_METHOD_REGISTRY`

`email` · `sms` · `mobile-app` · `download` · `print` · `custom`

### `CALLSHEET_RECIPIENT_GROUP_REGISTRY`

`production` · `cast` · `background` · `crew` · `vendors` · `transportation` · `locations` · `all` · `custom`

### `CALLSHEET_PACKAGE_KIND_REGISTRY`

`callsheet-package` · `distribution-package` · `mobile-package` · `print-package` · `pdf-package`

### `CALLSHEET_REVISION_COLOR_REGISTRY`

`white` · `blue` · `pink` · `yellow` · `green` · `goldenrod` · `buff` · `salmon` · `cherry` · `tan` · `gray` · `ivory` · `double-white`

---

## Separation of responsibilities

| Layer | Owns |
|-------|------|
| **Production Calendar** | When production operates |
| **Shoot Day** | What actually happened (execution) |
| **Callsheet** | Tomorrow’s / today’s **operational package** |
| **CallsheetPackage** | PDF, print, mobile, distribution artifacts |
| **Generated Output** | Derived artifacts (Article VI) |

---

## Naming collision — source vs core

| Identifier | Layer | Meaning |
|------------|-------|---------|
| `callsheet-revision` | **SourceDocumentKind** | Immutable uploaded callsheet **file** (Article I) |
| `callsheet-revision` | **CoreObjectKind** | Constitutional **CallsheetRevision** record |

Use `sourceDocumentKind` on `RelationshipEndpoint` to disambiguate graph edges. New constitutional work imports **`CallsheetRevision`** from `@/types/core/callsheet`.

---

## Relationship contracts

`CALLSHEET_CANONICAL_RELATIONSHIP_PATHS` · `CALLSHEET_RELATIONSHIP_SCHEMA_REGISTRY`

| Edge | Relationship |
|------|----------------|
| `shoot-day` → `callsheet` | Callsheet for day |
| `callsheet` → `callsheet-revision` | Revisions |
| `callsheet` → `callsheet-distribution` | Distribution |
| `callsheet` → `callsheet-package` | Output packages |
| `callsheet-package` → `generated-output` | PDF / delivery outputs |

---

## Legacy paths

| Path | Status |
|------|--------|
| `schedule-shootday-callsheet` | **Deprecated** — bypasses constitutional `callsheet` object |
| `callsheetrevision-generated-output` | **Legacy** — source document → output; prefer `callsheet-package` → `generated-output` |

---

## Next workspaces (not in scope)

- Workspace 16 — Transport Order Authority  
- Workspace 17 — Runsheet Authority  
- Workspace 18 — Production Accounting Authority  

---

*Types, registries, and relationship contracts only.*
