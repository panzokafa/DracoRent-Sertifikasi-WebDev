# DracoRent-Sertifikasi-WebDev
3. Nama Project :
DracoRent: Sistem Rental Naga 
DracoRent adalah website peminjaman naga yang dikelola oleh admin dan digunakan oleh anggota. Naga bisa disewa untuk penerbangan, perjalanan udara, pertunjukan, dan ekspedisi fantasi. Tarif sewa per hari dihitung dari spesies, ukuran, dan tingkat kesulitan penjinakan naga.

4. List Fitur :

(Umum)
Login dan logout, semua halaman hanya bisa diakses setelah login
Dua jenis pengguna: Admin dan User (anggota)
Satu user hanya memiliki satu profil, dan setiap user dapat mengubah profilnya sendiri

(Admin)
Tambah, ubah, dan hapus data naga (unit), kategori, dan anggota
Satu nama naga dapat memiliki banyak unit yang dibedakan lewat kode unit (kode unit unik)
Satu naga dapat memiliki lebih dari satu kategori (penerbangan, perjalanan udara, pertunjukan, ekspedisi fantasi)
Melihat semua daftar naga yang sedang disewa
Memproses pengembalian naga (hanya admin yang dapat melakukan pengembalian)
Melihat dan mencetak riwayat peminjaman dari anggota

(User)
Mencari naga berdasarkan nama
Menyewa naga, maksimal 2 unit dalam satu waktu
Durasi sewa maksimal 5 hari, jika lebih dikenakan denda otomatis
Melihat daftar naga yang sedang disewa oleh dirinya sendiri
Menghubungi admin untuk pengembalian naga

(Sistem)
Perhitungan tarif otomatis: tarif dasar spesies x faktor ukuran x faktor kesulitan penjinakan
Validasi pada setiap field yang diperlukan (email unik, kode unit unik, password minimal 8 karakter, tarif harus angka positif, minimal satu kategori per naga, unit yang sedang disewa tidak bisa disewa lagi)
Migration tabel dan seeder data awal (akun admin, kategori, spesies, dan list naga)

5. Skema Database :

7. Demo Website :
