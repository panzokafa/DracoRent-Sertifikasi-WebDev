# DOKUMENTASI PROYEK LENGKAP (PROJECT DOCUMENTATION)
# DracoRent — Sistem Pengelolaan Inventaris & Peminjaman Unit Naga
**Dokumentasi Resmi Arsitektur Sistem, Basis Data, REST API, Desain & Operasional (Versi 1.1)**

---

## 1. Pendahuluan & Ringkasan Proyek

### 1.1 Tentang DracoRent
**DracoRent** adalah aplikasi web komprehensif yang dirancang untuk mengelola inventaris spesimen naga dan operasional transaksi peminjaman naga pada serikat benteng (*Kaer Drakon*). Sistem ini menyediakan pemisahan hak akses berbasis peran (*Role-Based Access Control* / RBAC) untuk dua aktor utama:
1. **Admin (Pengelola Kandang / Kurator):** Bertanggung jawab atas pengelolaan data master (klasifikasi kategori naga, master unit naga dan multi-kategori, data anggota dan profil 1:1), pemantauan pinjaman aktif, eksekusi serah terima fisik pengembalian naga, kalkulasi otomatis denda keterlambatan, serta pencetakan riwayat laporan lengkap serikat.
2. **User (Anggota Serikat):** Memiliki hak untuk menjelajahi katalog spesimen naga, melakukan pencarian nama naga secara parsial, mengajukan peminjaman mandiri unit berstatus `tersedia` (durasi 1–5 hari kalender dengan batas kuota maksimal 2 pinjaman aktif), memantau status pinjaman aktif miliknya, melihat arsip riwayat ekspedisi pribadi, dan memperbarui data profilnya sendiri (relasi 1:1).

### 1.2 Informasi Lisensi & Spesifikasi Proyek
* **Nama Proyek:** DracoRent — Sistem Rental Naga
* **Konteks Proyek:** Uji Kompetensi Sertifikasi Web Development (Standar Industri)
* **Versi Rilis:** 1.1 (Production Ready - Full Database Connected)
* **Kepatuhan Kriteria:** 100% Seluruh Aturan Bisnis (`BR-01` s/d `BR-11`) & Kriteria Penerimaan (`AC-01` s/d `AC-34`)
* **Arsitektur Antarmuka:** *Guild Ledger & Volcanic Hearth* (Tema Gelap Fantasi Gelap Berbasis CSS Variabel Modern)

---

## 2. Tumpukan Teknologi (Tech Stack)

Aplikasi DracoRent dibangun dengan mengutamakan performa tinggi, keandalan integritas data ACID, serta keterbacaan kode (*clean code*):

```
+-----------------------------------------------------------------------------------+
|                            DRACORENT WEB APPLICATION                              |
+-----------------------------------------------------------------------------------+
|  [PRESENTATION LAYER]                                                             |
|  - 13 Stitch Responsive Views (HTML5 Semantic + Vanilla CSS Design System)        |
|  - Typography: Libre Caslon Text (Titles) & Inter (Body, UI Controls, Data Tables)|
|  - Interactive Client Engine: dracorent-app.js (Asynchronous Fetch & State Hub)   |
|                                                                                   |
|  [ROUTING & APPLICATION LAYER]                                                    |
|  - Artisan Compatible Runner (artisan CLI: serve, migrate, migrate:fresh, routes) |
|  - Front Controller: public/index.php & Laravel Blade compatible routes (web.php) |
|  - Dedicated RESTful Database API: public/api.php (MySQL PDO Layer)               |
|                                                                                   |
|  [PERSISTENCE & SECURITY LAYER]                                                   |
|  - Database: MySQL / MariaDB (Database: sistem_peminjaman_naga)                   |
|  - 6 Relational Tables with Foreign Key Constraints (Cascade & Restrict)          |
|  - Security: Bcrypt Password Hashing, PDO Prepared Statements, Concurrency Locks  |
+-----------------------------------------------------------------------------------+
```

