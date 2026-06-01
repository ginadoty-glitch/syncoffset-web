# SyncOffset Layout Constitution

Version 1.0 — Architecture only (no visual rebrand)

**Governs:** Dashboard operational surfaces inside `syncoffset-web`  
**Aligns with:** SyncOffset Platform Constitution; [`SYNCOFFSET_DATA_CONSTITUTION.md`](./SYNCOFFSET_DATA_CONSTITUTION.md) (Articles I, VI, VII, IX, X); layout Articles VIII–X (Platform Before Features, Reuse Before Rebuild, Preservation Before Cleanup)

**Does not change:** Colors, fonts, branding tokens, or existing logistics business logic.

---

## 1. Purpose

SyncOffset is a **production operating platform**, not a collection of isolated dashboards. This document defines the **reusable page architecture** that Logistics, Brokerage, Communications, and future modules (Calendar, Script Breakdown, DOOD, Callsheets, Finance, etc.) must inherit so new work does not invent layouts.

**Goals:**

- Reduce visual clutter through consistent panel hierarchy
- One operational shell pattern, many department lenses
- Preserve existing modules; migrate via composition, not deletion

---

## 2. Universal page framework

Every operational module uses the **SyncOffset Operational Shell** unless explicitly classified otherwise (see §8).

### 2.1 Layer model (outside → inside)

| Layer | Component name | Purpose |
|-------|------------------|---------|
| 0 | **App chrome** | Global sidebar + dashboard header (`layout.tsx`). Not module-owned. |
| 1 | **PageHeader** | Optional module title, production day context, primary actions. *Most operational shells omit this today — content starts in rails.* |
| 2 | **StatusStrip** | Optional horizontal alerts: propagation impacts, legal/blocker banners, revision notices. Highest priority; max 3 visible before collapse. |
| 3 | **MetricBar** | Optional KPI strip above workspace (counts, pressure, open items). Use sparingly — prefer intelligence rail for operational metrics. |
| 4 | **PrimaryWorkspace** | Full-bleed grid shell (`data-content-padding="false"`). Contains Manifest + Detail + Intelligence. |
| 4a | **ManifestPanel** (left) | Selectable queue/list: orders, docs, messages, categories. |
| 4b | **DetailPanel** (center) | Primary record view: tabs, map, fields, thread, reader. |
| 4c | **IntelligencePanel** (right) | Cross-record context: conditions, digest, linked ops, severity rollup. |
| 5 | **ActivityRail** | Optional bottom or in-detail timeline (production log, history tab). Prefer **tabs inside DetailPanel** today. |

### 2.2 PrimaryWorkspace contract

```tsx
// Canonical shell — extract to shared layout primitive in Phase 1
<div
  data-content-padding="false"
  className="grid h-[calc(100dvh-var(--dashboard-header-height))] overflow-hidden
             lg:grid-cols-[var(--so-manifest-width)_minmax(0,1fr)_var(--so-intel-width)] lg:divide-x"
>
  <ManifestPanel />
  <DetailPanel className="hidden lg:block" />
  <IntelligencePanel className="hidden lg:block" />
</div>
```

**Default widths (desktop lg+):**

| Token | Value | Used by |
|-------|-------|---------|
| `--so-manifest-width` | `288px` | Logistics, Chat, Email |
| `--so-manifest-width` | `300px` | Brokerage (documents wider rows) |
| `--so-intel-width` | `240px` | Logistics, Comms, Brokerage |
| Notifications manifest | `240px` | Narrower category rail |

**Mobile:** Single column; manifest only or stacked drawer pattern (Phase 2 — not implemented in v1 modules).

### 2.3 Panel interior contract (ManifestPanel)

Every manifest/list rail shares:

1. `Card` full height, `rounded-none ring-0`
2. `CardHeader` — `px-3 py-2`, uppercase micro-label (`text-[10px] tracking-[0.15em]`)
3. Optional `CardAction` — single primary icon action
4. Filter row — `TabsList` **or** folder list (h-7 compact)
5. Search — `InputGroup` h-6, `text-[10px]`
6. `ScrollArea` — selectable rows, 2–3 line density

