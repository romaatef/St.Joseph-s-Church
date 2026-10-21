do $$
begin
  create type public.user_role as enum ('admin', 'stage_responsible', 'viewer');
exception
  when duplicate_object then null;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  role public.user_role not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists name text,
  add column if not exists active boolean not null default true;

update public.profiles as profile
set name = coalesce(
  nullif(btrim(profile.name), ''),
  nullif(btrim(auth_user.raw_user_meta_data ->> 'name'), ''),
  split_part(auth_user.email, '@', 1),
  'مستخدم'
)
from auth.users as auth_user
where auth_user.id = profile.id
  and (profile.name is null or btrim(profile.name) = '');

alter table public.profiles
  alter column name set not null,
  alter column active set default true,
  alter column active set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and confrelid = 'auth.users'::regclass
      and contype = 'f'
  ) then
    alter table public.profiles
      add constraint profiles_auth_user_fkey
      foreign key (id) references auth.users (id) on delete cascade;
  end if;

end;
$$;

alter table public.profiles
  drop constraint if exists profiles_role_allowed;
alter table public.profiles
  add constraint profiles_role_allowed
  check (role::text in ('admin', 'stage_responsible', 'viewer'));

create table if not exists public.stage_responsibilities (
  user_id uuid not null references public.profiles (id) on delete cascade,
  stage_id text not null check (
    stage_id in (
      'had-nursery',
      'kg',
      'g1-g2',
      'g3-g4',
      'g5-g6',
      'prep',
      'secondary',
      'servants'
    )
  ),
  created_at timestamptz not null default now(),
  primary key (user_id, stage_id)
);

alter table public.profiles enable row level security;
alter table public.stage_responsibilities enable row level security;

grant select, insert, update, delete
on public.profiles, public.stage_responsibilities
to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
      and active = true
  );
$$;

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

create or replace function public.has_stage_read_access(requested_stage text)
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
      and profile.role in ('viewer', 'stage_responsible')
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
revoke all on function public.has_stage_access(text) from public;
grant execute on function public.has_stage_access(text) to authenticated;
revoke all on function public.has_stage_read_access(text) from public;
grant execute on function public.has_stage_read_access(text) to authenticated;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (id = (select auth.uid()));

drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Admins can manage profiles"
on public.profiles
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Users can read their own stage assignments"
on public.stage_responsibilities;
create policy "Users can read their own stage assignments"
on public.stage_responsibilities
for select
to authenticated
using (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.profiles
    where public.profiles.id = public.stage_responsibilities.user_id
      and public.profiles.active = true
  )
);

drop policy if exists "Admins can manage stage assignments"
on public.stage_responsibilities;
create policy "Admins can manage stage assignments"
on public.stage_responsibilities
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));
