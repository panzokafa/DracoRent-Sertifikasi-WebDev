<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Sistem Peminjaman Naga - Valyria Stables')</title>
    <link rel="stylesheet" href="{{ asset('css/dnd-theme.css') }}">
    @stack('styles')
</head>
<body>
    <div class="tome-wrapper">
        <header style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid var(--border-brass); margin-bottom: 24px; position: relative;">
            <div style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.25em; color: var(--text-secondary); text-transform: uppercase;">
                Buku Catatan Kerajaan &bull; Valyria Stables &bull; Codex v4.2
            </div>
            <h1 style="margin: 6px 0;">Sistem Peminjaman Naga</h1>
            <p style="font-size: 14px; color: var(--text-secondary); font-style: italic; max-width: 580px; margin: 0 auto;">
                "Setiap naga terikat oleh sumpah darah dan akad pinjam yang tercatat dalam gulungan perkamen klan."
            </p>
        </header>

        <nav style="display: flex; justify-content: center; gap: 8px; margin-bottom: 24px; flex-wrap: wrap;">
            <a href="#katalog" class="btn-seal btn-seal-primary">🐉 Katalog Naga</a>
            <a href="#akad" class="btn-seal btn-seal-secondary">📜 Buku Peminjaman</a>
            <a href="#tambah" class="btn-seal btn-seal-secondary">✍️ Akad Baru</a>
        </nav>

        <main>
            @yield('content')
        </main>

        <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border-brass); text-align: center; font-size: 13px; color: var(--text-muted);">
            <p>&copy; {{ date('Y') }} Sistem Peminjaman Naga. Valyrian Dragonlords Guild. Dilindungi Hukum Kerajaan.</p>
        </footer>
    </div>
    @stack('scripts')
</body>
</html>
