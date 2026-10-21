-- Apply this migration by itself and commit it before running 20261011_02_viewer_access.sql.
-- It only adds the enum label; it does not modify rows, tables, functions, grants, or policies.
do $$
declare
  v_role_type oid;
  v_role_labels text[];
begin
  select type_row.oid
  into v_role_type
  from pg_type as type_row
  join pg_namespace as namespace_row on namespace_row.oid = type_row.typnamespace
  where namespace_row.nspname = 'public'
    and type_row.typname = 'user_role'
    and type_row.typtype = 'e';

  if v_role_type is null then
    raise exception 'Expected public.user_role enum was not found; inspect the live schema before applying this migration.';
  end if;

  select array_agg(enum_row.enumlabel order by enum_row.enumsortorder)
  into v_role_labels
  from pg_enum as enum_row
  where enum_row.enumtypid = v_role_type;

  if not (v_role_labels @> array['admin', 'stage_responsible']) then
    raise exception 'public.user_role has unexpected labels; inspect the live schema before applying this migration.';
  end if;

  if not (v_role_labels @> array['viewer']) then
    execute 'alter type public.user_role add value ''viewer''';
  end if;
end;
$$;
