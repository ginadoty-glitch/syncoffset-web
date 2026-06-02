# SyncOffset Pre-Production Gap Analysis

**Date:** 2026-05-31  
**Scope:** Pre-production planning objects that exist **before** constitutional **Shooting Schedule** (`shooting-schedule`)  
**Method:** Review of all `docs/SYNCOFFSET_*_AUTHORITY*.md`, platform/data constitutions, `src/types/core/` kinds and registries  
**Action:** Findings only — **no new authorities**, **no code changes**

---

## Executive summary

SyncOffset’s **constitutional spine** for scheduling is now explicit:

```
Script Revision → Scene → Set → Budget Requirement
  → Shooting Schedule → Production Calendar → Shoot Day → Callsheet
```

**Pre-production planning** (prep memos, meetings, scouts, checklists, department notes) is **partially modeled** through **Creative**, **Location**, **Document**, **Production Calendar** (day types), and **Work Order** authorities — but **none** of the eleven audited objects has a **dedicated first-class core kind**.

| Classification | Count (primary) | Meaning |
|----------------|-----------------|---------|
| **1 — Already covered** | 5 | Mappable today to existing authorities (often as **activity**, **day type**, or **package** — not as named production objects) |
| **2 — Document Authority** | 4 | Best home for **files** and informal written records (`memo`, `reference`, ingestion) |
| **3 — Work Order Authority** | 1 | Only when prep becomes **formal inter-department work** on a Set |
| **4 — Future Planning / Prep Authority** | 6 | Need structured objects (meetings, action items, checklists, departmental prep lifecycle) |

**Highest gap:** collaborative planning (**Meeting**, **Action Item**, **Prep Checklist**, **Production Meeting**) — not documents alone and not work orders until execution is requested.

**Lowest gap:** location scouting artifacts (**Scout Package**, **Location Scout**, **Tech Scout**) — largely covered by **Location** + **Creative** + **Production Calendar** `tech-scout` / `prep` day types.

---

## Canonical timeline (reference)

All objects below are positioned relative to this chain. “**Before Shooting Schedule**” means: requirements exist from script/scene/set/budget, but **approved scene ordering** (`shooting-schedule`) is not yet the governing schedule artifact.

```
Script Revision
    ↓
Scene ───────────────────────────── breakdown-element, revision-change
    ↓
Set (container)
    ↓
Budget Requirement
    ↓
┌───────────────────────────────────────────────────────────────────────┐
│  PRE-PRODUCTION PLANNING GAP ZONE (this analysis)                      │
│  Memos · meetings · scouts · checklists · department prep notes        │
└───────────────────────────────────────────────────────────────────────┘
    ↓
Shooting Schedule          ← what gets shot (Shooting Schedule Authority)
    ↓
Production Calendar        ← when (prep / tech-scout / shoot day types)
    ↓
Calendar Day
    ↓
Shoot Day                  ← execution
    ↓
Callsheet                  ← daily operations package
```

**Rule of thumb:** If it is only a **PDF/email/spreadsheet**, prefer **Document Authority**. If it is **department creative intent**, prefer **Creative Authority**. If it is **“we need a location” or scout deliverables**, prefer **Location Authority**. If it is **“build/install/strike this on the set”**, prefer **Work Order Authority** (after budget/set exist). If it is **a scheduled planning activity on a date**, use **Production Calendar** `calendar-day` + `dayType` — not a separate meeting kind today.

---

## Authority coverage map (pre-shoot schedule)

