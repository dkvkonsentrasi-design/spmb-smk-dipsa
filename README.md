# Portal SPMB SMK DIPSA Purwokerto

Proyek HTML/CSS/JavaScript statis untuk GitHub Pages; Supabase menangani Auth dan PostgreSQL. Tidak memerlukan Node atau proses build. Tahun ajaran contoh adalah 2027/2028; ganti sesuai periode resmi. Tampilan mengikuti ZIP referensi sekolah: warna marun, latar krem, Playfair Display, hero foto sekolah, kartu jurusan, dan footer. Foto lokal berasal dari ZIP yang Anda lampirkan; gambar kartu jurusan mengikuti URL Unsplash pada CSS referensi dan memerlukan koneksi internet.

## Fitur tersedia
- Halaman publik responsif dengan tiga jurusan: Teknik Sepeda Motor, Desain Komunikasi Visual, Manajemen Perkantoran.
- Pendaftaran akun siswa dengan identitas, NISN, NIK, kelahiran, agama, alamat, sekolah asal, orang tua, pekerjaan, pendapatan, dan kontak.
- Pendaftaran langsung aktif tanpa konfirmasi email, login siswa/panitia, logout, validasi formulir, simpan draf, pilih jurusan, kirim pendaftaran, nomor pendaftaran otomatis, cetak bukti dari browser.
- Status draf → menunggu verifikasi → terverifikasi → diterima/tidak diterima. Catatan panitia terlihat oleh siswa. Perbarui status melalui tombol dashboard.
- Panitia melihat seluruh data, meninjau detail, memperbarui hasil, mencari nama/NISN, memfilter tanggal akun berdasarkan WIB, jurusan dan status, mengurutkan terbaru/terlama.
- Ekspor XLSX sungguhan menggunakan ExcelJS: judul resmi, periode/filter, semua kolom, rupiah, baris selang-seling, kolom beku, autofilter, dan pengaturan cetak landscape.
- RLS dan trigger database membatasi data siswa serta mencegah perubahan keputusan dari akun siswa. Peran panitia tidak berasal dari pilihan login atau metadata pengguna.

## 1. Siapkan Supabase
1. Buat proyek Supabase Anda. Jalankan `supabase/schema.sql` sekali di SQL Editor pada proyek baru.
2. Authentication: aktifkan provider Email dan nonaktifkan Confirm email. Atur password minimum 10 karakter. Untuk penggunaan nyata, konfigurasi SMTP jika nantinya menggunakan reset password atau notifikasi email.
3. Authentication → URL Configuration: Site URL dan Redirect URLs harus memuat alamat lengkap GitHub Pages Anda, misalnya `https://USERNAME.github.io/spmb-dipsa/`. Tambahkan `http://localhost:8080/` jika menguji lokal.
4. Isi `assets/config.js` dengan Project URL dan publishable key atau anon key publik. SDK `supabase-js` v2 mendukung key publik tersebut. Jangan masukkan service_role key atau secret key ke file web/GitHub.
5. Buat akun panitia dari dashboard Authentication → Users → Add user (tanpa metadata application), atur email terkonfirmasi. Ganti email pada `supabase/create-committee.sql`, lalu jalankan. Untuk mencabut akses: `delete from public.committee_members where user_id = 'UUID-PANITIA';`.
6. Ubah `schoolYear` pada config sesuai periode resmi.

Data diri saat pembuatan akun dikirim dalam metadata Auth dan langsung disalin oleh trigger ke tabel applications. Perubahan profil berikutnya ada pada tabel applications. Hindari membagikan akses administrator proyek Supabase kepada pengguna biasa. Akun siswa yang dibuat di luar formulir tanpa metadata tidak otomatis memiliki profil; gunakan formulir portal untuk siswa.

## 2. Terbitkan ke GitHub Pages
1. Buat repository GitHub, misalnya `spmb-dipsa`.
2. Upload isi folder proyek ini ke ROOT repository, termasuk `.github/workflows/pages.yml`. Jangan unggah ZIP saja dan jangan menaruh index.html satu folder lebih dalam.
3. Pastikan branch bernama `main`. Settings → Pages → Source: GitHub Actions.
4. Push perubahan; tunggu workflow Publish GitHub Pages selesai. Buka URL Pages, kemudian cocokkan URL tersebut pada Supabase Auth.
5. Workflow hanya menerbitkan index.html dan assets; SQL dan dokumen tidak disalin ke situs.

Alternatif tanpa Actions: gunakan Deploy from a branch, main/root. Cara ini juga mengekspos file SQL/README publik; file tidak mengandung secret tetapi disarankan workflow yang disediakan.

## 3. Uji lokal
Jalankan `python3 -m http.server 8080` di folder proyek, lalu buka http://localhost:8080. Tanpa konfigurasi Supabase, halaman publik bisa dilihat tetapi pendaftaran/login menampilkan pemberitahuan konfigurasi. Tidak ada data demo atau login palsu.

## Verifikasi sebelum digunakan
Ikuti `CHECKLIST.md`. Proyek belum diuji ke database Supabase nyata karena kredensial/proyek belum diberikan. File JavaScript diperiksa sintaksnya; skema perlu diuji pada staging. CDN diperlukan untuk Supabase, ExcelJS, dan font. Untuk produksi, vendor dan kunci versi dependensi yang telah diuji.

## Rekomendasi pengembangan berikutnya
Prioritas berikut: unggah KK/akta/rapor ke bucket privat Supabase Storage (signed URL dan RLS); jadwal/gelombang dan periode pendaftaran; kuota jurusan dan ranking transparan; notifikasi email; riwayat keputusan panitia; kartu pendaftaran PDF; alur lupa password dan perbaikan data oleh siswa atas permintaan panitia. Fitur ini belum diimplementasikan.

Tambahkan pemberitahuan privasi sekolah, kontak panitia, logo asli, tahun ajaran, jadwal dan dasar seleksi yang telah disahkan sebelum menerima data nyata. Nama ayah/ibu dapat diisi “Tidak ada” atau data wali sesuai kebijakan sekolah. Penyimpanan NIK dan pendapatan memerlukan pengelolaan akses serta masa retensi yang ditetapkan sekolah.

## Struktur
- index.html: kerangka halaman.
- assets/style.css: desain responsif.
- assets/app.js: Auth, dashboard, filter dan ekspor.
- assets/config.js: konfigurasi publik.
- supabase/schema.sql: tabel, trigger, RLS.
- supabase/create-committee.sql: pemberian akses panitia.
- .github/workflows/pages.yml: publikasi otomatis.
- CHECKLIST.md: pengujian penerimaan dan akses.

Referensi: https://supabase.com/docs/reference/javascript/auth-signup ; https://supabase.com/docs/guides/database/postgres/row-level-security ; https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Revisi desain
Desain publik, formulir akun, dan dashboard mengikuti identitas visual referensi sekolah. Foto hero, kegiatan, dan berita disertakan dalam assets/images. Teks berita dan kontak berasal dari referensi pengguna; konfirmasi aktualitasnya sebelum publikasi. Logika Supabase dan SQL tidak berubah. ZIP ini merupakan proyek portal terpisah, tidak mengubah ZIP referensi.

## Pendaftaran tanpa konfirmasi email
Authentication → Sign In / Providers → Email → matikan Confirm email → Save. Pendaftaran yang berhasil langsung mendapatkan sesi login dan membuka dashboard siswa. Pastikan pengaturan ini diterapkan; file frontend tidak bisa menonaktifkan verifikasi di server. Email pengguna tidak diverifikasi dalam alur ini.
