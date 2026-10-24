# DRACORENT — Business Requirement Document (BRD)

> **Kebutuhan bisnis, ruang lingkup, aturan bisnis, dan rancangan konseptual — Sistem Rental Naga (DracoRent)**

| Elemen | Keterangan |
| :--- | :--- |
| **Nama Proyek** | Sistem Rental Naga (DracoRent) |
| **Tim** | DracoRent |
| **Versi Dokumen** | 1.1 — Revisi konsistensi aturan bisnis |
| **Tanggal** | 22 Oktober 2026 |
| **Status** | Draft revisi untuk review |
| **Tujuan Dokumen** | Menjadi dasar pemahaman bisnis dan acuan sinkronisasi flowchart, ERD, PRD, serta implementasi Laravel |
| **Dokumen Pendamping** | [DracoRent_PRD.md](./DracoRent_PRD.md), [DracoRent_Flowchart_ERD.md](./DracoRent_Flowchart_ERD.md), [docs/DracoRent_BRD.pdf](./docs/DracoRent_BRD.pdf) |

> **Catatan Keputusan:** Tarif denda harian belum ditetapkan pada sumber BRD. Nilai final harus disetujui pemilik proyek sebelum implementasi dan pengujian final.

---

## Ringkasan Eksekutif

**DracoRent** adalah aplikasi pengelolaan inventaris dan peminjaman unit naga. Sistem mengatur akun dan profil, unit serta kategorinya, peminjaman dengan durasi pilihan **1–5 hari kalender**, batas **maksimal dua pinjaman aktif per User**, proses pengembalian oleh Admin, denda keterlambatan, dan pencetakan riwayat transaksi. Setiap unit memiliki kode unik dan dapat menampilkan gambar agar anggota dapat mengenali unit sebelum meminjam.

Dokumen ini menyelaraskan kebutuhan bisnis dan desain. Kolom `tanggal_tenggat` menjadi sumber acuan utama perhitungan denda untuk setiap transaksi. Nominal tarif denda harian belum tersedia pada sumber awal dan harus disepakati pemilik proyek.

---

## A. Latar Belakang

Sistem Rental Naga (DracoRent) dirancang untuk mengelola inventaris dan transaksi peminjaman naga untuk berbagai kebutuhan, seperti transportasi, pembakaran, pengairan, pertunjukan, dan keperluan lainnya.

Keberagaman jenis dan fungsi naga memerlukan pendataan yang terstruktur. Setiap unit harus dapat dibedakan melalui kode unik, dikelompokkan menggunakan kategori, dan ditampilkan dengan gambar. Pengelolaan manual berpotensi menimbulkan kesalahan pencatatan, kesulitan mengetahui ketersediaan, dan kendala pemantauan tenggat pengembalian.

Karena itu, sistem menyediakan autentikasi, manajemen data master, katalog dan pencarian, peminjaman mandiri dengan pembatasan kuota dan durasi, pengembalian oleh Admin, kalkulasi denda, serta riwayat yang dapat dicetak.

---

## B. Tujuan Bisnis

1. Memastikan setiap unit naga memiliki kode unit unik walaupun nama unit dapat sama.
2. Mengelompokkan naga ke beberapa kategori berdasarkan fungsi, elemen, ukuran, atau karakteristik lain yang ditentukan Admin.
3. Mengelola ketersediaan unit secara konsisten dan membatasi User pada maksimal dua pinjaman aktif.
4. Mengizinkan User memilih durasi peminjaman 1 sampai 5 hari kalender.
5. Menghitung denda berdasarkan keterlambatan setelah tanggal tenggat per transaksi.
6. Menyediakan gambar naga pada katalog dan detail unit serta mendukung upload oleh Admin.
7. Memudahkan Admin memproses pengembalian dan mencetak riwayat peminjaman.

---

## C. Pemangku Kepentingan dan Aktor

| Aktor | Tanggung Jawab | Hak Akses Utama |
| :--- | :--- | :--- |
| **Admin / Pengelola Kandang** | Mengelola data dan memelihara kebenaran status inventaris. | Kelola unit, gambar, kategori, anggota; lihat semua pinjaman aktif; memproses pengembalian dan denda; lihat/cetak semua riwayat. |
| **User / Anggota** | Mencari naga dan mengajukan peminjaman untuk akun sendiri. | Kelola profil sendiri; cari/lihat katalog serta detail; meminjam unit tersedia selama kuota terpenuhi; lihat pinjaman dan riwayat sendiri. |

