# SyncOffset Implementation Prompt (Template)

Copy this block into a task before implementation. Replace bracketed placeholders. Pair with [`SYNCOFFSET_BUILD_INTEGRITY_RULE.md`](./SYNCOFFSET_BUILD_INTEGRITY_RULE.md).

---

## OBJECTIVE

Implement **[feature name]**.

- Do not redesign unrelated areas.
- Do not create new authorities.
- Do not introduce mock data.

---

## SOURCE OF TRUTH

Use:

- **[table]**
- **[table]**
- **[table]**

Do not create duplicate storage.

---

## ROUTES

Create or modify:

- **/route**
- **/route**

---

## FILES

**Allowed:**

- **path**
- **path**

Do not modify unrelated files.

---

## REQUIREMENTS

1. **Requirement**
2. **Requirement**
3. **Requirement**

---

## OUT OF SCOPE

- AI
- New dashboards
- New tables
- New architecture
- Mock data

---

## VALIDATION REQUIRED

Run in the touched package(s):

```bash
npm run build
npx tsc --noEmit
```

Also verify per build-integrity rule: routes, migrations (if any), navigation, client/server boundaries, runtime SOR.

---

## REPORT FORMAT

Use truth labels only:

| Label | When |
|-------|------|
| **PRODUCTION READY** | Build + typecheck pass; SOR wired; deployable |
| **PARTIALLY IMPLEMENTED** | Gaps remain (env, migration, data, nav) |
| **PLACEHOLDER** | Shell only |
| **MOCK** | Demo/static data |
| **DEPRECATED** | Legacy path |

Every report **must** end with:

```text
BUILD STATUS:        PASS / FAIL
TYPECHECK STATUS:    PASS / FAIL
RUNTIME STATUS:      PASS / FAIL / PARTIAL
SOURCE OF TRUTH:     Supabase / AsyncStorage / Mixed
DEPLOYABLE:          YES / NO
```

**If DEPLOYABLE = NO, the feature is not complete.**

---

## Example (filled)

**OBJECTIVE:** Wire set-files screens to existing `set_files` / `scenes` tables.

**SOURCE OF TRUTH:** `set_files`, `scenes` (Expo `setFilesService.ts`).

**ROUTES:** `/set-files`, `/set-file/[id]` (Expo).

**FILES:** `expo/app/set-files.tsx`, `expo/app/set-file/[id].tsx`, `expo/services/setFilesService.ts` only.

**OUT OF SCOPE:** New tables, web `production_sets` merge, mock vendors.

**VALIDATION:** `npm run build` in `syncoffset-mobile/expo` if applicable; Expo typecheck if configured.
