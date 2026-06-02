# Set Workspace Readiness Audit

**Audit date:** 2026-05-31  
**Scope:** `/dashboard/sets`, `/dashboard/sets/[setId]` and supporting code only.  
**Method:** Read-only review of routes, loaders, components, migrations, constitutional types. No code changes.

---

## Executive Summary

The Set Workspace is a **credible visual shell** with a **navigable list → detail flow** and **honest empty states** (no mock constitutional objects). It is **not yet a production workspace** for art department daily work: everything is **read-only**, most constitutional adjacencies are **unwired**, and **persistence requires manual migration + seeding** with no operator tooling.

| Dimension | Score (0–100%) | Evidence |
|-----------|----------------|----------|
| Navigation & entry | **62%** | Sidebar → `/dashboard/sets` → cards → detail; back link; cmdk includes Sets via sidebar index only |
| UI / visual design | **72%** | Programa-style asset grid, 70/30 layout, cards, dark-mode tokens |
| Runtime / persistence | **38%** | SQL migration exists; loaders use service role; tables often unapplied; no seed workflow |
| Constitutional coverage | **35%** | ProductionSet, Asset, Scene, Document partially; WorkOrder, Location absent |
| Production usability (daily work) | **18%** | View-only; no create/edit, no asset drill-down, no photos, no financial truth |
| Mobile | **58%** | Single-column stack works; long scroll; dense sidebar context |

**Overall workspace readiness: 42%**

**Verdict:** Suitable as a **demo / architecture preview** after DB seed. **Not ready** for Set Decorator, Buyer, or coordinator **operational** use without the blockers below.

---

## Top 10 Blockers

### 1. Persistence not operational by default

| Field | Value |
|-------|--------|
| **Severity** | Critical |
| **Impact** | List and detail show empty or “Set not found” until operator applies SQL and inserts rows |
| **Recommended fix** | Documented apply path + optional seed script or Supabase seed migration (no mock fiction) |
| **Estimated complexity** | Low (ops) / Medium (seed tooling) |

**Evidence:** `supabase/migrations/20260531000300_set_workspace_tables.sql` — not auto-applied. `listProductionSets()` / `loadSetWorkspace()` return empty on missing table or missing row.

---

### 2. Read-only workspace — no meaningful work actions

| Field | Value |
|-------|--------|
| **Severity** | Critical |
| **Impact** | Art roles cannot add assets, update status, attach docs, or request work from the UI |
| **Recommended fix** | Sprint scoped CRUD: asset status, notes, document link to `set_id`, optional work-order create |
| **Estimated complexity** | High |

**Evidence:** No forms, mutations, or server actions under `src/app/(main)/dashboard/sets/` or `src/components/set-detail/`.

---

### 3. Asset cards are dead ends

| Field | Value |
|-------|--------|
| **Severity** | High |
| **Impact** | Primary Programa-style board does not open asset detail; Buyer/Decorator cannot manage line items |
| **Recommended fix** | `/dashboard/assets/[assetId]` or in-set drawer; link from `SetAssetCard` |
| **Estimated complexity** | Medium–High |

**Evidence:** `set-asset-card.tsx` — no `Link`/`onClick`; display only.

---

### 4. Ingestion pipeline does not link documents to sets

| Field | Value |
|-------|--------|
| **Severity** | High |
| **Impact** | `documents` queried by `set_id` stay empty after `/ingestion/upload`; Documents panel useless in real flow |
| **Recommended fix** | Set picker on upload or infer from context; write `documents.set_id` in document chain |
| **Estimated complexity** | Medium |

**Evidence:** `src/server/ingestion-actions.ts` — no `set_id` on document insert. `loadSetWorkspace()` filters `documents.eq("set_id", setId)`.

---

### 5. No photo / hero media resolution

| Field | Value |
|-------|--------|
| **Severity** | High |
| **Impact** | Photo-first design shows placeholders only; fails Programa/Studio Designer bar |
| **Recommended fix** | Resolve `photo_storage_ref` via Supabase signed URLs; optional hero on `production_sets` (requires constitutional field or media link pattern) |
| **Estimated complexity** | Medium |

