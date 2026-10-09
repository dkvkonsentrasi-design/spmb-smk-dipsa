-- Jalankan SEKALI melalui Supabase SQL Editor sebagai postgres.
-- Semua perubahan dalam transaksi; tidak menghapus tabel/data/trigger lama.
begin;

create sequence public.spmb_registration_seq;
create table public.committee_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table public.applications (
  user_id uuid primary key references auth.users(id) on delete cascade,
  registration_number text not null unique default
    ('DIPSA-' || to_char(now() at time zone 'Asia/Jakarta', 'YYYY') || '-' ||
     lpad(nextval('public.spmb_registration_seq')::text, 8, '0')),
  email text not null,
  full_name text not null check (length(trim(full_name)) between 1 and 200),
  nisn text not null unique check (nisn ~ '^[0-9]{10}$'),
  nik text not null unique check (nik ~ '^[0-9]{16}$'),
  birth_place text not null check (length(trim(birth_place)) between 1 and 200),
  birth_date date not null check (birth_date <= current_date),
  gender text not null check (gender in ('Laki-laki','Perempuan')),
  religion text not null check (length(trim(religion)) between 1 and 200),
  phone text not null check (length(trim(phone)) between 1 and 200),
  address text not null check (length(trim(address)) between 1 and 1000),
  school_origin text not null check (length(trim(school_origin)) between 1 and 200),
  graduation_year integer not null check (graduation_year between 1900 and 2100),
  father_name text not null check (length(trim(father_name)) between 1 and 200),
  father_job text not null check (length(trim(father_job)) between 1 and 200),
  mother_name text not null check (length(trim(mother_name)) between 1 and 200),
  mother_job text not null check (length(trim(mother_job)) between 1 and 200),
  parent_income numeric(14,2) not null check (parent_income between 0 and 999999999999),
  parent_phone text not null check (length(trim(parent_phone)) between 1 and 200),
  major text check (major in ('Teknik Sepeda Motor','Desain Komunikasi Visual','Manajemen Perkantoran')),
  status text not null default 'draft' check (status in ('draft','submitted','verified','accepted','rejected')),
  decision_note text not null default '' check (length(decision_note) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  submitted_at timestamptz,
  check (status = 'draft' or major is not null)
);
create index spmb_applications_created on public.applications(created_at desc);

alter table public.committee_members enable row level security;
alter table public.applications enable row level security;
revoke all on public.committee_members from public, anon, authenticated;
revoke all on public.applications from public, anon, authenticated;
revoke all on sequence public.spmb_registration_seq from public, anon, authenticated;
grant select, update on public.applications to authenticated;

create function public.is_committee()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists(select 1 from public.committee_members where user_id = auth.uid());
$$;
revoke all on function public.is_committee() from public, anon;
grant execute on function public.is_committee() to authenticated;

create policy spmb_read on public.applications for select to authenticated
using (user_id = (select auth.uid()) or (select public.is_committee()));
create policy spmb_update on public.applications for update to authenticated
using ((user_id = (select auth.uid()) and status = 'draft') or (select public.is_committee()))
with check ((user_id = (select auth.uid()) and status in ('draft','submitted')) or (select public.is_committee()));

create function public.spmb_guard_application()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if new.user_id is distinct from old.user_id
     or new.registration_number is distinct from old.registration_number
     or new.email is distinct from old.email
     or new.created_at is distinct from old.created_at then
    raise exception 'Identitas akun dan nomor pendaftaran tidak dapat diubah';
  end if;
  if not public.is_committee() then
    if auth.uid() is distinct from old.user_id or old.status <> 'draft' then
      raise exception 'Data hanya dapat diubah oleh pemilik selama masih draf';
    end if;
    if new.status not in ('draft','submitted')
       or new.decision_note is distinct from old.decision_note then
      raise exception 'Keputusan seleksi hanya dapat diubah panitia';
    end if;
  end if;
  new.updated_at := now();
  -- Tanggal pengajuan dikelola server dan tidak boleh dikirim ulang oleh siswa.
  new.submitted_at := old.submitted_at;
  if new.status <> 'draft' and old.submitted_at is null then
    new.submitted_at := now();
  end if;
  return new;
end;
$$;
revoke all on function public.spmb_guard_application() from public, anon, authenticated;
create trigger spmb_guard_application before update on public.applications
for each row execute function public.spmb_guard_application();

create function public.spmb_handle_new_user()
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
    father_name, father_job, mother_name, mother_job, parent_income, parent_phone
  ) values (
    new.id, new.email, d->>'full_name', d->>'nisn', d->>'nik',
    d->>'birth_place', (d->>'birth_date')::date, d->>'gender',
    d->>'religion', d->>'phone', d->>'address', d->>'school_origin',
    (d->>'graduation_year')::integer, d->>'father_name', d->>'father_job',
    d->>'mother_name', d->>'mother_job', (d->>'parent_income')::numeric,
    d->>'parent_phone'
  );
  -- Status/peran/nomor dari metadata pengguna sengaja tidak dipakai.
  return new;
end;
$$;
revoke all on function public.spmb_handle_new_user() from public, anon, authenticated;
create trigger spmb_on_auth_user_created after insert on auth.users
for each row execute function public.spmb_handle_new_user();

commit;
