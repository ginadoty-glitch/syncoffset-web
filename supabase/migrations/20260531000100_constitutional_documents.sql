-- SyncOffset Phase 3 — Constitutional document tables
-- Maps: ImmutableSourceDocument, DocumentRevision, Document (src/types/core)
-- Field mapping: docs/DOCUMENT_TABLE_MAPPING.md

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- PART 5 — Ingestion pipeline status (column on source_documents, not a separate authority)
CREATE TYPE ingestion_status AS ENUM (
  'uploaded',
  'processing',
  'review',
  'approved',
  'rejected',
  'failed'
);

-- ─── source_documents (ImmutableSourceDocument + AuditableCoreObject) ─────────

CREATE TABLE source_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_id UUID NOT NULL,
  kind TEXT NOT NULL DEFAULT 'source-document' CHECK (kind = 'source-document'),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'issued', 'superseded', 'archived')),
  ingestion_status ingestion_status NOT NULL DEFAULT 'uploaded',
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  modified_by TEXT NOT NULL,
  modified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_document_id UUID REFERENCES source_documents (id),
  source_version_id UUID,
  relationships JSONB NOT NULL DEFAULT '[]'::jsonb,
  source_document_kind TEXT NOT NULL CHECK (source_document_kind IN (
    'script-revision', 'shoot-schedule', 'one-liner', 'callsheet-revision',
    'breakdown-package', 'location-package', 'crew-list', 'cast-list', 'dood',
    'vendor-document', 'permit', 'reference-media'
  )),
  immutable JSONB NOT NULL,
  source_file JSONB NOT NULL,
  version_chain JSONB NOT NULL DEFAULT '[]'::jsonb,
  supersession JSONB NOT NULL DEFAULT '{}'::jsonb,
  ingestion JSONB NOT NULL
);

CREATE INDEX idx_source_documents_production ON source_documents (production_id);
CREATE INDEX idx_source_documents_ingestion_status ON source_documents (ingestion_status);
CREATE INDEX idx_source_documents_kind ON source_documents (source_document_kind);
CREATE INDEX idx_source_documents_uploaded_at ON source_documents ((immutable->>'uploadedAt'));

-- ─── documents (Document + AuditableCoreObject) ───────────────────────────────

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_id UUID NOT NULL,
  kind TEXT NOT NULL DEFAULT 'document' CHECK (kind = 'document'),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'issued', 'superseded', 'archived', 'cancelled')),
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  modified_by TEXT NOT NULL,
  modified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_document_id UUID REFERENCES source_documents (id),
  source_version_id UUID,
  relationships JSONB NOT NULL DEFAULT '[]'::jsonb,
  document_number TEXT NOT NULL,
  title TEXT NOT NULL,
  category_id TEXT NOT NULL,
  status_id TEXT NOT NULL CHECK (status_id IN ('draft', 'review', 'approved', 'issued', 'superseded', 'archived')),
  notes TEXT NOT NULL DEFAULT '',
  set_id UUID,
  set_number TEXT,
  scene_id UUID,
  document_revision_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  document_package_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  document_link_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  generated_output_ids JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX idx_documents_production ON documents (production_id);
CREATE INDEX idx_documents_source_document ON documents (source_document_id);

-- ─── document_revisions (DocumentRevision + AuditableCoreObject) ──────────────

CREATE TABLE document_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_id UUID NOT NULL,
  kind TEXT NOT NULL DEFAULT 'document-revision' CHECK (kind = 'document-revision'),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'issued', 'superseded', 'archived', 'cancelled')),
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  modified_by TEXT NOT NULL,
  modified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_document_id UUID REFERENCES source_documents (id),
  source_version_id UUID,
  relationships JSONB NOT NULL DEFAULT '[]'::jsonb,
  document_id UUID NOT NULL REFERENCES documents (id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  revision_color TEXT CHECK (revision_color IS NULL OR revision_color IN (
    'white', 'blue', 'pink', 'yellow', 'green', 'goldenrod', 'buff',
    'salmon', 'cherry', 'tan', 'gray', 'ivory', 'double-white'
  )),
  revision_recorded_at TIMESTAMPTZ NOT NULL,
  revision_recorded_by TEXT NOT NULL
);

CREATE INDEX idx_document_revisions_document ON document_revisions (document_id);
CREATE UNIQUE INDEX idx_document_revisions_number ON document_revisions (document_id, revision_number);

-- ─── RLS (authenticated; service role bypasses) ───────────────────────────────

ALTER TABLE source_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "source_documents_select" ON source_documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "source_documents_insert" ON source_documents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "source_documents_update" ON source_documents FOR UPDATE TO authenticated USING (true);

CREATE POLICY "documents_select" ON documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "documents_insert" ON documents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "documents_update" ON documents FOR UPDATE TO authenticated USING (true);

CREATE POLICY "document_revisions_select" ON document_revisions FOR SELECT TO authenticated USING (true);
CREATE POLICY "document_revisions_insert" ON document_revisions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "document_revisions_update" ON document_revisions FOR UPDATE TO authenticated USING (true);
