-- Phase 3D.2 — Index for Set Workspace document queries (do not execute automatically)

CREATE INDEX IF NOT EXISTS idx_documents_set ON documents (set_id);
