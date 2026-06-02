# SyncOffset Runtime Implementation Audit

**Audit date:** 2026-05-31  
**Scope:** Runtime code only (`src/`, `package.json`, app routes). Constitutional markdown under `docs/*AUTHORITY*` and registry docs were not used as evidence unless referenced by runtime TypeScript.  
**Method:** Repository search (`grep`/`glob`), file reads, `npx tsc --noEmit` (project root).

---

## Executive summary

SyncOffset Web today is a **Next.js 16 dashboard shell** with a **working client-side logistics prototype** (mock data + propagation engine). There is **no backend**, **no Supabase**, **no API routes**, **no file upload implementation**, and **no connection** between `src/types/core` and `src/app`. Constitutional types and registries exist as TypeScript only; extraction, storage, review queues for documents, and generated-output creation are **not implemented at runtime**.

---

## Section 1 — File uploads

### Search evidence

| Pattern | Result |
|---------|--------|
| `type="file"` | **0 matches** in repository |
| `FormData`, `multipart` | **0 matches** |
| `onDrop`, `useDropzone`, `Dropzone` | **0 matches** |
| `accept=` (image/file picker) | **0 matches** |
| `createObjectURL` | **0 matches** |

`src/components/ui/input.tsx` supports native `type={type}` and Tailwind `file:` styles, but **no caller passes `type="file"`**.

`@dnd-kit` is used only for **table row reorder** in legacy proposal UI — not file drop:

- `src/app/(main)/dashboard/(legacy)/default-v1/_components/proposal-sections-table/table.tsx` (`DndContext`, `onDragEnd`)

### Upload paths traced

| Route | Component | Storage target | Status |
|-------|-----------|----------------|--------|
| `/dashboard/productivity` | `quick-actions.tsx` — label `"Upload"`, `Upload` icon | None — `<Button variant="outline">` with **no** `onClick`, **no** `href`, **no** `<input type="file">` | **Placeholder** |
| *(none)* | No upload forms, document pickers, or image pickers found | — | **Missing** |
| `/dashboard/logistics` | `transport-detail.tsx` — `DocumentsTab` lists `shipment.documents` | In-memory mock: `shipment-data.ts` `AttachedDocument[]` | **Placeholder** (display only; no upload) |
| `/dashboard/logistics/brokerage` | `brokerage-detail.tsx` — attachment names in mock `brokerage-data.ts` | Static strings (e.g. `"Carnet-2026-0142.pdf"`) | **Placeholder** |
| `/dashboard/communications/email` | `email-data.ts` — `attachments` on messages | Static mock | **Placeholder** |
| Production nav (`sidebar-items.ts`) | Schedule, Locations, Crew, Operations → `/dashboard/coming-soon` | N/A | **Not started** (routes marked `comingSoon: true`) |

**Conclusion:** Users **cannot** upload files today. The only “Upload” affordance is a non-functional productivity button.

---

## Section 2 — Supabase storage

### Search evidence

| Pattern | Matches |
|---------|---------|
| `supabase`, `@supabase` | **0** (entire repo) |
| `supabase.storage` | **0** |
| `storage.from(` | **0** |
| `createSignedUrl` | **0** |
| `upload(` (storage) | **0** |
| `download(` (storage) | **0** |

`package.json` dependencies: Next.js, React, Zod, Zustand, TanStack Table, D3/topojson, etc. **No** `@supabase/supabase-js` or database client.

`src/types/operations/shared.ts` defines optional `storageRef?: string` on types — **comment/example only**, no runtime writer.

### Report

| Item | Status |
|------|--------|
| **Buckets found** | None |
| **Upload implemented** | No |
| **Download implemented** | No (storage layer) |
| **Unused** | N/A — integration absent |

Comments in `src/lib/operations/propagation.ts` reference a **future** Supabase realtime path; no implementation.

---

## Section 3 — Source document pipeline

Audited symbols and whether **runtime** (app/lib/server, excluding type-only definitions) references them.

| Artifact | Definition location | Referenced by `src/app` or `src/lib`? | Evidence |
|----------|---------------------|----------------------------------------|----------|
| `ImmutableSourceDocument` | `src/types/core/source/immutable-source-document.ts` | **No** | `grep` `@/types/core` under `src/`: **0** files |
| `SOURCE_INGESTION_REGISTRY` | `src/types/core/source/ingestion-registry.ts` | **No** | No matches under `src/app` |
| `Document` | `src/types/core/document/document.ts` | **No** | Types only |
| `DocumentRevision` | `src/types/core/document/document-revision.ts` | **No** | Types only |
| Typed source documents | `src/types/core/source/source-documents.ts` | **No** | Types only |

