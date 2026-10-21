do $$
declare
  v_admin_email text := 'REPLACE_WITH_EXISTING_AUTH_USER_EMAIL';
  v_user_id uuid;
  v_name text;
begin
  select
    auth_user.id,
    coalesce(
      nullif(btrim(auth_user.raw_user_meta_data ->> 'name'), ''),
      split_part(auth_user.email, '@', 1),
      'Admin'
    )
  into v_user_id, v_name
  from auth.users as auth_user
  where lower(auth_user.email) = lower(v_admin_email);

  if not found then
    raise exception 'No Supabase Auth user found for email %', v_admin_email;
  end if;

  insert into public.profiles (id, name, role, active)
  values (v_user_id, v_name, 'admin', true)
  on conflict (id) do update
    set name = case
          when btrim(public.profiles.name) = '' then excluded.name
          else public.profiles.name
        end,
        role = 'admin',
        active = true;

  delete from public.stage_responsibilities
  where user_id = v_user_id;
end;
$$;
