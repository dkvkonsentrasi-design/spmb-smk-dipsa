# Menyiapkan Supabase
1. Buka proyek Supabase yang URL-nya sama dengan assets/config.js.
2. Buka SQL Editor > New query.
3. Buka schema.sql, salin SEMUA isinya, tempel ke editor, lalu Run.
4. Jika berhasil, tabel applications dan committee_members muncul di schema public.
5. Aktifkan provider Email. Jika ingin langsung masuk setelah daftar, matikan Confirm email dan Save. Jika aktif, konfirmasi email sebelum login.
6. Isi Site URL dan Redirect URLs dengan URL lengkap website.
7. Pasang assets/app.js versi terbaru pada website dan muat ulang.
8. Coba daftar siswa dengan email, NISN dan NIK yang belum dipakai. Tahun lulus harus 1900–2100.
9. Untuk panitia, buat akun melalui Authentication > Users > Add user, dengan email terkonfirmasi. Jangan isi metadata application. Edit email dalam create-committee.sql lalu jalankan.
10. Login sebagai panitia; periksa data siswa, verifikasi dan hasil seleksi.

## Batasan dan pemulihan
- schema.sql adalah pemasangan awal SEKALI, bukan migrasi untuk database dengan tabel applications yang sudah ada.
- Tidak menghapus tabel, akun atau trigger lama. Jika muncul “already exists”, jangan hapus tabel: kirim pesan lengkap untuk menyesuaikan migrasi.
- Trigger lain pada auth.users masih dapat menyebabkan “Database error saving new user”. Jika tetap terjadi, kirim detail ERROR dari Logs > Auth atau Postgres.
- Akun yang sudah tercipta sebelum SQL ini dijalankan tidak otomatis mendapat profil. Jangan hapus akun siswa atau data lama; laporkan jika muncul “Profil akun belum tersedia” agar data lama dipulihkan.
- Metadata application diambil saat akun dibuat, bukan saat dikonfirmasi atau saat metadata diubah. Email, nomor pendaftaran dan peran ditentukan server.
- Belum diuji pada database Supabase nyata. Uji siswa A/B (data A tidak terbaca oleh B), panitia, simpan draf dan pengajuan sebelum menerima data asli.
