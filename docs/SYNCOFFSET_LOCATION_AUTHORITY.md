# SyncOffset Location Authority

Version 1.0 — Types and graph contracts only

**Workspace:** 07 Locations

**Code:** `src/types/core/location/`

**Related:** [`SYNCOFFSET_SCRIPT_AUTHORITY.md`](./SYNCOFFSET_SCRIPT_AUTHORITY.md) · [`SYNCOFFSET_VENDOR_AUTHORITY.md`](./SYNCOFFSET_VENDOR_AUTHORITY.md) · [`SYNCOFFSET_SHOOTDAY_AUTHORITY.md`](./SYNCOFFSET_SHOOTDAY_AUTHORITY.md)

---

## Constitutional objects

| Object | `CoreObjectKind` | Meaning |
|--------|------------------|---------|
| **Location** | `location` | Physical filming or production site |
| **LocationRequirement** | `location-requirement` | Scout / production need — **not** the place itself |
| **LocationPackage** | `location-package` | Approved location documentation (scout package, stills index) |
| **LocationAssignment** | `location-assignment` | Location bound to shoot day / scene activity |

**Out of scope in this phase:** maps, permits (`permit` remains separate), scheduling engine, Supabase.

**Naming note:** Authority `location-package` is an approved record object — distinct from immutable source `location-package` files in `source/` ingestion and from creative `department-package`.

---

## Location

**Types:** Studio · Stage · Practical Location · Warehouse · Vendor Facility · Office · Exterior Location · Backlot · Custom

| Field | Notes |
|-------|-------|
| `locationName` | Production-facing name |
| `locationType` | `LOCATION_TYPE_REGISTRY` |
| `address` | Optional address block (not map coordinates) |
| `locationRequirementIds[]`, `locationPackageIds[]`, `locationAssignmentIds[]` | Membership |
| `vendorIds[]`, `assetIds[]` | Linked vendors and assets on site |

---

## LocationRequirement

Need generated from script breakdown, scenes, or department packages.

| Field | Notes |
|-------|-------|
| `sceneId`, `breakdownElementId`, `scriptRevisionId`, `departmentPackageId` | Provenance |
| `locationId` | Set when requirement is fulfilled by a booked location |
| `requirementLabel` | e.g. "Warehouse — Night INT" |

---

## LocationPackage

Approved documentation for a location — scout reports, reference stills, location agreements (as source documents).

| Field | Notes |
|-------|-------|
| `locationId` | Approved location |
| `sourceDocumentIds[]`, `mediaAssetIds[]` | Provenance (Article I) |
| `approvedBy` | Locations coordinator |

---

## LocationAssignment

| Field | Notes |
|-------|-------|
| `locationId`, `shootDayId` | Day binding |
| `sceneId`, `companyMoveId` | Optional scope |
| `locationRequirementId` | Requirement fulfilled |

---

## Constitutional flow

```
Scene / Breakdown Element
    → Location Requirement
        → Location (approved site)
            → Location Assignment
                → Shoot Day
                    → Callsheet
```

Parallel links: **Location → Vendor**, **Location → Asset**

---

## Relationship graph (contracts only)

```
Scene → Location Requirement
Breakdown Element → Location Requirement
Location Requirement → Location
Location → Shoot Day (via Location Assignment)
Location → Callsheet (via Shoot Day / Generated Output)
Location → Vendor
Location → Asset
```

`LOCATION_CANONICAL_RELATIONSHIP_PATHS` · `LOCATION_RELATIONSHIP_SCHEMA_REGISTRY`

---

## Imports

```ts
import {
  type Location,
  type LocationRequirement,
  type LocationPackage,
  type LocationAssignment,
  LOCATION_TYPE_REGISTRY,
} from "@/types/core";
```

---

*No UI, routes, maps, permits workflow, scheduling engine, or Supabase in this phase.*
