do $$
begin
  if to_regtype('public.user_role') is null then
    create type public.user_role as enum ('admin', 'stage_responsible', 'viewer');
  else
    alter type public.user_role add value if not exists 'viewer';
  end if;
end;
$$;