> **Batas Kewenangan:** User tidak memiliki tombol pengembalian mandiri. Transaksi pengembalian hanya diselesaikan oleh Admin setelah naga diserahkan secara fisik.

---

## D. Ruang Lingkup Proyek

### D.1 In-Scope
- Login dan kontrol akses berbasis role Admin/User.
- Satu profil untuk setiap akun pengguna.
- CRUD data unit naga: kode unik, nama, status, kategori, dan gambar opsional.
- CRUD kategori dan relasi many-to-many antara unit dengan kategori.
- CRUD data anggota oleh Admin.
- Pencarian dan katalog berdasarkan nama unit, termasuk gambar, kategori, dan status.
- Peminjaman mandiri oleh User dengan durasi 1–5 hari kalender dan maksimal dua pinjaman aktif.
- Pengembalian oleh Admin, penyimpanan tanggal kembali, dan penghitungan denda keterlambatan.
- Riwayat transaksi dan pencetakan laporan oleh Admin.

### D.2 Out-of-Scope
- Integrasi payment gateway otomatis. Verifikasi pembayaran denda, bila diperlukan, dilakukan manual oleh Admin.
- Pelacakan lokasi naga menggunakan GPS real-time.
- Notifikasi otomatis SMS, WhatsApp, atau email di luar pesan aplikasi.

---

## E. Business Rules

| ID / Aturan | Ketentuan |
| :--- | :--- |
| **BR-01 — Autentikasi** | Setiap Admin/User wajib login sebelum mengakses fitur terproteksi. Login gagal menampilkan pesan validasi dan tidak memberikan akses. |
| **BR-02 — Keanggotaan** | Hanya akun terdaftar yang dapat mengajukan peminjaman. Admin bertanggung jawab mengelola akun anggota. |
| **BR-03 — Profil tunggal** | Setiap akun memiliki satu profil (1:1). User hanya mengubah profil sendiri; Admin dapat mengelola profil melalui administrasi anggota. |
| **BR-04 — Identitas dan kategori** | `kode_unit` wajib unik; `nama_unit` boleh sama. Satu unit dapat mempunyai beberapa kategori dan satu kategori dapat digunakan banyak unit. |
| **BR-05 — Kuota pinjaman** | User maksimal memiliki dua unit dengan pinjaman aktif/status `dipinjam` pada waktu bersamaan. Jika sudah dua, pinjaman baru ditolak. |
| **BR-06 — Durasi** | User memilih durasi 1–5 hari kalender. Durasi harus bilangan bulat; `tanggal_tenggat = tanggal_pinjam + durasi_pilihan`. |
| **BR-07 — Denda** | Denda mengacu pada `tanggal_tenggat` transaksi. Jika `tanggal_kembali <= tanggal_tenggat`, `denda = 0`. Jika melewati, `denda = hari_terlambat x tarif_harian`. |
| **BR-08 — Pengembalian** | User menyerahkan unit ke Admin. Admin memasukkan tanggal kembali, sistem menghitung denda, status loan menjadi `dikembalikan`, dan status unit menjadi `tersedia`. |
| **BR-09 — Privasi riwayat** | User hanya melihat transaksi miliknya. Admin dapat melihat seluruh transaksi dan mencetak riwayat. |
| **BR-10 — Gambar unit** | Admin dapat mengunggah gambar opsional. Kolom `units.gambar` menyimpan path file; gambar muncul pada katalog/detail. Jika kosong, gunakan placeholder. |
| **BR-11 — Integritas data** | Status unit harus konsisten dengan pinjaman aktif. Penghapusan data yang berisiko merusak riwayat harus ditolak atau ditangani dengan pengarsipan. |

### Rumus Tanggal dan Denda
- $\text{Tanggal Tenggat} = \text{Tanggal Pinjam} + \text{Durasi Pilihan}$
- $\text{Hari Terlambat} = \max(0, \text{Tanggal Kembali} - \text{Tanggal Tenggat})$
- $\text{Denda} = \text{Hari Terlambat} \times \text{Tarif Denda Harian}$