### 2.4 Panel interior contract (DetailPanel)

1. Optional **StatusStrip** (propagation / signal banners) at top
2. Record header — ID, badges, title, meta (brokerage pattern is richest)
3. Optional action bar — outline buttons, disabled in preview
4. `ScrollArea` + `Tabs` for structured subviews (route, driver, documents, history)
5. Empty state — centered uppercase microcopy

**Logistics-specific:** `pt-[104px]` alignment hack for map/queue visual sync — **do not generalize**; isolate as logistics layout variant in Phase 2.

### 2.5 Panel interior contract (IntelligencePanel)

1. `ScrollArea` full height
2. Repeated **SectionLabel** blocks (`text-[8px] uppercase tracking-[0.15em]`)
3. Compact rows — border-left semantic emphasis for tier/signal
4. Counts in header right — mono `text-[8px]`

**Rule:** Intelligence shows **cross-cutting** and **aggregated** truth; Detail shows **selected record** truth. Never duplicate full record bodies in both columns.

---

## 3. Spacing rules

| Context | Rule |
|---------|------|
| Dashboard content wrapper | Default `p-4 md:p-6`; operational shells set `data-content-padding="false"` |
| Panel header | `px-3 py-2` or `py-2.5` for detail |
| Section labels | `mb-1.5`, `tracking-[0.15em]`, `text-[8px]` |
| Row padding | Manifest: `px-2.5 py-1.5`; avoid exceeding ~72px row height in manifest |
| Detail body | `px-3` / `px-4`, `gap-3` between sections |
| Between panels | `lg:divide-x` only — no double borders inside adjacent cards |

**Density principle:** Operational coordinators need **scan density** in manifest; **reading comfort** in detail. Intelligence stays **tertiary** — smallest type, muted foreground.

---

## 4. Panel hierarchy (visual weight)

1. **Critical signal** — left border `2px`, tier color (blocker/legal/attention)
2. **Selected row** — border + subtle fill (`#bfd4ef` family)
3. **Detail header** — `text-xs`–`text-sm` title, badges
4. **Manifest header** — uppercase label only
5. **Intelligence sections** — muted, mono counts

**Competition rule:** Only **one** panel may use strong accent borders at a time (selected row OR active tab indicator).

---

## 5. Information density rules

| Zone | Max lines per item | Typography |
|------|-------------------|------------|
| Manifest row | 3 (+ optional 1px progress strip) | `10px` primary, mono IDs |
| Detail title block | 2–4 sublines | `xs`–`sm` |
| Intelligence row | 2 | `9px`–`10px` |
| Empty states | 1 | `11px` uppercase tracking-widest |

**Clutter triggers to avoid:**

- Duplicate metrics in manifest AND intelligence AND detail header
- More than 2 filter controls visible without collapse
- Full-width charts inside intelligence rail

---

## 6. Header standards

| Type | When | Content |
|------|------|---------|
| **App header** | Always | Sidebar trigger, search, prefs, account — owned by `dashboard/layout.tsx` |
| **Module PageHeader** | Future | Show title, shoot day, wrap # — only for non-shell pages (Calendar month view, Breakdown grid) |
| **Manifest header** | Always in shell | Module name + open count badge |
| **Detail header** | When record selected | ID, type badges, status, linked refs |

**Do not** add a second full-width module header above the three-column grid without removing manifest header redundancy.

---

## 7. Summary standards (MetricBar)

Use **MetricBar** when the module is **overview/dashboard** type (future Calendar week strip, Production Office day summary).

Operational shells (Logistics, Brokerage, Comms) should use:

- Counts in **manifest header** (`N open`, `N actionable`)
- Rollups in **intelligence** (severity, clearance status)

**Not** a separate MetricBar row unless ≥4 KPIs must be visible without selection.

---

## 8. Detail standards

