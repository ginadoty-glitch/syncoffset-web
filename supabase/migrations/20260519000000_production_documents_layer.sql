-- Production document hub: immutable uploaded sources + overlays (annotations,
-- extracted text/pages, import batches). Application contract: never overwrite
-- production_documents.storage_path in place; exports go under a separate path.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. production_documents
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.production_documents (
  id uuid primary key default gen_random_uuid(),
  show_id uuid not null references public.shows(id) on delete cascade,
  title text not null,
  source_file_name text not null,
  file_type text not null
    check (file_type in ('pdf', 'csv', 'xlsx', 'numbers', 'txt', 'other')),
  source_kind text not null default 'other'
    check (
      source_kind in (
        'script',
        'breakdown',
        'budget',
        'buy_list',
        'check_request',
        'petty_cash',
        'receipt',
        'vendor_list',
        'crew_list',
        'other'
      )
    ),
  storage_path text,
  text_extract_status text not null default 'pending'
    check (text_extract_status in ('pending', 'extracted', 'needs_ocr', 'failed')),
  is_read_only boolean not null default false,
  page_count integer,
  row_count integer,
  created_by_sub text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists production_documents_show_idx on public.production_documents(show_id);
create index if not exists production_documents_show_kind_idx on public.production_documents(show_id, source_kind);

drop trigger if exists production_documents_touch_updated on public.production_documents;
create trigger production_documents_touch_updated
  before update on public.production_documents
  for each row execute function public.touch_budget_row_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. production_document_pages
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.production_document_pages (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.production_documents(id) on delete cascade,
  page_number integer not null check (page_number >= 1),
  raw_text text,
  image_path text,
  width numeric,
  height numeric,
  unique(document_id, page_number)
);

create index if not exists production_document_pages_document_idx
  on public.production_document_pages(document_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. production_document_annotations
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.production_document_annotations (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.production_documents(id) on delete cascade,
  page_id uuid references public.production_document_pages(id) on delete set null,
  page_number integer not null default 1 check (page_number >= 1),
  layer_name text not null default 'default',
  department text,
  annotation_type text not null
    check (
      annotation_type in ('highlight', 'note', 'drawing', 'tag', 'box', 'strike', 'text')
    ),
  rect_json jsonb,
  points_json jsonb,
  color text,
  text text,
  linked_record_type text,
  linked_record_id uuid,
  created_by_sub text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists production_document_annotations_document_idx
  on public.production_document_annotations(document_id);
create index if not exists production_document_annotations_page_idx
  on public.production_document_annotations(page_id);

drop trigger if exists production_document_annotations_touch_updated
  on public.production_document_annotations;
create trigger production_document_annotations_touch_updated
  before update on public.production_document_annotations
  for each row execute function public.touch_budget_row_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. production_import_batches
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.production_import_batches (
  id uuid primary key default gen_random_uuid(),
  show_id uuid not null references public.shows(id) on delete cascade,
  document_id uuid not null references public.production_documents(id) on delete cascade,
  import_type text not null
    check (
      import_type in (
        'csv',
        'xlsx',
        'pdf_breakdown',
        'script',
        'buy_list',
        'budget',
        'crew',
        'vendor'
      )
    ),
  status text not null default 'draft'
    check (status in ('draft', 'mapped', 'imported', 'failed')),
  detected_columns jsonb not null default '[]'::jsonb,
  column_mapping jsonb not null default '{}'::jsonb,
  error_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists production_import_batches_show_idx on public.production_import_batches(show_id);
create index if not exists production_import_batches_document_idx on public.production_import_batches(document_id);

drop trigger if exists production_import_batches_touch_updated on public.production_import_batches;
create trigger production_import_batches_touch_updated
  before update on public.production_import_batches
  for each row execute function public.touch_budget_row_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. production_import_rows
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.production_import_rows (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.production_import_batches(id) on delete cascade,
  row_index integer not null check (row_index >= 0),
  raw_json jsonb not null,
  mapped_json jsonb,
  status text not null default 'draft'
    check (status in ('draft', 'valid', 'error', 'imported', 'skipped')),
  error_message text,
  unique(batch_id, row_index)
);

create index if not exists production_import_rows_batch_idx on public.production_import_rows(batch_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS (new tables only). Policies allow active membership or explicit dev-show access
-- via public.is_dev_show (see 20260518120000_restore_is_member_of.sql).
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.production_documents enable row level security;
alter table public.production_document_pages enable row level security;
alter table public.production_document_annotations enable row level security;
alter table public.production_import_batches enable row level security;
alter table public.production_import_rows enable row level security;

-- production_documents
drop policy if exists production_documents_sel on public.production_documents;
create policy production_documents_sel on public.production_documents
  for select using ((public.is_member_of(show_id) OR public.is_dev_show(show_id)));

drop policy if exists production_documents_ins on public.production_documents;
create policy production_documents_ins on public.production_documents
  for insert with check ((public.is_member_of(show_id) OR public.is_dev_show(show_id)));

drop policy if exists production_documents_upd on public.production_documents;
create policy production_documents_upd on public.production_documents
  for update using ((public.is_member_of(show_id) OR public.is_dev_show(show_id))) with check ((public.is_member_of(show_id) OR public.is_dev_show(show_id)));

drop policy if exists production_documents_del on public.production_documents;
create policy production_documents_del on public.production_documents
  for delete using ((public.is_member_of(show_id) OR public.is_dev_show(show_id)));

-- production_document_pages
drop policy if exists production_document_pages_sel on public.production_document_pages;
create policy production_document_pages_sel on public.production_document_pages
  for select using (
    exists (
      select 1 from public.production_documents d
      where d.id = production_document_pages.document_id and (public.is_member_of(d.show_id) OR public.is_dev_show(d.show_id))
    )
  );

drop policy if exists production_document_pages_ins on public.production_document_pages;
create policy production_document_pages_ins on public.production_document_pages
  for insert with check (
    exists (
      select 1 from public.production_documents d
      where d.id = document_id and (public.is_member_of(d.show_id) OR public.is_dev_show(d.show_id))
    )
  );

drop policy if exists production_document_pages_upd on public.production_document_pages;
create policy production_document_pages_upd on public.production_document_pages
  for update using (
    exists (
      select 1 from public.production_documents d
      where d.id = production_document_pages.document_id and (public.is_member_of(d.show_id) OR public.is_dev_show(d.show_id))
    )
  )
  with check (
    exists (
      select 1 from public.production_documents d
      where d.id = document_id and (public.is_member_of(d.show_id) OR public.is_dev_show(d.show_id))
    )
  );

drop policy if exists production_document_pages_del on public.production_document_pages;
create policy production_document_pages_del on public.production_document_pages
  for delete using (
    exists (
      select 1 from public.production_documents d
      where d.id = production_document_pages.document_id and (public.is_member_of(d.show_id) OR public.is_dev_show(d.show_id))
    )
  );

-- production_document_annotations
drop policy if exists production_document_annotations_sel on public.production_document_annotations;
create policy production_document_annotations_sel on public.production_document_annotations
  for select using (
    exists (
      select 1 from public.production_documents d
      where d.id = production_document_annotations.document_id and (public.is_member_of(d.show_id) OR public.is_dev_show(d.show_id))
    )
  );

drop policy if exists production_document_annotations_ins on public.production_document_annotations;
create policy production_document_annotations_ins on public.production_document_annotations
  for insert with check (
    exists (
      select 1 from public.production_documents d
      where d.id = document_id and (public.is_member_of(d.show_id) OR public.is_dev_show(d.show_id))
    )
  );

drop policy if exists production_document_annotations_upd on public.production_document_annotations;
create policy production_document_annotations_upd on public.production_document_annotations
  for update using (
    exists (
      select 1 from public.production_documents d
      where d.id = production_document_annotations.document_id and (public.is_member_of(d.show_id) OR public.is_dev_show(d.show_id))
    )
  )
  with check (
    exists (
      select 1 from public.production_documents d
      where d.id = document_id and (public.is_member_of(d.show_id) OR public.is_dev_show(d.show_id))
    )
  );

drop policy if exists production_document_annotations_del on public.production_document_annotations;
create policy production_document_annotations_del on public.production_document_annotations
  for delete using (
    exists (
      select 1 from public.production_documents d
      where d.id = production_document_annotations.document_id and (public.is_member_of(d.show_id) OR public.is_dev_show(d.show_id))
    )
  );

-- production_import_batches
drop policy if exists production_import_batches_sel on public.production_import_batches;
create policy production_import_batches_sel on public.production_import_batches
  for select using ((public.is_member_of(show_id) OR public.is_dev_show(show_id)));

drop policy if exists production_import_batches_ins on public.production_import_batches;
create policy production_import_batches_ins on public.production_import_batches
  for insert with check ((public.is_member_of(show_id) OR public.is_dev_show(show_id)));

drop policy if exists production_import_batches_upd on public.production_import_batches;
create policy production_import_batches_upd on public.production_import_batches
  for update using ((public.is_member_of(show_id) OR public.is_dev_show(show_id))) with check ((public.is_member_of(show_id) OR public.is_dev_show(show_id)));

drop policy if exists production_import_batches_del on public.production_import_batches;
create policy production_import_batches_del on public.production_import_batches
  for delete using ((public.is_member_of(show_id) OR public.is_dev_show(show_id)));

-- production_import_rows
drop policy if exists production_import_rows_sel on public.production_import_rows;
create policy production_import_rows_sel on public.production_import_rows
  for select using (
    exists (
      select 1 from public.production_import_batches b
      where b.id = production_import_rows.batch_id and (public.is_member_of(b.show_id) OR public.is_dev_show(b.show_id))
    )
  );

drop policy if exists production_import_rows_ins on public.production_import_rows;
create policy production_import_rows_ins on public.production_import_rows
  for insert with check (
    exists (
      select 1 from public.production_import_batches b
      where b.id = batch_id and (public.is_member_of(b.show_id) OR public.is_dev_show(b.show_id))
    )
  );

drop policy if exists production_import_rows_upd on public.production_import_rows;
create policy production_import_rows_upd on public.production_import_rows
  for update using (
    exists (
      select 1 from public.production_import_batches b
      where b.id = production_import_rows.batch_id and (public.is_member_of(b.show_id) OR public.is_dev_show(b.show_id))
    )
  )
  with check (
    exists (
      select 1 from public.production_import_batches b
      where b.id = batch_id and (public.is_member_of(b.show_id) OR public.is_dev_show(b.show_id))
    )
  );

drop policy if exists production_import_rows_del on public.production_import_rows;
create policy production_import_rows_del on public.production_import_rows
  for delete using (
    exists (
      select 1 from public.production_import_batches b
      where b.id = production_import_rows.batch_id and (public.is_member_of(b.show_id) OR public.is_dev_show(b.show_id))
    )
  );

-- Grants
grant select, insert, update, delete on public.production_documents to anon, authenticated, service_role;
grant select, insert, update, delete on public.production_document_pages to anon, authenticated, service_role;
grant select, insert, update, delete on public.production_document_annotations to anon, authenticated, service_role;
grant select, insert, update, delete on public.production_import_batches to anon, authenticated, service_role;
grant select, insert, update, delete on public.production_import_rows to anon, authenticated, service_role;

notify pgrst, 'reload schema';
