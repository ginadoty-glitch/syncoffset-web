-- Phase 3D.4 — Work Orders & Transport Orders (runtime persistence for constitutional types)
-- Maps: WorkOrder (core), TransportOrder (operations) — read-only workspace integration
-- Apply manually; no seed data.

CREATE TABLE work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_id UUID NOT NULL,
  set_id UUID NOT NULL REFERENCES production_sets (id) ON DELETE CASCADE,
  asset_id UUID REFERENCES assets (id) ON DELETE SET NULL,
  work_order_number TEXT NOT NULL,
  title TEXT NOT NULL,
  assigned_to TEXT NOT NULL DEFAULT '',
  status_id TEXT NOT NULL,
  priority_id TEXT NOT NULL DEFAULT 'normal',
  required_by_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  modified_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_work_orders_set ON work_orders (set_id);
CREATE INDEX idx_work_orders_asset ON work_orders (asset_id);
CREATE INDEX idx_work_orders_production ON work_orders (production_id);

CREATE TABLE transport_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_id UUID NOT NULL,
  set_id UUID REFERENCES production_sets (id) ON DELETE SET NULL,
  asset_id UUID REFERENCES assets (id) ON DELETE SET NULL,
  ref TEXT NOT NULL,
  title TEXT NOT NULL,
  origin_label TEXT NOT NULL,
  destination_label TEXT NOT NULL,
  status TEXT NOT NULL,
  assigned_driver TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transport_orders_set ON transport_orders (set_id);
CREATE INDEX idx_transport_orders_asset ON transport_orders (asset_id);
CREATE INDEX idx_transport_orders_production ON transport_orders (production_id);

ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "work_orders_select" ON work_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "transport_orders_select" ON transport_orders FOR SELECT TO authenticated USING (true);
