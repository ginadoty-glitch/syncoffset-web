# SyncOffset Audit Prompt (Template)

Use for **evidence-only** audits. Pair with [`SYNCOFFSET_BUILD_INTEGRITY_RULE.md`](./SYNCOFFSET_BUILD_INTEGRITY_RULE.md).

---

## OBJECTIVE

Audit **actual code**.

- Do not speculate.
- Do not propose future architecture.
- Do not describe intended behavior.

---

## OUTPUT (per item)

| Field | Values |
|-------|--------|
| **EXISTS** | YES / NO |
| **ROUTE** | path (or — if no route) |
| **DATA SOURCE** | Supabase · AsyncStorage · Mock · Context · Mixed · Seed |
| **READ** | YES / NO |
| **WRITE** | YES / NO |
| **SYSTEM OF RECORD** | table name(s) or service file (or —) |
| **BUILD STATUS** | PASS / FAIL (repo + command used) |
| **RUNTIME STATUS** | PASS / FAIL / PARTIAL |
| **DEPLOYABLE** | YES / NO |

**If EXISTS, READ, WRITE, RUNTIME, or DEPLOYABLE is NO:** state the **exact blocker** with evidence.

---

## Evidence requirements (no assumptions)

Every claim must cite at least one of:

- **File paths** (e.g. `expo/app/set-files.tsx`)
- **Imports** (e.g. `from "@/services/setFiles"`)
- **Table names** (e.g. `.from("set_files")` in service)
- **Route paths** (filesystem `app/.../page.tsx` or generated `routes.d.ts`)

Forbidden in audit prose:

- “Should”, “will”, “designed to”, “planned”
- Feature recommendations (unless asked separately)
- Intended behavior from comments/docs without matching runtime code

---

## Validation commands (when deployability is in scope)

Run in the audited package and report result:

```bash
npm run build
npx tsc --noEmit
```

Note **pre-existing** vs **item-specific** failures.

---

## Per-item report block (copy)

```markdown
### [Item name]

| | |
|--|--|
| **EXISTS** | YES / NO |
| **ROUTE** | |
| **DATA SOURCE** | |
| **READ** | YES / NO |
| **WRITE** | YES / NO |
| **SYSTEM OF RECORD** | |
| **BUILD STATUS** | PASS / FAIL |
| **RUNTIME STATUS** | PASS / FAIL / PARTIAL |
| **DEPLOYABLE** | YES / NO |

**Blocker:** (if any NO) — …

**Evidence:**
- `path/to/file.ts` — …
- Import: `…`
- Table: `…`
```

---

## Scope placeholder

**Audit scope:** [e.g. Web Production Calendar · Expo Set Files · full Expo tabs]

**Repos:** [syncoffset-web · syncoffset-mobile/expo]

**Date:** YYYY-MM-DD

---

## Related audits (historical)

| Doc | Scope |
|-----|--------|
| [`EXPO_RUNTIME_WIRING_AUDIT.md`](./EXPO_RUNTIME_WIRING_AUDIT.md) | Expo screen wiring |
| [`EXPO_DATA_LOSS_ELIMINATION_PLAN.md`](./EXPO_DATA_LOSS_ELIMINATION_PLAN.md) | AsyncStorage SOR workflows |
| [`SYNCOFFSET_PRODUCT_MATRIX.md`](./SYNCOFFSET_PRODUCT_MATRIX.md) | Web vs Expo matrix (may be stale — re-verify) |

Re-run audits when code changes; do not trust older docs without file grep.