| Komponen | Teknologi | Keterangan & Alasan Pemilihan |
| :--- | :--- | :--- |
| **Backend Core** | **PHP 8.2+** | Eksekusi cepat, kompatibel dengan ekosistem Laravel modern dan server PHP built-in. |
| **Database Server** | **MySQL 8.0+ / MariaDB 10.4+** | Mendukung transaksi ACID, *foreign key constraints*, *ON DELETE RESTRICT*, dan *row-level locking*. |
| **Database Driver** | **PDO (PHP Data Objects)** | Koneksi basis data terstandar dengan *prepared statements* parameter ganda untuk mencegah kerentanan SQL Injection. |
| **Styling & UI** | **Vanilla CSS (Design Tokens)** | Desain *Guild Ledger & Volcanic Hearth* menggunakan variabel CSS modern tanpa ketergantungan library pihak ketiga yang membengkak. |
| **Frontend Logic** | **Vanilla JavaScript (ES6+)** | Mesin interaktif asinkron yang menghubungkan 13 layar antarmuka dengan REST API secara mulus (*reactive state cache*). |
| **CLI & Migration** | **Artisan Compatible Engine** | Skrip CLI kustom (`artisan`) dan migrator (`database/migrate.php`) yang memungkinkan pengembang menjalankan `php artisan serve` dan migrasi satu perintah. |

---

## 3. Struktur Direktori Proyek

```
DracoRent-Sertifikasi-WebDev/
├── .env.example                         # Templat konfigurasi lingkungan basis data & port
├── artisan                              # Runner CLI kompatibel Artisan (serve, migrate, routes)
├── README.md                            # Ringkasan cepat proyek dan panduan sertifikasi
├── DracoRent_BRD.md                     # Business Requirement Document resmi
├── DracoRent_PRD.md                     # Product Requirement Document resmi
├── DracoRent_Flowchart_ERD.md           # Alur proses sistem & dokumentasi ERD 6 tabel
├── DracoRent_UAT_Results.md             # Laporan hasil eksekusi 34 kasus uji UAT (100% Pass)
├── DracoRent_Project_Documentation.md   # Dokumentasi teknis proyek komprehensif (dokumen ini)
├── DracoRent_Manual_Book.md             # Buku panduan pengguna (Manual Book) lengkap
├── app/
│   └── Models/                          # Model Eloquent kompatibel Laravel (Category, Loan, Profile, Unit, User)
├── assets/
│   ├── database_schema.png              # Diagram ERD visual 6 tabel basis data
│   └── icon.svg                         # Ikon resmi serikat naga DracoRent
├── database/
│   ├── migrate.php                      # Skrip migrasi & seeder otomatis PHP PDO
│   ├── schema.sql                       # Skema DDL 6 tabel & data awal (seeder kredensial 123456)
│   ├── start_services.ps1               # Skrip pembantu peluncuran MySQL & PHP dev server
│   ├── migrations/                      # Berkas migrasi Laravel standar (0001_01_01_create_...)
│   └── seeders/                         # Seeder basis data Laravel (DatabaseSeeder.php)
├── design/
│   └── stitch_d_d_design_system/        # Token desain resmi Guild Ledger & Volcanic Hearth
├── docs/
│   ├── DracoRent_BRD.pdf                # Berkas PDF Business Requirement Document
│   ├── DracoRent_PRD.pdf                # Berkas PDF Product Requirement Document
│   └── DracoRent_Flowchart_ERD.pdf      # Berkas PDF Flowchart & ERD visual
├── public/
│   ├── api.php                          # RESTful API Endpoint (CRUD 6 tabel, denda, login, kuota)
│   ├── index.php                        # Web front controller & router HTTP
│   ├── preview-dnd.html                 # Hub interaktif portal terpadu 13 layar
│   ├── css/
│   │   └── dnd-theme.css                # Desain sistem CSS Volcanic Hearth
│   ├── js/
│   │   └── dracorent-app.js             # Logika interaktif frontend terhubung live database
│   └── screens/                         # Berkas HTML 13 layar mandiri (anggota, unit, kategori, dsb.)
├── resources/
│   └── views/
│       ├── dracorent/                   # 13 View Blade kompatibel Laravel
│       └── layouts/                     # Layout induk template Blade (dnd.blade.php)
├── routes/
│   └── web.php                          # Peta rute web Laravel terdefinisi resmi
└── scratch/
    ├── run_full_uat_suite.php           # Runner otomasi pengujian 34 Acceptance Criteria
    └── uat_results_detailed.json        # Log hasil JSON pengujian UAT terperinci
```

