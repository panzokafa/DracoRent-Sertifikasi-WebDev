# DRACORENT — Product Requirement Document (PRD)

> **Spesifikasi fitur, validasi, alur, dan kriteria penerimaan — Sistem Rental Naga (DracoRent)**

| Elemen | Keterangan |
| :--- | :--- |
| **Nama Produk** | Sistem Rental Naga (DracoRent) |
| **Tim** | DracoRent |
| **Versi Dokumen** | 1.1 — Konsolidasi fitur dan aturan bisnis |
| **Tanggal** | 22 Oktober 2026 |
| **Dokumen Pendamping** | [DracoRent_BRD.md](./DracoRent_BRD.md), [DracoRent_Flowchart_ERD.md](./DracoRent_Flowchart_ERD.md), [docs/DracoRent_PRD.pdf](./docs/DracoRent_PRD.pdf) |
| **Status** | Draft revisi untuk review dan pengesahan keputusan bisnis |

> **Catatan Keputusan:** Tarif denda harian belum ditetapkan pada sumber BRD. Nilai final harus disetujui pemilik proyek sebelum implementasi dan pengujian final.

---

## 1. Tujuan dan Ringkasan Produk

PRD ini mendefinisikan spesifikasi fungsional dan kriteria penerimaan DracoRent. Dokumen digunakan sebagai acuan implementasi Laravel, penyusunan migration, controller/service, form, aturan akses, pengujian, dan demonstrasi sistem.

**Aturan utama:**
- Satu User dapat memiliki **maksimal dua pinjaman aktif**.
- Durasi pilihan adalah **1–5 hari kalender**.
- Denda mengacu pada **tanggal tenggat tiap transaksi**.
- **Hanya Admin** memproses pengembalian.
- Admin dapat mengunggah gambar unit dan mencetak seluruh riwayat.

---

## 2. Aktor dan Matriks Hak Akses

| Fitur | Admin | User |
| :--- | :---: | :---: |
| Login | Ya | Ya |
| Kelola profil sendiri | Ya | Ya |
| Kelola profil anggota | Ya | Tidak |
| CRUD kategori | Ya | Tidak |
| CRUD unit dan upload gambar | Ya | Tidak |
| CRUD data anggota | Ya | Tidak |
| Cari dan lihat katalog | Ya | Ya |
| Melihat daftar pinjaman aktif | Semua transaksi | Milik sendiri |
| Membuat pinjaman | Tidak wajib; sesuai kebutuhan scope | Ya |
| Proses pengembalian dan denda | Ya | Tidak |
| Lihat/cetak semua riwayat | Ya | Tidak |
| Lihat riwayat pribadi | Dapat melihat sebagai Admin | Ya |

> **Aturan Keamanan:** Pembatasan data harus dilakukan di server/controller/policy, bukan sekadar menyembunyikan tombol di antarmuka.

---

## 3. Ketentuan Data dan Status

### 3.1 Status Unit dan Transaksi

| Objek | Nilai | Arti |
| :--- | :--- | :--- |
| `units.status` | `tersedia` | Unit dapat dipilih untuk transaksi baru. |
| `units.status` | `dipinjam` | Unit sedang berada dalam transaksi aktif; tidak dapat dipinjam lagi. |
| `loans.status` | `dipinjam` | Pinjaman aktif, `tanggal_kembali` masih `NULL`. |
| `loans.status` | `dikembalikan` | Pengembalian sudah diproses Admin, `tanggal_kembali` dan `denda` tersimpan. |

### 3.2 Ketentuan Tanggal
- Semua tanggal pinjam, tenggat, dan kembali untuk aturan bisnis menggunakan **hari kalender**.
- `tanggal_tenggat` dihitung dari `tanggal_pinjam` ditambah durasi pilihan User (1–5 hari).
- `tanggal_kembali` tidak boleh mendahului `tanggal_pinjam`.
- Keterlambatan bernilai nol jika tanggal kembali pada atau sebelum tanggal tenggat; jika setelahnya, hitung selisih tanggal kembali dan tenggat.

