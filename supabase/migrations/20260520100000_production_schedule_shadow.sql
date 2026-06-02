-- Phase 1: server shadow stripboard archive (audit / lineage foundation).
-- Local AsyncStorage spine remains authoritative for active device UX; rows here are "local_shadow" drafts until publish exists.

create table if not exists public.production_schedule_revisions (
  id uuid primary key default gen_random_uuid(),
  show_id uuid not null references public.shows(id) on delete cascade,
  revision_name text not null,
  revision_source text not null check (
    revision_source in (
      'smart_import',
      'csv',
      'manual',
      'scriptation',
      'movie_magic',
      'unknown'
    )
  ),
  revision_scope text not null default 'local_shadow' check (
    revision_scope in ('local_shadow', 'shared_draft', 'published')
  ),
  imported_by text,
  imported_at timestamptz not null default now(),
  source_document_id uuid references public.production_documents(id) on delete set null,
  source_fingerprint text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists production_schedule_revisions_show_imported_idx
  on public.production_schedule_revisions (show_id, imported_at desc);
create index if not exists production_schedule_revisions_show_fp_idx
  on public.production_schedule_revisions (show_id, source_fingerprint);

create table if not exists public.production_schedule_days (
  id uuid primary key default gen_random_uuid(),
  revision_id uuid not null references public.production_schedule_revisions(id) on delete cascade,
  show_id uuid not null references public.shows(id) on delete cascade,
  strip_position integer not null check (strip_position >= 0),
  -- Instant for this shoot day strip (typically local calendar midnight).
  shoot_day timestamptz not null,
  day_type text,
  title text not null default '',
  notes text,
  meeting_url text,
  map_url text,
  production_document_source_id uuid references public.production_documents(id) on delete set null,
  imported_at timestamptz not null default now(),
  created_by text
);

create index if not exists production_schedule_days_revision_idx on public.production_schedule_days (revision_id);
create index if not exists production_schedule_days_show_idx on public.production_schedule_days (show_id);

create table if not exists public.production_schedule_lineage (
  id uuid primary key default gen_random_uuid(),
  parent_revision_id uuid not null references public.production_schedule_revisions(id) on delete cascade,
  child_revision_id uuid not null references public.production_schedule_revisions(id) on delete cascade,
  relationship_type text not null check (
    relationship_type in ('imported_from', 'replaced', 'merged', 'published')
  ),
  created_at timestamptz not null default now(),
  unique (parent_revision_id, child_revision_id)
);

create index if not exists production_schedule_lineage_child_idx on public.production_schedule_lineage (child_revision_id);

-- RLS: show membership (match production_documents posture).
alter table public.production_schedule_revisions enable row level security;
alter table public.production_schedule_days enable row level security;
alter table public.production_schedule_lineage enable row level security;

drop policy if exists production_schedule_revisions_sel on public.production_schedule_revisions;
create policy production_schedule_revisions_sel on public.production_schedule_revisions
  for select using ((public.is_member_of(show_id) OR public.is_dev_show(show_id)));

drop policy if exists production_schedule_revisions_ins on public.production_schedule_revisions;
create policy production_schedule_revisions_ins on public.production_schedule_revisions
  for insert with check ((public.is_member_of(show_id) OR public.is_dev_show(show_id)));

drop policy if exists production_schedule_revisions_upd on public.production_schedule_revisions;
create policy production_schedule_revisions_upd on public.production_schedule_revisions
  for update using ((public.is_member_of(show_id) OR public.is_dev_show(show_id)))
  with check ((public.is_member_of(show_id) OR public.is_dev_show(show_id)));

drop policy if exists production_schedule_revisions_del on public.production_schedule_revisions;
create policy production_schedule_revisions_del on public.production_schedule_revisions
  for delete using ((public.is_member_of(show_id) OR public.is_dev_show(show_id)));

-- Days: keyed by revision + denormalized show_id
drop policy if exists production_schedule_days_sel on public.production_schedule_days;
create policy production_schedule_days_sel on public.production_schedule_days
  for select using ((public.is_member_of(show_id) OR public.is_dev_show(show_id)));

drop policy if exists production_schedule_days_ins on public.production_schedule_days;
create policy production_schedule_days_ins on public.production_schedule_days
  for insert with check ((public.is_member_of(show_id) OR public.is_dev_show(show_id)));

drop policy if exists production_schedule_days_upd on public.production_schedule_days;
create policy production_schedule_days_upd on public.production_schedule_days
  for update using ((public.is_member_of(show_id) OR public.is_dev_show(show_id)))
  with check ((public.is_member_of(show_id) OR public.is_dev_show(show_id)));

drop policy if exists production_schedule_days_del on public.production_schedule_days;
create policy production_schedule_days_del on public.production_schedule_days
  for delete using ((public.is_member_of(show_id) OR public.is_dev_show(show_id)));

-- Lineage joins revisions (both revision rows imply same-show application responsibility)
drop policy if exists production_schedule_lineage_sel on public.production_schedule_lineage;
create policy production_schedule_lineage_sel on public.production_schedule_lineage
  for select using (
    exists (
      select 1 from public.production_schedule_revisions parent
      where parent.id = parent_revision_id and (public.is_member_of(parent.show_id) OR public.is_dev_show(parent.show_id))
    )
  );

drop policy if exists production_schedule_lineage_ins on public.production_schedule_lineage;
create policy production_schedule_lineage_ins on public.production_schedule_lineage
  for insert with check (
    exists (
      select 1 from public.production_schedule_revisions child
      where child.id = child_revision_id and (public.is_member_of(child.show_id) OR public.is_dev_show(child.show_id))
    )
  );

grant select, insert, update, delete on public.production_schedule_revisions to anon, authenticated, service_role;
grant select, insert, update, delete on public.production_schedule_days to anon, authenticated, service_role;
grant select, insert, update, delete on public.production_schedule_lineage to anon, authenticated, service_role;

notify pgrst, 'reload schema';
