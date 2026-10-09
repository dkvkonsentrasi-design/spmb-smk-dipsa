-- 1. Buat akun panitia lewat Authentication > Users > Add user.
-- 2. Ganti email contoh berikut dengan email akun tersebut.
-- 3. Jalankan melalui SQL Editor setelah schema.sql berhasil.
do $$
declare
  committee_email text := 'GANTI_EMAIL_PANITIA';
  committee_id uuid;
begin
  if committee_email = 'GANTI_EMAIL_PANITIA' then
    raise exception 'Ganti GANTI_EMAIL_PANITIA terlebih dahulu';
  end if;
  select id into committee_id from auth.users where lower(email) = lower(committee_email);
  if committee_id is null then
    raise exception 'Akun panitia belum tersedia pada Authentication > Users';
  end if;
  insert into public.committee_members(user_id) values (committee_id)
  on conflict (user_id) do nothing;
end;
$$;
