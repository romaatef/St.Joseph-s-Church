alter table public.stage_whatsapp_contacts
  drop constraint if exists stage_whatsapp_contacts_pkey;

alter table public.stage_whatsapp_contacts
  add constraint stage_whatsapp_contacts_pkey
  primary key (stage_id, whatsapp_phone);