# SyncOffset Production Hierarchy

Version 1.0 — Platform constitution (normative)

**Companion:** [`SYNCOFFSET_SCENE_AUTHORITY.md`](./SYNCOFFSET_SCENE_AUTHORITY.md) · [`SYNCOFFSET_DATA_CONSTITUTION.md`](./SYNCOFFSET_DATA_CONSTITUTION.md)

---

## What production is not

SyncOffset does **not** model production as:

```
Script → Scene → Set → Budget
```

Sets do not own scenes. Budgets do not originate from sets or assets alone.

---

## What production is

```
Source Document
    → Script
        → Scene
            → Breakdown
                → Budget
                    → Set
                        → Asset
                            → Vendor
                                → Logistics
                                    → Shoot Day
```

| Stage | Authority | Role |
|-------|-----------|------|
| Source Document | Article I (`source/`) | Immutable files exactly as received |
| Script | Script Authority | Revisions, revision changes, provenance |
| Scene | Scene Authority | Central production unit — all downstream planning derives here |
| Breakdown | Script Authority (`breakdown-element`) | Requirements extracted from scenes |
| Budget | Scene Authority (`budget-requirement`) | Needs from breakdown; scenes change when budget forces cuts |
| Set | Scene Authority (`set`) | Container supporting scenes — **not** parent authority |
| Asset | Core registry | Physical items; trace to **set number** |
| Vendor | Vendor Authority | Supply and services |
| Logistics | Operations types | Transport, shipment, return |
| Shoot Day | ShootDay Authority | Calendar — **consumes** scene plan |

---

## Authority ordering

1. **Script + Scene** define what production intends to shoot.
2. **Breakdown + Budget** define what production can afford and staff.
3. **Set, Asset, Vendor, Location** fulfill approved requirements.
4. **Logistics + Shoot Day** execute when and where.

**Budget authority** is above Set, Asset, Vendor, Location, and Logistics.  
**Scene authority** is above Budget requirements in the sense that every budget line anchors to a scene (and breakdown).

---

## Department coding

```
Production → Department → Set Number
```

Examples: SET 101 Police Station · SET 205 Apartment · SET 330 Hospital Corridor

Purchases, rentals, returns, shipments, and logistics must trace to a **set number** (`ProductionSet.setNumber`).

---

## Implementation

Types: `src/types/core/scene/` · Graph: `SCENE_CANONICAL_RELATIONSHIP_PATHS` · Registry: `CORE_OBJECT_REGISTRY`

No UI, routes, calculations, or database work in this constitutional layer.
