# Set Detail Workspace V1

**Route:** `/dashboard/sets/[setId]`  
**Constitutional anchor:** `ProductionSet` (`src/types/core/scene/set.ts`)  
**Flagship art-department workspace — visual, set-centric, no mock data.**

---

## Component hierarchy

```
SetDetailPage (RSC)
└── SetDetailWorkspace
    ├── SetDetailHeader
    ├── SetOverviewCards
    └── Grid (70% / 30% at lg+)
        ├── Main column
        │   ├── SetAssetBoard
        │   │   └── SetAssetCard × n
        │   ├── SetDocumentsPanel
        │   ├── SetScenesPanel
        │   └── SetDrawingsPanel
        └── Aside
            ├── SetFinancialPanel
            ├── SetOpenWorkPanel
            └── SetActivityTimeline

Shared: SetSectionEmpty
```

**Entry (list out of scope):** `/dashboard/sets/workspace` — explains direct UUID navigation.

---

## Data dependencies

| Loader | Source | Constitutional type |
|--------|--------|---------------------|
| `loadSetWorkspace(setId)` | `production_sets` | `ProductionSet` |
| Assets | `assets` WHERE `set_id` | `Asset` |
| Scenes | `scenes` WHERE `set_id` | `Scene` |
| Documents | `documents` WHERE `set_id` | `Document` |

**File:** `src/lib/sets/load-set-workspace.ts`

If tables are missing or the set ID is unknown:

- `set = null` → header “Set not found”
- All sections use empty states (no fictional rows)

---

## Constitutional objects referenced

| Kind | Type module | UI usage |
|------|-------------|----------|
| `set` | `scene/set.ts` | Header, workspace root |
| `asset` | `asset/asset.ts` | Asset board cards |
| `asset` categories | `asset/asset-category.ts` | Board grouping |
| `asset` status | `asset/asset-status.ts` | Card badges |
| `scene` | `scene/scene.ts` | Scene usage cards |
| `document` | `document/document.ts` | Documents panel |
| `document` category | `document/document-category.ts` | Document sections |
| `document` status | `document/document-status.ts` | Status badges |
| `production-cost` | `accounting/production-cost.ts` | **Not loaded** — financial empty state |

---

## Missing runtime dependencies

| Capability | Status |
|------------|--------|
| `production_sets` / `assets` / `scenes` tables | Migration `20260531000300_set_workspace_tables.sql` (not auto-run) |
| `production_costs` table | Not implemented — budget + financial panels empty |
| Activity / event log | Not implemented — timeline empty |
| Hero image on `ProductionSet` | Not in constitution — placeholder only |
| Art-department display statuses (Shopping, Shoot Ready, …) | Not in `SetStatus` — use constitutional `planned` \| `active` \| `struck` \| `archived` or empty |
| Asset photos | Optional `photo_storage_ref` on `assets` row only; no storage resolver in v1 |
| `/dashboard/sets` list | Out of scope |
| Upload / edit | Out of scope |

---

## Future integrations

- Signed URLs for `photo_storage_ref` and hero media
- `production_costs` rollup by `set_id` for overview + financial panel
- Append-only activity feed (asset added, document uploaded, PO approved)
- Scene click → scene detail route
- Asset click → asset detail route
- Link ingestion `documents.set_id` on upload for automatic linkage
- Sets index at `/dashboard/sets`

---

## Design notes

- Programa-inspired asset grid: photo area first (icon placeholder when no image)
- Dark-mode tokens: `bg-card`, `muted`, `#dbd5c5` scene copy accent (matches logistics)
- No dense tables; cards and scroll areas only
- Mobile: single column (grid collapses)

---

## Navigation

Sidebar: **Production → Set Workspace** → `/dashboard/sets/workspace` (help page).

Direct: `/dashboard/sets/{uuid}` after seeding `production_sets`.

---

## Out of scope (V1)

AI, extraction, search, generated outputs, editing, uploads, new authorities, new core types, mock constitutional objects.
