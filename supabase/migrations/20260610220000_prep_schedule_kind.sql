-- Prep Schedule is a distinct document kind, not a Shooting Schedule.
-- Prevents prep uploads from entering the shooting-schedule publish chain.

ALTER TABLE public.source_documents
  DROP CONSTRAINT IF EXISTS source_documents_source_document_kind_check;

ALTER TABLE public.source_documents
  ADD CONSTRAINT source_documents_source_document_kind_check CHECK (source_document_kind IN (
    'script-revision', 'shoot-schedule', 'one-liner', 'callsheet-revision',
    'breakdown-package', 'location-package', 'crew-list', 'cast-list', 'dood',
    'vendor-document', 'permit', 'reference-media', 'prep-schedule'
  ));
