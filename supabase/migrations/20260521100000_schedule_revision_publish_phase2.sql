-- Phase 2: published schedule revisions — governance only (NOT realtime collaborative strip editing).
-- Local AsyncStorage spine remains device operational truth; publishing only updates revision metadata visibility.

alter table public.production_schedule_revisions
  drop constraint if exists production_schedule_revisions_revision_scope_check;

alter table public.production_schedule_revisions
  add constraint production_schedule_revisions_revision_scope_check
  check (
    revision_scope in (
      'local_shadow',
      'shared_draft',
      'published',
      'superseded',
      'archived'
    )
  );

alter table public.production_schedule_revisions
  add column if not exists published_at timestamptz,
  add column if not exists published_by text,
  add column if not exists import_merge_kind text check (import_merge_kind in ('merged', 'replaced', 'initial')),
  add column if not exists revision_number integer;

-- Dense sequence per production (immutable display #); trigger assigns on new inserts unless caller sets revision_number explicitly.
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY show_id ORDER BY imported_at ASC, id ASC) AS rn
  FROM public.production_schedule_revisions
)
UPDATE public.production_schedule_revisions r
SET revision_number = ranked.rn
FROM ranked
WHERE r.id = ranked.id AND r.revision_number IS NULL;

UPDATE public.production_schedule_revisions
SET revision_number = 1
WHERE revision_number IS NULL;

alter table public.production_schedule_revisions
  alter column revision_number set not null;

ALTER TABLE public.production_schedule_revisions
  DROP CONSTRAINT IF EXISTS production_schedule_revisions_show_revnum_key;

ALTER TABLE public.production_schedule_revisions
  ADD CONSTRAINT production_schedule_revisions_show_revnum_key UNIQUE (show_id, revision_number);

create unique index if not exists production_schedule_one_published_per_show_idx
  on public.production_schedule_revisions (show_id)
  where revision_scope = 'published';

CREATE OR REPLACE FUNCTION public.production_schedule_revisions_assign_number()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.revision_number IS NOT NULL AND NEW.revision_number > 0 THEN
    RETURN NEW;
  END IF;
  PERFORM pg_advisory_xact_lock(hashtext(NEW.show_id::text));
  SELECT COALESCE(MAX(revision_number), 0) + 1 INTO NEW.revision_number
  FROM public.production_schedule_revisions
  WHERE show_id = NEW.show_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS production_schedule_revisions_assign_number_trg ON public.production_schedule_revisions;
CREATE TRIGGER production_schedule_revisions_assign_number_trg
  BEFORE INSERT ON public.production_schedule_revisions
  FOR EACH ROW
  EXECUTE PROCEDURE public.production_schedule_revisions_assign_number();
CREATE OR REPLACE FUNCTION public.publish_production_schedule_revision(
  p_show_id uuid,
  p_revision_id uuid,
  p_published_by text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_prev_ids uuid[];
  v_rid uuid;
BEGIN
  IF p_show_id IS NULL OR p_revision_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'missing_ids');
  END IF;

  IF NOT (public.is_member_of(p_show_id) OR public.is_dev_show(p_show_id)) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_authorized');
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(p_show_id::text));

  SELECT r.id INTO v_rid
  FROM public.production_schedule_revisions r
  WHERE r.id = p_revision_id
    AND r.show_id = p_show_id
    AND r.revision_scope IN ('local_shadow', 'shared_draft')
    AND r.revision_scope IS NOT NULL;

  IF v_rid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'revision_not_publishable');
  END IF;

  SELECT coalesce(array_agg(id), '{}') INTO v_prev_ids
  FROM public.production_schedule_revisions
  WHERE show_id = p_show_id AND revision_scope = 'published';

  UPDATE public.production_schedule_revisions
  SET revision_scope = 'superseded'
  WHERE show_id = p_show_id AND revision_scope = 'published';

  UPDATE public.production_schedule_revisions
  SET
    revision_scope = 'published',
    published_at = now(),
    published_by = LEFT(coalesce(nullif(trim(p_published_by), ''), imported_by), 320)
  WHERE id = p_revision_id AND show_id = p_show_id;

  IF cardinality(v_prev_ids) > 0 THEN
    INSERT INTO public.production_schedule_lineage (parent_revision_id, child_revision_id, relationship_type)
    SELECT unnest(v_prev_ids), p_revision_id, 'published'
    ON CONFLICT (parent_revision_id, child_revision_id) DO NOTHING;
  END IF;

  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.publish_production_schedule_revision(uuid, uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.publish_production_schedule_revision(uuid, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.publish_production_schedule_revision(uuid, uuid, text) TO service_role;

COMMENT ON COLUMN public.production_schedule_revisions.import_merge_kind IS
  'Whether this snapshot came from merged append or replace import (device-local bookkeeping).';

COMMENT ON COLUMN public.production_schedule_revisions.revision_scope IS
  'Governance lifecycle: office-facing winner is exactly one published per show at a time.';

notify pgrst, 'reload schema';
