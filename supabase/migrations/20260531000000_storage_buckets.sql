-- SyncOffset Phase 3 — Storage buckets (do not execute automatically from repo)
-- Apply via: supabase db push | Supabase SQL editor

-- Private production document buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('scripts', 'scripts', false, 52428800, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']::text[]),
  ('callsheets', 'callsheets', false, 52428800, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv']::text[]),
  ('production-calendars', 'production-calendars', false, 52428800, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv']::text[]),
  ('shooting-schedules', 'shooting-schedules', false, 52428800, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv']::text[]),
  ('receipts', 'receipts', false, 26214400, ARRAY['application/pdf', 'image/jpeg', 'image/png']::text[]),
  ('purchase-orders', 'purchase-orders', false, 52428800, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']::text[]),
  ('commercial-invoices', 'commercial-invoices', false, 52428800, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png']::text[]),
  ('brokerage', 'brokerage', false, 52428800, ARRAY['application/pdf', 'image/jpeg', 'image/png']::text[]),
  ('returns', 'returns', false, 52428800, ARRAY['application/pdf', 'image/jpeg', 'image/png']::text[]),
  ('vendor-documents', 'vendor-documents', false, 52428800, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']::text[]),
  ('photos', 'photos', false, 26214400, ARRAY['image/jpeg', 'image/png', 'image/heic', 'image/tiff']::text[]),
  ('reference-media', 'reference-media', false, 104857600, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'video/mp4']::text[])
ON CONFLICT (id) DO NOTHING;

-- Authenticated users: read/write objects in production-scoped paths
CREATE POLICY "syncoffset_storage_select"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id IN (
  'scripts', 'callsheets', 'production-calendars', 'shooting-schedules',
  'receipts', 'purchase-orders', 'commercial-invoices', 'brokerage',
  'returns', 'vendor-documents', 'photos', 'reference-media'
));

CREATE POLICY "syncoffset_storage_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN (
  'scripts', 'callsheets', 'production-calendars', 'shooting-schedules',
  'receipts', 'purchase-orders', 'commercial-invoices', 'brokerage',
  'returns', 'vendor-documents', 'photos', 'reference-media'
));

CREATE POLICY "syncoffset_storage_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id IN (
  'scripts', 'callsheets', 'production-calendars', 'shooting-schedules',
  'receipts', 'purchase-orders', 'commercial-invoices', 'brokerage',
  'returns', 'vendor-documents', 'photos', 'reference-media'
));

CREATE POLICY "syncoffset_storage_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id IN (
  'scripts', 'callsheets', 'production-calendars', 'shooting-schedules',
  'receipts', 'purchase-orders', 'commercial-invoices', 'brokerage',
  'returns', 'vendor-documents', 'photos', 'reference-media'
));
