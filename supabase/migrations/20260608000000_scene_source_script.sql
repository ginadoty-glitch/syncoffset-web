-- Add 'script' to scene_source check constraint (for script PDF ingestion pipeline)
ALTER TABLE public.scene_registry
  DROP CONSTRAINT IF EXISTS scene_registry_scene_source_check;

ALTER TABLE public.scene_registry
  ADD CONSTRAINT scene_registry_scene_source_check
  CHECK (scene_source IN ('schedule', 'breakdown', 'manual', 'script'));

NOTIFY pgrst, 'reload schema';