### 3.3 Skema Penyimpanan Gambar
- Kolom `units.gambar`: `VARCHAR(255)`, nullable; menyimpan path relatif file gambar di storage.
- Jenis yang diterima: `JPG`, `JPEG`, `PNG`, `WEBP`. Batas ukuran: **maksimal 2 MB**.
- Upload adalah opsional. Jika tidak ada gambar, gunakan placeholder.
- Saat gambar diganti, path baru disimpan dan file lama dibersihkan dengan aman setelah update berhasil, apabila file memang tidak digunakan di tempat lain.

---

## 4. F-01 — Autentikasi Login

| Aspek | Spesifikasi |
| :--- | :--- |
| **Aktor** | Admin, User |
| **Tujuan** | Memastikan hanya pengguna terdaftar yang dapat mengakses sistem sesuai perannya. |
| **Prasyarat** | Pengguna membuka halaman login dan mengisi email serta password. |
| **Alur Utama** | 1. Sistem memvalidasi input dan memeriksa kredensial.<br>2. Jika valid, sistem membuat sesi autentikasi dan mengarahkan pengguna ke halaman sesuai role.<br>3. Jika tidak valid, sistem tetap di halaman login dan menampilkan pesan umum yang tidak membocorkan password atau detail sensitif. |
| **Validasi** | Email: `required`, format email. Password: `required`, string. Password database harus berupa hash. Middleware auth diterapkan pada rute terproteksi. Role diperiksa untuk fitur Admin. |
| **Hasil** | Login berhasil membuka halaman sesuai role; login gagal tidak memberi akses; User tidak dapat membuka rute Admin hanya dengan mengetik URL. |
| **Kriteria Penerimaan** | 1. **AC-01**: email/password salah ditolak.<br>2. **AC-02**: login Admin dan User diarahkan sesuai role.<br>3. **AC-03**: akses ke rute terlindungi tanpa login diarahkan kembali ke login. |
| **Kondisi Gagal** | Email tidak terdaftar, password salah, atau input tidak valid. |

---

## 5. F-02 — Manajemen Profil

| Aspek | Spesifikasi |
| :--- | :--- |
| **Aktor** | Admin, User |
| **Tujuan** | Memelihara satu profil terkait tiap akun. |
| **Prasyarat** | Pengguna sudah login. |
| **Alur Utama** | 1. Pengguna membuka halaman profil.<br>2. Sistem mengambil profil yang terkait dengan pengguna saat ini.<br>3. Pengguna mengubah nama lengkap, nomor telepon, atau alamat dan menyimpan perubahan. |
| **Validasi** | `nama_lengkap`: `required\|string\|max:255`; `no_telp`: `required\|string\|max:20`; `alamat`: `required\|string`. `user_id` unik agar relasi `users`-`profiles` 1:1. User hanya bisa mengubah profil sendiri; Admin dapat mengelola profil anggota lewat administrasi anggota. |
| **Hasil** | Perubahan hanya tersimpan bila lolos validasi; data profil kembali tampil setelah tersimpan. |
| **Kriteria Penerimaan** | 1. **AC-04**: profil akun tidak duplikat.<br>2. **AC-05**: User tidak dapat mengubah profil akun lain.<br>3. **AC-06**: field wajib kosong ditolak. |
| **Kondisi Gagal** | Profil belum dibuat; sistem menampilkan pesan penanganan yang sesuai atau membuat profil pada proses pembuatan akun. |

---

## 6. F-03 — CRUD Kategori Naga