| Authority | Pre-production role | Core kinds used |
|-----------|---------------------|-----------------|
| **Script** | Script revision, scenes, breakdown | `script-revision`, `scene`, `breakdown-element`, `revision-change` |
| **Scene** | Hub; scene notes field | `scene`, `set`, `budget-requirement` |
| **Creative** | Department intent, director notes, scout stills in packages | `director-note`, `department-package`, `creative-reference`, `tech-pack`, `approval-record` |
| **Location** | Scout needs, approved scout docs | `location-requirement`, `location`, `location-package`, `location-assignment` |
| **Document** | Any uploaded memo, minutes, checklist file | `document`, `document-revision`, `document-link`, `source-document` |
| **Production Calendar** | **When** prep/scout happens (not meeting objects) | `production-calendar`, `calendar-day` (`prep`, `tech-scout`, …) |
| **Work Order** | Formal prep **work** on a set (not meetings) | `work-order`, `work-order-task` |
| **Communication** | Distribute memos/minutes (not own meetings) | `communication`, `distribution-list` |
| **Shooting Schedule** | **Downstream** — consumes scene ordering | `shooting-schedule` (+ revision/package) |

**Not constitutional (operational layer only):** `src/types/operations/shared.ts` defines `DocumentType` including `prep-memo` on **OwnedDocument** — parent-bound operational docs, **not** `CoreObjectKind`.

---

## Object-by-object classification

### Summary table

| Object | Primary class | Constitutional home today | Position vs spine |
|--------|---------------|---------------------------|-------------------|
| Prep Memo | **2** Document | `document` + `categoryId: memo` · ops `prep-memo` | After Set/Budget · before Shooting Schedule |
| Department Prep Memo | **2** + **1** Creative | `document` (memo) + `department-package` / `director-note` | Scene/Set · department lens · before schedule |
| Meeting | **4** Future Prep | No core kind | After Budget · before Calendar lock |
| Meeting Minutes | **2** Document | `document` (`memo` / `reference`) | Same as meeting · trace via `document-link` |
| Action Item | **4** Future Prep | No core kind; UI mock only | Parallel prep · not WO until formalized |
| Tech Scout | **1** Calendar + Location | `calendar-day` `dayType: tech-scout` · `location-requirement` | Calendar planning · before/at schedule consumption |
| Scout Package | **1** Location + Creative | `location-package` · creative `department-package` / `creative-reference` | Scene → location requirement · before schedule |
| Location Scout | **1** Location | `location-requirement` + `location` status `scouting` | Scene/breakdown · before `location-package` approval |
| Production Meeting | **4** Future Prep | No core kind | Production office · before schedule approval |
| Department Notes | **1** Creative + Scene | `director-note`, `department-package.notes`, `scene.notes` | Script Revision → Scene · before schedule |
| Prep Checklist | **4** Future Prep | No core kind; partial **3** WO tasks | Set prep · before principal photography |

---

### Prep Memo

| Field | Detail |
|-------|--------|
| **Classification** | **2 — Document Authority** (primary) |
| **Coverage** | `DOCUMENT_CATEGORY_REGISTRY` includes **`memo`**. Uploaded file → `source-document` → `document` + `document-revision` (Document Authority Rules 1–3). Optional `sceneId` / `setId` (Rule 4). |
| **Operational echo** | `DocumentType: "prep-memo"` in `src/types/operations/shared.ts` — logistics/operations **OwnedDocument**, not a core object. |
| **Gap** | No **`prep-memo`** core kind; no structured fields (owner, due date, department, checklist state). |
| **Spine position** | **Script Revision → Scene → Set → Budget Requirement** → *(prep memo as document)* → **Shooting Schedule** |

**Secondary:** If memo triggers build/prep labor on a set → **3 — Work Order** (downstream).

---

### Department Prep Memo

| Field | Detail |
|-------|--------|
| **Classification** | **2 — Document Authority** (file body) + **1 — Creative Authority** (department intent) |
| **Coverage** | Department-scoped memo PDF → **`document`** (`memo`, `document-link` → `department` / scene / set). Department narrative → **`department-package`** (`packageKind` art, construction, props, …) with `sourceDocumentIds`, `sceneIds`, `notes`. **PD notes** explicitly listed in Creative Authority examples. |
| **Gap** | No discriminated **`department-prep-memo`** kind; memo vs package vs director note is **documentation convention**, not enforced graph edge. |
| **Spine position** | **Scene → Set** (department lens) → *(prep memo)* → **Shooting Schedule** |

**Not Work Order** until memo asks another department to perform set work (then WO on required `setId`).

---

### Meeting

