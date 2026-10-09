# Uji penerimaan pada staging

1. Jalankan skema SQL di proyek baru tanpa error. Buat akun panitia dan beri akses lewat SQL admin.
2. Daftar siswa A dengan data lengkap. Tanpa konfirmasi email, akun langsung aktif dan dashboard siswa terbuka. Nomor pendaftaran dan semua data harus tersimpan.
3. NISN/NIK tidak valid, NISN/NIK duplikat, tanggal lahir masa depan, dan pendapatan negatif harus ditolak.
4. Simpan draf; logout/login; data tetap ada. Pilih jurusan dan kirim. Siswa tidak dapat mengedit setelah diajukan.
5. Daftar siswa B. Melalui SDK dengan sesi A, coba SELECT data B: hasil harus kosong. Coba UPDATE B: tidak berubah.
6. Melalui SDK dengan sesi A, coba set status accepted atau decision_note: harus ditolak trigger. Coba mengubah registration_number/created_at: ditolak. Coba INSERT ke committee_members: ditolak.
7. Pilih login panitia memakai akun siswa: sesi harus keluar dan akses ditolak. Pilihan dropdown bukan pemberi akses.
8. Panitia dapat melihat A dan B; buka detail; ubah status verified lalu accepted/rejected; siswa melihat status dan catatan setelah refresh.
9. Filter tanggal akun mengacu WIB, termasuk batas tengah malam. Gabungkan pencarian/jurusan/status, lalu bandingkan jumlah tabel dengan Excel.
10. Buka XLSX di Excel/LibreOffice: semua data, nol awal NIK/NISN tetap utuh, pendapatan numerik dalam rupiah, judul, filter, dan pratinjau cetak benar. Teks yang diawali = tetap string.
11. Uji lebih dari 1000 siswa untuk memastikan pagination pengambilan lengkap. Dashboard memuat semua data untuk rekap; rencanakan filter/pagination server untuk skala lebih besar.
12. Uji ponsel, navigasi keyboard, dialog, koneksi gagal, pendaftaran tanpa konfirmasi email, cetak bukti, dan logout.

Belum dijalankan pada layanan Supabase nyata; lakukan seluruh uji sebelum menerima data asli.
