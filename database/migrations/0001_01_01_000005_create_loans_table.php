<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->index()
                ->constrained('users')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->foreignId('unit_id')
                ->index()
                ->constrained('units')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->date('tanggal_pinjam');
            $table->date('tanggal_tenggat');
            $table->date('tanggal_kembali')->nullable();
            $table->decimal('denda', 10, 2)->default(0.00);
            $table->enum('status', ['dipinjam', 'dikembalikan'])->default('dipinjam')->index();
            $table->timestamps();
        });

        // Auto-seed initial guild data when running `php artisan migrate`
        if (DB::table('users')->count() === 0) {
            $hash = '$2y$10$PIdsuzALi3qN7KSoblaLFuIBqcKq.2dEtYgYW8lpPUybL6VHNNGn2'; // password: 123456
            $now = now();

            DB::table('users')->insert([
                ['id' => 1, 'email' => 'admin@dracorent.com', 'password' => $hash, 'role' => 'admin', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 2, 'email' => 'user@dracorent.com', 'password' => $hash, 'role' => 'user', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 3, 'email' => 'roderic.vance@dracorent.com', 'password' => $hash, 'role' => 'user', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 4, 'email' => 'samantha.drakos@dracorent.com', 'password' => $hash, 'role' => 'user', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 5, 'email' => 'brandon.sunder@dracorent.com', 'password' => $hash, 'role' => 'user', 'created_at' => $now, 'updated_at' => $now],
            ]);

            DB::table('profiles')->insert([
                ['user_id' => 1, 'nama_lengkap' => 'Kaelen Varr', 'no_telp' => '+62 811-9041-0012', 'alamat' => 'Menara Pengawas Timur No. 01, Wilayah Dalam Benteng Kaer Drakon', 'created_at' => $now, 'updated_at' => $now],
                ['user_id' => 2, 'nama_lengkap' => 'Lyra Valen', 'no_telp' => '+62 812-4091-8821', 'alamat' => 'Kompleks Pemukiman Pengawas Naga, Blok Karang Barat No. 14, Distrik Menara Api', 'created_at' => $now, 'updated_at' => $now],
                ['user_id' => 3, 'nama_lengkap' => 'Roderic Vance', 'no_telp' => '+62 813-8821-0094', 'alamat' => 'Garnisun Ksatria Perbatasan Utara, Barak Elang Besi Blok C-08', 'created_at' => $now, 'updated_at' => $now],
                ['user_id' => 4, 'nama_lengkap' => 'Samantha Drakos', 'no_telp' => '+62 815-7732-1190', 'alamat' => 'Distrik Akademi Drakonik, Menara Observasi Angin Lt. 3', 'created_at' => $now, 'updated_at' => $now],
                ['user_id' => 5, 'nama_lengkap' => 'Brandon Sunder', 'no_telp' => '+62 817-5501-3342', 'alamat' => 'Pos Ekspedisi Lembah Belerang, Sektor Logistik Berat B-12', 'created_at' => $now, 'updated_at' => $now],
            ]);

            DB::table('categories')->insert([
                ['id' => 1, 'nama_kategori' => 'Wyrm Api', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 2, 'nama_kategori' => 'Frost Drake', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 3, 'nama_kategori' => 'Wyvern Badai', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 4, 'nama_kategori' => 'Lindworm Batuan', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 5, 'nama_kategori' => 'Transportasi Berat', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 6, 'nama_kategori' => 'Patroli Udara', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 7, 'nama_kategori' => 'Eskor & Tempur', 'created_at' => $now, 'updated_at' => $now],
            ]);

            DB::table('units')->insert([
                ['id' => 1, 'kode_unit' => 'NGA-101', 'nama_unit' => 'Ignis Ashbringer', 'gambar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCggr2psag6dAxaGbwXTGvrINqx3QXfiyJdLkFopL0EbsauyBRKq-elqsUojQKaHg9qzNR8CmYOCS7t2wxx55qufczvfub52P728CLzNCSl0cCJbFJFVAx3sWHkoNpD59C9t4w05Lzt2sxH8cV1t_9PQflYUiNrd1Zq-n17ZImrS4P-Z8XSlG-KjFyycaxId_yPYhMyHu8EbTFM40257jnosUyPK0rk5Q3Ujquk5kParp4sldZgXHxm', 'status' => 'tersedia', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 2, 'kode_unit' => 'NGA-102', 'nama_unit' => 'Vermithrax Obsidian', 'gambar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6e2SjC9tB9BZUgrGVSmarlnfvZWCk0yn4rFQmiPJRHg69DJFr6x30KWZhqhnH8aCTWzosXjBVlFu3lhF9uHtwzrUx30oNbgRI5xV0CnIL6G58BmxTEIsaaEuRYMoj8sEB0qMEjNf-qDoT1TZIiAGiavswfCl6MjxI_9P90m8PKQAGqwwmYwu0RPSh141JF9KnAOIUCuv0z0xrCIWvlMzc7IvATfkK-ykEM1uPl107Eg9HB1rP6HB8', 'status' => 'dipinjam', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 3, 'kode_unit' => 'NGA-103', 'nama_unit' => 'Aetherius Zenith', 'gambar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCy6iF5T8594MsOEhEOtakPSZuQQQhmlYD05U77NS6oE1qfpJUcP_tev8KGMy0hWNGn-ef2__Pu-HqMVSk6rVxTv2z3Q8MZKcKp-IdzkxY8Atb6HiHafdSi3Ffp4T1fBAeg5yunxKhyoVnP9JNU-7_tpe7WGe-Logx_NRNfaTKF4PHFYDHYkog8aCHygt8YK3oZaQdh0z-nfGKDGB3M884VVZcRQm9gJLL35NyIXSPKspCO4cB53g2m', 'status' => 'dipinjam', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 4, 'kode_unit' => 'NGA-104', 'nama_unit' => 'Boreas Glacie', 'gambar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpAbGTFQTRefSL0Wl-3RlmzNbQbuYGlsAzQxjnJLUVIWpIbetTzJT1S1kYyZMnyVBjG_QLrqeAZHTEIdFlIyYUDYQGPai8uQ-6PL06Gb0QMn3UMxr2Ejnb8LpgKIFYs8G3UZpFpJRAVl1VZ9IIaalOmouxbB5UQ0HCoK6rVeTLUwliif950m7ix48WY3dwenaXcLAcKq0F7cF7lBTTG-O-Wk6rLhgYREtQ4ImbuL_sW0ih7OIuIpFX', 'status' => 'tersedia', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 5, 'kode_unit' => 'NGA-105', 'nama_unit' => 'Zephyr Galecrest', 'gambar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCCfXvUmdNJJSdrQdK5lEHbY8JKaA4xDdepnV7slthXOYZt_frgVBnljwWeRXeyR0EAL0UDqIt9Yb_u40cG2yVldW43Gtj-mLkfueGJ5OewPtEL5C4XAR-XMgTGvX6MgvJOBx5oKP9ZKKMGJdd3UHPLcJOFqa4ORACVZOCl6bxfz8hQdehLVmQS3xWMmtRNuFJxxExXqWkFrbEdO09ZBCyvRZFHS164MmB7gneEdEWX-h-3NRJZ8l1', 'status' => 'tersedia', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 6, 'kode_unit' => 'NGA-106', 'nama_unit' => 'Pyrothrax the Bold', 'gambar' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAace1CfliGw20QpY8A6evAIKORjH-umCaw5-mCMMblE9eCeDktlxBmCcffJ2rHVHLjcNzG40dt_-BfCNijuXbhULgKYJ8GY2ChC_QBLlqu188CVL5VL0eAO7qTHGQWT5yFKfQzw0AzOQPw17pBkxEt0BF9RJtCltIG4dMDeprs_CykmXWyiTiesFcPBlHd_c8W4qaTw6lZOa8fxm1fzfAEz7PMJeheTOEknEaNfwU0tZVrOd0bQTjO', 'status' => 'dipinjam', 'created_at' => $now, 'updated_at' => $now],
            ]);

            DB::table('category_unit')->insert([
                ['unit_id' => 1, 'category_id' => 1], ['unit_id' => 1, 'category_id' => 5],
                ['unit_id' => 2, 'category_id' => 4], ['unit_id' => 2, 'category_id' => 5],
                ['unit_id' => 3, 'category_id' => 3], ['unit_id' => 3, 'category_id' => 6],
                ['unit_id' => 4, 'category_id' => 2], ['unit_id' => 4, 'category_id' => 7],
                ['unit_id' => 5, 'category_id' => 3], ['unit_id' => 5, 'category_id' => 6],
                ['unit_id' => 6, 'category_id' => 1], ['unit_id' => 6, 'category_id' => 7],
            ]);

            DB::table('loans')->insert([
                ['id' => 1, 'user_id' => 2, 'unit_id' => 3, 'tanggal_pinjam' => '2026-10-20', 'tanggal_tenggat' => '2026-10-24', 'tanggal_kembali' => null, 'denda' => 0.00, 'status' => 'dipinjam', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 2, 'user_id' => 3, 'unit_id' => 2, 'tanggal_pinjam' => '2026-10-18', 'tanggal_tenggat' => '2026-10-21', 'tanggal_kembali' => null, 'denda' => 50000.00, 'status' => 'dipinjam', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 3, 'user_id' => 4, 'unit_id' => 6, 'tanggal_pinjam' => '2026-10-19', 'tanggal_tenggat' => '2026-10-22', 'tanggal_kembali' => null, 'denda' => 0.00, 'status' => 'dipinjam', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 4, 'user_id' => 2, 'unit_id' => 1, 'tanggal_pinjam' => '2026-10-12', 'tanggal_tenggat' => '2026-10-15', 'tanggal_kembali' => '2026-10-15', 'denda' => 0.00, 'status' => 'dikembalikan', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 5, 'user_id' => 3, 'unit_id' => 4, 'tanggal_pinjam' => '2026-10-10', 'tanggal_tenggat' => '2026-10-13', 'tanggal_kembali' => '2026-10-15', 'denda' => 100000.00, 'status' => 'dikembalikan', 'created_at' => $now, 'updated_at' => $now],
                ['id' => 6, 'user_id' => 5, 'unit_id' => 5, 'tanggal_pinjam' => '2026-10-05', 'tanggal_tenggat' => '2026-10-08', 'tanggal_kembali' => '2026-10-09', 'denda' => 50000.00, 'status' => 'dikembalikan', 'created_at' => $now, 'updated_at' => $now],
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};
