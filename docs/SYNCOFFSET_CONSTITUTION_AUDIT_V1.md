# SyncOffset Constitutional Audit v1.0

**Date:** 2026-05-31  
**Scope:** `src/types/core/` — all authorities, registries, relationship graph, companion docs  
**Action:** Findings only — **no code changes** in this pass.

**Validation:** `npx tsc --noEmit` — **no errors in `src/types/core`**. Project-level noise remains in `.next/types/*` (unrelated).

---

## Executive summary

The constitutional layer is **structurally sound**: 92 `CoreObjectKind` values, 92 `CORE_OBJECT_REGISTRY` entries, zero invalid `relationshipTargets`, and zero exact-duplicate rows in `RELATIONSHIP_SCHEMA_REGISTRY`.

The highest-value architectural win is already in place:

```
source-document (Article I file)
        ↓
document-revision
        ↓
document (logical production record)
```

The dominant risks before TestFlight are **documentation drift**, **dual-registry maintenance**, **package/kind string collisions**, and **schedule naming split** (`shoot-schedule` vs `shooting-schedule`) — not missing authorities.

**Recommendation:** Consolidate and wire (this audit) before any Workspace 24+ authority expansion.

---

## Audit methodology

| Source | Reviewed |
|--------|----------|
| `kinds.ts` | Full kind union |
| `registry.ts` | Entries, `isCalendarAuthority`, `relationshipTargets` |
| `RELATIONSHIP_SCHEMA_REGISTRY` | Active + commented edges |
| `CANONICAL_RELATIONSHIP_PATHS` | Global paths vs per-authority paths |
| `src/types/core/*/…-relationship-contracts.ts` | 21 authority contract modules |
| `docs/SYNCOFFSET_*_AUTHORITY*.md` | 22 authority docs |
| `docs/SYNCOFFSET_CORE_OBJECT_REGISTRY.md` | Cross-check vs code |
| Automated scripts | Duplicates, orphans, collisions |

---

## 1. Duplicate kinds

| Severity | Finding |
|----------|---------|
| **None** | No duplicate entries in `CoreObjectKind` union (92 unique kinds). |
| **None** | Registry keys match kinds 1:1. |

### Near-collisions (not duplicate kinds)

| Severity | Identifier | Layers |
|----------|------------|--------|
| **Critical** | `callsheet-revision` | **SourceDocumentKind** (ingested PDF) · **CoreObjectKind** (`CallsheetRevision`) · colloquial “callsheet revision” |
| **Major** | `document-revision` | Document Authority · distinct from `callsheet-revision` and `calendar-revision` |
| **Major** | `revision-change` | Script Authority (script diff) · not a document file revision |
| **Informational** | `calendar-revision` vs `callsheet-revision` vs `document-revision` | All valid; require `sourceDocumentKind` / `CoreObjectKind` disambiguation at graph endpoints |

---

## 2. Duplicate relationship edges

| Severity | Finding |
|----------|---------|
| **None** | Zero exact duplicates (`kind|from|to`) in `RELATIONSHIP_SCHEMA_REGISTRY` (232 active edges). |
| **None** | Zero same edge with multiple labels. |

### Dual-registry maintenance (Major)

| Metric | Value |
|--------|-------|
| Authority contract files | 21 |
| Authority schema edges also present in global registry | **239** (copied/inlined pattern) |
| Authority schema edges **not** in global registry | **12** |

**12 edges only in authority contracts (not in global `RELATIONSHIP_SCHEMA_REGISTRY`):**

| Authority | Edge |
|-----------|------|
| Background | `requires` scene → element |
| Cast | `references` cast-assignment → scene |
| Creative | `references` department-package → scene, location; `attached-to` creative-reference → media; `references` approval-record → department-package |
| Crew | `references` crew-assignment → crew-requirement; `assigned-to` crew-member → department |
| Document | `references` document-link → scene, asset |
| Script | `derived-from` scene → department-package |
| Shoot Day | `generated-from` shootday-package → generated-output |

