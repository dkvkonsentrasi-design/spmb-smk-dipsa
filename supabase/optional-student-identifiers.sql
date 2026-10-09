-- Jalankan di SQL Editor pada database yang sudah tersedia.
-- Menjaga data NISN/NIK lama; pendaftaran baru boleh bernilai NULL.
begin;
alter table public.applications alter column nisn drop not null;
alter table public.applications alter column nik drop not null;
commit;
