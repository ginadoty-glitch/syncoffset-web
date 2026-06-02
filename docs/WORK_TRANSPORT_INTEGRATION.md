# Phase 3D.4 — Work Orders & Transport Integration

## Objective

Surface constitutional **WorkOrder** and operational **TransportOrder** data in Set Workspace and Asset Workspace — read-only, no new authorities or workflow engines.

## Constitutional objects referenced

| Object | Layer | Path |
|--------|-------|------|
| **WorkOrder** | Core | `src/types/core/work-order/work-order.ts` |
| **WorkOrderStatus** / **WorkOrderPriority** | Core | `work-order-status.ts`, `work-order-priority.ts` |
| **TransportOrder** | Operations | `src/types/operations/transport-order.ts` |
| **ProductionSet** | Core | Set workspace host |
| **Asset** | Core | Asset workspace host |
| **Document** | Core | Unchanged (document panels separate) |

## Runtime persistence (new)

Migration: `supabase/migrations/20260531000600_work_transport_orders.sql`

| Table | Purpose |
|-------|---------|
| `work_orders` | Maps WorkOrder display fields; `set_id` required, `asset_id` optional |
| `transport_orders` | Maps TransportOrder subset; `set_id` and/or `asset_id` for joins |

No seed data. Empty states until operator inserts rows.

## Set workspace

| Panel | Data | Filter |
|-------|------|--------|
| **Open work orders** (sidebar) | `work_orders` by `set_id` | Excludes `completed`, `cancelled` |
| **Pending deliveries** (main) | `transport_orders` by `set_id` | Excludes `completed`, `cancelled`, `archived` |

Replaces document-based “Open work” panel (draft/review documents).

## Asset workspace

Route: `/dashboard/assets/[assetId]`

| Panel | Data | Filter |
|-------|------|--------|
| **Related work orders** | `work_orders` by `asset_id` | All linked rows |
| **Movement history** | `transport_orders` by `asset_id` | All linked rows, newest first |

## Missing runtime dependencies

| Dependency | Status |
|------------|--------|
| Migration `20260531000600` applied | **Required** for operations panels |
| `work_orders` / `transport_orders` rows seeded | **Required** for non-empty UI |
| Work order creation UI | Out of scope |
| Transport dispatch UI | Out of scope |
| Logistics mock queue ↔ Postgres | Not wired (separate system) |

## Example seed (operator)

```sql
INSERT INTO work_orders (production_id, set_id, work_order_number, title, assigned_to, status_id, priority_id, required_by_date)
VALUES ('YOUR_PRODUCTION_ID', 'YOUR_SET_ID', 'WO-101', 'Build Detective Desk', 'Set Dec — Build', 'in-progress', 'high', CURRENT_DATE + 3);

INSERT INTO transport_orders (production_id, set_id, ref, title, origin_label, destination_label, status, assigned_driver)
VALUES ('YOUR_PRODUCTION_ID', 'YOUR_SET_ID', 'CI-12-001', 'Furniture Delivery', 'Vendor Warehouse', 'Stage 4 — Courtroom', 'scheduled', 'J. Martinez');
```

Link asset-scoped rows with `asset_id` on the same tables.

## Validation

| Test | Expected |
|------|----------|
| Set detail — no migration | Empty states with migration hint |
| Set detail — seeded WO | Open work orders cards |
| Set detail — seeded transport | Pending deliveries cards |
| Asset detail — seeded | Work orders + movement panels |
| No demo rows in code | Confirmed |
