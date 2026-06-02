-- Phase 3B — indexes for document chain lookups (do not execute automatically)

CREATE INDEX IF NOT EXISTS idx_document_revisions_source_document
  ON document_revisions (source_document_id);

CREATE INDEX IF NOT EXISTS idx_document_revisions_document_number
  ON document_revisions (document_id, revision_number);
