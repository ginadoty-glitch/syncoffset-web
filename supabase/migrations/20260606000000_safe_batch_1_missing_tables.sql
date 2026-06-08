-- ════════════════════════════════════════════════════════════════════════════
-- Safe Batch 1: Create 5 genuinely missing foundation tables
--
-- These tables were defined in 20260422000000_syncoffset_init.sql but never
-- applied to the remote Supabase instance. All other init-era tables already
-- exist. This migration uses CREATE TABLE IF NOT EXISTS and idempotent policy
-- drops — safe to re-run.
--
-- Tables created:
--   1. receipts           — receipt intake (mobile AppProvider writes)
--   2. receipt_items       — line items per receipt
--   3. damage_reports      — loss/damage reports linked to trips
--   4. driver_locations    — append-only GPS pings from drivers
--   5. audit_log           — append-only audit ledger (server-only writes)
--
-- Also included:
--   6. GRANT service_role on shows, show_members, shipments, documents
--      (from 20260546000000 — fixes 403 on web server actions)
--   7. GRANT service_role on new tables + additional blocked tables
--
-- NOT included:
--   - No RLS policy changes on existing tables
--   - No function/RPC changes
--   - No column additions on existing tables
--   - No auth changes
--   - No destructive actions
-- ════════════════════════════════════════════════════════════════════════════

-- ─── 1. RECEIPTS ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id uuid NOT NULL REFERENCES public.shows(id) ON DELETE CASCADE,
  seller_name text NOT NULL,
  seller_address text,
  seller_email text,
  seller_phone text,
  source text CHECK (source IN ('facebook','craigslist','other')),
  ad_copy text,
  total numeric(12,2) NOT NULL DEFAULT 0,
  signature_path text,
  po_number text,
  purchased_by_sub text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.receipt_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id uuid NOT NULL REFERENCES public.receipts(id) ON DELETE CASCADE,
  description text NOT NULL,
  price numeric(12,2) NOT NULL DEFAULT 0,
  is_asset boolean NOT NULL DEFAULT false
);

-- ─── 2. DAMAGE REPORTS ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.damage_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id uuid NOT NULL REFERENCES public.shows(id) ON DELETE CASCADE,
  trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL,
  description text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('minor','major','loss')),
  photo_path text,
  reported_by_sub text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ─── 3. DRIVER LOCATIONS (append-only GPS) ──────────────────────────────────

CREATE TABLE IF NOT EXISTS public.driver_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_sub text NOT NULL,
  show_id uuid REFERENCES public.shows(id) ON DELETE CASCADE,
  trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  accuracy double precision,
  speed double precision,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS driver_locations_driver_idx
  ON public.driver_locations(driver_sub, recorded_at DESC);
CREATE INDEX IF NOT EXISTS driver_locations_show_idx
  ON public.driver_locations(show_id, recorded_at DESC);

-- ─── 4. AUDIT LOG (append-only) ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_sub text,
  show_id uuid REFERENCES public.shows(id) ON DELETE SET NULL,
  event text NOT NULL,
  target_type text,
  target_id text,
  detail jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_log_created_idx
  ON public.audit_log(created_at DESC);

-- ─── 5. RLS on new tables ───────────────────────────────────────────────────

ALTER TABLE public.receipts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipt_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.damage_reports   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log        ENABLE ROW LEVEL SECURITY;

-- Receipts: members read; creator can insert/update; dispatch can update
DROP POLICY IF EXISTS receipts_select ON public.receipts;
CREATE POLICY receipts_select ON public.receipts
  FOR SELECT USING (public.is_member_of(show_id));

DROP POLICY IF EXISTS receipts_insert ON public.receipts;
CREATE POLICY receipts_insert ON public.receipts
  FOR INSERT WITH CHECK (
    public.is_member_of(show_id) AND purchased_by_sub = public.current_sub()
  );

DROP POLICY IF EXISTS receipts_update ON public.receipts;
CREATE POLICY receipts_update ON public.receipts
  FOR UPDATE USING (public.is_dispatch(show_id) OR purchased_by_sub = public.current_sub())
  WITH CHECK (public.is_dispatch(show_id) OR purchased_by_sub = public.current_sub());

-- Receipt items: follow parent receipt
DROP POLICY IF EXISTS receipt_items_all ON public.receipt_items;
CREATE POLICY receipt_items_all ON public.receipt_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.receipts r
      WHERE r.id = receipt_id AND public.is_member_of(r.show_id)
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.receipts r
      WHERE r.id = receipt_id AND public.is_member_of(r.show_id)
    )
  );

-- Damage reports: members read; member can file
DROP POLICY IF EXISTS damage_select ON public.damage_reports;
CREATE POLICY damage_select ON public.damage_reports
  FOR SELECT USING (public.is_member_of(show_id));

DROP POLICY IF EXISTS damage_insert ON public.damage_reports;
CREATE POLICY damage_insert ON public.damage_reports
  FOR INSERT WITH CHECK (
    public.is_member_of(show_id) AND reported_by_sub = public.current_sub()
  );

-- Driver locations: driver inserts own; dispatch reads show
DROP POLICY IF EXISTS driver_loc_insert ON public.driver_locations;
CREATE POLICY driver_loc_insert ON public.driver_locations
  FOR INSERT WITH CHECK (
    driver_sub = public.current_sub()
    AND (show_id IS NULL OR public.is_member_of(show_id))
  );

DROP POLICY IF EXISTS driver_loc_select ON public.driver_locations;
CREATE POLICY driver_loc_select ON public.driver_locations
  FOR SELECT USING (
    driver_sub = public.current_sub()
    OR (show_id IS NOT NULL AND public.is_dispatch(show_id))
  );

-- Audit log: insert-only from client; no client read
DROP POLICY IF EXISTS audit_insert ON public.audit_log;
CREATE POLICY audit_insert ON public.audit_log
  FOR INSERT WITH CHECK (
    actor_sub = public.current_sub()
    AND (show_id IS NULL OR public.is_member_of(show_id))
  );

-- ─── 6. GRANTS ──────────────────────────────────────────────────────────────
-- service_role on foundation tables (from 20260546000000)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shows        TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.show_members TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipments    TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents    TO service_role;

-- service_role on new tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.receipts         TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.receipt_items    TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.damage_reports   TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.driver_locations TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_log        TO service_role;

-- service_role on other blocked foundation tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scenes           TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.set_files        TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.drivers          TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crew_contacts    TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.logistics_documents TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.logistics_document_versions TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversations    TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversation_members TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages         TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.show_invites     TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_rooms       TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_room_members TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages    TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.production_tasks TO service_role;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
