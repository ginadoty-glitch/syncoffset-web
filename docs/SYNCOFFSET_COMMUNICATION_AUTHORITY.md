# SyncOffset Communication Authority v1.0

**Workspace 22** — production communications as constitutional objects.

**Code:** `src/types/core/communication/`

**Out of scope:** UI · Outlook · Gmail · Apple Mail · Exchange · SMS gateways · push systems · chat servers · delivery engines · Supabase · workflows · approval engines.

---

## Constitutional purpose

**Communication is a production object.** Delivery systems are not.

| Constitutional | Not authority |
|----------------|---------------|
| `communication` | Email, Outlook, Gmail, SMS, push, chat |
| `distribution-list` | Mailing list provider |
| `communication-package` | MIME / EML file alone |

Platforms (Outlook, Exchange, Gmail, Apple Mail, production office mailboxes, SMS, push, chat, printed notices) are **integrations** — the same `Communication` may use any `channelId` without changing the object (Rule 1).

---

## Production hierarchy

```
Production Calendar
    ↓
Shoot Day
    ↓
Callsheet
    ↓
Communication
    ↓
Distribution List
    ↓
Recipients (crew-member / person members on list)
```

Communication **distributes** production information. It does **not** replace Callsheets, Calendars, Work Orders, or Transport Orders.

---

## Critical rules

### Rule 1 — Platform-independent

One `Communication` may be delivered via `email`, `sms`, `push`, `chat`, or `printed` without changing the constitutional record.

### Rule 2 — Production references

Communications may **reference**: show, scene, set, shoot-day, callsheet, work-order, transport-order, vendor, location, asset, purchase-order, shipment, return, production-calendar.

### Rule 3 — Department mailboxes

**Department mailboxes** (`art@`, `props@`, …) are **production entities** — not personal accounts. `MAILBOX_ENDPOINT_KIND_REGISTRY` supports **department-mailbox** and **personal-mailbox** without platform dependency.

### Rule 4 — Callsheet authority

**Callsheet Authority** owns execution packages. **Communication** distributes information about them.

### Rule 5 — No approvals

Communications do **not** create approvals — future Approval Authority owns sign-off.

### Rule 6 — No tasks

**Work Orders** own work. Communications distribute information **about** work.

---

## Objects

| Object | `CoreObjectKind` | Role |
|--------|------------------|------|
| **Communication** | `communication` | Production communication record |
| **DistributionList** | `distribution-list` | Recipient groups |
| **CommunicationPackage** | `communication-package` | Documentation outputs only |

---

## Communication — required fields

| Field | Notes |
|-------|-------|
| `communicationNumber` | e.g. COM-2403 |
| `subject` | Subject line |
| `body` | Message body |
| `channelId` | `COMMUNICATION_CHANNEL_REGISTRY` |
| `statusId` | `COMMUNICATION_STATUS_REGISTRY` |
| `createdBy` | Author identity |
| `sentAt?` | Send timestamp when distributed |
| `notes` | May be empty string |

---

## DistributionList — required fields

| Field | Notes |
|-------|-------|
| `name` | e.g. Art Department, All Crew |
| `description` | List purpose |
| `departmentId?` | Optional department anchor |

**Examples:** Art · Props · Set Decoration · Construction · Transportation · Locations · Production Office · All Crew · All Cast · All Background

---

## CommunicationPackage — required fields

| Field | Notes |
|-------|-------|
| `communicationId` | Parent communication |
| `packageKind` | `COMMUNICATION_PACKAGE_KIND_REGISTRY` |
| `generatedAt` | Issue timestamp |

**Kinds:** `email-package` · `distribution-package` · `notice-package` · `production-update-package` · `department-update-package`

---

## Registries

### `COMMUNICATION_STATUS_REGISTRY`

`draft` · `queued` · `distributed` · `delivered` · `read` · `archived`

### `COMMUNICATION_CHANNEL_REGISTRY`

`email` · `sms` · `push` · `chat` · `phone` · `printed`

### `DEPARTMENT_MAILBOX_REGISTRY`

`art` · `props` · `setdec` · `construction` · `locations` · `transport` · `production`

---

## Relationship contracts

`COMMUNICATION_CANONICAL_RELATIONSHIP_PATHS` · `COMMUNICATION_RELATIONSHIP_SCHEMA_REGISTRY`

| pathId | Path |
|--------|------|
| `communication-distribution` | Communication → Distribution List → Recipients |
| `callsheet-distribution` | Callsheet → Communication → Distribution List |
| `work-order-notification` | Work Order → Communication |
| `transport-notification` | Transport Order → Communication |
| `production-notification` | Shoot Day → Communication |

### Required edges

| Edge |
|------|
| `communication` → `distribution-list` |
| `communication` → `callsheet` \| `shoot-day` \| `work-order` \| `transport-order` \| `vendor` \| `location` \| `asset` \| `set` \| `scene` \| `production-calendar` |
| `communication-package` → `generated-output` |

---

## Naming notes

| Topic | Notes |
|-------|--------|
| `callsheet-distribution` vs `distribution-list` | Callsheet delivery record ≠ Communication distribution list |
| `distribution-package` package kind | Communication package kind — distinct from callsheet package kinds |
| **Recipient** | No `recipient` core kind in v1 — members on `distribution-list` |

---

*Types, registries, and relationship contracts only.*