**Evidence:** `set-asset-card.tsx`, `set-detail-header.tsx` — `ImageIcon` placeholders. `assets.photo_storage_ref` column exists in migration but no loader URL logic.

---

### 6. Financial and budget panels are permanently empty

| Field | Value |
|-------|--------|
| **Severity** | High |
| **Impact** | Buyer and PD cannot see planned/committed/actual; overview Budget card is placeholder |
| **Recommended fix** | `production_costs` persistence + read-only rollup by `set_id` (constitutional `ProductionCost`) |
| **Estimated complexity** | High |

**Evidence:** `set-financial-panel.tsx`, `set-overview-cards.tsx` (Budget) — explicit empty states. No `production_costs` table in repo migrations.

---

### 7. Work orders not integrated

| Field | Value |
|-------|--------|
| **Severity** | Medium |
| **Impact** | “Open work” is document draft/review only; inter-department requests (constitutional `WorkOrder`) missing |
| **Recommended fix** | `work_orders` table + panel replacing/extending open-work; filter by `setId` |
| **Estimated complexity** | High |

**Evidence:** `WorkOrder` in `src/types/core/work-order/work-order.ts` (`setId` required). No table, loader, or UI reference in set workspace.

---

### 8. Locations not integrated

| Field | Value |
|-------|--------|
| **Severity** | Medium |
| **Impact** | Set’s `location_ids` on `ProductionSet` never surfaced; location-driven prep invisible |
| **Recommended fix** | Load `locations` (or join via IDs); header or sidebar strip on set detail |
| **Estimated complexity** | Medium |

**Evidence:** `ProductionSetRow.location_ids` in `workspace-types.ts` — not loaded in `loadSetWorkspace()`. No `locations` migration in set workspace SQL.

---

### 9. Activity timeline is static empty

| Field | Value |
|-------|--------|
| **Severity** | Medium |
| **Impact** | Coordinators lack audit trail (uploads, PO approve, asset add) |
| **Recommended fix** | Append-only activity table or project from domain events |
| **Estimated complexity** | Medium–High |

**Evidence:** `set-activity-timeline.tsx` — always `SetSectionEmpty`.

---

### 10. Auth / RLS vs dev service-role pattern

| Field | Value |
|-------|--------|
| **Severity** | Medium |
| **Impact** | Works in dev with `SUPABASE_SERVICE_ROLE_KEY`; production users with anon session may get zero rows under RLS `authenticated` policies |
| **Recommended fix** | Supabase Auth + production-scoped RLS; server loaders use session user, not only service role |
| **Estimated complexity** | High |

**Evidence:** `createServiceClient()` in `list-production-sets.ts` / `load-set-workspace.ts`. Migration policies: `TO authenticated` only on SELECT.

---