---

## 4. Perancangan Basis Data (Database Design & ERD 6 Tabel)

Basis data aplikasi bernama **`sistem_peminjaman_naga`** dirancang dengan normalisasi tingkat tinggi (3NF) yang terdiri dari 6 tabel berelasi:

```mermaid
erDiagram
    users ||--|| profiles : "1:1 (user_id)"
    users ||--o{ loans : "1:N (user_id)"
    units ||--o{ loans : "1:N (unit_id)"
    units ||--o{ category_unit : "1:N (unit_id)"
    categories ||--o{ category_unit : "1:N (category_id)"

    users {
        BIGINT id PK
        VARCHAR email UK
        VARCHAR password
        ENUM role
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    profiles {
        BIGINT id PK
        BIGINT user_id FK,UK
        VARCHAR nama_lengkap
        VARCHAR no_telp
        TEXT alamat
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    units {
        BIGINT id PK
        VARCHAR kode_unit UK
        VARCHAR nama_unit IDX
        VARCHAR gambar
        ENUM status
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    categories {
        BIGINT id PK
        VARCHAR nama_kategori UK
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    category_unit {
        BIGINT id PK
        BIGINT unit_id FK
        BIGINT category_id FK
    }

    loans {
        BIGINT id PK
        BIGINT user_id FK
        BIGINT unit_id FK
        DATE tanggal_pinjam
        DATE tanggal_tenggat
        DATE tanggal_kembali
        DECIMAL denda
        ENUM status IDX
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
```

### 4.1 Spesifikasi Rinci Tabel Basis Data

#### 1. Tabel `users` (Akun Pengguna)
Menyimpan kredensial autentikasi pengguna dengan hak akses (*role*).
* `id` (BIGINT UNSIGNED, Primary Key, Auto Increment)
* `email` (VARCHAR(255), Not Null, Unique)
* `password` (VARCHAR(255), Not Null) — *Tersimpan sebagai hash Bcrypt ($2y$)*
* `role` (ENUM('admin', 'user'), Not Null, Default 'user')
* `created_at`, `updated_at` (TIMESTAMP)

#### 2. Tabel `profiles` (Profil Tunggal Anggota — Relasi 1:1)
Menyimpan biodata pengguna. Sesuai aturan **BR-03**, setiap akun hanya memiliki tepat satu baris profil.
* `id` (BIGINT UNSIGNED, Primary Key, Auto Increment)
* `user_id` (BIGINT UNSIGNED, Not Null, Unique) — *Foreign Key ke `users.id` (ON UPDATE CASCADE ON DELETE CASCADE)*
* `nama_lengkap` (VARCHAR(255), Not Null)
* `no_telp` (VARCHAR(20), Not Null)
* `alamat` (TEXT, Not Null)
* `created_at`, `updated_at` (TIMESTAMP)

#### 3. Tabel `units` (Master Unit Spesimen Naga)
Menyimpan seluruh inventaris naga di kandang benteng.
* `id` (BIGINT UNSIGNED, Primary Key, Auto Increment)
* `kode_unit` (VARCHAR(50), Not Null, Unique) — *Wajib unik untuk membedakan spesimen*
* `nama_unit` (VARCHAR(100), Not Null, Index) — *Boleh sama antar unit jika kodenya berbeda (BR-04)*
* `gambar` (VARCHAR(500), Nullable) — *Menyimpan path/URL foto spesimen atau fallback placeholder*
* `status` (ENUM('tersedia', 'dipinjam'), Not Null, Default 'tersedia')
* `created_at`, `updated_at` (TIMESTAMP)