### Pipeline checklist

| Question | Answer | Evidence |
|----------|--------|----------|
| **Registry exists?** | Yes (TypeScript) | `SOURCE_INGESTION_REGISTRY` in `ingestion-registry.ts` (12 kinds) |
| **Runtime exists?** | No | Zero app imports of `@/types/core` |
| **Queue exists?** | No (document ingestion) | No job queue, worker, or API route (`src/app/api/`: **0 files**) |
| **Review step exists?** | No | No route/component for source/extraction review |
| **Extraction trigger exists?** | No | No `fetch` to extraction services; no AI SDK in dependencies |

**Note:** Logistics `TransportQueue` (`transport-queue.tsx`) is a **transport order manifest**, not a document ingestion queue.

---

## Section 4 — Agentic extraction

### Search evidence (`src/`, `package.json`)

| Term | Runtime finding |
|------|-----------------|
| `openai`, `anthropic`, `claude`, `gemini` | **0** dependencies; **0** app/lib usage |
| `ocr` | **0** |
| `llm` | Mock CRM chart label `"LLM Training"` in `crm.config.ts` only |
| `extract`, `ingest` | **0** runtime services; comments in `src/types/core/source/*` say “future extraction” |
| `queue` | UI labels only (`TransportQueue`, `Rush Queue`, legacy `Manager Action Queue`) — **not** job queues |

### Classification

| Area | Status |
|------|--------|
| Agentic extraction | **Designed only** (types + registry metadata) |
| OCR / LLM pipelines | **Not started** at runtime |
| Background workers | **Not started** |

### Actual runtime files (operational intelligence, not extraction)

| File | Role |
|------|------|
| `src/lib/operations/propagation.ts` | Derives transport propagation from mock logistics objects |
| `src/app/(main)/dashboard/logistics/_components/logistics.tsx` | Wires queue + detail + `computeGlobalPropagation()` |
| `src/app/(main)/dashboard/logistics/_components/shipment-data.ts` | Static shipment/attachment dataset |
| `src/app/(main)/dashboard/logistics/_components/operational-data.ts` | Static conditions, assignments, callsheet revision |

---

## Section 5 — Document types (`SOURCE_INGESTION_REGISTRY`)

Registry: `src/types/core/source/ingestion-registry.ts`.  
**Runtime connected?** = any import or usage from `src/app`, `src/lib`, `src/server` → **No for all rows**.

| Source kind | Supported source systems (registry) | Extraction targets (registry) | Runtime connected? |
|-------------|-------------------------------------|-------------------------------|------------------|
| `script-revision` | scriptation, pdf, manual-upload | script, script-revision, scene, element, breakdown-element, revision-change | **No** |
| `shoot-schedule` | movie-magic-scheduling, ep-scheduling, scenechronize, studiobinder, excel, pdf, manual-upload | shoot-day, company-move, cast-member, crew-member | **No** |
| `one-liner` | movie-magic-scheduling, ep-scheduling, excel, pdf, manual-upload | shoot-day, scene, location, company-move | **No** |
| `callsheet-revision` | studiobinder, scenechronize, pdf, excel, manual-upload | shoot-day, document, crew-member, cast-member, location | **No** |
| `breakdown-package` | scriptation, movie-magic-scheduling, excel, pdf, manual-upload | scene, element, breakdown-element, asset | **No** |
| `location-package` | pdf, excel, manual-upload | location, document, media | **No** |
| `crew-list` | excel, pdf, scenechronize, manual-upload | crew-member, department | **No** |
| `cast-list` | excel, pdf, scenechronize, manual-upload | cast-member, background-performer | **No** |
| `dood` | movie-magic-scheduling, ep-scheduling, excel, pdf, manual-upload | shoot-day, cast-member, background-performer | **No** |
| `vendor-document` | pdf, excel, manual-upload | vendor, document | **No** |
| `permit` | pdf, manual-upload | permit, location | **No** |
| `reference-media` | manual-upload, pdf | media, scene, location, asset | **No** |

---

## Section 6 — Downloads

### Search evidence

| Pattern | Finding |
|---------|---------|
| `Blob`, `createObjectURL` | **0** |
| `xlsx` / Excel export libs | **0** in `package.json` and app |
| `.download(` (DOM) | **0** |
| `pdf` | Mock attachment **names** and type unions only |

### Download / export UI (no handlers)

