create table if not exists public.stage_whatsapp_contacts (
  stage_id text primary key check (
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
  whatsapp_phone text not null check (whatsapp_phone ~ '^[1-9][0-9]{7,14}$'),
  updated_at timestamptz not null default now()
);

alter table public.stage_whatsapp_contacts enable row level security;

grant select, insert, update, delete
on public.stage_whatsapp_contacts
to authenticated;

drop policy if exists "Admins can manage stage WhatsApp contacts"
on public.stage_whatsapp_contacts;
create policy "Admins can manage stage WhatsApp contacts"
on public.stage_whatsapp_contacts
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));
 