-- 20260607000000_scene_registry.sql
--
-- Scene Registry — canonical operational scene hub.
-- Independent of set_files, callsheets, prep memos, transport orders.
-- Those systems reference scene_registry; scene_registry references nothing
-- except shows (ownership) and production_schedule_revisions (audit trail).

-- ─────────────────────────────────────────────────────────────────────────────
-- Table
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.scene_registry (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id            UUID NOT NULL REFERENCES public.shows(id) ON DELETE CASCADE,

  -- Identity
  scene_number       TEXT NOT NULL,
  scene_number_raw   TEXT NOT NULL,
  script_page_count  TEXT,

  -- People (Breakdown-owned)
  cast_numbers       INTEGER[] NOT NULL DEFAULT '{}',
  background_count   INTEGER,

  -- Schedule Intelligence (Schedule-owned)
  set_name           TEXT NOT NULL DEFAULT '',
  sub_location       TEXT,
  int_ext            TEXT NOT NULL DEFAULT 'INT'
                     CHECK (int_ext IN ('INT', 'EXT', 'INT/EXT', 'E/I')),
  day_night          TEXT NOT NULL DEFAULT 'D'
                     CHECK (day_night IN ('D', 'N', 'D/N')),
  d_number           TEXT,
  unit_label         TEXT,
  shoot_day_number   INTEGER,
  location_name      TEXT,

  -- Source revision audit trail
  source_revision_id UUID
                     REFERENCES public.production_schedule_revisions(id)
                     ON DELETE SET NULL,

  -- Operations
  scene_source       TEXT NOT NULL DEFAULT 'schedule'
                     CHECK (scene_source IN ('schedule', 'breakdown', 'manual')),
  scene_status       TEXT NOT NULL DEFAULT 'active'
                     CHECK (scene_status IN ('active', 'omitted', 'archived')),
  scene_readiness    TEXT NOT NULL DEFAULT 'not_started'
                     CHECK (scene_readiness IN ('not_started', 'partial', 'ready', 'blocked')),

  notes              TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- One scene per number per show
  CONSTRAINT uq_scene_registry_show_scene UNIQUE (show_id, scene_number)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────────────────────────────────────

CREATE INDEX idx_scene_registry_show
  ON public.scene_registry(show_id);

CREATE INDEX idx_scene_registry_shoot_day
  ON public.scene_registry(show_id, shoot_day_number)
  WHERE scene_status = 'active';

CREATE INDEX idx_scene_registry_readiness
  ON public.scene_registry(show_id, scene_readiness)
  WHERE scene_status = 'active';

CREATE INDEX idx_scene_registry_location
  ON public.scene_registry(show_id, location_name)
  WHERE scene_status = 'active';

CREATE INDEX idx_scene_registry_source_rev
  ON public.scene_registry(source_revision_id)
  WHERE source_revision_id IS NOT NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- updated_at trigger
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.scene_registry_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_scene_registry_updated_at
  BEFORE UPDATE ON public.scene_registry
  FOR EACH ROW
  EXECUTE FUNCTION public.scene_registry_set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.scene_registry ENABLE ROW LEVEL SECURITY;

CREATE POLICY scene_registry_sel ON public.scene_registry
  FOR SELECT USING (
    public.is_member_of(show_id) OR public.is_dev_show(show_id)
  );

CREATE POLICY scene_registry_ins ON public.scene_registry
  FOR INSERT WITH CHECK (
    public.is_member_of(show_id) OR public.is_dev_show(show_id)
  );

CREATE POLICY scene_registry_upd ON public.scene_registry
  FOR UPDATE USING (
    public.is_member_of(show_id) OR public.is_dev_show(show_id)
  )
  WITH CHECK (
    public.is_member_of(show_id) OR public.is_dev_show(show_id)
  );

-- No delete policy — scenes are archived, never deleted

-- ─────────────────────────────────────────────────────────────────────────────
-- Service role grant (server-side import operations)
-- ─────────────────────────────────────────────────────────────────────────────

GRANT ALL ON public.scene_registry TO service_role;

NOTIFY pgrst, 'reload schema';
