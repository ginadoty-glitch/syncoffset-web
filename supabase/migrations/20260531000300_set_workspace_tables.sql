-- Set Detail Workspace V1 — persistence for existing constitutional types (no new authorities)
-- Maps: ProductionSet, Asset, Scene (src/types/core/scene, src/types/core/asset)
-- Apply manually; no seed data.

CREATE TABLE production_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_id UUID NOT NULL,
  kind TEXT NOT NULL DEFAULT 'set' CHECK (kind = 'set'),
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'struck', 'archived')),
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  modified_by TEXT NOT NULL,
  modified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_document_id UUID,
  source_version_id UUID,
  relationships JSONB NOT NULL DEFAULT '[]'::jsonb,
  set_number TEXT NOT NULL,
  set_name TEXT NOT NULL,
  related_scene_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  asset_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  location_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  budget_line_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  department_id UUID,
  notes TEXT
);

CREATE INDEX idx_production_sets_production ON production_sets (production_id);

CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_id UUID NOT NULL,
  kind TEXT NOT NULL DEFAULT 'asset' CHECK (kind = 'asset'),
  status TEXT NOT NULL DEFAULT 'requested',
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  modified_by TEXT NOT NULL,
  modified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_document_id UUID,
  source_version_id UUID,
  relationships JSONB NOT NULL DEFAULT '[]'::jsonb,
  asset_number TEXT NOT NULL,
  asset_name TEXT NOT NULL,
  category_id TEXT NOT NULL,
  custom_category_label TEXT,
  department_id UUID NOT NULL,
  set_id UUID NOT NULL REFERENCES production_sets (id) ON DELETE CASCADE,
  set_number TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  asset_instance_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  asset_assignment_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  asset_package_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  budget_requirement_id UUID,
  breakdown_element_id UUID,
  vendor_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  purchase_order_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  purchase_line_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  shipment_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  return_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  photo_storage_ref TEXT,
  vendor_display_name TEXT,
  cost_display_amount NUMERIC
);

CREATE INDEX idx_assets_set ON assets (set_id);

CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_id UUID NOT NULL,
  kind TEXT NOT NULL DEFAULT 'scene' CHECK (kind = 'scene'),
  status TEXT NOT NULL DEFAULT 'draft',
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  modified_by TEXT NOT NULL,
  modified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_document_id UUID,
  source_version_id UUID,
  relationships JSONB NOT NULL DEFAULT '[]'::jsonb,
  scene_number TEXT NOT NULL,
  interior_exterior TEXT NOT NULL,
  time_of_day TEXT NOT NULL,
  script_pages NUMERIC NOT NULL DEFAULT 0,
  set_id UUID NOT NULL REFERENCES production_sets (id) ON DELETE CASCADE,
  location_id UUID NOT NULL,
  episode_number TEXT NOT NULL DEFAULT '',
  revision_color TEXT NOT NULL DEFAULT 'white',
  notes TEXT NOT NULL DEFAULT '',
  script_revision_id UUID NOT NULL,
  episode_id UUID,
  cast_count INTEGER NOT NULL DEFAULT 0,
  asset_count INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT ''
);

CREATE INDEX idx_scenes_set ON scenes (set_id);

ALTER TABLE production_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "production_sets_select" ON production_sets FOR SELECT TO authenticated USING (true);
CREATE POLICY "assets_select" ON assets FOR SELECT TO authenticated USING (true);
CREATE POLICY "scenes_select" ON scenes FOR SELECT TO authenticated USING (true);