**Risk:** Global graph and authority modules drift when only one file is updated.

### Bidirectional edges (same relationship kind, reversed direction)

| Severity | Pair | Kind |
|----------|------|------|
| **Minor** | vendor ↔ shipment | `assigned-to` |
| **Minor** | vendor ↔ brokerage-record | `references` |
| **Minor** | location ↔ vendor | `references` |

These are not duplicates but may confuse traversal unless direction is documented.

### Intentional bidirectional planning ↔ execution

| Severity | Pair | Notes |
|----------|------|-------|
| **Informational** | scene ↔ shoot-day | `scene` → `shoot-day` `scheduled-on` + `shoot-day` → `scene` `references` — aligns with Scene owns intent / Shoot Day owns execution |
| **Informational** | production-calendar ↔ shooting-schedule | Calendar consumes schedule |

---

## 3. Deprecated paths still referenced

| Severity | Location | Item |
|----------|----------|------|
| **Major** | `relationship-path.ts` | `schedule-shootday-callsheet` — marked `@deprecated`; still in `CANONICAL_RELATIONSHIP_PATHS` |
| **Major** | `relationship-path.ts` | `callsheetrevision-generated-output` — `@deprecated`; uses `callsheet-revision` as **node** (ambiguous with core kind) |
| **Minor** | `relationship-schema-registry.ts` | 3 edges **commented out** (scene→asset, asset→return, asset→PO, vendor→brokerage-record) — correct deprecation, but still visible |
| **Major** | `bg-relationship-contracts.ts` | Path `shootday-callsheet-bg` still uses `callsheet-revision` as **SourceDocumentKind** cast — predates Callsheet/Document constitutional objects |
| **Major** | `services/shootday*` | Entire `src/types/core/services/` layer deprecated but **exported** from `@/types/core` |
| **Major** | `docs/SYNCOFFSET_SHOOTDAY_AUTHORITY.md` | Legacy doc coexists with `SYNCOFFSET_SHOOTDAY_AUTHORITY_V2.md` |
| **Minor** | `script/scene.ts`, `scene-production.ts`, `scene-type.ts` | Deprecated Scene duplicates |
| **Minor** | `services/shoot-day-record.ts` | Still exports `export type ShootDay = LegacyShootDay` (shadowed by barrel order if importing from `@/types/core` only) |

---

## 4. Circular authority dependencies

No hard **type-level** import cycles detected across authority folders.

### Conceptual coupling (not invalid, but dense)

| Severity | Cycle / hub | Notes |
|----------|-------------|-------|
| **Informational** | scene → budget → PO → shipment → asset → set → scene | Normative production hierarchy; not a registry bug |
| **Informational** | shoot-day → callsheet → communication → (refs) shoot-day | Distribution layer references execution |
| **Minor** | purchase-order ↔ shipment | PO spawns shipment; shipment `depends-on` PO — acyclic if direction respected |

**No Critical circular ownership loops** found in schema (e.g. A `owns` B `owns` A with same relationship kind).

---

## 5. Naming collisions

| Severity | Name | Conflict |
|----------|------|----------|
| **Critical** | `inventory-package` | **CoreObjectKind** (Inventory Authority) · **AssetPackageKind** string (`asset-status.ts`) |
| **Critical** | `callsheet-revision` | **SourceDocumentKind** · **CoreObjectKind** |
| **Major** | `shoot-schedule` | **SourceDocumentKind** (ingestion) vs **`shooting-schedule`** **CoreObjectKind** (constitutional schedule object) — no type module for `shooting-schedule` |
| **Major** | `location-package` | **SourceDocumentKind** (`location-package` ingestion) vs **CoreObjectKind** (`location-package` Location Authority) |
| **Major** | `department-package` | **CoreObjectKind** (Creative) · **ShootDayPackageKind** id `department-package` · **DocumentPackageKind** is separate |
| **Major** | `return` | **CoreObjectKind** (Return Authority) vs keyword / return logistics colloquial |
| **Minor** | `distribution-package` | Communication · Document · Callsheet package **kind strings** |
| **Minor** | `production-package` | Shoot Day package kind · Document package kind |
| **Minor** | `ConstructionPackage` (creative typed alias) vs `construction-package` (work-order package kind) — different type namespaces |

