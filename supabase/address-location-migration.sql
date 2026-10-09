-- Jalankan di database yang sudah memiliki schema.sql. Tidak menghapus data.
begin;
alter table public.applications add column if not exists address_street text not null default '';
alter table public.applications add column if not exists address_rt text not null default '';
alter table public.applications add column if not exists address_rw text not null default '';
alter table public.applications add column if not exists address_village text not null default '';
alter table public.applications add column if not exists address_district text not null default '';
alter table public.applications add column if not exists address_city text not null default '';
alter table public.applications add column if not exists address_province text not null default '';
alter table public.applications add column if not exists address_postal_code text not null default '';
alter table public.applications add column if not exists address_country text not null default '';

create table if not exists public.application_locations (
 user_id uuid primary key references public.applications(user_id) on delete cascade,
 maps_url text not null default '' check(length(maps_url)<=2048 and (maps_url='' or maps_url ~ '^https://(maps\.app\.goo\.gl/[^[:space:]]+|goo\.gl/maps/[^[:space:]]*|(www\.)?google\.(com|co\.id)/maps(/[^[:space:]]*|\?[^[:space:]]*)?|maps\.google\.com([/?][^[:space:]]*)?)$')),
 updated_by uuid references auth.users(id),
 updated_at timestamptz not null default now()
);
alter table public.application_locations enable row level security;
revoke all on public.application_locations from public,anon,authenticated;
grant select,insert,update on public.application_locations to authenticated;
drop policy if exists spmb_location_read on public.application_locations;
create policy spmb_location_read on public.application_locations for select to authenticated using(public.is_committee());
drop policy if exists spmb_location_insert on public.application_locations;
create policy spmb_location_insert on public.application_locations for insert to authenticated with check(public.is_committee() and updated_by=auth.uid());
drop policy if exists spmb_location_update on public.application_locations;
create policy spmb_location_update on public.application_locations for update to authenticated using(public.is_committee()) with check(public.is_committee() and updated_by=auth.uid());
create or replace function public.spmb_location_timestamp() returns trigger language plpgsql set search_path='' as $$ begin new.updated_at:=now();new.updated_by:=auth.uid();return new;end;$$;
revoke all on function public.spmb_location_timestamp() from public,anon,authenticated;
drop trigger if exists spmb_location_timestamp on public.application_locations;
create trigger spmb_location_timestamp before insert or update on public.application_locations for each row execute function public.spmb_location_timestamp();
create or replace function public.spmb_handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  d jsonb := new.raw_user_meta_data -> 'application';
begin
  -- Akun panitia dari dashboard tanpa metadata tidak membuat profil siswa.
  if d is null or d = 'null'::jsonb then return new; end if;
  if jsonb_typeof(d) <> 'object' then
    raise exception 'Metadata application harus berupa objek';
  end if;
  insert into public.applications (
    user_id, email, full_name, nisn, nik, birth_place, birth_date, gender,
    religion, phone, address, school_origin, graduation_year,
    father_name, father_job, mother_name, mother_job, parent_income, parent_phone,
    address_street, address_rt, address_rw, address_village, address_district, address_city, address_province, address_postal_code, address_country
  ) values (
    new.id, new.email, d->>'full_name', d->>'nisn', d->>'nik',
    d->>'birth_place', (d->>'birth_date')::date, d->>'gender',
    d->>'religion', d->>'phone', d->>'address', d->>'school_origin',
    (d->>'graduation_year')::integer, d->>'father_name', d->>'father_job',
    d->>'mother_name', d->>'mother_job', (d->>'parent_income')::numeric,
    d->>'parent_phone',
    coalesce(d->>'address_street',''), coalesce(d->>'address_rt',''), coalesce(d->>'address_rw',''), coalesce(d->>'address_village',''), coalesce(d->>'address_district',''), coalesce(d->>'address_city',''), coalesce(d->>'address_province',''), coalesce(d->>'address_postal_code',''), coalesce(d->>'address_country','')
  );
  -- Status/peran/nomor dari metadata pengguna sengaja tidak dipakai.
  return new;
end;
$$;

commit;