- Tabs for **orthogonal facets** of one record (Overview / Route / Documents / History)
- Map strip **inside** detail when geographic context matters (Logistics only today)
- Propagation/status banners **above** tabs, never below fold
- Field grids: 2-column `label / value` for brokerage fields; key-value rows for logistics driver

---

## 9. Intelligence standards

- Sections: Clearance, Action Required, Rush Queue, Linked Operations, Digest by Severity
- Sort: blocker → attention → info → clear
- Click-through: intelligence rows may change selection (`onSelectDoc`, order focus)
- Digest panel (Notifications right rail) is **IntelligencePanel** variant, not a fourth column

---

## 10. Three-column rules

| Rule | Description |
|------|-------------|
| **When required** | Any module where user selects one item from many and needs context + cross-links |
| **When forbidden** | Full-page calendar grid, spreadsheet breakdown, printable callsheet preview (use dedicated layouts) |
| **Column collapse** | `< lg`: hide center + right; show manifest only + sheet/drawer for detail (Phase 2) |
| **Width drift** | Converge on 288/240; allow 300px manifest only when row content requires (brokerage) |
| **Alignment hacks** | Module-specific offsets (logistics `pt-[104px]`) live in module wrapper, not shared primitive |

---

## 11. When to use which pattern

| Pattern | Use when | Examples |
|---------|----------|----------|
| **Three-column shell** | Selectable queue + detail + contextual intelligence | Logistics, Brokerage, Chat, Email, Notifications |
| **Single-column + PageHeader** | Timeline-first or document-first overview | Future Calendar, DOOD list |
| **Grid + Detail drawer** | Many homogeneous records, spreadsheet editing | Script Breakdown, Budget lines |
| **Card dashboard** | KPI overview, low interaction | Template finance (legacy), future office summary |
| **Table** | Sortable bulk data, export, column filters | Users admin, future vendor registry |
| **List (manifest only)** | Narrow categories feeding center feed | Notifications categories |
| **Panel** | Full-bleed placeholder or simple tools | ModulePlaceholder pages |
| **Print layout** | WYSIWYG output, pagination | Future Callsheets PDF view |

---

## 12. Mobile considerations (Phase 2+)

- Manifest remains primary; detail opens in `Sheet` or full-screen push
- Intelligence collapses to tab on detail or bottom sheet
- Do not shrink three columns side-by-side below `lg`
- Touch targets: manifest rows min-height 44px when mobile prioritized

---

## 13. Desktop considerations (current v1)

- Target: production coordinators on laptops 1280px+
- Full viewport height: `100dvh - var(--dashboard-header-height)`
- Sticky app header when `data-navbar-style=sticky`
- Hidden columns use `hidden lg:block` — acceptable for v1; document mobile gap

---

## 14. Shared component extraction target (Article IX)

Priority order for `src/components/platform/` (proposed):

1. `OperationalShell` — grid + width tokens
2. `ManifestPanel` — Card + header + search + scroll scaffold
3. `SectionLabel` — dedupe 5+ copies
4. `ManifestRow` — button row with left accent stripe optional
5. `IntelligencePanel` — ScrollArea + SectionLabel sections
6. `DetailPanel` — header + tabs + scroll scaffold
7. `StatusStrip` / `PropagationBanner` — tier-colored banners
8. `EmptySelection` — shared empty state

**Remain module-specific:** Map, propagation engine hooks, chat composer, email reader, brokerage field grids.

---

## 15. Compliance checklist (new modules)

Before shipping a module surface:

- [ ] Classified in module matrix (§16 in audit report)
- [ ] Uses Operational Shell OR documented exception
- [ ] Manifest/intelligence/detail responsibilities assigned
- [ ] No new colors/fonts/animations
- [ ] Reuses `SectionLabel`, Card, ScrollArea, Tabs, InputGroup
- [ ] `data-content-padding="false"` if full-bleed
- [ ] Source/provenance hooks reserved for Article I (future data layer)

---

*Document status: Architecture specification. Implementation tracked separately in layout system roadmap.*
