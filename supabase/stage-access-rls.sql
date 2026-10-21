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

revoke all on function public.has_stage_access(text) from public;
grant execute on function public.has_stage_access(text) to authenticated;
revoke all on function public.has_stage_read_access(text) from public;
grant execute on function public.has_stage_read_access(text) to authenticated;

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
    where profiles.id = stage_responsibilities.user_id
      and profiles.active = true
  )
);

comment on function public.has_stage_access(text) is
'Returns true only for an active admin or stage-responsible user assigned to the requested stage. Use only for write policies.';
comment on function public.has_stage_read_access(text) is
'Returns true for an active admin or an active Viewer/stage-responsible user assigned to the requested stage. Use for read policies only.';

-- Apply this policy pair to each stage-scoped table after it is created,
-- replacing <stage_scoped_table> with its actual table name:
-- alter table public.<stage_scoped_table> enable row level security;
-- create policy "Assigned stages are readable"
-- on public.<stage_scoped_table>
-- for select to authenticated
-- using (public.has_stage_read_access(stage_id));
-- create policy "Assigned stages are writable"
-- on public.<stage_scoped_table>
-- for all to authenticated
-- using (public.has_stage_access(stage_id))
-- with check (public.has_stage_access(stage_id));
