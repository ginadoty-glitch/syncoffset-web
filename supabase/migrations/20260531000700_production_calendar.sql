-- Production Strip Calendar — runtime persistence for constitutional CalendarDay / ProductionCalendar
-- Scene → Shoot Day → Calendar (planning visualization). Apply manually; no seed data.

CREATE TABLE production_calendars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_id UUID NOT NULL,
  calendar_name TEXT NOT NULL DEFAULT 'Master Production Calendar',
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  revision_color TEXT NOT NULL DEFAULT 'white',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  modified_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_production_calendars_production ON production_calendars (production_id);

CREATE TABLE calendar_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_id UUID NOT NULL,
  calendar_id UUID NOT NULL REFERENCES production_calendars (id) ON DELETE CASCADE,
  calendar_date DATE NOT NULL,
  day_number INTEGER,
  day_type TEXT NOT NULL DEFAULT 'shoot',
  shoot_location TEXT NOT NULL DEFAULT '',
  unit_label TEXT NOT NULL DEFAULT '',
  zone_color TEXT NOT NULL DEFAULT 'unit-a',
  notes TEXT NOT NULL DEFAULT '',
  shoot_day_id UUID,
  UNIQUE (calendar_id, calendar_date)
);

CREATE INDEX idx_calendar_days_production_date ON calendar_days (production_id, calendar_date);
CREATE INDEX idx_calendar_days_calendar ON calendar_days (calendar_id);

CREATE TABLE calendar_day_scenes (
  calendar_day_id UUID NOT NULL REFERENCES calendar_days (id) ON DELETE CASCADE,
  scene_id UUID NOT NULL REFERENCES scenes (id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (calendar_day_id, scene_id)
);

CREATE TABLE calendar_day_obligations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_day_id UUID NOT NULL REFERENCES calendar_days (id) ON DELETE CASCADE,
  obligation_type TEXT NOT NULL DEFAULT 'custom',
  label TEXT NOT NULL,
  time_label TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_calendar_day_obligations_day ON calendar_day_obligations (calendar_day_id);

ALTER TABLE production_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_day_scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_day_obligations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "production_calendars_select" ON production_calendars FOR SELECT TO authenticated USING (true);
CREATE POLICY "calendar_days_select" ON calendar_days FOR SELECT TO authenticated USING (true);
CREATE POLICY "calendar_day_scenes_select" ON calendar_day_scenes FOR SELECT TO authenticated USING (true);
CREATE POLICY "calendar_day_obligations_select" ON calendar_day_obligations FOR SELECT TO authenticated USING (true);