| Aspek | Spesifikasi |
| :--- | :--- |
| **Aktor** | Admin |
| **Tujuan** | Mengelola kategori untuk klasifikasi unit naga. |
| **Prasyarat** | Admin sudah login. |
| **Alur Utama** | 1. Admin membuka menu kategori.<br>2. Admin dapat membuat, melihat, mengedit, dan menghapus kategori yang aman untuk dihapus.<br>3. Sistem memperbarui daftar kategori setelah setiap operasi sukses. |
| **Validasi** | `nama_kategori`: `required\|string\|max:100\|unique`. Hapus kategori yang direferensikan harus menangani relasi `category_unit` terlebih dahulu. |
| **Hasil** | Kategori memiliki nama unik dan relasi kategori-unit tidak boleh menjadi yatim. |
| **Kriteria Penerimaan** | 1. **AC-07**: nama kategori duplikat ditolak.<br>2. **AC-08**: kategori baru dapat dipilih pada F-04.<br>3. **AC-09**: kategori yang sedang digunakan tidak dapat dihapus dengan merusak relasi. |
| **Kondisi Gagal** | Nama kategori sudah digunakan atau kategori masih direferensikan unit. |

---

## 7. F-04 — CRUD Unit Naga, Multiple Kategori, dan Upload Gambar

| Aspek | Spesifikasi |
| :--- | :--- |
| **Aktor** | Admin |
| **Tujuan** | Mengelola inventaris naga termasuk gambar untuk ditampilkan di katalog. |
| **Prasyarat** | Admin sudah login dan kategori yang dipilih sudah tersedia. |
| **Alur Utama** | 1. Admin membuka form tambah/edit unit.<br>2. Admin memasukkan kode unit, nama unit, memilih satu atau lebih kategori, mengisi gambar bila tersedia, dan mengirim form.<br>3. Sistem memvalidasi input serta berkas. Jika lolos, sistem menyimpan unit dan relasi `category_unit`. |
| **Validasi** | `kode_unit`: `required\|string\|max:50\|unique` (saat edit, abaikan ID unit saat ini); `nama_unit`: `required\|string\|max:100` dan tidak wajib unik; `categories`: `required\|array\|min:1`; `categories.*`: `exists:categories,id`; `gambar`: `nullable\|image\|mimes:jpg,jpeg,png,webp\|max:2048`. Unit baru default status `tersedia`. Path file disimpan dalam `units.gambar`. |
| **Hasil** | Katalog menampilkan nama, kode, kategori, status dan gambar/placeholder. Pengubahan kode unit tidak boleh membuat duplikat. |
| **Kriteria Penerimaan** | 1. **AC-10**: kode unit harus unik.<br>2. **AC-11**: nama unit sama diperbolehkan bila kode berbeda.<br>3. **AC-12**: upload gambar valid tersimpan dan dapat ditampilkan.<br>4. **AC-13**: file non-gambar atau lebih dari 2 MB ditolak.<br>5. **AC-14**: satu unit dapat memiliki beberapa kategori. |
| **Kondisi Gagal** | Kode duplikat, kategori tak valid, file tidak didukung, atau penyimpanan file gagal. Tidak boleh meninggalkan data unit tanpa konsistensi relasi. |

---

## 8. F-05 — CRUD Data Anggota

| Aspek | Spesifikasi |
| :--- | :--- |
| **Aktor** | Admin |
| **Tujuan** | Mengelola akun anggota dan profil yang terkait. |
| **Prasyarat** | Admin sudah login dan memiliki hak administrasi anggota. |
| **Alur Utama** | 1. Admin membuka daftar anggota.<br>2. Admin menambah akun, mengubah data, atau menonaktifkan/menghapus akun bila aman untuk riwayat.<br>3. Ketika akun dibuat, email harus unik, password di-hash, role ditetapkan, dan satu profil dibuat. |
| **Validasi** | `email`: `required\|email\|unique` pada create. Password wajib dan minimal 8 karakter pada create; pada edit, kosong berarti tidak berubah. Role dibatasi `admin`/`user`. User/loans historis tidak boleh terhapus secara cascade sehingga menghilangkan riwayat. |
| **Hasil** | Daftar anggota merefleksikan perubahan; profil tunggal tetap terjaga. |
| **Kriteria Penerimaan** | 1. **AC-15**: email duplikat ditolak.<br>2. **AC-16**: akun baru memiliki tepat satu profil.<br>3. **AC-17**: password tidak pernah disimpan sebagai teks biasa.<br>4. **AC-18**: penghapusan tidak menghilangkan transaksi historis. |
| **Kondisi Gagal** | Email sudah digunakan, password tidak memenuhi syarat, atau akun masih terkait data yang harus dipertahankan. |