| Location | Control | Behavior |
|----------|---------|----------|
| `users/_components/users.tsx` | `<Download /> Export` button | **Placeholder** — no `onClick` |
| `default/_components/subscriber-overview.tsx` | Export button | **Placeholder** |
| `logistics/brokerage/_components/brokerage-detail.tsx` | `ActionButton` + `FileDown` “Generate PDF” | **Placeholder** — `ActionButton` sets `disabled` on all actions |
| `transport-detail.tsx` `DocumentsTab` | Lists doc name/ref | **Display only** — no download link |

**Actual working downloads:** **None** identified in runtime code.

---

## Section 7 — Generated outputs

### Types

| Path | Content |
|------|---------|
| `src/types/core/generated/generated-output.ts` | `GeneratedOutput`, typed variants (callsheet, dood, crew-list, etc.), `isGeneratedOutputKind()` |
| `src/types/core/generated/generated-output-kind.ts` | Kind union |

### Runtime

| Question | Answer | Evidence |
|----------|--------|----------|
| Types only? | **Yes** | `grep` `generated-output` / `GeneratedOutput` in `src/` excluding `types/`: **0** |
| Runtime creation exists? | **No** | No services or API creating output records |
| Download exists? | **No** | No artifact `storageRef` resolution or file generation |

Logistics UI references “callsheet revision” and “PDF package” in **mock** operational data and propagation comments — not `GeneratedOutput` types.

---

## Section 8 — Search

| Capability | Evidence | Status |
|------------|----------|--------|
| Global production search | Not found | **Not started** |
| Vector / embedding / pgvector | **0** matches (meaningful) | **Not started** |
| Full-text search (FTS) | **0** | **Not started** |
| Sidebar command palette | `search-dialog.tsx` — indexes `sidebarItems` URLs via `cmdk` | **Partial** — **navigation search only** |

`users/_components/users.tsx` has a local table filter input — not cross-object search.

---

## Section 9 — Review queues

No runtime workflow connects uploaded sources → extraction → human approval.

### What exists (UI labels / mock data)

| Name | Route / file | Purpose | Document/extraction review? |
|------|--------------|---------|------------------------------|
| `TransportQueue` | `/dashboard/logistics` — `transport-queue.tsx` | Sort/display transport orders | **No** — logistics dispatch |
| `Rush Queue` | `operational-intelligence.tsx` | Filter `urgency === "priority"` shipments | **No** |
| Email `approvals` folder | `/dashboard/communications/email` — `email-data.ts` | Two mock messages in folder | **No** — static email demo |
| Brokerage drafts | `brokerage-intelligence.tsx` | `status === "draft"` on mock docs | **No** — brokerage UI state |
| `Manager Action Queue` | Legacy `/dashboard/(legacy)/analytics-v1` | Template analytics card | **No** |
| CRM “Needs Review” | `opportunities-table/data.json` | Sales health strings | **No** |

### Production routes for documents / scripts / receipts

`sidebar-items.ts` Production and Finance items use `comingSoon: true` → `/dashboard/coming-soon`. **No** dedicated ingestion or review routes.

---

## Section 10 — Readiness scores (0–100%)

Scores reflect **implemented runtime behavior**, not design quality of types.

| Dimension | Score | Evidence |
|-----------|-------|----------|
| **Constitution** (types/registries in `src/types/core`) | **88%** | ~198 `.ts` files under `src/types/core`; `SOURCE_INGESTION_REGISTRY` complete for 12 kinds; relationship schema merge exists. **Not wired to app** (0 imports). |
| **Runtime** (end-to-end product features) | **12%** | Next.js app renders; logistics propagation + map fetch world atlas JSON; all domain data is local mocks. No API, auth, or persistence. |
| **Uploads** | **0%** | No file inputs or upload handlers. |
| **Storage** | **0%** | No Supabase or object storage client. |
| **Extraction** | **0%** | Registry/comments only. |
| **Generated outputs** | **0%** | Types only. |
| **Search** | **8%** | Sidebar route search only. |

`npx tsc --noEmit` at project root: fails on duplicate `.next/types/*` artifacts — **not** evidence of missing core types; app does not typecheck against `@/types/core` today.

---

## What exists today

