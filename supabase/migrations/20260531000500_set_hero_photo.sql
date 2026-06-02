-- Phase 3D.3 — Set hero photo (workspace media; not Document Authority)
-- Apply manually; do not execute automatically from repo.

ALTER TABLE production_sets
  ADD COLUMN IF NOT EXISTS hero_image_url TEXT;

COMMENT ON COLUMN production_sets.hero_image_url IS
  'Storage ref: set-photos/{productionId}/{setId}/hero.{ext} — workspace visual identity only';

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'set-photos',
  'set-photos',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "syncoffset_set_photos_select"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'set-photos');

CREATE POLICY "syncoffset_set_photos_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'set-photos');

CREATE POLICY "syncoffset_set_photos_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'set-photos');

CREATE POLICY "syncoffset_set_photos_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'set-photos');
