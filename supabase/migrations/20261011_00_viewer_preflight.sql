-- Read-only inspection for Viewer migration planning. This file contains SELECT statements only.
select
  namespace_row.nspname as schema_name,
  type_row.typname as type_name,
  array_agg(enum_row.enumlabel order by enum_row.enumsortorder) as role_labels
from pg_type as type_row
join pg_namespace as namespace_row on namespace_row.oid = type_row.typnamespace
join pg_enum as enum_row on enum_row.enumtypid = type_row.oid
where namespace_row.nspname = 'public'
  and type_row.typname = 'user_role'
group by namespace_row.nspname, type_row.typname;

select
  class_row.relname as table_name,
  class_row.relrowsecurity as rls_enabled,
  class_row.relforcerowsecurity as rls_forced
from pg_class as class_row
join pg_namespace as namespace_row on namespace_row.oid = class_row.relnamespace
where namespace_row.nspname = 'public'
  and class_row.relname in ('profiles', 'stage_responsibilities');

select
  constraint_row.conrelid::regclass as table_name,
  constraint_row.conname as constraint_name,
  constraint_row.convalidated as validated,
  pg_get_constraintdef(constraint_row.oid) as definition
from pg_constraint as constraint_row
where constraint_row.conrelid in (
  to_regclass('public.profiles'),
  to_regclass('public.stage_responsibilities')
)
order by table_name, constraint_name;

select
  policy.schemaname,
  policy.tablename,
  policy.policyname,
  policy.permissive,
  policy.roles,
  policy.cmd,
  policy.qual,
  policy.with_check
from pg_policies as policy
where policy.schemaname = 'public'
  and policy.tablename in ('profiles', 'stage_responsibilities')
order by policy.tablename, policy.policyname;

select
  class_row.relname as table_name,
  has_table_privilege('authenticated', class_row.oid, 'SELECT') as authenticated_can_select,
  has_table_privilege('authenticated', class_row.oid, 'INSERT') as authenticated_can_insert,
  has_table_privilege('authenticated', class_row.oid, 'UPDATE') as authenticated_can_update,
  has_table_privilege('authenticated', class_row.oid, 'DELETE') as authenticated_can_delete
from pg_class as class_row
join pg_namespace as namespace_row on namespace_row.oid = class_row.relnamespace
where namespace_row.nspname = 'public'
  and class_row.relkind in ('r', 'p', 'v', 'm', 'f')
order by class_row.relname;

select
  procedure_row.oid::regprocedure as function_signature,
  procedure_row.prosecdef as security_definer,
  procedure_row.proconfig as function_settings,
  procedure_row.proacl as function_acl,
  has_function_privilege('authenticated', procedure_row.oid, 'EXECUTE') as authenticated_can_execute,
  has_function_privilege('anon', procedure_row.oid, 'EXECUTE') as anon_can_execute,
  procedure_row.prosrc as function_definition
from pg_proc as procedure_row
join pg_namespace as namespace_row on namespace_row.oid = procedure_row.pronamespace
where namespace_row.nspname = 'public'
  and procedure_row.proname in (
    'is_admin',
    'has_stage_access',
    'has_stage_read_access',
    'admin_save_profile',
    'admin_set_profile_active'
  )
order by procedure_row.proname, procedure_row.oid::regprocedure::text;
