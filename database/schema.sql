-- Skema Database: Sistem Peminjaman Naga (DracoRent)
-- Target: MySQL / MariaDB (misalnya melalui phpMyAdmin)
-- Sesuai ERD 6 Tabel pada Dokumen BRD DracoRent

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `loans`;
DROP TABLE IF EXISTS `category_unit`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `units`;
DROP TABLE IF EXISTS `profiles`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `profiles` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `nama_lengkap` VARCHAR(255) NOT NULL,
    `no_telp` VARCHAR(20) NOT NULL,
    `alamat` TEXT NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `profiles_user_id_unique` (`user_id`),
    CONSTRAINT `profiles_user_id_foreign`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `units` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `kode_unit` VARCHAR(50) NOT NULL,
    `nama_unit` VARCHAR(100) NOT NULL,
    `gambar` VARCHAR(500) NULL,
    `status` ENUM('tersedia', 'dipinjam') NOT NULL DEFAULT 'tersedia',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `units_kode_unit_unique` (`kode_unit`),
    KEY `units_nama_unit_index` (`nama_unit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `categories` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama_kategori` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `categories_nama_kategori_unique` (`nama_kategori`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `category_unit` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `unit_id` BIGINT UNSIGNED NOT NULL,
    `category_id` BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `category_unit_unit_id_category_id_unique` (`unit_id`, `category_id`),
    KEY `category_unit_category_id_index` (`category_id`),
    CONSTRAINT `category_unit_unit_id_foreign`
        FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `category_unit_category_id_foreign`
        FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `loans` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `unit_id` BIGINT UNSIGNED NOT NULL,
    `tanggal_pinjam` DATE NOT NULL,
    `tanggal_tenggat` DATE NOT NULL,
    `tanggal_kembali` DATE NULL,
    `denda` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `status` ENUM('dipinjam', 'dikembalikan') NOT NULL DEFAULT 'dipinjam',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `loans_user_id_index` (`user_id`),
    KEY `loans_unit_id_index` (`unit_id`),
    KEY `loans_status_index` (`status`),
    CONSTRAINT `loans_user_id_foreign`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `loans_unit_id_foreign`
        FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- DATA AWAL (SEEDER) — AKUN LOGIN MUDAH (Password: 123456)
-- Hash bcrypt di bawah adalah untuk password: 123456
-- =====================================================================

INSERT INTO `users` (`id`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'admin@dracorent.com', '$2y$10$PIdsuzALi3qN7KSoblaLFuIBqcKq.2dEtYgYW8lpPUybL6VHNNGn2', 'admin', NOW(), NOW()),
(2, 'user@dracorent.com', '$2y$10$PIdsuzALi3qN7KSoblaLFuIBqcKq.2dEtYgYW8lpPUybL6VHNNGn2', 'user', NOW(), NOW()),
(3, 'roderic.vance@dracorent.com', '$2y$10$PIdsuzALi3qN7KSoblaLFuIBqcKq.2dEtYgYW8lpPUybL6VHNNGn2', 'user', NOW(), NOW()),
(4, 'samantha.drakos@dracorent.com', '$2y$10$PIdsuzALi3qN7KSoblaLFuIBqcKq.2dEtYgYW8lpPUybL6VHNNGn2', 'user', NOW(), NOW()),
(5, 'brandon.sunder@dracorent.com', '$2y$10$PIdsuzALi3qN7KSoblaLFuIBqcKq.2dEtYgYW8lpPUybL6VHNNGn2', 'user', NOW(), NOW());

INSERT INTO `profiles` (`user_id`, `nama_lengkap`, `no_telp`, `alamat`, `created_at`, `updated_at`) VALUES
(1, 'Kaelen Varr', '+62 811-9041-0012', 'Menara Pengawas Timur No. 01, Wilayah Dalam Benteng Kaer Drakon', NOW(), NOW()),
(2, 'Lyra Valen', '+62 812-4091-8821', 'Kompleks Pemukiman Pengawas Naga, Blok Karang Barat No. 14, Distrik Menara Api', NOW(), NOW()),
(3, 'Roderic Vance', '+62 813-8821-0094', 'Garnisun Ksatria Perbatasan Utara, Barak Elang Besi Blok C-08', NOW(), NOW()),
(4, 'Samantha Drakos', '+62 815-7732-1190', 'Distrik Akademi Drakonik, Menara Observasi Angin Lt. 3', NOW(), NOW()),
(5, 'Brandon Sunder', '+62 817-5501-3342', 'Pos Ekspedisi Lembah Belerang, Sektor Logistik Berat B-12', NOW(), NOW());

INSERT INTO `categories` (`id`, `nama_kategori`, `created_at`, `updated_at`) VALUES
(1, 'Wyrm Api', NOW(), NOW()),
(2, 'Frost Drake', NOW(), NOW()),
(3, 'Wyvern Badai', NOW(), NOW()),
(4, 'Lindworm Batuan', NOW(), NOW()),
(5, 'Transportasi Berat', NOW(), NOW()),
(6, 'Patroli Udara', NOW(), NOW()),
(7, 'Eskor & Tempur', NOW(), NOW());

INSERT INTO `units` (`id`, `kode_unit`, `nama_unit`, `gambar`, `status`, `created_at`, `updated_at`) VALUES
(1, 'NGA-101', 'Ignis Ashbringer', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCggr2psag6dAxaGbwXTGvrINqx3QXfiyJdLkFopL0EbsauyBRKq-elqsUojQKaHg9qzNR8CmYOCS7t2wxx55qufczvfub52P728CLzNCSl0cCJbFJFVAx3sWHkoNpD59C9t4w05Lzt2sxH8cV1t_9PQflYUiNrd1Zq-n17ZImrS4P-Z8XSlG-KjFyycaxId_yPYhMyHu8EbTFM40257jnosUyPK0rk5Q3Ujquk5kParp4sldZgXHxm', 'tersedia', NOW(), NOW()),
(2, 'NGA-102', 'Vermithrax Obsidian', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6e2SjC9tB9BZUgrGVSmarlnfvZWCk0yn4rFQmiPJRHg69DJFr6x30KWZhqhnH8aCTWzosXjBVlFu3lhF9uHtwzrUx30oNbgRI5xV0CnIL6G58BmxTEIsaaEuRYMoj8sEB0qMEjNf-qDoT1TZIiAGiavswfCl6MjxI_9P90m8PKQAGqwwmYwu0RPSh141JF9KnAOIUCuv0z0xrCIWvlMzc7IvATfkK-ykEM1uPl107Eg9HB1rP6HB8', 'dipinjam', NOW(), NOW()),
(3, 'NGA-103', 'Aetherius Zenith', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCy6iF5T8594MsOEhEOtakPSZuQQQhmlYD05U77NS6oE1qfpJUcP_tev8KGMy0hWNGn-ef2__Pu-HqMVSk6rVxTv2z3Q8MZKcKp-IdzkxY8Atb6HiHafdSi3Ffp4T1fBAeg5yunxKhyoVnP9JNU-7_tpe7WGe-Logx_NRNfaTKF4PHFYDHYkog8aCHygt8YK3oZaQdh0z-nfGKDGB3M884VVZcRQm9gJLL35NyIXSPKspCO4cB53g2m', 'tersedia', NOW(), NOW()),
(4, 'NGA-104', 'Boreas Glacie', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpAbGTFQTRefSL0Wl-3RlmzNbQbuYGlsAzQxjnJLUVIWpIbetTzJT1S1kYyZMnyVBjG_QLrqeAZHTEIdFlIyYUDYQGPai8uQ-6PL06Gb0QMn3UMxr2Ejnb8LpgKIFYs8G3UZpFpJRAVl1VZ9IIaalOmouxbB5UQ0HCoK6rVeTLUwliif950m7ix48WY3dwenaXcLAcKq0F7cF7lBTTG-O-Wk6rLhgYREtQ4ImbuL_sW0ih7OIuIpFX', 'tersedia', NOW(), NOW()),
(5, 'NGA-105', 'Zephyr Galecrest', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCCfXvUmdNJJSdrQdK5lEHbY8JKaA4xDdepnV7slthXOYZt_frgVBnljwWeRXeyR0EAL0UDqIt9Yb_u40cG2yVldW43Gtj-mLkfueGJ5OewPtEL5C4XAR-XMgTGvX6MgvJOBx5oKP9ZKKMGJdd3UHPLcJOFqa4ORACVZOCl6bxfz8hQdehLVmQS3xWMmtRNuFJxxExXqWkFrbEdO09ZBCyvRZFHS164MmB7gneEdEWX-h-3NRJZ8l1', 'tersedia', NOW(), NOW()),
(6, 'NGA-106', 'Pyrothrax the Bold', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAace1CfliGw20QpY8A6evAIKORjH-umCaw5-mCMMblE9eCeDktlxBmCcffJ2rHVHLjcNzG40dt_-BfCNijuXbhULgKYJ8GY2ChC_QBLlqu188CVL5VL0eAO7qTHGQWT5yFKfQzw0AzOQPw17pBkxEt0BF9RJtCltIG4dMDeprs_CykmXWyiTiesFcPBlHd_c8W4qaTw6lZOa8fxm1fzfAEz7PMJeheTOEknEaNfwU0tZVrOd0bQTjO', 'dipinjam', NOW(), NOW());

INSERT INTO `category_unit` (`unit_id`, `category_id`) VALUES
(1, 1), (1, 5),
(2, 4), (2, 5),
(3, 3), (3, 6),
(4, 2), (4, 7),
(5, 3), (5, 6),
(6, 1), (6, 7);

INSERT INTO `loans` (`id`, `user_id`, `unit_id`, `tanggal_pinjam`, `tanggal_tenggat`, `tanggal_kembali`, `denda`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, 3, '2026-10-20', '2026-10-24', '2026-10-23', 0.00, 'dikembalikan', NOW(), NOW()),
(2, 3, 2, '2026-10-18', '2026-10-21', NULL, 50000.00, 'dipinjam', NOW(), NOW()),
(3, 4, 6, '2026-10-19', '2026-10-22', NULL, 0.00, 'dipinjam', NOW(), NOW()),
(4, 2, 1, '2026-10-12', '2026-10-15', '2026-10-15', 0.00, 'dikembalikan', NOW(), NOW()),
(5, 3, 4, '2026-10-10', '2026-10-13', '2026-10-15', 100000.00, 'dikembalikan', NOW(), NOW()),
(6, 5, 5, '2026-10-05', '2026-10-08', '2026-10-09', 50000.00, 'dikembalikan', NOW(), NOW());
