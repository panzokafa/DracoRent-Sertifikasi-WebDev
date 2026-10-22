<?php

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Route any api.php request directly to public/api.php
if (basename($uri) === 'api.php') {
    require __DIR__ . '/api.php';
    exit;
}

$publicFile = __DIR__ . $uri;

// Serve static files directly when running PHP built-in server
if ($uri !== '/' && is_file($publicFile)) {
    return false;
}

$routeMap = [
    '/' => __DIR__ . '/preview-dnd.html',
    '/masuk' => __DIR__ . '/../resources/views/dracorent/masuk.blade.php',
    '/katalog-naga' => __DIR__ . '/../resources/views/dracorent/katalog-naga.blade.php',
    '/detail-naga' => __DIR__ . '/../resources/views/dracorent/detail-naga.blade.php',
    '/pinjaman-saya' => __DIR__ . '/../resources/views/dracorent/pinjaman-saya.blade.php',
    '/riwayat-rental' => __DIR__ . '/../resources/views/dracorent/riwayat-rental.blade.php',
    '/profil-saya' => __DIR__ . '/../resources/views/dracorent/profil-saya.blade.php',
    '/admin/ringkasan' => __DIR__ . '/../resources/views/dracorent/ringkasan.blade.php',
    '/admin/unit-naga' => __DIR__ . '/../resources/views/dracorent/unit-naga.blade.php',
    '/admin/tambah-unit' => __DIR__ . '/../resources/views/dracorent/tambah-unit-modal.blade.php',
    '/admin/kategori' => __DIR__ . '/../resources/views/dracorent/kategori.blade.php',
    '/admin/anggota' => __DIR__ . '/../resources/views/dracorent/anggota.blade.php',
    '/admin/pinjaman-aktif' => __DIR__ . '/../resources/views/dracorent/pinjaman-aktif.blade.php',
    '/admin/riwayat-dan-laporan' => __DIR__ . '/../resources/views/dracorent/riwayat-dan-laporan.blade.php',
];

$normalized = rtrim($uri, '/') ?: '/';

if (isset($routeMap[$normalized]) && is_file($routeMap[$normalized])) {
    readfile($routeMap[$normalized]);
    exit;
}

// Default fallback to interactive 13-screen portal
readfile(__DIR__ . '/preview-dnd.html');
