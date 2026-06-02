# SyncOffset Development Rule — Build Integrity First

**Applies to:** `syncoffset-web`, `syncoffset-mobile/expo`, and all implementation work in this monorepo.

No feature, fix, or sprint item may be reported as complete unless this checklist passes.

---

## Never claim completion if any of these exist

- Build failures
- TypeScript errors (new or unacknowledged)
- Illegal client/server imports
- Missing routes
- Missing migrations (when schema is required)
- Missing environment variables (when runtime depends on them)
- Missing navigation wiring
- Runtime crashes
- Supabase table mismatches
- Broken imports
- Placeholder implementations presented as complete
- Mock data presented as production-ready

---

## Required completion checklist

### 1. Build verification

```bash
npm run build
```

**Result must be PASS.** On FAIL: stop; report exact error; do not claim complete.

### 2. TypeScript verification

```bash
npx tsc --noEmit
```

**Result must be PASS.** On FAIL: list errors; separate pre-existing vs introduced.

### 3. Route verification

For every new route:

- File exists under App Router / Expo Router
- Compiles in build
- Navigable URL documented
- Linked from UI when intended

Report: **Route URL · Navigation path · Status**

### 4. Migration verification

For every new table:

- Migration file path
- Table names
- Operator actions (manual apply; never assume applied)

### 5. Runtime verification

State **data source** explicitly:

- Supabase
- AsyncStorage
- Mock
- Context only
- Seed data
- Mixed

If not Supabase-backed, say so clearly.

### 6. Truthfulness labels

Use only:

| Label | Meaning |
|-------|---------|
| **PRODUCTION READY** | All checks pass; Supabase (or declared SOR) wired |
| **PARTIALLY IMPLEMENTED** | UI/route exists; data or deploy gaps remain |
| **PLACEHOLDER** | Shell / coming-soon |
| **MOCK** | Static or demo data |
| **DEPRECATED** | Superseded path still present |

Avoid “complete”, “done”, “finished” unless all checks pass.

### 7. Architectural violations

Report before claiming complete:

- Client component importing server module
- `next/headers` in client bundle
- Server actions imported into client components
- Circular dependencies
- Duplicate systems / duplicate SOR tables

---

## Final output format (every implementation report)

```text
BUILD STATUS:        PASS / FAIL
TYPECHECK STATUS:    PASS / FAIL
RUNTIME STATUS:      PASS / PARTIAL / MOCK
SOURCE OF TRUTH:     Supabase / AsyncStorage / Mixed / …
DEPLOYABLE:          YES / NO
```

**If DEPLOYABLE = NO, the feature is not complete.**

---

## Repo-specific notes

| Repo | Build command | Typecheck |
|------|---------------|-----------|
| `syncoffset-web` | `npm run build` | `npx tsc --noEmit` |
| `syncoffset-mobile/expo` | `npm run build` (if defined) / EAS | project `tsc` if configured |

Cross-repo work: run checks in **each** touched package.
