# Production Strip Calendar V1

## Purpose

Replicate a traditional film/TV **wall calendar** (month grid, production day containers) — **not** Google Calendar, Outlook, or shadcn `Calendar` as the primary UI.

Constitutional mapping:

| Layer | Object | Runtime |
|-------|--------|---------|
| Month grid | `ProductionCalendar` | `production_calendars` |
| Day container | `CalendarDay` | `calendar_days` |
| Shoot anchor | `ShootDay` | `shoot_day_id` (optional FK placeholder) |
| Scene work | `Scene` | `calendar_day_scenes` → `scenes` |
| Production events | obligations | `calendar_day_obligations` |
| Department forecast | `WorkOrder`, `TransportOrder` | due-date / activity overlay on cell |

Hierarchy: **Scene → Shoot Day → Calendar** (scenes linked to calendar days; not events imported from an agenda).

## Route

`/dashboard/production-calendar?month=YYYY-MM`

Sidebar: **Production → Production Calendar**

## Migration

`supabase/migrations/20260531000700_production_calendar.sql`

## Example seed (operator)

```sql
INSERT INTO production_calendars (production_id, calendar_name)
VALUES ('YOUR_PRODUCTION_ID', 'Series — Season 1');

-- Use returned calendar id:
INSERT INTO calendar_days (production_id, calendar_id, calendar_date, day_number, day_type, shoot_location, unit_label, zone_color, notes)
VALUES
  ('YOUR_PRODUCTION_ID', 'CALENDAR_ID', '2026-06-14', 14, 'shoot', 'NS STUDIOS', 'Main Unit', 'unit-a', ''),
  ('YOUR_PRODUCTION_ID', 'CALENDAR_ID', '2026-06-15', 15, 'prep', 'WHISTLER', 'Prep Week', 'prep-week', 'Tech survey AM');

INSERT INTO calendar_day_obligations (calendar_day_id, obligation_type, label, time_label, sort_order)
VALUES ('DAY_UUID', 'tech-scout', 'TECH SURVEY', '2 PM', 0);

INSERT INTO calendar_day_scenes (calendar_day_id, scene_id, sort_order)
SELECT 'DAY_UUID', id, 0 FROM scenes WHERE scene_number IN ('302','303','304') LIMIT 3;
```

## Out of scope (V1)

- Drag-and-drop scheduling
- Agenda/week SaaS views as primary
- Callsheet generation
- Auto-sync from shooting schedule PDFs