---

## 9. F-06 — Pencarian dan Katalog Naga

| Aspek | Spesifikasi |
| :--- | :--- |
| **Aktor** | Admin, User |
| **Tujuan** | Memudahkan pengguna menemukan naga dan menilai ketersediaannya. |
| **Prasyarat** | Pengguna sudah login untuk fitur yang diproteksi. |
| **Alur Utama** | 1. Pengguna membuka katalog dan memasukkan kata kunci nama unit.<br>2. Sistem mencari `nama_unit` dengan pencocokan parsial dan mengambil kategori terkait.<br>3. Sistem menampilkan kartu/detail berisi kode, nama, gambar atau placeholder, kategori, dan status. |
| **Validasi** | Pencarian menggunakan parameter query yang aman; pencarian tanpa kata kunci menampilkan katalog; hanya unit status `tersedia` yang boleh dipilih untuk pinjam. |
| **Hasil** | Hasil kosong menampilkan pesan yang jelas; detail unit tidak boleh menampilkan status yang berbeda dari database. |
| **Kriteria Penerimaan** | 1. **AC-19**: pencarian nama parsial menghasilkan unit yang cocok.<br>2. **AC-20**: kartu katalog menampilkan gambar/placeholder dan status.<br>3. **AC-21**: unit `dipinjam` tidak bisa dipilih untuk transaksi baru. |
| **Kondisi Gagal** | Kata kunci tidak menemukan unit atau unit tidak tersedia. |

---

## 10. F-07 — Transaksi Pinjam Naga

| Aspek | Spesifikasi |
| :--- | :--- |
| **Aktor** | User |
| **Tujuan** | Membuat pinjaman secara mandiri dengan kuota dan durasi yang valid. |
| **Prasyarat** | User login; unit terpilih `tersedia`. |
| **Alur Utama** | 1. User membuka detail unit dan menekan Pinjam.<br>2. User memilih durasi 1–5 hari kalender.<br>3. Sistem memvalidasi durasi, status unit, dan jumlah pinjaman aktif User. |
| **Aturan/Hasil Proses** | Jika valid, sistem membuat record `loans`; set `tanggal_pinjam`, `tanggal_tenggat`, `tanggal_kembali` `NULL`, `denda` `0`, status `dipinjam`; `units.status` menjadi `dipinjam`. Operasi status dan pencatatan harus konsisten dalam transaksi database. |
| **Validasi** | Durasi berupa integer 1–5. Unit harus `tersedia`. Jumlah `loans` berstatus `dipinjam` milik User harus `< 2`. Sistem harus mencegah dua permintaan bersamaan meminjam unit yang sama atau membuat kuota melebihi dua. |
| **Hasil** | Transaksi hanya dibuat jika semua syarat lolos. Tenggat sesuai pilihan User dan unit tidak bisa dipinjam ulang selama pinjaman aktif. |
| **Kriteria Penerimaan** | 1. **AC-22**: durasi 1 dan 5 diterima.<br>2. **AC-23**: durasi 0 dan 6 ditolak.<br>3. **AC-24**: pinjaman ketiga ditolak.<br>4. **AC-25**: unit yang sudah dipinjam ditolak.<br>5. **AC-26**: tanggal tenggat konsisten dengan durasi pilihan. |
| **Kondisi Gagal** | Durasi tidak valid, kuota penuh, unit tidak tersedia, atau validasi transaksi gagal. |

---

## 11. F-08 — Pengembalian dan Kalkulasi Denda

