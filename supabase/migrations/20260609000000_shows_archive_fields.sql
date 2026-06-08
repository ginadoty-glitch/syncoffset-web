-- Add archive support and extended metadata to shows (productions)
ALTER TABLE shows
  ADD COLUMN IF NOT EXISTS archived_at timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS production_type text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS notes text DEFAULT NULL;

COMMENT ON COLUMN shows.archived_at IS 'Timestamp when production was archived; NULL = active';
COMMENT ON COLUMN shows.production_type IS 'e.g. Feature Film, Series, Short, Commercial';
COMMENT ON COLUMN shows.notes IS 'Free-form production notes';