---

## F. Alur Proses Sistem

### F.1 Alur Umum Login
1. Pengguna membuka sistem dan memasukkan email serta password.
2. Jika kredensial tidak valid, sistem menampilkan pesan validasi dan kembali ke login.
3. Jika valid, sistem memeriksa role dan membuka alur User atau Admin.

### F.2 Alur User
1. Cari naga berdasarkan nama unit dan lihat gambar, kategori, serta status.
2. Pilih unit berstatus `tersedia`, buka detail, lalu pilih durasi 1–5 hari.
3. Sistem memvalidasi durasi dan memeriksa jumlah pinjaman aktif User.
4. Jika durasi tidak valid atau kuota sudah dua unit, transaksi ditolak dengan pesan yang sesuai.
5. Jika valid, sistem menyimpan transaksi, menentukan tanggal tenggat, mengubah status pinjaman menjadi `dipinjam`, dan status unit menjadi `dipinjam`.
6. Untuk mengembalikan, User menghubungi Admin dan menyerahkan unit.

### F.3 Alur Admin
1. Kelola unit, upload gambar, kategori, dan akun anggota.
2. Buka daftar pinjaman aktif saat menerima pengembalian.
3. Pilih transaksi dan masukkan tanggal kembali yang tidak mendahului tanggal pinjam.
4. Bandingkan tanggal kembali dengan tanggal tenggat dan hitung denda jika terlambat.
5. Simpan tanggal kembali dan denda; ubah status transaksi dan unit sesuai kondisi pengembalian.
6. Lihat dan cetak riwayat peminjaman.

---

## G. Rancangan Data dan Relasi

![ERD DracoRent](./assets/database_schema.png)

| Tabel | Fungsi dan Atribut Utama |
| :--- | :--- |
| **`users`** | `id` (PK), `email` (unique), `password` hash, `role` (`admin`/`user`), timestamps. |
| **`profiles`** | `id` (PK), `user_id` (FK dan unique), `nama_lengkap`, `no_telp`, `alamat`, timestamps. |
| **`units`** | `id` (PK), `kode_unit` (unique), `nama_unit` (index, non-unique), `gambar` (nullable `VARCHAR(255)`), `status` (`tersedia`/`dipinjam`), timestamps. |
| **`categories`** | `id` (PK), `nama_kategori` (unique), timestamps. |
| **`category_unit`** | `id` (PK), `unit_id` (FK), `category_id` (FK), unique gabungan `unit_id + category_id` disarankan. |
| **`loans`** | `id` (PK), `user_id` (FK), `unit_id` (FK), `tanggal_pinjam`, `tanggal_tenggat`, `tanggal_kembali` nullable, `denda` default 0, `status` (`dipinjam`/`dikembalikan`), timestamps. |

### G.1 Relasi
- `users` **1:1** `profiles`
- `users` **1:N** `loans`
- `units` **1:N** `loans`
- `units` **1:N** `category_unit` dan `categories` **1:N** `category_unit` (secara konseptual `units` **M:N** `categories`).

### G.2 Ketentuan Gambar
Kolom `units.gambar` bertipe `VARCHAR(255)` dan nullable. Kolom menyimpan path gambar yang dikelola oleh storage aplikasi, bukan data biner. F-04 wajib menyediakan input file, validasi tipe/ukuran, dan pratinjau opsional. Gambar yang tidak ada tidak menghalangi unit ditampilkan; gunakan placeholder.

---

## H. Ringkasan Kebutuhan Produk

| Kode | Fitur | Aktor |
| :--- | :--- | :--- |
| **F-01** | Autentikasi Login | Admin, User |
| **F-02** | Manajemen Profil | Admin, User |
| **F-03** | CRUD Kategori Naga | Admin |
| **F-04** | CRUD Unit Naga, Multiple Kategori & Upload Gambar | Admin |
| **F-05** | CRUD Data Anggota | Admin |
| **F-06** | Pencarian dan Katalog Naga | Admin, User |
| **F-07** | Transaksi Pinjam Naga | User |
| **F-08** | Pengembalian dan Kalkulasi Denda | Admin |
| **F-09** | Riwayat dan Cetak Laporan | Admin, User |

