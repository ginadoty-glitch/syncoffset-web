# SyncOffset Development Rule — No Mock in Production Workflows

**Effective:** immediately  
**Applies to:** `syncoffset-web`, `syncoffset-mobile/expo`, TestFlight, and any production-facing build.

Companion: [SYNCOFFSET_BUILD_INTEGRITY_RULE.md](./SYNCOFFSET_BUILD_INTEGRITY_RULE.md) (build + truthfulness labels).

---

## Policy

Production workflows **must not display**:

- Mock data
- Demo data
- Seed arrays
- Hardcoded business records
- Placeholder business objects presented as real rows

**Allowed in production UI:**

- Empty states
- Setup states
- Missing migration warnings
- “No data” states (honest zero rows from Supabase)

**TestFlight / field testing:**

Users must exercise **real workflows** against **real Supabase data**. Offline or unconfigured environments may show empty/setup states — not fabricated production rows.

---

## Required runtime labels

Every route, sprint report, and product-matrix row must use **one** of:

| Label | Meaning |
|-------|---------|
| **PRODUCTION READY** | Real SOR wired; no mock business rows in UI |
| **PARTIALLY IMPLEMENTED** | Real path exists; schema, auth, or nav gaps remain |
| **PLACEHOLDER** | Shell / coming-soon / module placeholder (no fake rows) |
| **MOCK** | Static or demo business data shown |
| **DEPRECATED** | Superseded; still reachable |

**Rule:** Any route that still shows mock business data must be labeled **MOCK** in docs **or** removed from navigation before TestFlight.

Do not label a screen **PRODUCTION READY** if it reads from `*-data.ts` seed arrays, `data.json` demo tables, or `AppProvider` seed lists while presenting rows as operational truth.

---

## Before TestFlight — remove or hide

### Web (`syncoffset-web`)

| Area | Status | Evidence | Action |
|------|--------|----------|--------|
| Logistics overview | **MOCK** | `logistics/_components/shipment-data.ts`, `operational-data.ts` | Hide nav or empty state + Supabase wire |
| Logistics subroutes (TO, shipments, rush, holdbacks) | **PLACEHOLDER** / partial | `ModulePlaceholder` on some; overview still mock | Hide until real |
| Brokerage | **MOCK** | `logistics/brokerage/_components/brokerage-data.ts` | Hide nav |
| Communications (chat, email, notifications) | **MOCK** | `communications/_components/chat-data.ts`, `email-data.ts`, `notifications-data.ts` | Hide nav |
| Studio Admin demo dashboards | **MOCK** | Routes exist; **not** in primary sidebar today | Block direct URL / remove routes |
| Mail | **MOCK** | `mail/_components/data.tsx` | Hide |
| Finance dashboard | **MOCK** | Template personal finance — not production accounting | Hide |

**Studio Admin routes (orphan — hide before TestFlight):**

- `/dashboard/default`, `/dashboard/default-v1`
- `/dashboard/crm`
- `/dashboard/finance`, `/dashboard/finance-v1`
- `/dashboard/ecommerce`
- `/dashboard/analytics`
- `/dashboard/productivity`
- `/dashboard/users`
- `/dashboard/academy`
- `/dashboard/mail`, `/mail`
- `/dashboard/(legacy)/*`

**Currently in sidebar (production nav) — highest risk:**

| Nav item | Route | Label today |
|----------|-------|-------------|
| Logistics → Overview | `/dashboard/logistics` | **MOCK** |
| Logistics → Transport Orders | `/dashboard/logistics/transport-orders` | Verify SOR |
| Logistics → Shipments | `/dashboard/logistics/shipments` | **MOCK** / placeholder |
| Logistics → Brokerage Docs | `/dashboard/logistics/brokerage` | **MOCK** |
| Logistics → Rush / Holdbacks | `/dashboard/logistics/rush`, `holdbacks` | **PLACEHOLDER** |
| Communications → Chat / Email / Notifications | `/dashboard/communications/*` | **MOCK** |
| Production → Sets | `/dashboard/sets` | **PARTIALLY IMPLEMENTED** (Supabase; needs migration) |
| Production → Calendar | `/dashboard/production-calendar` | **PARTIALLY IMPLEMENTED** (published schedule) |
| Ingestion | `/ingestion` | **PRODUCTION READY** path (verify env) |

### Expo (`syncoffset-mobile/expo`)

| Area | Status | Evidence | Action |
|------|--------|----------|--------|
| `demoMode` + seed hydration | **MOCK** when active | `AppProvider`: `SEED_*`, `useSeedLists`, `useSeedData` | Disable demoMode in TestFlight builds; empty when no Supabase |
| Dispatch home “seed” drivers | **MOCK** when `homeDriversSource: "seed"` | `(tabs)/index` | Must be `"supabase"` or `"empty"` in field builds |
| Unconfigured Supabase | **PARTIALLY IMPLEMENTED** | Falls back to seed lists | Show setup state, not seed rows |

---

## Implementation checklist (pre–TestFlight)

1. **Audit** every reachable route; assign one truthfulness label.
2. **Navigation** — remove or gate **MOCK** items from sidebar, hub, and search (`sidebar-items.ts`, Expo Operations hub).
3. **Data layer** — replace `*-data.ts` / `data.json` reads with Supabase loaders or honest empty states.
4. **Build flags** — `demoMode === false`, `BYPASS_AUTH_FOR_DEV === false` for field builds.
5. **Schema** — apply migrations before claiming **PRODUCTION READY** (e.g. `set_files`, schedule publish).
6. **Report** using [SYNCOFFSET_BUILD_INTEGRITY_RULE.md](./SYNCOFFSET_BUILD_INTEGRITY_RULE.md) final format; `RUNTIME STATUS` must not be **MOCK** for ship candidates.

---

## Agent / sprint rules

- Do not add new seed arrays for production screens.
- Do not present `data.json` or hardcoded arrays as dispatch, logistics, or finance truth.
- When mock is unavoidable during development, label the route **MOCK** in the sprint doc and do not link it from production nav.
- Empty and migration-missing states are preferred over fake rows.

---

## Related docs

- [SYNCOFFSET_PRODUCT_MATRIX.md](./SYNCOFFSET_PRODUCT_MATRIX.md) — mock audit tables
- [EXPO_RUNTIME_WIRING_AUDIT.md](./EXPO_RUNTIME_WIRING_AUDIT.md) — Expo data sources per route
- [SYNCOFFSET_AUDIT_PROMPT.md](./SYNCOFFSET_AUDIT_PROMPT.md) — include mock/SOR in audits
