# Portal SPMB SMK DIPSA Purwokerto

Website HTML/CSS/JavaScript dengan Supabase Auth, PostgreSQL, dan Storage privat.

Baca **PANDUAN-PENGOPERASIAN.md** untuk pemasangan, alur siswa/panitia, batasan, dan pengujian.

- `index.html`, `assets/`: website siap hosting.
- `supabase/schema.sql`: skema awal, hanya untuk database baru.
- `supabase/upgrade.sql`: fitur berkas privat, jalankan setelah skema tersedia.
- `supabase/create-committee.sql`: pemberian akses panitia melalui SQL Editor.
- `tests/flows.cjs`: simulasi alur UI dasar (`node tests/flows.cjs`).

Website belum diverifikasi terhadap database Supabase produksi. Konfigurasi asli dipertahankan. Jangan memasukkan secret/service_role key dalam file browser.