- **Next.js 16 App Router** dashboard with logistics, communications, mail, and legacy template areas (`src/app/(main)/dashboard/`).
- **Client-side propagation engine** — `src/lib/operations/propagation.ts` consumed by logistics components; computes `DerivedOrderState` from mock `shipment-data.ts` / `operational-data.ts`.
- **Static mock datasets** for transport, brokerage, email, chat, notifications, CRM, ecommerce, etc.
- **UI shell**: sidebar, theme/preferences (cookies via `src/server/server-actions.ts`), command palette route search.
- **Constitutional TypeScript layer** under `src/types/core/` (including ingestion registry, documents, generated outputs) — compiles as types but **unused** by app code.
- **Single network fetch** in logistics map: `shipment-route-map.tsx` loads `WORLD_ATLAS_URL` (topojson).

---

## What is partially built

- **Logistics command center** — interactive selection, propagation banners, map strip; data is **not** persisted or API-backed.
- **Brokerage / email / documents UI** — shows attachment **metadata** from mocks; actions disabled or non-functional.
- **Search** — route jumper only (`search-dialog.tsx`).
- **Server actions** — cookie preference helpers only (`server-actions.ts`).
- **Input component** — capable of `type="file"` styling; **no** upload flow wired.

---

## What is designed only

- Source ingestion pipeline (`ImmutableSourceDocument` → `DocumentRevision` → `Document`).
- `SOURCE_INGESTION_REGISTRY` extraction targets and source systems.
- Generated output contracts and artifact `storageRef` field.
- Agentic extraction (comments: “future extraction”, “future table: source_extraction_history”).
- Supabase realtime propagation (comments in `propagation.ts`).
- RBAC / multi-tenant (README: “planned”).
- Production sidebar modules (Schedule, Crew, Finance, etc.) — `comingSoon: true`.

---

## What is missing

- File upload UI and handlers.
- `src/app/api/**` routes (directory absent).
- Database / Supabase client and storage buckets.
- Persistence for core objects.
- Document ingestion queue, review UI, extraction workers.
- LLM/OCR integrations.
- Working export/download (PDF, xlsx, blobs).
- Production object search (FTS/vector).
- Auth middleware (`middleware.ts` not present).
- App imports of `@/types/core`.

---

## Fastest path to Phase 4 upload pipeline (evidence-based)

Phase 4 target flow (from `docs/SYNCOFFSET_IMPLEMENTATION_SPRINT.md`, for alignment only):  
`Upload → SourceDocument → DocumentRevision → Document → Review Queue`.

**Gaps ordered by what the repo lacks today (no implementation found):**

1. **Storage layer** — No Supabase (or other) client; no buckets; `storageRef` never written at runtime.
2. **Upload transport** — No `type="file"`, `FormData`, or API/server handler accepting bytes.
3. **Type wiring** — `src/app` has **zero** imports of `@/types/core`; upload cannot persist constitutional shapes without new bridging code.
4. **Persistence API** — No `src/app/api` routes; `server-actions.ts` only sets cookies.
5. **Review queue UI** — No route after upload; Production nav is `coming-soon`.

**What is already adjacent (could be extended, not “done”):**

- Mock document lists in logistics/brokerage/email (UI patterns for listing attachments).
- `Input` + `Button` + Zod + React Hook Form in stack (`package.json`).
- Ingestion registry already lists `manual-upload` for all 12 source kinds (`ingestion-registry.ts`).

**Distance:** Phase 4 requires **net-new infrastructure** (storage + upload handler + DB + app wiring). The logistics UI prototype does **not** shorten upload/storage work; it only demonstrates list/detail layouts. Constitutional types are **ready as contracts** but **0% connected** to runtime — connecting them is a prerequisite for a constitutionally correct Phase 4, not optional polish.

---

## Appendix — Key file references

| Area | Path |
|------|------|
| Ingestion registry | `src/types/core/source/ingestion-registry.ts` |
| Immutable source base | `src/types/core/source/immutable-source-document.ts` |
| Document authority types | `src/types/core/document/document.ts`, `document-revision.ts` |
| Generated output types | `src/types/core/generated/generated-output.ts` |
| Propagation runtime | `src/lib/operations/propagation.ts` |
| Mock shipments | `src/app/(main)/dashboard/logistics/_components/shipment-data.ts` |
| Placeholder Upload button | `src/app/(main)/dashboard/productivity/_components/quick-actions.tsx` |
| Disabled PDF action | `src/app/(main)/dashboard/logistics/brokerage/_components/brokerage-detail.tsx` |
| Route search | `src/app/(main)/dashboard/_components/sidebar/search-dialog.tsx` |
| Production nav (not built) | `src/navigation/sidebar/sidebar-items.ts` |
| Server actions (cookies only) | `src/server/server-actions.ts` |
| Dependencies | `package.json` |

---

*End of runtime audit. Findings are limited to repository state at audit time; no speculative features included.*