### Resolved well (Informational)

| Pattern | Resolution |
|---------|------------|
| `source-document` vs `document` | Document Authority v1 migration — **correct DAM pattern** |
| `LegacyShootDay` vs `ShootDay` | Barrel exports `shootday/` after `services/` — constitutional `ShootDay` wins from `@/types/core` |

---

## 6. Package kind collisions

14 package-related strings appear in multiple authority registries (core kind and/or `packageKind` id).

| Severity | Package string | Authorities / locations |
|----------|----------------|-------------------------|
| **Critical** | `inventory-package` | Asset `AssetPackageKind` · Inventory **core kind** |
| **Major** | `distribution-package` | Callsheet · Communication · Document |
| **Major** | `return-package` | Asset package kind · Return **core kind** · Brokerage package **kind id** |
| **Major** | `brokerage-package` | Brokerage core kind · Vendor relationship targets · Generated output kind union |
| **Major** | `department-package` | Creative core kind · Shoot Day package kind id |
| **Major** | `production-package` | Shoot Day · Document package kinds |
| **Minor** | `callsheet-package` | Callsheet core kind + status registry |
| **Minor** | `cost-report-package` | Accounting core kind + package kind |
| **Minor** | `strike-package` | Asset · Return · Work Order package kinds |
| **Minor** | `receiving-package` | Purchase · Shipment status registries |
| **Minor** | `asset-package` | Asset core + scene/asset contracts |
| **Minor** | `document-package` | Document core kind + package kind id (same authority — OK) |
| **Minor** | `location-package` | Source ingestion vs Location Authority core kind |

**Mitigation already used elsewhere:** separate TypeScript unions (`AssetPackageKind` vs `CoreObjectKind`). Runtime/graph code must never compare package kind strings across authorities without context.

---

## 7. Registry targets that no longer exist

| Severity | Finding |
|----------|---------|
| **None** | Automated pass: every `relationshipTargets` entry resolves to a `CoreObjectKind` in `kinds.ts`. |

### Over-broad / redundant targets (Minor)

Many entries list both `source-document` and `document` after Document Authority migration — intentional during transition; may be trimmed later for clarity.

---

## 8. Missing exports

| Severity | Finding |
|----------|---------|
| **Minor** | `index.ts` does not re-export `CANONICAL_RELATIONSHIP_PATHS` from each authority module — only `relationships/index.ts` exports global paths. Authority paths are exported from their barrels (e.g. `INVENTORY_CANONICAL_RELATIONSHIP_PATHS`) but not aggregated. |
| **Minor** | No single `CONSTITUTIONAL_SCHEMA_REGISTRY` merge — consumers must know global + authority split. |
| **Informational** | `transport-order`, `shooting-schedule`, `prep-day`, `wrap-day`, `company-move`, `person`, `stunt-performer`, `risk-evaluation`, `element` have registry entries but **no dedicated authority folder** |

### Barrel export order (Informational)

`@/types/core` exports `services/` before `shootday/` — constitutional `ShootDay` overrides deprecated `ShootDay` alias from services when using barrel import. Direct path imports from `services/shoot-day-record` still expose `ShootDay = LegacyShootDay`.

---

## 9. Orphaned authorities

“Orphaned” = kinds or contracts without a cohesive authority module or doc.