---

## I. Kebutuhan Nonfungsional

| ID | Kebutuhan |
| :--- | :--- |
| **NFR-01** | Password disimpan sebagai hash; akses terproteksi menggunakan autentikasi dan pemeriksaan role. |
| **NFR-02** | User hanya dapat mengakses profil dan transaksi miliknya; pembatasan dilakukan di sisi server. |
| **NFR-03** | Validasi server-side diterapkan pada data form, status transaksi, kategori, tanggal, dan upload file. |
| **NFR-04** | Jenis file dan ukuran gambar divalidasi; path disimpan ke database dan file dikelola melalui storage aplikasi. |
| **NFR-05** | Foreign key dan constraint menjaga konsistensi relasi; perubahan status unit dan loan dilakukan secara konsisten. |
| **NFR-06** | Pesan error harus jelas; katalog menampilkan status, gambar atau placeholder, dan kategori. |
| **NFR-07** | Aplikasi dapat digunakan pada browser modern di desktop/laptop dan diupayakan responsif untuk layar lebih kecil. |

---

## J. Asumsi, Batasan, Risiko, dan Keputusan Terbuka

### J.1 Asumsi dan Batasan
- Durasi dihitung menggunakan hari kalender. Konfirmasi jika kebijakan bisnis menghendaki hari kerja.
- Satu transaksi loan merepresentasikan satu unit naga.
- Pembayaran denda otomatis dan integrasi payment gateway tidak termasuk scope.
- Nominal tarif denda harian belum ditetapkan dalam BRD sumber.

### J.2 Keputusan yang Harus Disahkan

| ID | Keputusan | Catatan | Status |
| :--- | :--- | :--- | :--- |
| **D-01** | Tarif denda harian | Belum ditetapkan pada BRD sumber. Pemilik proyek menetapkan nominal sebelum implementasi/pengujian final. | Terbuka |
| **D-02** | Hari kalender atau hari kerja | Rancangan ini menggunakan hari kalender. Konfirmasi bila bisnis menghendaki hari kerja. | Asumsi |
| **D-03** | Format laporan | Rekomendasi: print browser dan/atau PDF; filter periode belum wajib. | Rekomendasi |
| **D-04** | Penghapusan data yang direferensikan transaksi | Transaksi historis dipertahankan; gunakan penolakan penghapusan atau pengarsipan. | Aturan desain |

### J.3 Risiko dan Mitigasi

| Risiko | Mitigasi |
| :--- | :--- |
| **Dua User meminjam unit yang sama hampir bersamaan** | Lakukan validasi status dan pencatatan pinjaman dalam transaksi database; kunci/atasi kondisi race sesuai DB yang digunakan. |
| **Status unit tidak cocok dengan loan** | Update status unit dan loan dalam satu transaksi database; lakukan pengujian alur pinjam/kembali. |
| **Gambar gagal dimuat atau file tidak valid** | Validasi upload, gunakan placeholder, dan tangani kegagalan penyimpanan file. |
| **Tarif denda belum disepakati** | Sahkan tarif sebelum UAT; jangan menganggap nominal contoh sebagai keputusan bisnis. |
| **Riwayat hilang akibat penghapusan** | Tolak penghapusan yang merusak referensi atau gunakan mekanisme arsip/soft delete. |

---

## K. Kriteria Keberhasilan

- Login dan pemisahan role berjalan dengan benar.
- Admin dapat mengelola enam entitas/tabel dalam batas akses yang ditentukan serta upload gambar unit.
- Katalog dapat mencari dan menampilkan unit beserta kategori, status, dan gambar/placeholder.
- User dapat meminjam hanya jika unit tersedia, durasi 1–5 hari valid, dan pinjaman aktif kurang dari dua.
- Pengembalian hanya diproses Admin dan denda mengacu pada tanggal tenggat per transaksi.
- User hanya melihat transaksinya sendiri; Admin dapat melihat dan mencetak riwayat.
- Pengujian penerimaan di PRD lulus setelah tarif denda disepakati.
