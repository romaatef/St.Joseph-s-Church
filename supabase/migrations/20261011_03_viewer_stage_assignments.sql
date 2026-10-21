-- Apply after 20261011_02_viewer_access.sql.
-- Allows admins to assign one or more stages to a Viewer; it does not change RLS policies.
begin;

do $$
begin
  if not exists (
    select 1
    from pg_type as type_row
    join pg_namespace as namespace_row on namespace_row.oid = type_row.typnamespace
    join pg_enum as enum_row on enum_row.enumtypid = type_row.oid
    where namespace_row.nspname = 'public'
      and type_row.typname = 'user_role'
      and enum_row.enumlabel = 'viewer'
  ) then
    raise exception 'Viewer role is missing; apply the Viewer role migrations first.';
  end if;

  if to_regclass('public.profiles') is null
     or to_regclass('public.stage_responsibilities') is null
     or to_regprocedure(
       'public.admin_save_profile(uuid,text,public.user_role,text[])'
     ) is null then
    raise exception 'Expected Viewer profile tables or admin_save_profile function were not found.';
  end if;
end;
$$;

create or replace function public.admin_save_profile(
  p_user_id uuid,
  p_name text,
  p_role public.user_role,
  p_stage_ids text[]
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := (select auth.uid());
  v_is_active_admin boolean;
  v_admin_count bigint;
begin
  if v_actor is null or not public.is_admin() then
    raise exception 'not_authorized' using errcode = '42501';
  end if;
  if p_name is null or length(btrim(p_name)) < 2 then
    raise exception 'invalid_name' using errcode = '22023';
  end if;
  if exists (
    select 1
    from unnest(coalesce(p_stage_ids, array[]::text[])) as requested(stage_id)
    where requested.stage_id not in (
      'had-nursery', 'kg', 'g1-g2', 'g3-g4', 'g5-g6', 'prep', 'secondary',
      'servants'
    )
  ) then
    raise exception 'invalid_stage' using errcode = '22023';
  end if;
  if p_role in ('stage_responsible', 'viewer')
     and coalesce(cardinality(p_stage_ids), 0) = 0 then
    raise exception 'stage_required' using errcode = '22023';
  end if;
  if not exists (select 1 from auth.users where id = p_user_id) then
    raise exception 'target_auth_user_not_found' using errcode = 'P0002';
  end if;

  perform pg_advisory_xact_lock(812734, 1);

  select active
  into v_is_active_admin
  from public.profiles
  where id = p_user_id and role = 'admin'
  for update;

  if v_is_active_admin and p_role <> 'admin' then
    select count(*)
    into v_admin_count
    from public.profiles
    where role = 'admin' and active = true;

    if v_admin_count <= 1 then
      raise exception 'last_active_admin' using errcode = 'P0001';
    end if;
  end if;

  insert into public.profiles (id, name, role, active)
  values (p_user_id, btrim(p_name), p_role, true)
  on conflict (id) do update
    set name = excluded.name,
        role = excluded.role;

  delete from public.stage_responsibilities
  where user_id = p_user_id;

  if p_role in ('stage_responsible', 'viewer') then
    insert into public.stage_responsibilities (user_id, stage_id)
    select p_user_id, requested.stage_id
    from unnest(p_stage_ids) as requested(stage_id);
  end if;
end;
$$;

revoke all on function public.admin_save_profile(
  uuid, text, public.user_role, text[]
) from public, anon, authenticated;
grant execute on function public.admin_save_profile(
  uuid, text, public.user_role, text[]
) to authenticated;

commit;
