# Portal SPMB SMK DIPSA — versi perbaikan

## Menyiapkan database
1. URL dan publishable key dari file asli dipertahankan di `assets/config.js`. Kunci ini memang untuk browser. Jangan menggantinya dengan service_role / secret key.
2. Untuk database BARU, jalankan `supabase/schema.sql` sekali di Supabase SQL Editor. Bila tabel sudah ada, jangan jalankan ulang dan jangan menghapus data; skema lama perlu dibandingkan dahulu.
3. Jalankan `supabase/upgrade.sql` setelah tabel tersedia. Skrip ini menambahkan bucket privat dan kebijakan akses berkas, serta bisa dijalankan ulang.
4. Buat akun panitia melalui Authentication > Users, tanpa metadata application. Edit email di `supabase/create-committee.sql`, lalu jalankan.
5. Aktifkan Email Auth. Sebaiknya pertahankan konfirmasi email. Isi Site URL dan Redirect URLs dengan URL portal yang digunakan, termasuk URL pratinjau bila diperlukan.
6. Atur pengiriman email melalui SMTP sebelum menerima pendaftaran dalam jumlah besar.
7. Tahun ajaran dapat diubah di `assets/config.js`. Saat ini mengikuti file asli: 2027/2028. Jadwal dan syarat resmi perlu dikonfirmasi sekolah.

## Menjalankan website
Website berupa HTML/CSS/JavaScript tanpa proses build. Unggah `index.html` dan folder `assets` ke hosting HTTPS, atau untuk lokal jalankan `python3 -m http.server 8080` dari folder proyek. Jangan membuka langsung melalui file:// untuk alur autentikasi.

## Alur siswa
Daftar dengan email aktif dan biodata lengkap. Konfirmasi email bila diaktifkan, lalu masuk sebagai siswa. Simpan draf, pilih jurusan, unggah berkas pendukung, dan ajukan pendaftaran. Biodata dan unggah berkas dikunci setelah pengajuan. Tombol cetak menghasilkan bukti pengajuan dengan nomor, jurusan, status, dan catatan. Bukti pengajuan bukan keputusan diterima.

Berkas pendukung: kartu keluarga, akta, ijazah/SKL, pasfoto. Format PDF/JPG/PNG, maksimal 5 MB tiap berkas. Kelengkapan diperiksa manual oleh panitia; aplikasi tidak menetapkan persyaratan wajib sekolah tanpa konfirmasi. Siswa hanya dapat melihat berkasnya sendiri; panitia bisa melihat seluruh berkas. Tautan lihat berkas berlaku 60 detik.

## Alur panitia
Masuk sebagai panitia, cari/filter calon siswa, tinjau biodata dan berkas, ubah status atau catatan, lalu ekspor hasil sesuai filter ke Excel. Jurusan harus sudah dipilih sebelum status bukan draf. Panitia tidak memiliki fitur edit biodata dalam versi ini.

## Pengujian sebelum digunakan
- Gunakan dua akun siswa berbeda: pastikan siswa B tidak dapat membaca/mengubah data dan berkas siswa A melalui API.
- Uji konfirmasi email, login, logout, lupa kata sandi dan kata sandi baru.
- Uji simpan draf tanpa jurusan, lalu pengajuan dengan jurusan; perubahan setelah pengajuan harus ditolak database.
- Uji unggah/ganti setiap berkas, format salah, ukuran di atas 5 MB, serta akses berkas dari akun panitia.
- Uji perubahan status, catatan, filter tanggal WIB, Excel, dan cetak bukti.
- Uji pada ponsel serta cek URL redirect email.

## Batas verifikasi
Kode JavaScript dan pemeriksaan alur dengan simulasi telah diuji. SQL dan transaksi Auth/Storage belum dijalankan di proyek Supabase Anda. Akun tanpa profil (dibuat sebelum trigger terpasang) masih perlu pemulihan oleh pengelola database. Skema saat ini mendukung satu pendaftaran per akun/NISN/NIK; penerimaan beberapa tahun perlu migrasi khusus agar riwayat tidak tertimpa. Jangan menganggap website siap menerima data nyata sebelum pengujian dua akun selesai.

## Perbaikan utama
Pemulihan kata sandi, unggah berkas privat, akses panitia, cetak bukti khusus, validasi tahun lulus/pendapatan, draf tanpa jurusan, konfirmasi sebelum pengajuan, deteksi update gagal, pesan error di dialog, dan fallback bila CDN Supabase tidak tersedia. Gaya visual dan aset sekolah dipertahankan.
