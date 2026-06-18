-- Apply once in Supabase SQL editor if shipment desk writes return 42501.
-- Also shipped as supabase/migrations/20260617000000_shipments_desk_grants_and_log_rpc.sql

grant select, insert, update, delete on public.shipments to service_role;

create or replace function public.log_shipment_for_desk(
  p_show_id uuid,
  p_runsheet_id uuid,
  p_direction text,
  p_origin text,
  p_destination text,
  p_carrier text,
  p_tracking_number text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_show_id is null then
    raise exception 'show_id is required' using errcode = '22023';
  end if;
  if p_direction is null or p_direction not in ('inbound', 'outbound') then
    raise exception 'direction must be inbound or outbound' using errcode = '22023';
  end if;
  if coalesce(btrim(p_origin), '') = '' and coalesce(btrim(p_tracking_number), '') = '' then
    raise exception 'origin or tracking_number is required' using errcode = '22023';
  end if;
  if coalesce(btrim(p_destination), '') = '' then
    raise exception 'destination is required' using errcode = '22023';
  end if;

  insert into public.shipments (
    show_id, runsheet_id, direction, origin, destination, status, carrier, tracking_number
  ) values (
    p_show_id,
    p_runsheet_id,
    p_direction,
    coalesce(nullif(btrim(p_origin), ''), btrim(p_tracking_number)),
    btrim(p_destination),
    'preparing',
    nullif(btrim(coalesce(p_carrier, '')), ''),
    nullif(btrim(coalesce(p_tracking_number, '')), '')
  )
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.log_shipment_for_desk(uuid, uuid, text, text, text, text, text) to service_role;
notify pgrst, 'reload schema';
