-- Publish RPC: permit service-role execution.
--
-- Web server actions run as service_role (no Supabase Auth session), so
-- is_member_of() is always false and is_dev_show() only matches the seed show.
-- The publish path therefore failed with not_authorized for every real
-- production. Allow service_role while preserving member/dev-show access and
-- all supersede + lineage logic.

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

  IF NOT (
    public.is_member_of(p_show_id)
    OR public.is_dev_show(p_show_id)
    OR (SELECT auth.role()) = 'service_role'
  ) THEN
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
GRANT EXECUTE ON FUNCTION public.publish_production_schedule_revision(uuid, uuid, text) TO authenticated, service_role;