#### 4. Tabel `categories` (Master Kategori & Klasifikasi Naga)
Menyimpan taksonomi kategori naga (elemen, fungsi militer, logistik).
* `id` (BIGINT UNSIGNED, Primary Key, Auto Increment)
* `nama_kategori` (VARCHAR(100), Not Null, Unique)
* `created_at`, `updated_at` (TIMESTAMP)

#### 5. Tabel `category_unit` (Tabel Pivot Relasi Many-to-Many Unit & Kategori)
Menghubungkan unit naga dengan banyak kategori (**BR-04 / AC-14**).
* `id` (BIGINT UNSIGNED, Primary Key, Auto Increment)
* `unit_id` (BIGINT UNSIGNED, Not Null, Foreign Key ke `units.id` ON DELETE CASCADE)
* `category_id` (BIGINT UNSIGNED, Not Null, Foreign Key ke `categories.id` ON DELETE CASCADE)
* *Composite Unique Constraint:* `UNIQUE KEY (unit_id, category_id)`

#### 6. Tabel `loans` (Transaksi Peminjaman & Riwayat Denda)
Mencatat seluruh riwayat peminjaman, tanggal tenggat, serah terima pengembalian, dan denda.
* `id` (BIGINT UNSIGNED, Primary Key, Auto Increment)
* `user_id` (BIGINT UNSIGNED, Not Null, Foreign Key ke `users.id` **ON DELETE RESTRICT**)
* `unit_id` (BIGINT UNSIGNED, Not Null, Foreign Key ke `units.id` **ON DELETE RESTRICT**)
* `tanggal_pinjam` (DATE, Not Null)
* `tanggal_tenggat` (DATE, Not Null)
* `tanggal_kembali` (DATE, Nullable)
* `denda` (DECIMAL(10,2), Not Null, Default 0.00)
* `status` (ENUM('dipinjam', 'dikembalikan'), Not Null, Default 'dipinjam')
* `created_at`, `updated_at` (TIMESTAMP)

> [!IMPORTANT]
> **Kebijakan Integritas Relasi (ON DELETE RESTRICT):**
> Sesuai aturan **BR-11** dan **AC-18**, foreign key `loans.user_id` dan `loans.unit_id` menggunakan klausul `ON DELETE RESTRICT`. Hal ini memastikan bahwa data unit naga atau anggota yang pernah memiliki catatan transaksi historis tidak akan bisa dihapus sembarangan dari sistem, sehingga keutuhan laporan audit dan riwayat serikat selalu terjaga 100%.

---

## 5. Aturan Bisnis & Formulasi Perhitungan Matematis

Aplikasi DracoRent menerapkan logika bisnis ketat yang dihitung secara deterministik:

### 5.1 Aturan Durasi Peminjaman (`BR-06` / `AC-22`, `AC-23`, `AC-26`)
Anggota memilih durasi peminjaman sebesar $D \in [1, 5]$ hari kalender. Tanggal tenggat pengembalian dihitung otomatis dari tanggal pinjam:
$$\text{Tanggal Tenggat} = \text{Tanggal Pinjam} + D \text{ hari}$$
* Durasi di luar rentang ($D < 1$ atau $D > 5$) otomatis ditolak oleh validasi server-side.

### 5.2 Aturan Pembatasan Kuota Pinjaman Aktif (`BR-05` / `AC-24`)
Setiap anggota serikat hanya diizinkan memiliki **maksimal 2 transaksi peminjaman aktif** (`status = 'dipinjam'`) pada waktu yang bersamaan:
$$\text{Jumlah Pinjaman Aktif User} = \sum_{\text{loan} \in \text{Loans}} [\text{loan.user\_id} = U \land \text{loan.status} = \text{'dipinjam'}] \le 2$$
* Jika anggota telah memiliki 2 pinjaman aktif, upaya peminjaman ke-3 otomatis ditolak server dengan pesan error informatif.