| Field | Detail |
|-------|--------|
| **Classification** | **4 — Future Planning / Prep Authority** |
| **Coverage today** | **None** as core object. **Communication Authority** can record that a message was sent (invite, agenda email) — Rule 6: communications do **not** create tasks or own meetings. **Document Authority** can store agenda attachments only. |
| **Platform docs** | Workspace taxonomy mentions calendars and department coordination; no `meeting` in `CoreObjectKind`. |
| **Gap** | No `meeting` kind, no attendees, no agenda/minutes linkage, no calendar integration without overloading `calendar-day`. |
| **Spine position** | **Budget Requirement** → *(meeting — unmodeled)* → **Shooting Schedule** / **Production Calendar** |

**Do not classify as Document alone** — a meeting is an **event**, not a file.

---

### Meeting Minutes

| Field | Detail |
|-------|--------|
| **Classification** | **2 — Document Authority** (primary) |
| **Coverage** | Minutes PDF/DOCX → **`document`** (`memo` or `reference`) + **`document-revision`** + **`document-link`** → scene, set, show, production-calendar (reference only). |
| **Gap** | No structured extraction to **Action Item** objects; no `meeting-minutes` category (only generic `memo`). |
| **Spine position** | Same band as **Meeting** — artifact sits **before Shooting Schedule**; links backward to **Scene/Set/Budget** via `document-link` |

**Secondary:** **4 — Future Prep** if minutes must drive tracked follow-ups (action items).

---

### Action Item

| Field | Detail |
|-------|--------|
| **Classification** | **4 — Future Planning / Prep Authority** (primary) |
| **Coverage today** | **No** `action-item` in `kinds.ts`. Closest: **`work-order-task`** when item becomes formal inter-department work (**3**). Communication UI mocks filter `actionRequired` on notifications — **not constitutional**. CRM template `actionItems` — **unrelated** dashboard demo data. |
| **Gap** | No assignee, due date, status, or meeting parent at core layer. Work Order Rule 6 (Communication): communications do not create tasks. |
| **Spine position** | **Budget / Set prep** → *(action items)* → **Shooting Schedule** approval |

**Promote to 3 — Work Order** only when: assigned departments, `setId`/`setNumber` required, execution scope (Work Order Rules 4–5).

---

### Tech Scout

| Field | Detail |
|-------|--------|
| **Classification** | **1 — Already covered** (activity + calendar typing) |
| **Coverage** | **`calendar-day`** with `dayType: "tech-scout"` (`CALENDAR_DAY_TYPE_REGISTRY` — “Technical scout — planning only”). **`location-requirement`** / **`location`** (`scouting` status) for site evaluation. Creative **`creative-reference`** for scout stills. |
| **Gap** | No standalone **`tech-scout`** core object; scout **event** is a **calendar day type**, not a first-class record with crew/location assignment bundle. |
| **Spine position** | **Scene → Location requirement** → *(tech scout day on calendar)* → may occur **before or after** draft **Shooting Schedule**; consumes into schedule/calendar planning |

**Not Document Authority** for the activity itself — only for scout PDFs (see Scout Package).

---

### Scout Package

| Field | Detail |
|-------|--------|
| **Classification** | **1 — Already covered** |
| **Coverage** | **Location Authority:** `location-package` — “scout reports, reference stills, location agreements” with `sourceDocumentIds`. **Creative Authority:** “location/scout packages” → **`department-package`** (`location-department`) or **`creative-reference`**. **Naming:** distinct from source ingestion `location-package` (SourceDocumentKind) — documented in Location Authority. |
| **Gap** | Colloquial “scout package” spans **two authorities**; no single `scout-package` kind (audit noted package-string collisions elsewhere). |
| **Spine position** | **Scene → location-requirement → location → location-package** → feeds **Shooting Schedule** / **Production Calendar** context |

**Secondary 2 — Document:** raw uploaded scout PDF → `document` + link to `location-package`.

---

### Location Scout

