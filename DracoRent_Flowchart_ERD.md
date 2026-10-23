# DRACORENT — Flowchart & Entity Relationship Diagram (ERD)

> **Dokumentasi Visual Alur Sistem dan Skema Relasi 6 Tabel Database — Sistem Rental Naga (DracoRent)**
>
> Berkas PDF sumber: [docs/DracoRent_Flowchart_ERD.pdf](./docs/DracoRent_Flowchart_ERD.pdf)

---

## 1. Flowchart 1 — Login dan Pemilihan Role

```mermaid
flowchart TD
    Start(["MULAI"]) --> Input["User / Admin mengisi email dan password"]
    Input --> CheckValid{"Kredensial valid?"}
    CheckValid -- "Tidak" --> ErrorMsg["Tampilkan pesan validasi dan kembali ke halaman login"]
    ErrorMsg -- "Coba lagi" --> Input
    CheckValid -- "Ya" --> CheckRole{"Periksa role pengguna"}
    CheckRole -- "role = user" --> UserFlow["USER / ANGGOTA: Cari katalog, lihat gambar, pilih durasi dan pinjam"]
    CheckRole -- "role = admin" --> AdminFlow["ADMIN: Kelola unit/gambar/kategori/anggota; proses pengembalian dan laporan"]
    UserFlow --> Flow2(["Proses rinci: Flowchart 2"])
    AdminFlow --> Flow3(["Proses rinci: Flowchart 3"])
```

---

## 2. Flowchart 2 — Alur Peminjaman User / Anggota

```mermaid
flowchart TD
    StartUser(["Mulai alur User"]) --> Search["Cari naga berdasarkan nama unit"]
    Search --> ViewCatalog["Lihat katalog: gambar/placeholder, nama, kode, kategori, status"]
    ViewCatalog --> SelectUnit["Pilih unit dengan status tersedia"]
    SelectUnit --> SelectDuration["Pilih durasi peminjaman 1-5 hari kalender"]
    SelectDuration --> ValidDuration{"Durasi bilangan bulat antara 1 dan 5?"}
    ValidDuration -- "Tidak" --> RejectDuration["Tolak transaksi dan tampilkan pesan durasi harus 1-5 hari"]
    RejectDuration -- "Perbaiki pilihan" --> SelectDuration
    ValidDuration -- "Ya" --> CheckQuota{"Jumlah pinjaman aktif User < 2?"}
    CheckQuota -- "Tidak" --> RejectQuota["Tolak transaksi: maksimal pinjam 2 naga"]
    RejectQuota --> EndUser(["Selesai alur User"])
    CheckQuota -- "Ya" --> SaveLoan["Simpan loan: tanggal_pinjam = hari ini, tanggal_tenggat = tanggal_pinjam + durasi, tanggal_kembali = NULL, denda = 0"]
    SaveLoan --> UpdateStatus["Ubah status unit = dipinjam dan status loan = dipinjam"]
    UpdateStatus --> ReturnNote["Untuk kembali: hubungi Admin dan serahkan naga secara fisik"]
    ReturnNote --> EndUser
```

---

## 3. Flowchart 3 — Pengelolaan dan Pengembalian Admin

```mermaid
flowchart TD
    StartAdmin(["Mulai alur Admin"]) --> ManageMaster["Kelola data master: unit + upload gambar, kategori, anggota"]
    ManageMaster --> OpenActiveLoans["Buka Daftar Pinjaman Aktif dan pilih transaksi"]
    OpenActiveLoans --> InputReturn["Terima naga dari User dan input tanggal kembali"]
    InputReturn --> ValidDate{"Tanggal kembali >= tanggal pinjam dan transaksi masih aktif?"}
    ValidDate -- "Tidak valid" --> RejectReturn["Tolak pemrosesan dan tampilkan pesan validasi"]
    RejectReturn -- "Perbaiki input" --> InputReturn
    ValidDate -- "Valid" --> CheckLate{"Tanggal kembali > tanggal tenggat?"}
    CheckLate -- "Ya" --> CalcLate["Terlambat: hari_terlambat = kembali - tenggat; denda = hari_terlambat x tarif harian"]
    CheckLate -- "Tidak" --> NoFine["Tidak terlambat: denda = Rp0"]
    CalcLate --> SaveReturn["Simpan tanggal kembali dan denda; loan.status = dikembalikan; unit.status = tersedia"]
    NoFine --> SaveReturn
    SaveReturn --> PrintReport["Lihat dan cetak riwayat (Print browser / PDF)"]
    PrintReport --> EndAdmin(["Selesai alur Admin"])
```

---

## 4. Entity Relationship Diagram (ERD) — 6 Tabel

### Gambar Skema Database
![ERD Sistem Rental Naga (DracoRent)](./assets/database_schema.png)

### Diagram ER (Mermaid)
```mermaid
erDiagram
    users ||--|| profiles : "1 : 1 (satu profil per akun)"
    users ||--o{ loans : "1 : N (riwayat transaksi)"
    units ||--o{ loans : "1 : N (unit dapat disewa berulang)"
    units ||--o{ category_unit : "1 : N"
    categories ||--o{ category_unit : "1 : N"

    users {
        BIGINT id PK
        VARCHAR(255) email UK "UNIQUE"
        VARCHAR(255) password "HASH"
        ENUM role "admin, user"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    profiles {
        BIGINT id PK
        BIGINT user_id FK,UK "FK + UNIQUE"
        VARCHAR(255) nama_lengkap
        VARCHAR(20) no_telp
        TEXT alamat
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    units {
        BIGINT id PK
        VARCHAR(50) kode_unit UK "UNIQUE"
        VARCHAR(100) nama_unit "INDEX"
        VARCHAR(255) gambar "NULLABLE"
        ENUM status "tersedia, dipinjam"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    categories {
        BIGINT id PK
        VARCHAR(100) nama_kategori UK "UNIQUE"
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
        DATE tanggal_kembali "NULLABLE"
        DECIMAL(10_2) denda "DEFAULT 0"
        ENUM status "dipinjam, dikembalikan"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
```

---

## 5. Detail Kardinalitas Relasi
1. **`users` ↔ `profiles` (`1 : 1`)**: Satu akun pengguna tepat memiliki satu profil (`profiles.user_id` memiliki constraint `FOREIGN KEY` sekaligus `UNIQUE`).
2. **`users` ↔ `loans` (`1 : N`)**: Satu pengguna dapat memiliki banyak riwayat transaksi peminjaman, namun dibatasi maksimal **2 pinjaman berstatus `dipinjam`** pada saat bersamaan.
3. **`units` ↔ `loans` (`1 : N`)**: Satu unit naga dapat disewa berulang kali dari waktu ke waktu, tetapi hanya boleh berada pada maksimal **1 transaksi berstatus `dipinjam`** pada satu waktu.
4. **`units` ↔ `categories` (`M : N` via `category_unit`)**: Satu unit naga dapat memiliki lebih dari satu kategori, dan satu kategori dapat dimiliki oleh banyak unit naga melalui tabel pivot `category_unit` (`UNIQUE(unit_id, category_id)`).