| Aspek | Spesifikasi |
| :--- | :--- |
| **Aktor** | Admin |
| **Tujuan** | Memproses pengembalian fisik dan menyimpan denda berdasarkan tenggat. |
| **Prasyarat** | Admin login; transaksi berstatus `dipinjam`; unit diserahkan oleh User. |
| **Alur Utama** | 1. Admin memilih transaksi aktif.<br>2. Admin memasukkan tanggal kembali.<br>3. Sistem memastikan `tanggal_kembali >= tanggal_pinjam`; lalu membandingkan dengan `tanggal_tenggat`. |
| **Aturan/Hasil Proses** | Jika `tanggal_kembali <= tanggal_tenggat`, `denda = 0`. Jika melewati, `hari_terlambat = tanggal_kembali - tanggal_tenggat` dan `denda = hari_terlambat x tarif_denda_harian` yang telah disahkan. Sistem menyimpan tanggal kembali/denda, mengubah `loans.status` ke `dikembalikan` dan `units.status` ke `tersedia`. |
| **Validasi** | `tanggal_kembali`: `required\|date\|after_or_equal:tanggal_pinjam`. Transaksi harus masih aktif. Proses tidak boleh diselesaikan dua kali. Nominal tarif harian masih perlu keputusan bisnis final; implementasi harus mengambil nilai yang disahkan. |
| **Hasil** | Transaksi aktif menjadi selesai satu kali saja; denda tersimpan konsisten dan unit kembali tersedia. |
| **Kriteria Penerimaan** | 1. **AC-27**: tanggal kembali tepat saat tenggat menghasilkan denda 0.<br>2. **AC-28**: tanggal kembali setelah tenggat memakai jumlah hari terlambat, bukan angka lima hari tetap.<br>3. **AC-29**: tanggal sebelum tanggal pinjam ditolak.<br>4. **AC-30**: pengembalian yang sudah selesai tidak dapat diproses lagi. |
| **Kondisi Gagal** | Tanggal tidak valid, transaksi sudah selesai, atau tarif belum dikonfigurasi untuk lingkungan final. |

---

## 12. F-09 — Riwayat Peminjaman dan Cetak Laporan

| Aspek | Spesifikasi |
| :--- | :--- |
| **Aktor** | Admin, User |
| **Tujuan** | Menyediakan transparansi transaksi dan laporan. |
| **Prasyarat** | Pengguna login. |
| **Alur Utama** | 1. Pengguna membuka menu riwayat.<br>2. Sistem menampilkan riwayat dengan cakupan akses sesuai role.<br>3. Admin dapat melihat seluruh transaksi dan mencetak melalui print browser atau PDF; User hanya melihat transaksinya sendiri. |
| **Validasi** | Laporan sekurang-kurangnya memuat ID transaksi, nama/email peminjam atau identitas yang disepakati, kode/nama unit, tanggal pinjam, tanggal tenggat, tanggal kembali, status, dan denda. Query User dibatasi `user_id` akun aktif; query Admin mencakup semua data. |
| **Hasil** | Riwayat dapat difilter/diurutkan bila implementasi menyediakan; laporan harus memakai data aktual yang tersimpan. |
| **Kriteria Penerimaan** | 1. **AC-31**: User melihat transaksi miliknya saja.<br>2. **AC-32**: Admin melihat seluruh riwayat.<br>3. **AC-33**: laporan mencantumkan tanggal tenggat dan denda.<br>4. **AC-34**: cetak browser atau PDF menghasilkan laporan terbaca. |
| **Kondisi Gagal** | Data kosong menampilkan pesan tanpa error; akses ke transaksi User lain ditolak. |

---

## 13. Aturan Validasi Lintas Fitur

| Area | Aturan Lintas Fitur |
| :--- | :--- |
| **Role** | Admin-only routes diperiksa oleh middleware/policy. Jangan mengandalkan tampilan UI saja. |
| **Integritas Unit** | Satu unit hanya boleh memiliki satu pinjaman aktif pada waktu yang sama. |
| **Kuota User** | Cek pinjaman aktif dan buat transaksi secara aman agar dua request bersamaan tidak melewati kuota. |
| **Tanggal** | Tanggal tenggat berasal dari durasi pilihan. Tanggal kembali tidak boleh sebelum tanggal pinjam. |
| **Gambar** | Path file dibersihkan dan diperbarui dengan aman; kegagalan upload tidak boleh merusak data lama. |
| **Penghapusan** | Relasi yang dipakai transaksi tidak boleh dihapus cascade bila menghilangkan riwayat. |
| **Uang Denda** | Disimpan dalam `DECIMAL(10,2)`; tarif denda harus disahkan sebelum rilis. |

