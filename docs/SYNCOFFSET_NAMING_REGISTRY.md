# SyncOffset Naming Registry

**Version:** 1.0 — disambiguation for identifiers shared across layers  
**Companion:** [`SYNCOFFSET_CONSTITUTION_AUDIT_V1.md`](./SYNCOFFSET_CONSTITUTION_AUDIT_V1.md) · [`SYNCOFFSET_IMPLEMENTATION_SPRINT.md`](./SYNCOFFSET_IMPLEMENTATION_SPRINT.md)

---

## Rule

When the **same string** appears in multiple type namespaces, always qualify:

| Qualifier | Example |
|-----------|---------|
| `CoreObjectKind` | `kind: "inventory-package"` on `InventoryPackage` |
| `SourceDocumentKind` | `sourceDocumentKind: "callsheet-revision"` on ingestion |
| `AssetPackageKind` | `packageKind: "asset-inventory-report"` on `AssetPackage` |
| `*PackageKind` (authority) | `packageKind` on authority package objects — scoped to that authority’s union |

**Never** compare package kind strings across authorities without context.

---

## Critical disambiguations (Phase 1)

### `callsheet-revision`

| Layer | Identifier | Type / object |
|-------|------------|---------------|
| **Ingestion** | `callsheet-revision` | `SourceDocumentKind` — immutable uploaded callsheet **file** (PDF, etc.) |
| **Constitutional** | `callsheet-revision` | `CoreObjectKind` — **`CallsheetRevision`** record under **`callsheet`** |
| **Colloquial** | “callsheet revision” | Disambiguate in docs and UI copy |

**Graph rules:**

- Active canonical paths use **`callsheet`** → **`callsheet-revision`** (core) → **`callsheet-package`** → **`generated-output`**.  
- Legacy paths that terminate on **`callsheet-revision` as SourceDocumentKind** live in `LEGACY_CANONICAL_RELATIONSHIP_PATHS` only.  
- Document chain: ingested file → `source-document` → `document-revision` → `document` → `document-link` → `callsheet`.

**Code pointers:** `source-document-kind.ts` · `callsheet/callsheet-revision.ts` · `SYNCOFFSET_CALLSHEET_AUTHORITY.md`

---

### `inventory-package`

| Layer | Identifier | Type / object |
|-------|------------|---------------|
| **Constitutional** | `inventory-package` | `CoreObjectKind` — **`InventoryPackage`** (Inventory Authority) |
| **Asset documentation** | `asset-inventory-report` | `AssetPackageKind` — asset-side inventory **report** package (renamed from `inventory-package` in Phase 1) |

**Graph rules:**

- Inventory edges use **`toKind: "inventory-package"`** (core kind only).  
- Asset packages must use **`packageKind: "asset-inventory-report"`**, never `"inventory-package"`.

**Code pointers:** `inventory/inventory-package.ts` · `asset/asset-status.ts` · `SYNCOFFSET_INVENTORY_AUTHORITY.md`

---

## Related revision identifiers (informational)

| String | Authority | Meaning |
|--------|-----------|---------|
| `document-revision` | Document | Logical document revision |
| `calendar-revision` | Production Calendar | Calendar revision record |
| `shooting-schedule-revision` | Shooting Schedule | Schedule revision record |
| `revision-change` | Script | Diff between script revisions — **not** a file revision |
| `callsheet-revision` | Callsheet + Source | See above |

---

## Schedule naming

| Layer | Identifier | Meaning |
|-------|------------|---------|
| `shoot-schedule` | `SourceDocumentKind` | Uploaded schedule file only |
| `shooting-schedule` | `CoreObjectKind` | Constitutional schedule object |

See [`SYNCOFFSET_SHOOTING_SCHEDULE_AUTHORITY.md`](./SYNCOFFSET_SHOOTING_SCHEDULE_AUTHORITY.md).

---

## Location package

| Layer | Identifier | Meaning |
|-------|------------|---------|
| `location-package` | `SourceDocumentKind` | Ingested location file |
| `location-package` | `CoreObjectKind` | Location Authority approved package |
| `location-department` | `DepartmentPackageKind` | Creative department package — not `location-package` |

---

## Package kind collisions (documented, not renamed in Phase 1)

| String | Authorities | Notes |
|--------|-------------|-------|
| `distribution-package` | Callsheet, Communication, Document | Disambiguate by parent object `kind` |
| `production-package` | Shoot Day, Document | Package kind id, not core kind |
| `department-package` | Creative core kind · Shoot Day package kind id | Different namespaces |
| `return-package` | Asset, Return, Brokerage | Use parent `kind` |

---

*Naming registry v1.0 — extend when new collisions are discovered; do not add core kinds here.*
