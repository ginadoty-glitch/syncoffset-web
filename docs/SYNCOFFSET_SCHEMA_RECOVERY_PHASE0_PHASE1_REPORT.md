# Schema Recovery — Phase 0 & Phase 1 Execution Report

**Project:** `yddwznlclkcfqqgmorye`  
**Authority:** [SYNCOFFSET_SCHEMA_DECISION_RECORD.md](./SYNCOFFSET_SCHEMA_DECISION_RECORD.md) · [SYNCOFFSET_SCHEMA_RECOVERY_PLAN.md](./SYNCOFFSET_SCHEMA_RECOVERY_PLAN.md)  
**Date:** 2026-06-02

---

## Executive summary

| Phase | DB execution | Reason |
|-------|----------------|--------|
| **Phase 0** | **NOT APPLIED** | No `SUPABASE_SERVICE_ROLE_KEY` / `DATABASE_URL` / Supabase CLI link in this environment |
| **Phase 1** | **NOT APPLIED** | Same |

**Operator assets prepared:**

- `docs/sql/SYNCOFFSET_SCHEMA_RECOVERY_PHASE0_PHASE1.sql` — Phase 0 rename (transactional)
- Phase 1: paste full files from `syncoffset-mobile/supabase/migrations/20260520100000_production_schedule_shadow.sql` then `20260521100000_schedule_revision_publish_phase2.sql`

**No SDR conflicts** in migration content (Phase 1 does not touch `scenes` or constitutional `documents`).

---

## Pre-flight (before apply)

| TABLE | EXISTS (probe) | Notes |
|-------|----------------|-------|
| `documents` | **YES** (implied) | PostgREST 42501 permission denied — not PGRST205 |
| `document_versions` | **YES** (implied) | 42501 |
| `logistics_documents` | **NO** | PGRST205 |
| `logistics_document_versions` | **NO** | PGRST205 |
| `production_schedule_revisions` | **NO** | PGRST205 |
| `production_schedule_days` | **NO** | PGRST205 |
| `production_schedule_lineage` | **NO** | PGRST205 |

---

## Phase 0 — Document collision recovery

### Planned SQL (Decision 2)

```sql
ALTER TABLE public.documents RENAME TO logistics_documents;
ALTER TABLE public.document_versions RENAME TO logistics_document_versions;
```

### SDR compliance

| Check | Result |
|-------|--------|
| Renames legacy only | **PASS** |
| Frees `documents` for future constitutional `CREATE` | **PASS** (after rename) |
| Conflicts with Decision 1 (`scenes`) | **NONE** |

### Post-apply verification (expected)

| TABLE | EXISTS (target) |
|-------|-----------------|
| `logistics_documents` | YES |
| `logistics_document_versions` | YES |
| `documents` | NO (until Phase 4 constitutional migration) |

### Legacy logistics routes

| Check | Expected after rename **without app code change** |
|-------|-----------------------------------------------------|
| Expo `.from("documents")` | **FAIL** — table name no longer exists |
| Expo `.from("document_versions")` | **FAIL** |
| Constitutional chain unblocked | **YES** — name `documents` free for `20260531000100` |

Per SDR: mobile must later target `logistics_documents` (follow-up code sprint). Phase 0 **does not** use views named `documents` (would block constitutional table).

---

## Phase 0 validation matrix (not run on DB — template)

| Check | TABLE / item | EXISTS | POLICIES | FUNCTIONS |
|-------|----------------|--------|----------|-----------|
| Rename | `logistics_documents` | — / NO | — | — |
| Rename | `logistics_document_versions` | — / NO | — | — |
| Freed | `documents` | NO | — | — |

**BUILD STATUS:** PASS (`syncoffset-web` `npm run build`)  
**TYPECHECK STATUS:** PASS (web + expo)  
**SAFE TO CONTINUE:** **NO** (Phase 0 not applied on host)

---

## Phase 1 — Schedule authority recovery

### Migrations (apply once, mobile copy)

| ORDER | FILE |
|-------|------|
| 1 | `syncoffset-mobile/supabase/migrations/20260520100000_production_schedule_shadow.sql` |
| 2 | `syncoffset-mobile/supabase/migrations/20260521100000_schedule_revision_publish_phase2.sql` |

### Depends on (verify on project)

- `public.shows` — present
- `public.production_documents` — required for nullable FKs on schedule revisions/days
- `public.is_member_of`, `public.is_dev_show` — required for RLS

### Creates

| Object | Type |
|--------|------|
| `production_schedule_revisions` | table + RLS + grants |
| `production_schedule_days` | table + RLS + grants |
| `production_schedule_lineage` | table + RLS |
| `production_schedule_revisions_assign_number` | function + trigger |
| `publish_production_schedule_revision` | function (SECURITY DEFINER) |

### SDR compliance

| Check | Result |
|-------|--------|
| Touches `public.scenes` | **NO** |
| Touches `public.documents` | **NO** (only `production_documents` FK) |
| STOP condition triggered | **NO** |

---

## Phase 1 validation matrix (template after apply)

| TABLE | EXISTS |
|-------|--------|
| `production_schedule_revisions` | YES / NO |
| `production_schedule_days` | YES / NO |
| `production_schedule_lineage` | YES / NO |

| FUNCTIONS | PASS / FAIL |
|-----------|-------------|
| `publish_production_schedule_revision` | |
| `production_schedule_revisions_assign_number` | |

| POLICIES | PASS / FAIL |
|----------|-------------|
| RLS enabled on three schedule tables | |
| `is_member_of` / `is_dev_show` policies present | |

**BUILD STATUS:** PASS  
**TYPECHECK STATUS:** PASS  
**SAFE TO CONTINUE:** **NO** until Phase 0–1 applied and verified

---

## How to complete execution (operator)

1. Supabase Dashboard → project **yddwznlclkcfqqgmorye** → SQL Editor (service role).
2. Run `docs/sql/SYNCOFFSET_SCHEMA_RECOVERY_PHASE0_PHASE1.sql` (Phase 0 block).
3. Paste and run **full** `20260520100000_production_schedule_shadow.sql`.
4. Paste and run **full** `20260521100000_schedule_revision_publish_phase2.sql`.
5. Run post-check queries in SQL file comments.
6. Re-probe with service role or SQL `to_regclass`.

Optional local:

```bash
export SUPABASE_SERVICE_ROLE_KEY='…'  # project secret key
# Use psql session pooler URL from Dashboard → Connect
```

---

## FINAL REPORT

```text
PHASE COMPLETED:           Phase 0 — NOT APPLIED (env)
                           Phase 1 — NOT APPLIED (env)

TABLES CREATED:            (none this session)

TABLES RENAMED:            (none this session)
                           Planned: documents → logistics_documents
                                     document_versions → logistics_document_versions

BLOCKERS REMAINING:
  1. SUPABASE_SERVICE_ROLE_KEY or DB URL not available to agent for DDL
  2. Phase 0–1 SQL not executed on yddwznlclkcfqqgmorye
  3. After Phase 0: Expo logistics document paths need logistics_* table names (code; out of scope here)

SAFE FOR PHASE 2 (WEB SETS):  NO
```

**Phase 2 remains blocked until:** Phase 0 rename confirmed, Phase 1 schedule tables confirmed, and `public.scenes` not created by Expo migration (per SDR).

---

## Amendments / re-run

After operator applies SQL, update this report with post-flight `EXISTS YES/NO` and set **SAFE FOR PHASE 2** to **YES** when Phase 0–1 post-checks pass.
