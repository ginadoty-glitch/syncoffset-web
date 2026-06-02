# SyncOffset Rule — Duplication Guard (Audit Before Build)

**Applies before any new feature implementation.**

Pair with:

- [`SYNCOFFSET_AUDIT_PROMPT.md`](./SYNCOFFSET_AUDIT_PROMPT.md) — evidence format
- [`SYNCOFFSET_IMPLEMENTATION_PROMPT.md`](./SYNCOFFSET_IMPLEMENTATION_PROMPT.md) — scoped build
- [`SYNCOFFSET_CANONICAL_MODEL.md`](./SYNCOFFSET_CANONICAL_MODEL.md) — declared SOR winners
- [`SYNCOFFSET_PRODUCT_MATRIX.md`](./SYNCOFFSET_PRODUCT_MATRIX.md) — Web vs Expo (verify in code, may be stale)

---

## Rule

Before implementing any new feature, **audit whether the workflow already exists** in:

| Layer | Where to look |
|-------|----------------|
| **Expo** | `syncoffset-mobile/expo/app/**`, `expo/services/**`, `(tabs)` navigation |
| **Web** | `syncoffset-web/src/app/**`, `src/lib/**`, sidebar `src/navigation/sidebar/sidebar-items.ts` |
| **Supabase** | `syncoffset-mobile/supabase/migrations/**`, `syncoffset-web/supabase/migrations/**` |
| **Constitutional types** | `syncoffset-web/src/types/core/**`, `expo/types/**` |

Use **grep**, route scans, and `.from("table")` searches — not memory or docs alone.

---

## If an equivalent workflow already exists

**STOP.** Do not build a second version.

Report:

```markdown
## EXISTING IMPLEMENTATION
- Repo / route / service / table (with file paths)

## DUPLICATION RISK
- What would be duplicated (data model, route name, user-facing workflow)

## RECOMMENDED OWNER
- Single system of record: Expo | Web | Supabase table | Constitutional type
- Action: wire / extend / deprecate — not reimplement
```

Only proceed with implementation when:

- No equivalent exists, **or**
- User explicitly approves extending the **recommended owner** (not a parallel fork)

---

## Equivalence examples (audit triggers)

| Proposed work | Check first |
|---------------|-------------|
| Production calendar UI | Expo `(tabs)/calendar` + `production_schedule_*` · Web `/dashboard/production-calendar` + `calendar_days` |
| Set list / set detail | Expo `set-files` + `set_files` / AsyncStorage · Web `/dashboard/sets` + `production_sets` |
| Transport / runsheets | Expo `runsheets`, `trips` · Web `transport_orders` + mock `logistics` |
| Document upload | Web `/ingestion` + `source_documents` · Expo `production-document-ingest` + `production_documents` |
| Budget pressure | Expo `live-budget`, `budget` · Web `/dashboard/finance` (template mock) |

---

## Output label

If stopping due to duplication: report status **DEPRECATED / DUPLICATE PATH** — not **PRODUCTION READY** for the proposed second system.
