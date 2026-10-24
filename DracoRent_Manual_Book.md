# BUKU PANDUAN PENGGUNA (MANUAL BOOK)
# DracoRent — Sistem Pengelolaan Inventaris & Peminjaman Unit Naga
**Panduan Lengkap Operasional Aplikasi untuk Administrator (Kurator) dan Pengguna (Anggota Serikat)**

---

## DAFTAR ISI

1. [Bab 1: Pendahuluan & Gambaran Umum Sistem](#bab-1-pendahuluan--gambaran-umum-sistem)
2. [Bab 2: Petunjuk Instalasi & Persiapan Sistem](#bab-2-petunjuk-instalasi--persiapan-sistem)
3. [Bab 3: Panduan Autentikasi & Navigasi Portal](#bab-3-panduan-autentikasi--navigasi-portal)
4. [Bab 4: Panduan Operasional Anggota Serikat (User)](#bab-4-panduan-operasional-anggota-serikat-user)
   - 4.1 [Eksplorasi Katalog & Pencarian Spesimen Naga (F-06)](#41-eksplorasi-katalog--pencarian-spesimen-naga-f-06)
   - 4.2 [Melihat Detail Spesimen & Klasifikasi Elemen](#42-melihat-detail-spesimen--klasifikasi-elemen)
   - 4.3 [Melakukan Transaksi Peminjaman Mandiri (F-07)](#43-melakukan-transaksi-peminjaman-mandiri-f-07)
   - 4.4 [Memantau Pinjaman Aktif & Petunjuk Pengembalian Fisik](#44-memantau-pinjaman-aktif--petunjuk-pengembalian-fisik)
   - 4.5 [Memeriksa Riwayat Rental Pribadi (F-09)](#45-memeriksa-riwayat-rental-pribadi-f-09)
   - 4.6 [Memperbarui Profil Anggota (Relasi 1:1) (F-02)](#46-memperbarui-profil-anggota-relasi-11-f-02)
5. [Bab 5: Panduan Operasional Administrator (Kurator Kandang)](#bab-5-panduan-operasional-administrator-kurator-kandang)
   - 5.1 [Membaca Ringkasan & Dashboard Metrik Kandang](#51-membaca-ringkasan--dashboard-metrik-kandang)
   - 5.2 [Manajemen Klasifikasi & Kategori Naga (F-03)](#52-manajemen-klasifikasi--kategori-naga-f-03)
   - 5.3 [Manajemen Inventaris Master Unit Naga & Multi-Kategori (F-04)](#53-manajemen-inventaris-master-unit-naga--multi-kategori-f-04)
   - 5.4 [Manajemen Akun & Profil Anggota Serikat (F-05)](#54-manajemen-akun--profil-anggota-serikat-f-05)
   - 5.5 [Memproses Pengembalian Fisik & Kalkulasi Denda Otomatis (F-08)](#55-memproses-pengembalian-fisik--kalkulasi-denda-otomatis-f-08)
   - 5.6 [Audit Riwayat Transaksi Global & Cetak Laporan (F-09)](#56-audit-riwayat-transaksi-global--cetak-laporan-f-09)
6. [Bab 6: Tanya Jawab (FAQ) & Solusi Kendala Umum](#bab-6-tanya-jawab-faq--solusi-kendala-umum)

---

## Bab 1: Pendahuluan & Gambaran Umum Sistem

### 1.1 Latar Belakang
**DracoRent** adalah platform digital pengelolaan logistik naga yang beroperasi di dalam benteng serikat *Kaer Drakon*. Naga dimanfaatkan oleh serikat untuk berbagai misi strategis, seperti patroli perbatasan udara, transportasi kargo berat, eskorta pasukan perang, hingga ekspedisi medan ekstrem.

Sistem DracoRent mengotomatisasi seluruh siklus hidup peminjaman unit naga, mulai dari pengelompokan klasifikasi kategori, pendataan spesimen dengan nomor identifikasi unik, reservasi mandiri oleh anggota, hingga kalkulasi denda keterlambatan secara otomatis saat unit dikembalikan ke kandang benteng.

### 1.2 Hak Akses Pengguna (Role Matriks)
Sistem membedakan hak akses pengguna menjadi dua tingkat peran:
* **Admin (Kurator Kandang):** Pemegang kendali penuh atas data master naga, kategori, anggota serikat, penerimaan fisik unit yang kembali, penagihan denda keterlambatan, dan pencetakan laporan resmi serikat.
* **User (Anggota Serikat):** Anggota yang berhak meminjam naga siap pakai, memantau masa tenggat sewa miliknya, melihat arsip ekspedisinya sendiri, dan memperbarui kontak profilnya.

```
+------------------------------------+----------+---------+
| Fitur / Modul Aplikasi             |  Admin   |  User   |
+------------------------------------+----------+---------+
| Login & Autentikasi                |    Ya    |   Ya    |
| Kelola Profil Mandiri (1:1)        |    Ya    |   Ya    |
| Jelajah Katalog & Cari Naga        |    Ya    |   Ya    |
| Pinjam Naga Mandiri (1–5 hari)     |  Sesuai  |   Ya    |
| Pantau Status Pinjaman Sendiri     |    Ya    |   Ya    |
| Riwayat Transaksi Pribadi          |    Ya    |   Ya    |
| CRUD Kategori Naga                 |    Ya    |  Tidak  |
| CRUD Unit Naga & Multi-Kategori    |    Ya    |  Tidak  |
| CRUD Anggota & Akun Serikat        |    Ya    |  Tidak  |
| Proses Pengembalian & Hitung Denda |    Ya    |  Tidak  |
| Lihat Riwayat Seluruh Serikat      |    Ya    |  Tidak  |
| Cetak Laporan Resmi (PDF/Print)    |    Ya    |  Tidak  |
+------------------------------------+----------+---------+
```

---

## Bab 2: Petunjuk Instalasi & Persiapan Sistem

### 2.1 Kebutuhan Sistem Minimum
* **Sistem Operasi:** Windows 10/11, macOS, atau Linux
* **PHP Runtime:** PHP 8.2 atau lebih baru (dengan ekstensi `pdo_mysql`, `curl`, `mbstring`)
* **Database Engine:** MySQL 8.0+ atau MariaDB 10.4+ (misal via XAMPP, Laragon, atau Docker)
* **Web Browser:** Google Chrome, Microsoft Edge, Mozilla Firefox, atau Safari

### 2.2 Langkah Menjalankan Aplikasi

#### Langkah 1: Membuka Folder Proyek
Buka terminal PowerShell atau Command Prompt pada folder proyek:
```bash
cd c:\Users\Ghilman\DracoRent-Sertifikasi-WebDev
```

#### Langkah 2: Memastikan MySQL Berjalan
Pastikan modul MySQL / MariaDB pada panel kontrol Laragon atau XAMPP Anda telah aktif dan mendengarkan port default `3306`.

#### Langkah 3: Menjalankan Migrasi & Seeder Database
Eksekusi perintah Artisan berikut untuk menginisialisasi 6 tabel relasional dan mengisi data awal (*fresh migration*):
```bash
php artisan migrate:fresh
```
*Output yang muncul akan mengonfirmasi pembuatan tabel `users`, `profiles`, `units`, `categories`, `category_unit`, dan `loans` beserta akun bawaan.*

#### Langkah 4: Menjalankan Server Aplikasi
Jalankan server pengembangan lokal DracoRent:
```bash
php artisan serve
```
*Server akan aktif pada alamat default: **`http://127.0.0.1:8000`**.*

#### Langkah 5: Membuka Aplikasi di Browser
Buka peramban web dan navigasikan ke alamat:
```
http://127.0.0.1:8000
```

---

## Bab 3: Panduan Autentikasi & Navigasi Portal

### 3.1 Halaman Masuk (Login)
Saat pertama kali membuka tautan `/masuk`, Anda akan disajikan layar login bertema obsidian dengan aksen emas vulkanik.

```
       =========================================
       |               DRACORENT               |
       |       Portal Serikat Kaer Drakon      |
       =========================================
       |  Surel Terdaftar                      |
       |  [ admin@dracorent.com              ] |
       |                                       |
       |  Kata Sandi Rahasia                   |
       |  [ ••••••                           ] |
       |                                       |
       |  [ MASUK KE BENTENG DRACORENT (BTN) ] |
       =========================================
```

1. Masukkan **Alamat Surel** anggota yang terdaftar di serikat.
2. Masukkan **Kata Sandi** (Password).
3. Klik tombol **"Masuk ke Benteng DracoRent"**.
4. Sistem akan memvalidasi kredensial. Jika benar, pengguna diarahkan ke antarmuka sesuai hak aksesnya (Admin diarahkan ke Ringkasan Kurator; Anggota diarahkan ke Katalog Naga).

### 3.2 Daftar Akun Pengujian Bawaan (Default Presets)
Untuk kemudahan pengujian dan demonstrasi, database seeder telah menyediakan beberapa akun siap pakai:

| Peran (Role) | Alamat Email | Kata Sandi | Nama Profil | No. Registrasi | Kuota Awal |
| :--- | :--- | :---: | :--- | :---: | :---: |
| **Admin** | `admin@dracorent.com` | `123456` | Kaelen Varr | `ADM-001` | Pengelola |
| **User (Anggota)** | `user@dracorent.com` | `123456` | Lyra Valen | `G-4091` | 0/2 Aktif |
| **User (Anggota)** | `roderic.vance@dracorent.com` | `123456` | Roderic Vance | `G-4092` | 1/2 Aktif |
| **User (Anggota)** | `samantha.drakos@dracorent.com` | `123456` | Samantha Drakos | `G-4093` | 1/2 Aktif |
| **User (Anggota)** | `brandon.sunder@dracorent.com` | `123456` | Brandon Sunder | `G-4094` | 0/2 Aktif |

### 3.3 Navigasi Cepat (Top Hub Switcher)
Pada bagian atas layar portal (`/`), terdapat bilah kendali cepat (*Quick Switcher*) yang memungkinkan penguji beralih ke 13 layar yang dirancang secara instan tanpa perlu bolak-balik:
* **Sisi User:** `Katalog Naga`, `Detail Naga`, `Pinjaman Saya`, `Riwayat Rental`, `Profil Saya`.
* **Sisi Admin:** `Ringkasan Kurator`, `Unit Naga`, `Tambah/Edit Unit`, `Kategori Klasifikasi`, `Anggota Serikat`, `Pinjaman Aktif (Pengembalian & Denda)`, `Riwayat & Laporan Cetak`.

---

## Bab 4: Panduan Operasional Anggota Serikat (User)

### 4.1 Eksplorasi Katalog & Pencarian Spesimen Naga (F-06)
Pada halaman **Katalog Naga** (`/katalog-naga`), anggota dapat melihat seluruh spesimen naga yang dipelihara di kandang serikat.

1. **Kotak Pencarian Cepat:** Ketikkan nama naga (misalnya *"Ignis"*, *"Vermithrax"*, atau *"Zephyr"*) pada kolom pencarian di bagian atas.
2. **Penyaringan Otomatis:** Sistem akan langsung menyaring kartu unit yang sesuai tanpa perlu memuat ulang halaman (*real-time filter*).
3. **Indikator Status Spesimen:**
   * **Hijau ("Tersedia"):** Naga sedang berada di kandang dan siap untuk dipinjam.
   * **Kuning Emas ("Dipinjam"):** Naga sedang dalam misi aktif bersama anggota lain dan tidak dapat disewa.
4. **Tag Kategori:** Setiap kartu menampilkan taksonomi naga (misal: *Wyrm Api*, *Transportasi Berat*).

### 4.2 Melihat Detail Spesimen & Klasifikasi Elemen
Klik salah satu kartu naga di katalog untuk masuk ke layar **Detail Spesimen** (`/detail-naga`):
* Menampilkan foto spesimen naga resolusi tinggi atau *fallback placeholder* resmi.
* Informasi spesifikasi: Kode Unit unik (misal `NGA-101`), Nama Naga, deskripsi temperamen, habitat kandang, dan daftar kategori multi-elemen yang disandangnya.
* Jika unit berstatus **Tersedia**, formulir peminjaman mandiri akan aktif di panel kanan.

### 4.3 Melakukan Transaksi Peminjaman Mandiri (F-07)
Anggota dapat menyewa naga secara mandiri dengan ketentuan aturan bisnis berikut:

```
[ FORMULIR PEMINJAMAN MANDIRI ]
---------------------------------------------------------
Spesimen Terpilih : Ignis Ashbringer (NGA-101)
Status Ketersediaan: Tersedia di Kandang Utama
---------------------------------------------------------
Pilih Durasi Sewa : [ 1 Hari  ▼ ] (Tersedia opsi 1 s/d 5 Hari)
Tanggal Pinjam    : [ 2026-10-24 ]
Tanggal Tenggat   : 2026-10-25 (Dihitung Otomatis)
---------------------------------------------------------
[ TOMBOL: KONFIRMASI PEMINJAMAN SPESIMEN ]
```

1. **Pilih Durasi:** Pilih jangka waktu peminjaman antara **1 sampai 5 hari kalender**.
2. **Periksa Tanggal Tenggat:** Sistem secara otomatis menghitung:
   $$\text{Tanggal Tenggat} = \text{Tanggal Pinjam} + \text{Durasi Sewa}$$
3. **Patuhi Batas Kuota (Maksimal 2 Unit):** Setiap anggota serikat hanya boleh meminjam maksimal 2 unit naga aktif secara bersamaan.
   * *Catatan:* Jika Anda telah memiliki 2 naga yang belum dikembalikan, sistem akan menolak transaksi baru dan menampilkan pesan: *"Kuota peminjaman penuh (2/2 aktif). Setiap anggota hanya dapat meminjam maksimal 2 unit naga."*
4. **Klik Konfirmasi:** Klik tombol peminjaman. Status naga akan seketika berubah menjadi `dipinjam`, dan transaksi masuk ke buku besar *loans*.

### 4.4 Memantau Pinjaman Aktif & Petunjuk Pengembalian Fisik
Buka menu **Pinjaman Saya** (`/pinjaman-saya`):
* Layar ini hanya menampilkan naga yang saat ini sedang Anda sewa beserta nomor transaksi (`TRX-2026-xxxx`) dan batas tanggal tenggat pengembalian.
* **Prosedur Pengembalian Fisik:** Sesuai aturan serikat (**BR-08**), User tidak memiliki tombol pengembalian di sistem. Anggota wajib membawa naga kembali ke kandang benteng dan menyerahkannya kepada Admin (Kurator). Admin yang akan memeriksa kondisi fisik naga dan menyelesaikan transaksi di sistem.

### 4.5 Memeriksa Riwayat Rental Pribadi (F-09)
Buka menu **Riwayat Rental** (`/riwayat-rental`):
* Menampilkan arsip lengkap riwayat peminjaman masa lalu yang pernah dilakukan oleh akun Anda.
* Memuat rincian: Kode Transaksi, Nama Naga, Tanggal Pinjam, Tanggal Tenggat, Tanggal Kembali, Status (`dikembalikan`), dan nominal denda (jika ada).
* Sesuai aturan privasi (**BR-09 / AC-31**), Anda tidak dapat melihat riwayat milik anggota serikat lain.

### 4.6 Memperbarui Profil Anggota (Relasi 1:1) (F-02)
Buka menu **Profil Saya** (`/profil-saya`):
1. Anda dapat memperbarui:
   * **Nama Lengkap:** Nama resmi ksatria/pengawas naga.
   * **Nomor Telepon:** Kontak darurat serikat (format: `+62 ...`).
   * **Alamat Domisili:** Sektor/blok barak tempat tinggal di benteng.
2. Klik tombol **"Simpan Perubahan Profil"**.
3. Sistem akan memperbarui tabel `profiles` secara persisten (**AC-04 s/d AC-06**).

---

## Bab 5: Panduan Operasional Administrator (Kurator Kandang)

### 5.1 Membaca Ringkasan & Dashboard Metrik Kandang
Saat Admin masuk, buka menu **Ringkasan Kurator** (`/admin/ringkasan`). Halaman ini menyajikan metrik statistik utama serikat secara *real-time*:
* **Total Inventaris Unit:** Jumlah seluruh naga yang terdaftar di kandang.
* **Unit Tersedia:** Naga yang siap dipinjam hari ini.
* **Unit Sedang Bertugas (Dipinjam):** Naga yang sedang berada di luar benteng.
* **Total Transaksi Selesai:** Akumulasi ekspedisi naga yang telah kembali.
* **Total Denda Terkumpul:** Jumlah nominal rupiah denda keterlambatan yang berhasil dicatat.

### 5.2 Manajemen Klasifikasi & Kategori Naga (F-03)
Akses menu **Kategori Klasifikasi** (`/admin/kategori`):
1. **Menambah Kategori Baru:**
   * Masukkan nama klasifikasi pada formulir (misal: *"Drake Badai Salju"*).
   * Klik **"Simpan Kategori"**. Nama kategori wajib unik (minimal 3 karakter).
2. **Mengubah Nama Kategori:** Klik tombol edit pada baris kategori yang bersangkutan, ubah namanya, lalu simpan.
3. **Menghapus Kategori (Proteksi Relasi):**
   * Klik tombol hapus (ikon tempat sampah).
   * **Perhatian Proteksi Relasi (BR-08 / AC-09):** Jika kategori tersebut masih digunakan oleh satu atau beberapa unit naga pada tabel pivot `category_unit`, sistem akan **menolak penghapusan** demi menjaga integritas data taksonomi.
   * Kategori hanya dapat dihapus jika jumlah unit terikat adalah 0.

### 5.3 Manajemen Inventaris Master Unit Naga & Multi-Kategori (F-04)
Akses menu **Unit Naga** (`/admin/unit-naga`) dan tombol **"Tambah Spesimen Baru"** (`/admin/tambah-unit`):

```
[ MODAL PENDAFTARAN UNIT SPESIMEN BARU ]
-------------------------------------------------------------------
Kode Unit Unik   : [ NGA-107               ] (Wajib Unik - Primary Key)
Nama Spesimen    : [ Pyrothrax Ignis       ] (Boleh Sama antar Unit)
Pilih Kategori   : [x] Wyrm Api   [x] Eskor & Tempur   [ ] Patroli
URL Foto Spesimen: [ https://domain.com/naga.webp                 ]
-------------------------------------------------------------------
[ BATAL ]                                    [ SIMPAN SPESIMEN ]
```

1. **Kode Unit (Wajib Unik):** Masukkan kode identifikasi alfanumerik (misal `NGA-107`). Sistem akan menolak jika kode tersebut sudah digunakan unit lain.
2. **Nama Unit:** Masukkan nama naga. Nama boleh sama dengan unit lain selama kode unitnya berbeda (**AC-11**).
3. **Multi-Kategori (Many-to-Many):** Centang satu atau beberapa kategori sekaligus (misal seekor naga bertipe *Wyrm Api* sekaligus *Transportasi Berat*).
4. **Foto Spesimen:** Masukkan tautan URL gambar spesimen atau biarkan kosong untuk menggunakan gambar *placeholder* bawaan.
5. **Proteksi Hapus Unit (BR-11 / AC-18):**
   * Unit naga yang sedang berstatus `dipinjam` **tidak dapat dihapus**.
   * Unit naga yang memiliki riwayat di tabel peminjaman (*loans*) **tidak dapat dihapus** (*ON DELETE RESTRICT*) agar rekam jejak laporan keuangan serikat tidak rusak.

### 5.4 Manajemen Akun & Profil Anggota Serikat (F-05)
Akses menu **Anggota Serikat** (`/admin/anggota`):
1. **Mendaftarkan Anggota Baru:**
   * Klik tombol **"Tambah Anggota Baru"**.
   * Masukkan Surel (wajib unik), Kata Sandi (minimal 6 karakter, otomatis dienkripsi hash Bcrypt), Peran (`user` atau `admin`), Nama Lengkap, No. Telepon, dan Alamat.
   * Saat akun disimpan, sistem secara otomatis membina 1 record di tabel `users` dan 1 record di tabel `profiles` (Relasi 1:1 terjamin).
2. **Proteksi Hapus Anggota:** Anggota yang masih memiliki peminjaman aktif atau memiliki riwayat transaksi tidak dapat dihapus sembarangan (*ON DELETE RESTRICT*).

### 5.5 Memproses Pengembalian Fisik & Kalkulasi Denda Otomatis (F-08)
Saat anggota menyerahkan kembali naga ke kandang, Admin membuka menu **Pinjaman Aktif** (`/admin/pinjaman-aktif`):

```
DAFTAR PINJAMAN AKTIF SERIKAT
-----------------------------------------------------------------------------
Kode Trx       | Peminjam     | Unit Naga        | Tenggat     | Aksi
-----------------------------------------------------------------------------
TRX-2026-0882  | Roderic V.   | NGA-102 (Obsidian)| 2026-10-21  | [ KEMBALIKAN ]
TRX-2026-0883  | Samantha D.  | NGA-106 (Pyrothrax)| 2026-10-22 | [ KEMBALIKAN ]
-----------------------------------------------------------------------------
```

1. Cari baris transaksi naga yang dikembalikan, lalu klik tombol **"Proses Pengembalian"**.
2. **Pilih Tanggal Pengembalian:** Masukkan tanggal serah terima fisik hari ini (validasi: $\text{Tanggal Kembali} \ge \text{Tanggal Pinjam}$).
3. **Kalkulasi Denda Otomatis:**
   * Jika $\text{Tanggal Kembali} \le \text{Tanggal Tenggat}$, denda = **Rp0**.
   * Jika $\text{Tanggal Kembali} > \text{Tanggal Tenggat}$, sistem otomatis menghitung:
     $$\text{Hari Terlambat} = \text{Tanggal Kembali} - \text{Tanggal Tenggat}$$
     $$\text{Denda Keterlambatan} = \text{Hari Terlambat} \times \text{Rp50.000}$$
4. Klik **"Selesaikan Pengembalian"**.
   * Status transaksi pada tabel `loans` berubah menjadi `dikembalikan`.
   * Nilai denda tersimpan persisten ke database.
   * **Status unit naga di tabel `units` seketika pulih menjadi `tersedia`**, sehingga anggota lain dapat langsung meminjamnya kembali di katalog.

### 5.6 Audit Riwayat Transaksi Global & Cetak Laporan (F-09)
Akses menu **Riwayat & Laporan** (`/admin/riwayat-dan-laporan`):
1. **Audit Trail Lengkap:** Menampilkan seluruh riwayat transaksi peminjaman naga dari seluruh anggota serikat tanpa kecuali.
2. **Filter & Pencarian:** Tersedia filter status (`Semua`, `Dipinjam`, `Dikembalikan`) dan pencarian nomor transaksi.
3. **Cetak Dokumen Laporan (Print / PDF):**
   * Klik tombol emas **"Cetak Laporan / Ekspor PDF"** di pojok kanan atas.
   * Dialog cetak peramban web (*browser print dialog*) akan terbuka dengan tata letak dokumen formal siap cetak (kertas A4 / Simpan sebagai PDF).

---

## Bab 6: Tanya Jawab (FAQ) & Solusi Kendala Umum

### Q1: Mengapa anggota tidak bisa meminjam naga ke-3 padahal unit berstatus tersedia?
> **Jawaban:** Sesuai aturan bisnis resmi serikat (**BR-05 / AC-24**), setiap anggota hanya diperkenankan memiliki maksimal **2 pinjaman aktif** dalam satu waktu. Selesaikan terlebih dahulu pengembalian salah satu naga yang sedang disewa agar kuota peminjaman Anda kembali terbuka.

### Q2: Mengapa anggota tidak menemukan tombol "Kembalikan Naga" di antarmukanya?
> **Jawaban:** Sesuai aturan bisnis (**BR-08 / AC-11**), pengembalian naga melibatkan serah terima fisik spesimen hewan berukuran besar. Anggota wajib mengantarkan naga ke kandang serikat dan Admin Kurator yang berwenang menekan tombol pengembalian di sistem setelah memeriksa kondisi naga.

### Q3: Mengapa Admin gagal menghapus kategori naga tertentu?
> **Jawaban:** Kategori tersebut masih terikat pada satu atau beberapa unit naga di tabel pivot `category_unit`. Sistem mencegah penghapusan agar tidak terjadi data relasi yatim (*orphan records*). Lepaskan terlebih dahulu kategori tersebut dari unit terkait sebelum menghapusnya (**AC-09**).

### Q4: Mengapa sistem menolak penghapusan anggota serikat?
> **Jawaban:** Anggota tersebut memiliki catatan transaksi peminjaman historis di tabel `loans`. Kebijakan basis data menggunakan `ON DELETE RESTRICT` (**BR-11 / AC-18**) agar riwayat pembukuan dan audit trail serikat tetap abadi dan tidak rusak.

### Q5: Bagaimana jika server lokal tidak bisa terhubung ke database MySQL?
> **Jawaban:** 
> 1. Periksa apakah modul MySQL / MariaDB pada XAMPP/Laragon sudah berstatus *Running* pada port `3306`.
> 2. Pastikan pengaturan di file `.env` mengarah ke host `127.0.0.1` dengan username `root` (tanpa password).
> 3. Jalankan kembali perintah `php artisan migrate:fresh` untuk memastikan basis data terhubung dengan sempurna.

---
*Buku Panduan Pengguna (Manual Book) DracoRent Versi 1.1 diterbitkan resmi sebagai pedoman operasional lengkap bagi pengguna dan penguji sertifikasi web development 2026.*