### 5.3 Aturan Pengembalian & Kalkulasi Denda Keterlambatan (`BR-07` / `AC-27`, `AC-28`, `AC-29`)
Pengembalian unit naga hanya dapat dieksekusi oleh Admin Kurator setelah serah terima fisik naga dilakukan. Tanggal kembali wajib memenuhi syarat $\text{Tanggal Kembali} \ge \text{Tanggal Pinjam}$.

Perhitungan hari keterlambatan ($H$) dan denda ($F$):
$$H = \max(0, \text{Tanggal Kembali} - \text{Tanggal Tenggat})$$
$$F = H \times \text{Tarif Denda Harian}$$
* **Tarif Denda Harian yang Disepakati:** **Rp50.000 / hari**.
* Jika pengembalian tepat waktu atau lebih awal ($\text{Tanggal Kembali} \le \text{Tanggal Tenggat}$), maka $H = 0$ dan $\text{Denda} = \text{Rp0}$.
* Jika terlambat 3 hari melewati tenggat, maka $H = 3$ dan $\text{Denda} = 3 \times \text{Rp50.000} = \text{Rp150.000}$.

---

## 6. Spesifikasi Teknis RESTful API Endpoint (`public/api.php`)

Seluruh komunikasi antarmuka ke basis data MySQL dilayani melalui endpoint sentral `public/api.php` dengan metode JSON terstruktur:

### 6.1 `GET|POST /api.php?action=bootstrap`
Mengambil *snapshot* data terkini serikat untuk me-render seluruh layar antarmuka.
* **Payload Respon:**
  ```json
  {
    "ok": true,
    "categories": [...],
    "units": [...],
    "members": [...],
    "loans": [...],
    "stats": {
      "total_units": 6,
      "available_units": 4,
      "borrowed_units": 2,
      "active_loans": 2,
      "returned_loans": 4,
      "total_fines": 200000.00,
      "total_categories": 7,
      "total_members": 5
    }
  }
  ```

### 6.2 `POST /api.php` — `action: login`
Memverifikasi kredensial surel dan kata sandi pengguna.
* **Request Body:**
  ```json
  {
    "action": "login",
    "email": "admin@dracorent.com",
    "password": "123456"
  }
  ```
* **Respon Sukses (200 OK):**
  ```json
  {
    "ok": true,
    "message": "Login berhasil.",
    "user": {
      "id": 1,
      "email": "admin@dracorent.com",
      "role": "admin",
      "nama_lengkap": "Kaelen Varr",
      "no_telp": "+62 811-9041-0012",
      "alamat": "Menara Pengawas Timur No. 01...",
      "reg_code": "ADM-001"
    },
    "state": { ... }
  }
  ```

### 6.3 `POST /api.php` — `action: borrow_loan`
Mencatat peminjaman unit naga mandiri oleh anggota terdaftar (**BR-01, BR-05, BR-06**).
* **Request Body:**
  ```json
  {
    "action": "borrow_loan",
    "user_id": 2,
    "kode_unit": "NGA-101",
    "days": 4,
    "tanggal_pinjam": "2026-10-24"
  }
  ```
* **Respon Sukses (200 OK):**
  ```json
  {
    "ok": true,
    "message": "Peminjaman Ignis Ashbringer (NGA-101) selama 4 hari berhasil dicatat ke database!",
    "loan_id": 7,
    "state": { ... }
  }
  ```

### 6.4 `POST /api.php` — `action: return_loan`
Memproses serah terima fisik naga dan kalkulasi denda keterlambatan (**BR-07, BR-08**).
* **Request Body:**
  ```json
  {
    "action": "return_loan",
    "kode_unit": "NGA-101",
    "tanggal_kembali": "2026-10-31"
  }
  ```
