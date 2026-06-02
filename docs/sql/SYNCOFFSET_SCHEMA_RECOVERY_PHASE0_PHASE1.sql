-- SyncOffset Schema Recovery — Phase 0 + Phase 1
-- Project: yddwznlclkcfqqgmorye
-- Authority: SYNCOFFSET_SCHEMA_DECISION_RECORD.md, SYNCOFFSET_SCHEMA_RECOVERY_PLAN.md
-- Run in Supabase SQL Editor (service role) or psql. Idempotent where noted.

-- =============================================================================
-- PHASE 0 — Document collision recovery (Decision 2)
-- =============================================================================

-- Pre-check: legacy tables must exist
-- SELECT to_regclass('public.documents'), to_regclass('public.document_versions');

BEGIN;

-- Stop if constitutional documents already exist (avoid double-rename)
DO $$
BEGIN
  IF to_regclass('public.source_documents') IS NOT NULL THEN
    RAISE EXCEPTION 'Phase 0 abort: source_documents already exists — constitutional chain may be applied';
  END IF;
END $$;

-- Rename only when legacy names still present
DO $$
BEGIN
  IF to_regclass('public.documents') IS NOT NULL
     AND to_regclass('public.logistics_documents') IS NULL THEN
    ALTER TABLE public.documents RENAME TO logistics_documents;
  END IF;
  IF to_regclass('public.document_versions') IS NOT NULL
     AND to_regclass('public.logistics_document_versions') IS NULL THEN
    ALTER TABLE public.document_versions RENAME TO logistics_document_versions;
  END IF;
END $$;

COMMIT;

-- Post-check Phase 0
-- SELECT to_regclass('public.logistics_documents'), to_regclass('public.logistics_document_versions');
-- SELECT to_regclass('public.documents');  -- must be NULL before constitutional migration

NOTIFY pgrst, 'reload schema';

-- =============================================================================
-- PHASE 1 — Schedule authority (run after Phase 0 COMMIT)
-- Apply file contents in order (paste full migration bodies):
--   1. syncoffset-mobile/supabase/migrations/20260520100000_production_schedule_shadow.sql
--   2. syncoffset-mobile/supabase/migrations/20260521100000_schedule_revision_publish_phase2.sql
-- (Duplicate copies under syncoffset-web/supabase/migrations/ — do not apply twice.)
-- =============================================================================

-- Post-check Phase 1
-- SELECT count(*) FROM public.production_schedule_revisions;
-- SELECT count(*) FROM public.production_schedule_days;
-- SELECT count(*) FROM public.production_schedule_lineage;
-- SELECT proname FROM pg_proc WHERE proname IN (
--   'publish_production_schedule_revision',
--   'production_schedule_revisions_assign_number'
-- );
