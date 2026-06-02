# Supabase Implementation Plan — Phase 3 Foundation Sprint

**Date:** 2026-05-31  
**Objective:** Connect `src/types/core` document chain to Supabase Storage + Postgres. No AI, extraction, or workflows.

---

## PART 1 — Project structure audit

| Item | Finding | Evidence |
|------|---------|----------|
| **Next.js version** | **16.2.x** | `package.json` → `"next": "^16.2.6"` |
| **Router** | **App Router** | `src/app/` with `layout.tsx`, `page.tsx`; no `pages/` directory |
| **Database layer** | **None (pre-sprint)** | No ORM, no `src/app/api`, no Supabase prior to Phase 3 |
| **Auth** | **UI placeholders only** | `src/app/(main)/auth/v1/login`, `auth/v2/register` — forms without Supabase Auth wiring; no `middleware.ts` before sprint |
| **Server actions** | **Cookie preferences only** | `src/server/server-actions.ts` — `getValueFromCookie`, `setValueToCookie`, `getPreference` |
| **Constitutional types** | **Present, disconnected from app** | `src/types/core/` (~198 files); zero `@/types/core` imports in `src/app` before Phase 3 |
| **State** | Zustand (preferences, mail) | `src/stores/preferences/`, `src/app/(main)/mail/_components/use-mail.ts` |
| **Validation** | Zod 4 | `package.json` |
| **Styling** | Tailwind v4 + Shadcn | `globals.css`, `src/components/ui/` |

### Route groups

| Group | Path prefix | Layout |
|-------|-------------|--------|
| Dashboard | `/dashboard/*` | `src/app/(main)/dashboard/layout.tsx` (sidebar) |
| Mail | `/mail` | `src/app/(main)/mail/layout.tsx` |
| Auth | `/auth/*` | `auth/v2/layout.tsx` |
| **Ingestion (Phase 3)** | `/ingestion`, `/ingestion/upload` | `src/app/(main)/ingestion/layout.tsx` |

### Phase 3 additions

| Component | Path |
|-----------|------|
| Supabase browser client | `src/lib/supabase/client.ts` |
| Supabase server client | `src/lib/supabase/server.ts` |
| Session middleware helper | `src/lib/supabase/middleware.ts` |
| Root middleware | `src/middleware.ts` |
| Ingestion services | `src/lib/ingestion/*` |
| Upload server action | `src/server/ingestion-actions.ts` |
| SQL migrations | `supabase/migrations/` |
| Env template | `.env.example` |

---

## Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server-only: uploads + inserts until Auth is wired
NEXT_PUBLIC_DEFAULT_PRODUCTION_ID=  # UUID for single-production dev tenant
```

---

## Deployment steps (operator)

1. Create Supabase project.
2. Copy env vars to `.env.local`.
3. Run migrations (do not auto-execute from repo):
   ```bash
   supabase db push
   # or apply SQL files in supabase/migrations/ via dashboard SQL editor
   ```
4. Create storage buckets via `20260531000000_storage_buckets.sql`.
5. Apply `20260531000100_constitutional_documents.sql`.
6. `npm run dev` → `/ingestion/upload` → upload PDF → verify `/ingestion`.

---

## PART 9 — Validation checklist

### Test A — Upload PDF

1. Open `/ingestion/upload`.
2. Select source kind + PDF file → Upload.
3. **Expect:**
   - Supabase Storage: object under `{bucket}/{productionId}/{sourceDocumentId}/{filename}`.
   - `source_documents` row: `ingestion_status = 'uploaded'`, `source_file.storage_ref` populated.

### Test B — Review queue

1. Open `/ingestion`.
2. **Expect:** row with file name, source kind, upload date, status `uploaded`, uploaded by.

---

## Out of scope (Phase 3)

- OCR / LLM / agentic extraction (Phase 4+)
- Generated outputs runtime
- Forecasting / accounting engines
- Full RBAC (policies stubbed for `authenticated`; service role used server-side for dev)
- Auto-create `documents` + `document_revisions` on upload (tables ready; upload inserts `source_documents` only per sprint spec)

---

## Remaining gaps before Phase 4

See `docs/CONSTITUTION_RUNTIME_MAPPING.md` and sprint deliverables summary in Phase 3 PR notes.