---

## 14. Kriteria Penerimaan Terpadu

| ID | Kriteria |
| :--- | :--- |
| **AC-01** | Login salah ditolak; akses rute mematuhi autentikasi dan role. |
| **AC-02** | Admin dan User diarahkan ke area yang tepat. |
| **AC-03** | Setiap akun memiliki tepat satu profil. |
| **AC-04** | Nama kategori dan kode unit unik; nama unit boleh sama. |
| **AC-05** | Upload gambar valid berhasil; file invalid/terlalu besar ditolak. |
| **AC-06** | Katalog menampilkan nama, kategori, status, serta gambar/placeholder. |
| **AC-07** | Durasi 1 sampai 5 diterima; di luar rentang ditolak. |
| **AC-08** | User tidak bisa melampaui dua pinjaman aktif. |
| **AC-09** | Unit yang sudah dipinjam tidak bisa dipinjam lagi. |
| **AC-10** | Tanggal tenggat dihitung menurut durasi yang dipilih. |
| **AC-11** | User tidak dapat memproses pengembalian di sistem. |
| **AC-12** | Admin memproses pengembalian satu kali dan status unit kembali tersedia. |
| **AC-13** | Denda dihitung relatif terhadap tanggal tenggat per transaksi. |
| **AC-14** | User hanya melihat riwayat sendiri; Admin melihat semua dan dapat mencetak. |
| **AC-15** | Riwayat tetap utuh saat data master yang direferensikan hendak dihapus. |

---

## 15. Rekomendasi Pengujian Skenario Batas

| Skenario | Data Uji | Ekspektasi |
| :--- | :--- | :--- |
| **Batas durasi bawah** | `durasi = 1` | Tanggal tenggat satu hari setelah tanggal pinjam. |
| **Batas durasi atas** | `durasi = 5` | Tanggal tenggat lima hari setelah tanggal pinjam. |
| **Di bawah batas** | `durasi = 0` | Validasi menolak. |
| **Di atas batas** | `durasi = 6` | Validasi menolak. |
| **Kuota penuh** | 2 loans aktif, minta pinjaman ke-3 | Ditolak. |
| **Tidak ada keterlambatan** | `kembali = tenggat` | Denda 0. |
| **Terlambat satu hari** | `kembali = tenggat + 1 hari` | `Denda = tarif harian` yang disetujui. |
| **Terlambat beberapa hari** | `kembali = tenggat + 3 hari` | `Denda = 3 x tarif harian` yang disetujui. |
| **Gambar opsional** | `gambar = NULL` | Katalog memakai placeholder. |
| **Gambar tidak valid** | File PDF atau `> 2MB` | Upload ditolak. |
| **Race condition** | Dua request pinjam untuk unit sama | Maksimal satu transaksi aktif untuk unit tersebut. |

---

## 16. Dependencies dan Keputusan Terbuka

- Migration harus mencerminkan enam tabel pada ERD dan constraint yang ditentukan.
- Storage Laravel perlu dikonfigurasi agar gambar dapat diakses melalui URL yang aman, misalnya menggunakan storage link bila memakai public disk.
- Library ekspor PDF ditentukan saat implementasi; pilihan yang disebut dalam BRD adalah DomPDF atau print browser.
- Tarif denda harian belum ditetapkan pada BRD sumber. Pemilik proyek perlu menyetujui nominal sebelum pengujian final dan rilis.
- Konfirmasi akhir bahwa durasi dihitung sebagai hari kalender.

> **Catatan Tarif Denda:** Jangan menetapkan angka final secara implisit. Untuk pengujian, gunakan variabel konfigurasi tarif yang dapat diganti; data uji nominal hanya berlaku jika pemilik proyek telah menyetujuinya.