| Field | Detail |
|-------|--------|
| **Classification** | **1 — Already covered** (process modeled, not a noun kind) |
| **Coverage** | **`location-requirement`** (need from scene/breakdown) · **`location`** with `LocationStatus: "scouting"` · **`location-assignment`** only after shoot day exists (downstream). Creative/Location packages hold deliverables. |
| **Gap** | No `location-scout` core kind; “location scout” is a **workflow label**, not constitutional object. |
| **Spine position** | **Script Revision → Scene → breakdown → location-requirement** → *(scouting)* → **location** approval → **Shooting Schedule** |

---

### Production Meeting

| Field | Detail |
|-------|--------|
| **Classification** | **4 — Future Planning / Prep Authority** |
| **Coverage today** | Same as **Meeting** — no core kind. Production-specific semantics (department heads, schedule review, budget lock) are **not** distinguished in types. |
| **Partial bridges** | **`production-calendar`** status workflow (`planning`, `review`, `approved`) covers **calendar** approval, not **meeting** records. **`shooting-schedule`** status similarly. |
| **Gap** | Cannot attach attendees, decisions, or action items to a `production-meeting` object. |
| **Spine position** | **Budget Requirement** → *(production meeting)* → **Shooting Schedule** + **Production Calendar** approval |

**Secondary 2 — Document:** minutes/agenda files only.

---

### Department Notes

| Field | Detail |
|-------|--------|
| **Classification** | **1 — Already covered** (Creative + Scene) |
| **Coverage** | **`director-note`** — creative instruction, `sceneIds`, `departmentIds`, `revisionId`. **`department-package`** — `notes?`, departmental intent. **`scene.notes`** — production notes on scene record (Scene Authority required field, may be empty). Crew registry comment: creative `department-package` ≠ crew fulfillment packages. |
| **Gap** | “Department notes” is overloaded: scene field vs director note vs informal doc. No `department-notes` kind. |
| **Spine position** | **Script Revision → Scene** (+ Set) → *(department notes)* → **Shooting Schedule** |

**Secondary 2 — Document:** when notes are only a Word/PDF memo.

---

### Prep Checklist

| Field | Detail |
|-------|--------|
| **Classification** | **4 — Future Planning / Prep Authority** (primary) |
| **Coverage today** | **Partial 3 — Work Order:** checklist **items** map to **`work-order-task`** when each line is formal work on a **Set**. **Partial 1:** Asset `prep-package` is **asset logistics** prep, not production prep checklist. **Partial 2:** spreadsheet/PDF checklist → **`document`**. |
| **Gap** | No checklist object with completion state, assignee per line, or template per department. |
| **Spine position** | **Set** (+ Budget) → *(prep checklist)* → **Production Calendar** `prep` days → **Shoot Day** |

---

## Objects without a constitutional home (named kinds)

These colloquial production terms have **no** matching `CoreObjectKind`:

| Term | Nearest kinds | Why insufficient |
|------|---------------|------------------|
| Meeting | — | Event, not document or WO |
| Production Meeting | — | Same |
| Action Item | `work-order-task` | Only after formal WO; no meeting parent |
| Prep Checklist | `work-order-task[]`, `document` | No checklist container |
| Prep Memo (structured) | `document` (`memo`) | No prep-specific metadata at core |
| Department Prep Memo (structured) | `document`, `department-package` | Split across authorities |

**Orphan scheduling kinds** (audit): `prep-day` core kind exists in registry but Production Calendar doc directs new work to **`calendar-day`** + `dayType: prep` — prefer calendar authority for prep **dates**.

---

## Cross-authority collisions (pre-production)

| Term | Collision | Resolution (documented) |
|------|-------------|-------------------------|
| Scout package | `location-package` (core) vs source `location-package` vs creative package | Location + Creative Authority naming notes |
| Department package | Creative `department-package` vs Shoot Day package kind id | Disambiguate by type namespace |
| Prep package | Asset `prep-package` vs prep checklist colloquial | Asset = asset logistics only |
| Memo | Document `memo` category vs ops `prep-memo` | Core vs operations layer |
| Notes | `scene.notes` vs `director-note` vs `department-package.notes` | Convention + links, not one kind |