| Severity | Item | State |
|----------|------|-------|
| **Major** | **`shooting-schedule`** | Core kind + registry + calendar/callsheet edges; **no** `src/types/core/shooting-schedule/` types |
| **Major** | **`transport-order`** | Core kind + registry; **no** Transport Order Authority module (user noted W16 planned) |
| **Major** | **167 canonical paths** | Defined in authority `*_CANONICAL_RELATIONSHIP_PATHS` but **not** copied to global `CANONICAL_RELATIONSHIP_PATHS` (~30 global paths only) |
| **Minor** | `prep-day`, `wrap-day`, `company-move` | Registry only; scheduling semantics partially covered by Production Calendar `CalendarDayType` |
| **Minor** | `element` | Registry + BG edge `scene → element`; production code favors `breakdown-element` |
| **Minor** | `person`, `stunt-performer`, `risk-evaluation` | Registry targets only; thin or no first-class types |
| **Minor** | `permit` | Immutable source-adjacent; linked from location |
| **Informational** | Legacy `SYNCOFFSET_SHOOTDAY_AUTHORITY.md` | Superseded by V2 but still in repo |

### Well-formed authority modules (22 docs / 21 contract files)

Accounting, Asset, Background, Brokerage, Callsheet, Communication, Creative, Crew, Cast, Document, Inventory, Location, Production Calendar, Purchase, Return, Scene (incl. set/budget), Script, Shipment, Shoot Day, Vendor, Work Order.

---

## 10. Conflicting ownership rules

| Severity | Rule A | Rule B | Resolution status |
|----------|--------|--------|-------------------|
| **Critical** | `SYNCOFFSET_CORE_OBJECT_REGISTRY.md`: `shoot-day` `isCalendarAuthority: true` | `registry.ts`: only `production-calendar` + `calendar-day` are `isCalendarAuthority: true` | **Doc stale** — code reflects Calendar = planning, Shoot Day = execution |
| **Major** | Asset Authority: assets on Set | Scene deprecated `assetIds` still on `Scene` type | Code comments deprecate; fields remain |
| **Major** | Inventory Rule 2: location/qty/condition on Inventory | Asset Authority / `asset-instance` may imply deployment location | Documented in Inventory doc; not fully excised from asset paths |
| **Major** | Callsheet Rule 4: Callsheet owns execution package | Legacy paths still treat `callsheet-revision` source as terminal | Migrate consumers to `callsheet` core object |
| **Minor** | Scene owns Shoot Day (`scheduled-on`) | Shoot Day references Scene | Intentional bidirectional semantics |
| **Minor** | Work Order Rule 4: always on Set | Some edges use `scene → work-order` without set | `setId`/`setNumber` required on WO type — OK at type level |
| **Minor** | Communication Rule 6: does not create tasks | Work Order notifications via `work-order → communication` | Compatible if WO remains authoritative |

---

## Document Authority / source-document (highlight)

| Severity | Finding |
|----------|---------|
| **Informational (positive)** | `source-document` + `document` + `document-revision` split is the correct enterprise DAM pattern. |
| **Major** | Ingestion migration incomplete in **graph paths**: BG/cast/legacy paths still terminal on `callsheet-revision` **source** node instead of `callsheet` / `document`. |
| **Major** | `generated-output-source-documents` global path still ends at `source-document` — should align with `document-revision` chain per Document Authority. |
| **Minor** | `RelationshipSchemaEntry` uses `CoreObjectKind` only — `source-document` is now a core kind (OK). |

---

## Index / comment drift

| Severity | File | Issue |
|----------|------|-------|
| **Minor** | `src/types/core/index.ts` | Comment lists Inventory as “W22” — Communication also documented as W22 in prior work; workspace numbers collided |
| **Minor** | `SYNCOFFSET_CORE_OBJECT_REGISTRY.md` | Predates Document, Inventory, Communication, Accounting, Work Order authorities |

---

## TypeScript validation

```bash
npx tsc --noEmit
```

| Scope | Result |
|-------|--------|
| `src/types/core` | **Pass** (0 errors) |
| Full project | Fails on `.next/types/*` duplicate declarations (pre-existing Next.js artifact issue) |

---

## Recommended consolidation pass (no new authorities)

Priority order for a **wiring** sprint (not expansion):

