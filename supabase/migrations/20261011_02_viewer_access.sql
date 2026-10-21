-- Run only after 20261011_01_add_viewer_role.sql has committed.
-- This migration does not change or replace any RLS policies.
begin;

do $$
declare
  v_constraint_definition text;
  v_normalized_constraint text;
  v_profile_rls boolean;
  v_assignment_rls boolean;
  v_save_profile_oid oid;
  v_procedure_oid oid;
  v_procedure_source text;
  v_compact_procedure_source text;
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
    raise exception 'Viewer enum label is missing; commit 20261011_01_add_viewer_role.sql first.';
  end if;

  if to_regclass('public.profiles') is null
     or to_regclass('public.stage_responsibilities') is null then
    raise exception 'Expected profiles and stage_responsibilities tables were not found; inspect the live schema.';
  end if;

  select class_row.relrowsecurity
  into v_profile_rls
  from pg_class as class_row
  where class_row.oid = 'public.profiles'::regclass;

  select class_row.relrowsecurity
  into v_assignment_rls
  from pg_class as class_row
  where class_row.oid = 'public.stage_responsibilities'::regclass;

  if not coalesce(v_profile_rls, false) or not coalesce(v_assignment_rls, false) then
    raise exception 'RLS must remain enabled on profiles and stage_responsibilities; inspect the live schema.';
  end if;

  select pg_get_constraintdef(constraint_row.oid)
  into v_constraint_definition
  from pg_constraint as constraint_row
  where constraint_row.conrelid = 'public.profiles'::regclass
    and constraint_row.conname = 'profiles_role_allowed'
    and constraint_row.contype = 'c'
    and constraint_row.convalidated;

  if v_constraint_definition is null then
    raise exception 'Expected validated profiles_role_allowed check was not found; inspect profile role constraints.';
  end if;

  v_normalized_constraint := regexp_replace(
    lower(v_constraint_definition),
    $regex$[\s()"]$regex$,
    '',
    'g'
  );
  v_normalized_constraint := replace(v_normalized_constraint, chr(39), '');

  if v_normalized_constraint not in (
    'checkrole::text=anyarray[admin::text,stage_responsible::text]',
    'checkrole::text=anyarray[stage_responsible::text,admin::text]',
    'checkrole::text=anyarray[admin::text,stage_responsible::text,viewer::text]',
    'checkrole::text=anyarray[admin::text,viewer::text,stage_responsible::text]',
    'checkrole::text=anyarray[stage_responsible::text,admin::text,viewer::text]',
    'checkrole::text=anyarray[stage_responsible::text,viewer::text,admin::text]',
    'checkrole::text=anyarray[viewer::text,admin::text,stage_responsible::text]',
    'checkrole::text=anyarray[viewer::text,stage_responsible::text,admin::text]'
  ) then
    raise exception 'profiles_role_allowed has an unexpected definition; inspect it before changing this constraint.';
  end if;

  if not exists (
    select 1
    from pg_policies as policy_row
    where policy_row.schemaname = 'public'
      and policy_row.tablename = 'profiles'
      and policy_row.policyname = 'Users can read their own profile'
      and policy_row.cmd = 'SELECT'
      and lower(coalesce(policy_row.qual, '')) like '%auth.uid%'
  ) or not exists (
    select 1
    from pg_policies as policy_row
    where policy_row.schemaname = 'public'
      and policy_row.tablename = 'stage_responsibilities'
      and policy_row.policyname = 'Users can read their own stage assignments'
      and policy_row.cmd = 'SELECT'
      and lower(coalesce(policy_row.qual, '')) like '%auth.uid%'
  ) then
    raise exception 'Expected self-read policies were not found; inspect current RLS policies before applying this migration.';
  end if;

  if not exists (
    select 1
    from pg_policies as policy_row
    where policy_row.schemaname = 'public'
      and policy_row.tablename = 'profiles'
      and policy_row.policyname = 'Admins can manage profiles'
      and policy_row.permissive = 'PERMISSIVE'
      and policy_row.cmd = 'ALL'
      and policy_row.roles = array['authenticated']::name[]
      and lower(regexp_replace(
        regexp_replace(coalesce(policy_row.qual, ''), '[[:space:]"]', '', 'g'),
        '^[()]+|[()]+$',
        '',
        'g'
      )) in (
        'is_admin()',
        'public.is_admin()',
        'selectis_admin()asis_admin',
        'selectpublic.is_admin()asis_admin'
      )
      and lower(regexp_replace(
        regexp_replace(coalesce(policy_row.with_check, ''), '[[:space:]"]', '', 'g'),
        '^[()]+|[()]+$',
        '',
        'g'
      )) in (
        'is_admin()',
        'public.is_admin()',
        'selectis_admin()asis_admin',
        'selectpublic.is_admin()asis_admin'
      )
  ) or not exists (
    select 1
    from pg_policies as policy_row
    where policy_row.schemaname = 'public'
      and policy_row.tablename = 'stage_responsibilities'
      and policy_row.policyname = 'Admins can manage stage assignments'
      and policy_row.permissive = 'PERMISSIVE'
      and policy_row.cmd = 'ALL'
      and policy_row.roles = array['authenticated']::name[]
      and lower(regexp_replace(
        regexp_replace(coalesce(policy_row.qual, ''), '[[:space:]"]', '', 'g'),
        '^[()]+|[()]+$',
        '',
        'g'
      )) in (
        'is_admin()',
        'public.is_admin()',
        'selectis_admin()asis_admin',
        'selectpublic.is_admin()asis_admin'
      )
      and lower(regexp_replace(
        regexp_replace(coalesce(policy_row.with_check, ''), '[[:space:]"]', '', 'g'),
        '^[()]+|[()]+$',
        '',
        'g'
      )) in (
        'is_admin()',
        'public.is_admin()',
        'selectis_admin()asis_admin',
        'selectpublic.is_admin()asis_admin'
      )
  ) then
    raise exception 'Expected admin-only write policies were not found; inspect current RLS policies before applying this migration.';
  end if;

  if exists (
    select 1
    from pg_policies as policy_row
    where policy_row.schemaname = 'public'
      and policy_row.tablename = 'profiles'
      and policy_row.cmd <> 'SELECT'
      and policy_row.policyname <> 'Admins can manage profiles'
  ) or exists (
    select 1
    from pg_policies as policy_row
    where policy_row.schemaname = 'public'
      and policy_row.tablename = 'stage_responsibilities'
      and policy_row.cmd <> 'SELECT'
      and policy_row.policyname <> 'Admins can manage stage assignments'
  ) then
    raise exception 'Unexpected write policy found; inspect all policies before applying this migration.';
  end if;

  if exists (
    select 1
    from pg_class as class_row
    join pg_namespace as namespace_row on namespace_row.oid = class_row.relnamespace
    where namespace_row.nspname = 'public'
      and class_row.relkind in ('r', 'p', 'v', 'm', 'f')
      and class_row.relname not in ('profiles', 'stage_responsibilities')
      and (
        has_table_privilege('authenticated', class_row.oid, 'INSERT')
        or has_table_privilege('authenticated', class_row.oid, 'UPDATE')
        or has_table_privilege('authenticated', class_row.oid, 'DELETE')
      )
  ) then
    raise exception 'Authenticated users have write grants on additional public tables; inspect their RLS policies before applying this migration.';
  end if;

  v_procedure_oid := to_regprocedure('public.is_admin()');
  select proc_row.prosrc
  into v_procedure_source
  from pg_proc as proc_row
  where proc_row.oid = v_procedure_oid
    and proc_row.prosecdef;
  if v_procedure_source is null
     or position('role' in lower(v_procedure_source)) = 0
     or position('admin' in lower(v_procedure_source)) = 0
     or position('active' in lower(v_procedure_source)) = 0
     or position('auth.uid' in lower(v_procedure_source)) = 0
     or position('viewer' in lower(v_procedure_source)) > 0 then
    raise exception 'is_admin does not match the expected active-admin-only check; inspect it before applying this migration.';
  end if;

  v_procedure_oid := to_regprocedure('public.has_stage_access(text)');
  select proc_row.prosrc
  into v_procedure_source
  from pg_proc as proc_row
  where proc_row.oid = v_procedure_oid
    and proc_row.prosecdef
    and proc_row.provolatile = 's'
    and proc_row.prolang = (
      select language_row.oid
      from pg_language as language_row
      where language_row.lanname = 'sql'
    )
    and coalesce(proc_row.proconfig, array[]::text[]) @> array['search_path=""'];
  v_compact_procedure_source := regexp_replace(
    lower(coalesce(v_procedure_source, '')),
    '[[:space:]]',
    '',
    'g'
  );
  if v_procedure_source is null then
    raise exception 'has_stage_access is missing or does not have the expected SQL SECURITY DEFINER, STABLE, and fixed search_path properties.';
  end if;

  v_compact_procedure_source := regexp_replace(
    v_compact_procedure_source,
    ';+$',
    ''
  );
  if v_compact_procedure_source not in (
    'selectpublic.is_admin()orexists(select1frompublic.stage_responsibilitieswhereuser_id=(selectauth.uid())andstage_id=requested_stage)',
    'selectpublic.is_admin()orexists(select1frompublic.stage_responsibilitiesasassignmentjoinpublic.profilesasprofileonprofile.id=assignment.user_idwhereassignment.user_id=(selectauth.uid())andassignment.stage_id=requested_stageandprofile.active=trueandprofile.role=''stage_responsible'')'
  ) then
    raise exception 'has_stage_access has an unexpected definition; inspect it before replacing the known legacy or stage-responsible-only implementation.';
  end if;

  v_save_profile_oid := to_regprocedure(
    'public.admin_save_profile(uuid,text,public.user_role,text[])'
  );
  if v_save_profile_oid is null then
    raise exception 'Expected admin_save_profile function was not found; inspect live function signatures.';
  end if;

  v_procedure_oid := to_regprocedure(
    'public.admin_set_profile_active(uuid,boolean)'
  );
  if v_procedure_oid is null then
    raise exception 'Expected admin_set_profile_active function was not found; inspect live function signatures.';
  end if;
end;
$$;

-- Replace the known legacy helper with an active stage-responsible-only write check.
create or replace function public.has_stage_access(requested_stage text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_admin() or exists (
    select 1
    from public.stage_responsibilities as assignment
    join public.profiles as profile on profile.id = assignment.user_id
    where assignment.user_id = (select auth.uid())
      and assignment.stage_id = requested_stage
      and profile.active = true
      and profile.role = 'stage_responsible'
  );
$$;

do $$
declare
  v_constraint_definition text;
  v_normalized_constraint text;
begin
  select pg_get_constraintdef(constraint_row.oid)
  into v_constraint_definition
  from pg_constraint as constraint_row
  where constraint_row.conrelid = 'public.profiles'::regclass
    and constraint_row.conname = 'profiles_role_allowed'
    and constraint_row.contype = 'c'
    and constraint_row.convalidated;

  v_normalized_constraint := regexp_replace(
    lower(v_constraint_definition),
    $regex$[\s()"]$regex$,
    '',
    'g'
  );
  v_normalized_constraint := replace(v_normalized_constraint, chr(39), '');

  if v_normalized_constraint in (
    'checkrole::text=anyarray[admin::text,stage_responsible::text]',
    'checkrole::text=anyarray[stage_responsible::text,admin::text]'
  ) then
    alter table public.profiles drop constraint profiles_role_allowed;
    alter table public.profiles
      add constraint profiles_role_allowed
      check (role::text in ('admin', 'stage_responsible', 'viewer'));
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
      'had-nursery', 'kg', 'g1-g2', 'g3-g4', 'g5-g6', 'prep', 'secondary'
    )
  ) then
    raise exception 'invalid_stage' using errcode = '22023';
  end if;
  if p_role = 'stage_responsible'
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

  if p_role = 'stage_responsible' then
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

create or replace function public.admin_set_profile_active(
  p_user_id uuid,
  p_active boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := (select auth.uid());
  v_target public.profiles%rowtype;
  v_admin_count bigint;
begin
  if v_actor is null or not public.is_admin() then
    raise exception 'not_authorized' using errcode = '42501';
  end if;
  if p_active is null then
    raise exception 'invalid_active' using errcode = '22023';
  end if;

  perform pg_advisory_xact_lock(812734, 1);

  select *
  into v_target
  from public.profiles
  where id = p_user_id
  for update;

  if not found then
    raise exception 'target_profile_not_found' using errcode = 'P0002';
  end if;

  if v_target.role = 'admin' and v_target.active and not p_active then
    select count(*)
    into v_admin_count
    from public.profiles
    where role = 'admin' and active = true;

    if v_admin_count <= 1 then
      raise exception 'last_active_admin' using errcode = 'P0001';
    end if;
  end if;

  update public.profiles
  set active = p_active
  where id = p_user_id;
end;
$$;

revoke all on function public.admin_set_profile_active(
  uuid, boolean
) from public, anon, authenticated;
grant execute on function public.admin_set_profile_active(
  uuid, boolean
) to authenticated;

commit;
