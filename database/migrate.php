<?php

/**
 * Skrip Otomatis Migrate & Seed Database DracoRent (Sistem Peminjaman Naga)
 * Jalankan di terminal: php database/migrate.php
 */

// Load .env configuration
$envFile = __DIR__ . '/../.env';
$envVars = [];
if (is_file($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            [$key, $val] = array_map('trim', explode('=', $line, 2));
            $val = trim($val, '"\'');
            $envVars[$key] = $val;
        }
    }
}

$host = $envVars['DB_HOST'] ?? getenv('DB_HOST') ?: '127.0.0.1';
$port = $envVars['DB_PORT'] ?? getenv('DB_PORT') ?: '3306';
$dbName = $envVars['DB_DATABASE'] ?? getenv('DB_DATABASE') ?: 'sistem_peminjaman_naga';
$username = $envVars['DB_USERNAME'] ?? getenv('DB_USERNAME') ?: 'root';
$password = $envVars['DB_PASSWORD'] ?? getenv('DB_PASSWORD') ?: '';

echo "=====================================================\n";
echo " DRACORENT — MIGRASI & SEED DATABASE OTOMATIS\n";
echo "=====================================================\n";

try {
    $pdo = new PDO("mysql:host={$host};port={$port};charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    echo "[1/3] Membuat database `{$dbName}` jika belum ada...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    $pdo->exec("USE `{$dbName}`;");

    echo "[2/3] Membersihkan tabel lama (fresh migration)...\n";
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
    foreach (['loans', 'category_unit', 'categories', 'units', 'profiles', 'users'] as $table) {
        $pdo->exec("DROP TABLE IF EXISTS `{$table}`;");
    }
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

    echo "[3/3] Menjalankan skema 6 tabel & seeder dari database/schema.sql...\n";
    $sqlPath = __DIR__ . '/schema.sql';
    $sql = file_get_contents($sqlPath);
    // Hapus UTF-8 BOM jika ada
    $sql = preg_replace('/^\xEF\xBB\xBF/', '', $sql);
    $pdo->exec($sql);

    echo "\n✅ MIGRASI & SEED BERHASIL!\n";
    echo "Database : {$dbName}\n";
    echo "Tabel    : users, profiles, units, categories, category_unit, loans\n";
    echo "Akun 1   : admin@dracorent.com (Password: 123456)\n";
    echo "Akun 2   : user@dracorent.com  (Password: 123456)\n";
} catch (PDOException $e) {
    echo "\n❌ Error Database: " . $e->getMessage() . "\n";
    exit(1);
}
