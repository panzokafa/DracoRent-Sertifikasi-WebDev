<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| DracoRent — Guild Ledger & Volcanic Hearth Web Routes (13 Stitch Screens)
|--------------------------------------------------------------------------
*/

Route::get('/', fn () => view('dracorent.katalog-naga'))->name('katalog');
Route::get('/masuk', fn () => view('dracorent.masuk'))->name('login');
Route::get('/katalog-naga', fn () => view('dracorent.katalog-naga'))->name('dracorent.katalog-naga');
Route::get('/detail-naga', fn () => view('dracorent.detail-naga'))->name('dracorent.detail-naga');
Route::get('/pinjaman-saya', fn () => view('dracorent.pinjaman-saya'))->name('dracorent.pinjaman-saya');
Route::get('/riwayat-rental', fn () => view('dracorent.riwayat-rental'))->name('dracorent.riwayat-rental');
Route::get('/profil-saya', fn () => view('dracorent.profil-saya'))->name('dracorent.profil-saya');

// Admin Kurator Routes
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/ringkasan', fn () => view('dracorent.ringkasan'))->name('ringkasan');
    Route::get('/unit-naga', fn () => view('dracorent.unit-naga'))->name('unit-naga');
    Route::get('/tambah-unit', fn () => view('dracorent.tambah-unit-modal'))->name('tambah-unit');
    Route::get('/kategori', fn () => view('dracorent.kategori'))->name('kategori');
    Route::get('/anggota', fn () => view('dracorent.anggota'))->name('anggota');
    Route::get('/pinjaman-aktif', fn () => view('dracorent.pinjaman-aktif'))->name('pinjaman-aktif');
    Route::get('/riwayat-dan-laporan', fn () => view('dracorent.riwayat-dan-laporan'))->name('riwayat-dan-laporan');
});
