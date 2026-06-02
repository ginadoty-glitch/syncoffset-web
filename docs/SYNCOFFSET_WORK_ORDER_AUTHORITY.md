# SyncOffset Work Order Authority v1.0

**Workspace 19** — inter-department production work requests.

**Code:** `src/types/core/work-order/`

**Out of scope:** UI · routes · workflows · notifications · automation · Supabase · email · calendars · scheduling engines · business logic.

---

## Constitutional purpose

A **Work Order** is a **formal production request between departments**.

| A Work Order is | A Work Order is NOT |
|-----------------|---------------------|
| Requested labor, fabrication, installation, prep, modification, restoration, strike, research, graphics, construction, dressing, coordination, production services | **Purchase Order**, **Shipment**, **Transport Order** |
| Department execution of a production need | **Asset**, **Budget Requirement**, **Callsheet**, **Shoot Day** |

Work orders **originate from production needs** — they **do not create** the need. They **execute** the need.

---

## Production hierarchy

```
Script Revision
    ↓
Scene
    ↓
Set
    ↓
Budget Requirement
    ↓
Department Requirement   (crew-requirement / department planning — future formal kind)
    ↓
Work Order
    ↓
Department Execution
    ↓
Shoot Day
    ↓
Callsheet
```

---

## Critical rules

### Rule 1 — Request work, not move assets

Work Orders **request work**. They do **not** move assets.

### Rule 2 — Transport moves assets

**Transport Orders** move assets. They do **not** request work.

### Rule 3 — Purchase acquires assets

**Purchase Orders** acquire assets. They do **not** assign labor.

### Rule 4 — Always on a Set

Work Orders **always** belong to a **Set** — `setId` and `setNumber` are **required**.

### Rule 5 — Scene creates need

Work Orders may **reference** a **Scene**. Scenes create the need; departments execute the work.

---

## Objects

| Object | `CoreObjectKind` | Role |
|--------|------------------|------|
| **WorkOrder** | `work-order` | Constitutional production request |
| **WorkOrderTask** | `work-order-task` | Individual execution item |
| **WorkOrderPackage** | `work-order-package` | Generated documentation only |

---

## WorkOrder — required fields

| Field | Notes |
|-------|-------|
| `workOrderNumber` | e.g. WO-1042 |
| `title` | Short label |
| `description` | Scope |
| `requestingDepartmentId` | Requesting department |
| `assignedDepartmentId` | Fulfillment department |
| `setId`, `setNumber` | **Required** (Rule 4) |
| `sceneId?` | Optional scene trace (Rule 5) |
| `budgetRequirementId?` | Optional budget trace |
| `priorityId` | `WORK_ORDER_PRIORITY_REGISTRY` |
| `statusId` | `WORK_ORDER_STATUS_REGISTRY` |
| `requestedBy` | Requester identity |
| `requestedDate` / `requiredByDate` | ISO dates |
| `notes` | May be empty string |

---

## WorkOrderTask — required fields

| Field | Notes |
|-------|-------|
| `workOrderId` | Parent work order |
| `title` | Task label |
| `description` | Task scope |
| `statusId` | `WORK_ORDER_TASK_STATUS_REGISTRY` |
| `assignedTo?` | Assignee identity |
| `dueDate?` | ISO date |

**Examples:** build counter · print menus · age walls · install drapes · strike set · deliver graphics package

---

## WorkOrderPackage — required fields

| Field | Notes |
|-------|-------|
| `workOrderId` | Parent work order |
| `packageKind` | `WORK_ORDER_PACKAGE_KIND_REGISTRY` |
| `generatedAt` | Issue timestamp |

**Package kinds:** `department-work-package` · `construction-package` · `graphics-package` · `installation-package` · `strike-package`

---

## Registries

### `WORK_ORDER_STATUS_REGISTRY`

`draft` · `requested` · `reviewing` · `approved` · `assigned` · `in-progress` · `blocked` · `completed` · `cancelled`

### `WORK_ORDER_PRIORITY_REGISTRY`

`low` · `normal` · `high` · `rush` · `critical`

### `WORK_ORDER_TASK_STATUS_REGISTRY`

`pending` · `in-progress` · `blocked` · `completed` · `cancelled`

---

## Constitutional examples

| From → To | Work |
|-----------|------|
| Art → Construction | Build kitchen island |
| Art → Graphics | Create restaurant menus |
| Set Dec → Greens | Install practical plants |
| Locations → Set Dec | Protect hardwood flooring |
| Production → Transportation | Move hero furniture package *(transport is separate — WO requests coordination)* |

---

## Relationship contracts

`WORK_ORDER_CANONICAL_RELATIONSHIP_PATHS` · `WORK_ORDER_RELATIONSHIP_SCHEMA_REGISTRY`

| pathId | Path |
|--------|------|
| `planning-to-execution` | Budget Requirement → Work Order → Work Order Task → Shoot Day |
| `scene-work` | Scene → Set → Work Order |
| `department-work` | Department → Work Order → Department (assigned) |
| `execution-package` | Work Order → Work Order Package → Generated Output |

### Required edges

| Edge |
|------|
| `department` → `work-order` |
| `work-order` → `work-order-task` |
| `work-order` → `work-order-package` |
| `work-order` → `set` |
| `work-order` → `scene` |
| `work-order` → `budget-requirement` |
| `work-order` → `shoot-day` |
| `work-order` → `generated-output` |

---

*Types, registries, and relationship contracts only.*