1. **Critical:** Update `SYNCOFFSET_CORE_OBJECT_REGISTRY.md` — calendar authority, Document Authority, `source-document`, full kind list.
2. **Critical:** Document `inventory-package` / `callsheet-revision` disambiguation in a single `SYNCOFFSET_NAMING_REGISTRY.md` or appendix.
3. **Major:** Merge or generate global `RELATIONSHIP_SCHEMA_REGISTRY` from authority modules (single source of truth).
4. **Major:** Promote high-value `*_CANONICAL_RELATIONSHIP_PATHS` into global `CANONICAL_RELATIONSHIP_PATHS` OR publish `getAllCanonicalPaths()` aggregator.
5. **Major:** Align `shoot-schedule` (source) vs `shooting-schedule` (core) in docs and one relationship path vocabulary.
6. **Major:** Finish graph migration: `callsheet` / `document` / `source-document` in BG/cast/legacy paths.
7. **Minor:** Archive or redirect `SYNCOFFSET_SHOOTDAY_AUTHORITY.md` → V2 only.
8. **Minor:** Add 12 missing schema edges to global registry (or remove from authority if redundant).

---

## Authority inventory (code present)

| Domain | Doc | Contracts | Kinds (representative) |
|--------|-----|-----------|-------------------------|
| Script / Scene | ✓ | ✓ | script-revision, scene, set, budget-requirement, breakdown-element |
| Cast / Crew / BG | ✓ | ✓ | cast-*, crew-*, bg-* |
| Creative | ✓ | ✓ | director-note, department-package, tech-pack |
| Location | ✓ | ✓ | location-* |
| Asset / Inventory | ✓ | ✓ | asset-*, inventory-* |
| Vendor / Purchase | ✓ | ✓ | vendor-*, purchase-* |
| Shipment / Brokerage / Return | ✓ | ✓ | shipment-*, brokerage-*, return-* |
| Calendar / Shoot Day | ✓ | ✓ | production-calendar-*, shoot-day, shootday-* |
| Callsheet / Work Order | ✓ | ✓ | callsheet-*, work-order-* |
| Accounting / Communication | ✓ | ✓ | production-cost-*, communication-* |
| Document | ✓ | ✓ | document-*, source-document |
| Source (Article I) | partial | via source/ | source-document kinds |
| Transport / Shooting Schedule | ✗ / partial | partial edges only | transport-order, shooting-schedule |

---

## Conclusion

SyncOffset has **enough constitutional law to run a studio**. The next high-leverage work is **consolidation**: one graph registry, one naming appendix, doc sync, and completion of the **source-document → document-revision → document** chain across all paths — not another authority workspace.

---

---

## Phase 1 remediation status (2026-05-31)

| Critical finding | Status |
|------------------|--------|
| `callsheet-revision` collision | **Resolved** — [`SYNCOFFSET_NAMING_REGISTRY.md`](./SYNCOFFSET_NAMING_REGISTRY.md); legacy paths → `LEGACY_CANONICAL_RELATIONSHIP_PATHS`; BG path → `callsheet` |
| `inventory-package` collision | **Resolved** — Asset `AssetPackageKind` renamed to `asset-inventory-report`; core `inventory-package` unchanged |
| `CORE_OBJECT_REGISTRY.md` drift | **Resolved** — v2.0 doc synced with code |
| Dual-registry drift | **Resolved** — `RELATIONSHIP_SCHEMA_REGISTRY` merged from authority exports only (`relationship-schema-merge.ts`) |
| Deprecated graph terminals | **Resolved** — removed from active `CANONICAL_RELATIONSHIP_PATHS`; document chains added |

**Remaining (Phase 2+):** Full runtime document migration; Supabase; upload pipeline; extraction; search.

---

*Audit v1.0 — findings. Phase 1 remediation applied in code + docs per [`SYNCOFFSET_IMPLEMENTATION_SPRINT.md`](./SYNCOFFSET_IMPLEMENTATION_SPRINT.md).*