* **Respon Sukses (200 OK):**
  ```json
  {
    "ok": true,
    "message": "Pengembalian berhasil disimpan ke database! Status unit kini Tersedia. Denda keterlambatan (3 hari): Rp150.000",
    "days_late": 3,
    "denda": 150000,
    "state": { ... }
  }
  ```

### 6.5 `POST /api.php` — `action: save_unit` & `delete_unit`
Menambah/mengedit unit naga dan multi-kategori, serta menghapus unit dengan proteksi riwayat (**BR-04, BR-08, BR-10**).
* **Request Body (`save_unit`):**
  ```json
  {
    "action": "save_unit",
    "kode_unit": "NGA-107",
    "nama_unit": "Drakon Sol Invictus",
    "gambar": "https://images.example.com/drakon.webp",
    "categories": [1, 6]
  }
  ```

### 6.6 `POST /api.php` — `action: save_category` & `delete_category`
Mengelola master kategori naga dengan proteksi integritas relasi tabel pivot (`category_unit`).

### 6.7 `POST /api.php` — `action: save_member` & `delete_member`
Mengelola akun anggota dan relasi 1:1 profil, dilengkapi enkripsi password Bcrypt dan proteksi riwayat historis.

---

## 7. Desain Sistem & Arsitektur Antarmuka (Volcanic Hearth UI)

Antarmuka DracoRent mengadopsi bahasa desain resmi **Guild Ledger & Volcanic Hearth**:
* **Warna Latar (Surface & Obsidian):** `#111317` (Surface Dim), `#1E2024` (Surface Container), `#282A2E` (Surface High).
* **Aksen Emas Naga (Gold Tint):** `#E8C178` (Primary Gold), `#D5B873` (Gold Hover), `#412D00` (Gold Deep).
* **Status Badges:**
  * **Tersedia (Ready):** Background `#20392F`, Teks `#6EB895`.
  * **Dipinjam (Active Loan):** Background `#3C3020`, Teks `#D5A35B`.
  * **Denda / Terlambat (Overdue):** Background `#412527`, Teks `#E17B79`.
* **Tipografi:**
  * Judul Utama & Nama Unit: **Libre Caslon Text** (Kesan manuskrip kuno elegan).
  * Data Tabel, Form, & Label: **Inter** (Keterbacaan tinggi untuk dokumen digital).

---

## 8. Panduan Menjalankan Sistem Secara Lokal

### 8.1 Prasyarat Lingkungan
1. **PHP:** Versi 8.2 atau lebih baru dengan ekstensi `pdo_mysql`, `curl`, `mbstring`.
2. **Database:** MySQL / MariaDB (misalnya bawaan XAMPP / Laragon).
3. **Web Browser:** Google Chrome / Edge modern.

### 8.2 Langkah Instalasi & Menjalankan Server
1. Buka direktori proyek di terminal / PowerShell:
   ```bash
   cd c:\Users\Ghilman\DracoRent-Sertifikasi-WebDev
   ```
2. Pastikan service MySQL/MariaDB telah berjalan pada port `3306`.
3. Jalankan migrasi dan seeder awal basis data (membuat database `sistem_peminjaman_naga` dan 6 tabel):
   ```bash
   php artisan migrate:fresh
   ```
4. Jalankan server lokal:
   ```bash
   php artisan serve
   ```
5. Akses sistem di peramban web: **`http://127.0.0.1:8000`**

### 8.3 Kredensial Default Seeder
* **Akun Admin:** `admin@dracorent.com` | Password: `123456` (Reg: `ADM-001`)
* **Akun User:** `user@dracorent.com` | Password: `123456` (Reg: `G-4091`)
* **Akun Anggota Lain:** `roderic.vance@dracorent.com`, `samantha.drakos@dracorent.com`, `brandon.sunder@dracorent.com` (Password: `123456`)

---
*Dokumen ini merupakan spesifikasi teknis dan dokumentasi arsitektur resmi DracoRent Versi 1.1.*