---

## Recommended mapping (no new authorities)

Until a **Planning / Prep Authority** is chartered, use this **wiring guide**:

| Production artifact | Record as | Link via |
|--------------------|-----------|----------|
| Prep memo (file) | `document` + `memo` | `document-link` → scene, set |
| Department prep memo (file) | `document` + `memo` | + `department-package` sourceDocumentIds |
| Meeting agenda / minutes (file) | `document` | `document-link` → show, calendar, scene |
| Meeting (event) | *Gap* — track outside core or `calendar-day` + notes until Prep Authority | `dayType: custom` / `prep` |
| Action item (informal) | *Gap* — or `work-order` + `work-order-task` when formalized | setId required |
| Tech scout (activity) | `calendar-day` (`tech-scout`) | location-requirement, location |
| Scout deliverables | `location-package` + creative refs | source-document provenance |
| Department notes (intent) | `director-note` / `department-package` | sceneIds, script revision |
| Prep checklist (file) | `document` | set/scene links |
| Prep checklist (execution) | `work-order` + tasks | Work Order Rules 4–5 |

---

## Future Planning / Prep Authority (not created — scope sketch)

If chartered later, it should sit **between Budget Requirement and Shooting Schedule** and **not** duplicate:

- **Document** (files)
- **Creative** (intent packages)
- **Location** (sites and scout packages)
- **Work Order** (execution)
- **Production Calendar** (dates)

Candidate first-class objects (documentation only): `prep-plan`, `production-meeting`, `meeting-minutes` (structured), `action-item`, `prep-checklist`, `department-prep-record` — with explicit edges to **Scene**, **Set**, **Budget Requirement**, and optional **`calendar-day`** before schedule lock.

---

## Authority doc index (reviewed)

| Doc | Pre-production relevance |
|-----|--------------------------|
| `SYNCOFFSET_SCRIPT_AUTHORITY.md` | Upstream requirements |
| `SYNCOFFSET_SCENE_AUTHORITY.md` | Scene notes, set, budget hub |
| `SYNCOFFSET_CREATIVE_AUTHORITY.md` | Department packages, director notes, scout stills |
| `SYNCOFFSET_LOCATION_AUTHORITY.md` | Scout packages, requirements, scouting status |
| `SYNCOFFSET_DOCUMENT_AUTHORITY.md` | Memos, minutes, generic files |
| `SYNCOFFSET_WORK_ORDER_AUTHORITY.md` | Prep as executable work on sets |
| `SYNCOFFSET_PRODUCTION_CALENDAR_AUTHORITY.md` | prep / tech-scout day types |
| `SYNCOFFSET_SHOOTING_SCHEDULE_AUTHORITY.md` | Downstream “what” schedule |
| `SYNCOFFSET_CALLSHEET_AUTHORITY.md` | Post-schedule execution (out of scope) |
| `SYNCOFFSET_COMMUNICATION_AUTHORITY.md` | Distribution only |
| `SYNCOFFSET_PLATFORM_WORKSPACES.md` | Prep Schedules as calendar **source** (not core kinds) |
| `SYNCOFFSET_CONSTITUTION_AUDIT_V1.md` | `prep-day` orphan, hierarchy drift |
| `SYNCOFFSET_PRODUCTION_HIERARCHY.md` | Stops at Shoot Day — no pre-schedule planning layer |

---

## Conclusion

Pre-production planning in SyncOffset is **real in production workflows** but **thin in constitutional types**. Most **artifacts** map to **Document** or **Creative/Location packages**; most **activities** map to **calendar day types** or **location scouting**; most **collaboration** (**meetings**, **action items**, **checklists**) has **no first-class home** and is classified **4 — Future Planning / Prep Authority**.

Shooting Schedule and Production Calendar correctly sit **downstream** of this gap zone — consolidating prep planning into documents and work orders works for TestFlight, but **meetings and tracked action items** will remain a graph blind spot until a Prep/Planning authority is explicitly chartered.

---

*Gap analysis v1.0 — findings only. No source files were modified.*