## Missing Runtime Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| `production_sets` table | Migration file only | `20260531000300_set_workspace_tables.sql` |
| `assets` table | Migration file only | Optional display columns `photo_storage_ref`, `vendor_display_name`, `cost_display_amount` |
| `scenes` table | Migration file only | Simplified row vs full `Scene` type |
| `documents.set_id` population | **Not implemented** | Ingestion/document chain |
| `locations` table + loader | **Missing** | Constitutional `Location` |
| `work_orders` table + loader | **Missing** | Constitutional `WorkOrder` |
| `production_costs` table + loader | **Missing** | Constitutional `ProductionCost` |
| Activity / event log | **Missing** | Timeline |
| Supabase env vars | Required | `NEXT_PUBLIC_*`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_DEFAULT_PRODUCTION_ID` |
| Signed URL service for photos | **Missing** | Storage read |
| Asset detail route | **Missing** | No `/dashboard/assets/[id]` |
| Sets search (global) | **Missing** | Cmdk = sidebar routes only |
| Set create / edit UI | **Missing** | No forms |
| Sync `ProductionSet.asset_ids` JSON with `assets` rows | **Not enforced** | Two sources of truth possible |
| Seed / onboarding documentation | Partial | `WORKSPACE_SPRINT_1.md`, operator prose only |

**Existing loaders (implemented):**

- `src/lib/sets/list-production-sets.ts` → `listProductionSets()`
- `src/lib/sets/load-set-workspace.ts` → `loadSetWorkspace(setId)`

**Routes (implemented):**

- `src/app/(main)/dashboard/sets/page.tsx`
- `src/app/(main)/dashboard/sets/[setId]/page.tsx`
- `src/app/(main)/dashboard/sets/workspace/page.tsx` → redirects to `/dashboard/sets`

---

## Missing Constitutional Integrations

| Constitutional object | Type path | Runtime connection | Gap |
|----------------------|-----------|-------------------|-----|
| **ProductionSet** | `src/types/core/scene/set.ts` | `production_sets` + header/overview | Partial: no hero, art-dept status labels (Shopping, Shoot Ready) not in `SetStatus`; `asset_ids`/`location_ids` arrays not maintained from DB |
| **Asset** | `src/types/core/asset/asset.ts` | `assets` table + board cards | Partial: row is subset of `Asset`; no `AssetInstance`, packages, PO links; cards not navigable |
| **Scene** | `src/types/core/scene/scene.ts` | `scenes` table + scene cards | Partial: simplified schema (`description`, counts); not full scene fields; click = no route |
| **Document** | `src/types/core/document/document.ts` | `documents` by `set_id` | Weak: only if `set_id` set manually; ingestion omits link |
| **WorkOrder** | `src/types/core/work-order/work-order.ts` | **None** | Required for department open work per constitution |
| **Location** | `src/types/core/location/location.ts` | **None** | `location_ids` on set unused |

**UI imports of `@/types/core`:** registries only (`asset-category`, `asset-status`, `document-category`) — not full object graphs or relationship engine.

**Related but out of workspace scope:** `PurchaseOrder`, `Shipment`, `Vendor` — referenced on `Asset` type, not shown on set page.

---

## 1. Navigation

| Check | Assessment |
|-------|------------|
| Sidebar flow | **Good** — Production → Sets → `/dashboard/sets` (`sidebar-items.ts`) |
| Back navigation | **Good** — `← All sets` on detail (`[setId]/page.tsx`) |
| User entry points | **Limited** — No global search to sets; no deep links from logistics/ingestion; Production group mostly `comingSoon` |
| Production workflow | **Incomplete** — List → detail works; no tie-in to schedule, locations, or ingestion review |

**Stale doc note:** `SET_DETAIL_WORKSPACE_V1.md` still references `/dashboard/sets/workspace` as help entry; code redirects to list.

---

## 2. Runtime Dependencies

See **Missing Runtime Dependencies** above. Supabase **is** in project (post–Phase 3); runtime audit doc `SYNCOFFSET_RUNTIME_AUDIT.md` is **outdated** on that point.

---

## 3. Constitutional Coverage

See **Missing Constitutional Integrations** above.

---

## 4. Empty States

| State | Implementation | Useful for production users? |
|-------|----------------|------------------------------|
| **No set found** | Header copy + migration hint (`set-detail-header.tsx`) | **Yes** — clear operator action |
| **No sets in production** | `sets-index.tsx` — no mock rows | **Yes** — honest |
| **Persistence unavailable** | Error message with migration name | **Yes** — for engineering; harsh for end users without IT |
| **No assets assigned** | `set-asset-board.tsx` | **Yes** — but needs next-step CTA (“Add asset” disabled today) |
| **No documents linked** | `set-documents-panel.tsx` | **Yes** — should mention linking via ingestion + `set_id` |
| **No scene usage** | `set-scenes-panel.tsx` | **Yes** |
| **Accounting unavailable** | Budget overview + financial panel | **Yes** — sets expectations; frustrating for Buyer until wired |
| **No drawings** | `set-drawings-panel.tsx` + type chips | **Yes** |
| **No open work** | `set-open-work-panel.tsx` | **Partial** — only documents; misleading if users expect work orders |
| **No recent activity** | `set-activity-timeline.tsx` | **Yes** — honest placeholder |

**Gap:** Empty states explain *absence* but rarely offer *enabled* next actions (by design in V1 read-only sprint).

---

## 5. Mobile

| Check | Assessment |
|-------|------------|
| Layout | `lg:grid-cols-10` → single column below `lg`; header stacks (`md:flex-row`) |
| Scrolling | Long vertical page (board + documents + scenes + drawings + aside panels); no sticky section nav |
| Readability | Text sizes adequate (`text-sm` / `text-xs`); good contrast on dark theme |
| Card density | Asset grid `sm:grid-cols-2` — reasonable; list page `sm:grid-cols-2` cards OK |

**Issues:** Aside (financial, open work, activity) appears **below** main content on mobile — financial summary far from overview cards. Document `ScrollArea` height may feel cramped on small viewports.

---

## 6. Production Usability (role-by-role)

| Role | Meaningful work today? | Why |
|------|------------------------|-----|
| **Set Decorator** | **No** | Cannot add/move assets, photos, or status; board is view-only |
| **Buyer** | **No** | No PO/receipt linkage on set page; financial empty; vendor/cost columns only if manually seeded in DB |
| **Art Coordinator** | **Minimal** | Can open set and scan list if seeded; no coordination tools (activity, WO, approvals) |
| **Assistant Art Director** | **Minimal** | Same — overview counts only if data exists |
| **Art Director** | **Minimal** | Visual layout preview only |
| **Production Designer** | **Minimal** | No drawings/media resolution; hero placeholder |

**Shared:** All roles benefit from **read-only orientation** once DB is seeded; none can **complete a workflow** inside the workspace.

---

## Recommendation

### Choose: **A. Improve Set Workspace**

**Not B. Build Asset Workspace** as the *next* flagship sprint.

**Why A**

1. **Navigation hub exists but is hollow** — list + detail are the right spine; abandoning them for a separate asset app duplicates context (assets are constitutionally **on a set**, `Asset.setId` required).
2. **Asset board is already the visual center** — improving drill-down, photos, and mutations on the set page delivers Programa-like value without a second flagship shell.
3. **Asset Workspace alone** would orphan `/dashboard/sets/[setId]` or force duplicate set context; B is premature until set-linked persistence and document ingestion are fixed.
4. **Highest ROI fixes are set-scoped** — `set_id` on documents, location strip, work-order open work, `production_cost` rollup, asset detail routes — all strengthen the current routes.

**When to choose B:** After A delivers navigable assets from set detail (click card → asset workspace) and seeded real data — then **Asset Workspace** becomes the deep editor; set page remains the hub.

**Suggested order for “Improve Set Workspace” sprint**

1. Operator readiness (apply migration + seed docs / script)  
2. Document ↔ set linkage from ingestion  
3. Asset detail route + clickable cards  
4. Photo signed URLs  
5. Work order + location panels (read-only first)  
6. Production cost read-only rollup  
7. Activity feed  

---

## OUT OF SCOPE (this audit)

- No code written  
- No routes, components, or migrations created  
- No new authorities  

---

## Appendix — File map

| Area | Paths |
|------|-------|
| List page | `src/app/(main)/dashboard/sets/page.tsx` |
| Detail page | `src/app/(main)/dashboard/sets/[setId]/page.tsx` |
| Components | `src/components/set-detail/*`, `src/components/sets/*` |
| Loaders | `src/lib/sets/load-set-workspace.ts`, `list-production-sets.ts` |
| Migration | `supabase/migrations/20260531000300_set_workspace_tables.sql` |
| Docs | `docs/SET_DETAIL_WORKSPACE_V1.md`, `docs/WORKSPACE_SPRINT_1.md` |

---

*End of audit.*
