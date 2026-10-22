<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Loan;
use App\Models\Profile;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Akun Admin Mudah
        $admin = User::updateOrCreate(
            ['email' => 'admin@dracorent.com'],
            [
                'password' => Hash::make('123456'),
                'role' => 'admin',
            ]
        );

        Profile::updateOrCreate(
            ['user_id' => $admin->id],
            [
                'nama_lengkap' => 'Kaelen Varr (Kurator Admin)',
                'no_telp' => '+62 811-9041-0012',
                'alamat' => 'Menara Pengawas Timur No. 01, Wilayah Dalam Benteng Kaer Drakon',
            ]
        );

        // 2. Akun User / Anggota Mudah
        $user = User::updateOrCreate(
            ['email' => 'user@dracorent.com'],
            [
                'password' => Hash::make('123456'),
                'role' => 'user',
            ]
        );

        Profile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'nama_lengkap' => 'Lyra Valen (Anggota Serikat)',
                'no_telp' => '+62 812-4091-8821',
                'alamat' => 'Kompleks Pemukiman Penunggang Angin Sektor 4, Blok Obsidian No. 12',
            ]
        );

        // 3. Kategori Ordo Naga
        $catApi = Category::firstOrCreate(['nama_kategori' => 'Naga Api (Wyrm)']);
        $catHutan = Category::firstOrCreate(['nama_kategori' => 'Naga Hutan (Drake)']);
        $catLangit = Category::firstOrCreate(['nama_kategori' => 'Naga Langit (Amphithere)']);
        $catEs = Category::firstOrCreate(['nama_kategori' => 'Naga Es (Frost)']);
        $catBatu = Category::firstOrCreate(['nama_kategori' => 'Naga Batu (Lindworm)']);

        // 4. Unit Naga
        $u1 = Unit::updateOrCreate(
            ['kode_unit' => 'NGA-101'],
            ['nama_unit' => 'Ignis Ashbringer', 'gambar' => 'images/dragons/red.jpg', 'status' => 'tersedia']
        );
        $u1->categories()->syncWithoutDetaching([$catApi->id]);

        $u2 = Unit::updateOrCreate(
            ['kode_unit' => 'NGA-102'],
            ['nama_unit' => 'Sylvan Verdant', 'gambar' => 'images/dragons/green.jpg', 'status' => 'tersedia']
        );
        $u2->categories()->syncWithoutDetaching([$catHutan->id]);

        $u3 = Unit::updateOrCreate(
            ['kode_unit' => 'NGA-103'],
            ['nama_unit' => 'Aetherius Zenith', 'gambar' => 'images/dragons/blue.jpg', 'status' => 'dipinjam']
        );
        $u3->categories()->syncWithoutDetaching([$catLangit->id]);

        // 5. Pinjaman Aktif Contoh
        Loan::firstOrCreate(
            ['user_id' => $user->id, 'unit_id' => $u3->id, 'status' => 'dipinjam'],
            [
                'tanggal_pinjam' => '2026-10-22',
                'tanggal_tenggat' => '2026-10-26',
                'denda' => 0,
            ]
        );
    }
}
