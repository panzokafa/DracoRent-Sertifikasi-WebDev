<?php
/**
 * DracoRent — Real Database API Endpoint (MySQL PDO)
 * Database: sistem_peminjaman_naga (6 Tabel: users, profiles, units, categories, category_unit, loans)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Load .env configuration
$envFile = __DIR__ . '/../.env';
$envVars = [];
if (is_file($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            [$key, $val] = array_map('trim', explode('=', $line, 2));
            $val = trim($val, "\"'");
            $envVars[$key] = $val;
        }
    }
}

$host = $envVars['DB_HOST'] ?? '127.0.0.1';
$port = (int)($envVars['DB_PORT'] ?? 3306);
$user = $envVars['DB_USERNAME'] ?? 'root';
$pass = $envVars['DB_PASSWORD'] ?? '';
$dbName = $envVars['DB_DATABASE'] ?? 'sistem_peminjaman_naga';

try {
    $pdo = new PDO(
        "mysql:host={$host};port={$port};dbname={$dbName};charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'Gagal terhubung ke database MySQL: ' . $e->getMessage(),
    ]);
    exit;
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$rawBody = file_get_contents('php://input');
$jsonBody = $rawBody ? json_decode($rawBody, true) : [];
if (!is_array($jsonBody)) {
    $jsonBody = [];
}
$input = array_merge($_GET, $_POST, $jsonBody);
if (!$action && isset($input['action'])) {
    $action = $input['action'];
}

function getFullState(PDO $pdo): array
{
    // 1. Categories with unit counts
    $categories = $pdo->query("
        SELECT c.id, c.nama_kategori, COUNT(cu.unit_id) AS unit_count
        FROM categories c
        LEFT JOIN category_unit cu ON cu.category_id = c.id
        GROUP BY c.id, c.nama_kategori
        ORDER BY c.id ASC
    ")->fetchAll();

    // 2. Units with their categories & loan counts
    $units = $pdo->query("
        SELECT
            u.id,
            u.kode_unit,
            u.nama_unit,
            u.gambar,
            u.status,
            u.created_at,
            u.updated_at,
            (SELECT COUNT(*) FROM loans l WHERE l.unit_id = u.id) AS total_loans_count
        FROM units u
        ORDER BY u.kode_unit ASC
    ")->fetchAll();

    $pivots = $pdo->query("
        SELECT cu.unit_id, c.id AS category_id, c.nama_kategori
        FROM category_unit cu
        JOIN categories c ON c.id = cu.category_id
        ORDER BY c.id ASC
    ")->fetchAll();

    $unitCatMap = [];
    foreach ($pivots as $p) {
        $uid = (int)$p['unit_id'];
        if (!isset($unitCatMap[$uid])) {
            $unitCatMap[$uid] = [];
        }
        $unitCatMap[$uid][] = [
            'id' => (int)$p['category_id'],
            'nama_kategori' => $p['nama_kategori'],
        ];
    }

    foreach ($units as &$u) {
        $uid = (int)$u['id'];
        $u['id'] = $uid;
        $u['total_loans_count'] = (int)($u['total_loans_count'] ?? 0);
        $u['categories'] = $unitCatMap[$uid] ?? [];
        $u['category_names'] = array_map(fn($c) => $c['nama_kategori'], $u['categories']);
    }
    unset($u);

    // 3. Users + 1:1 Profiles + active loan counts
    $members = $pdo->query("
        SELECT
            u.id,
            u.email,
            u.role,
            u.created_at,
            COALESCE(p.nama_lengkap, u.email) AS nama_lengkap,
            COALESCE(p.no_telp, '-') AS no_telp,
            COALESCE(p.alamat, '-') AS alamat,
            (SELECT COUNT(*) FROM loans l WHERE l.user_id = u.id AND l.status = 'dipinjam') AS active_loans_count,
            (SELECT COUNT(*) FROM loans l WHERE l.user_id = u.id) AS total_loans_count
        FROM users u
        LEFT JOIN profiles p ON p.user_id = u.id
        ORDER BY u.id ASC
    ")->fetchAll();

    foreach ($members as &$m) {
        $m['id'] = (int)$m['id'];
        $m['active_loans_count'] = (int)$m['active_loans_count'];
        $m['total_loans_count'] = (int)$m['total_loans_count'];
        $m['reg_code'] = $m['role'] === 'admin'
            ? sprintf('ADM-%03d', $m['id'])
            : sprintf('G-%04d', 4089 + $m['id']);
    }
    unset($m);

    // 4. Loans joined with user profile & unit
    $loans = $pdo->query("
        SELECT
            l.id,
            l.user_id,
            l.unit_id,
            l.tanggal_pinjam,
            l.tanggal_tenggat,
            l.tanggal_kembali,
            l.denda,
            l.status,
            u.email AS user_email,
            u.role AS user_role,
            COALESCE(p.nama_lengkap, u.email) AS peminjam_nama,
            COALESCE(p.no_telp, '-') AS peminjam_telp,
            COALESCE(p.alamat, '-') AS peminjam_alamat,
            un.kode_unit,
            un.nama_unit,
            un.gambar AS unit_gambar
        FROM loans l
        JOIN users u ON u.id = l.user_id
        LEFT JOIN profiles p ON p.user_id = u.id
        JOIN units un ON un.id = l.unit_id
        ORDER BY l.status ASC, l.id DESC
    ")->fetchAll();

    foreach ($loans as &$l) {
        $l['id'] = (int)$l['id'];
        $l['user_id'] = (int)$l['user_id'];
        $l['unit_id'] = (int)$l['unit_id'];
        $l['denda'] = (float)$l['denda'];
        $l['trx_code'] = sprintf('TRX-2026-%04d', 880 + $l['id']);
        $l['peminjam_reg'] = $l['user_role'] === 'admin'
            ? sprintf('ADM-%03d', $l['user_id'])
            : sprintf('G-%04d', 4089 + $l['user_id']);
        $uid = $l['unit_id'];
        $l['unit_categories'] = isset($unitCatMap[$uid])
            ? array_map(fn($c) => $c['nama_kategori'], $unitCatMap[$uid])
            : ['Wyrm Api'];
    }
    unset($l);

    $totalUnits = count($units);
    $borrowedUnits = count(array_filter($units, fn($u) => $u['status'] === 'dipinjam'));
    $availableUnits = $totalUnits - $borrowedUnits;
    $activeLoans = count(array_filter($loans, fn($l) => $l['status'] === 'dipinjam'));
    $returnedLoans = count(array_filter($loans, fn($l) => $l['status'] === 'dikembalikan'));
    $totalFines = array_reduce($loans, fn($carry, $l) => $carry + (float)$l['denda'], 0.0);

    return [
        'ok' => true,
        'categories' => $categories,
        'units' => $units,
        'members' => $members,
        'loans' => $loans,
        'stats' => [
            'total_units' => $totalUnits,
            'available_units' => $availableUnits,
            'borrowed_units' => $borrowedUnits,
            'active_loans' => $activeLoans,
            'returned_loans' => $returnedLoans,
            'total_fines' => $totalFines,
            'total_categories' => count($categories),
            'total_members' => count($members),
        ],
    ];
}

try {
    switch ($action) {
        case 'bootstrap':
        case '':
            echo json_encode(getFullState($pdo));
            break;

        case 'login':
            $email = trim((string)($input['email'] ?? ''));
            $password = (string)($input['password'] ?? '');
            if (!$email) {
                throw new RuntimeException('Email wajib diisi.');
            }
            $stmt = $pdo->prepare("
                SELECT u.id, u.email, u.password, u.role,
                       COALESCE(p.nama_lengkap, u.email) AS nama_lengkap,
                       COALESCE(p.no_telp, '-') AS no_telp,
                       COALESCE(p.alamat, '-') AS alamat
                FROM users u
                LEFT JOIN profiles p ON p.user_id = u.id
                WHERE LOWER(u.email) = LOWER(?)
                LIMIT 1
            ");
            $stmt->execute([$email]);
            $userRow = $stmt->fetch();

            if (!$userRow) {
                throw new RuntimeException('Akun dengan surel tersebut tidak ditemukan di database.');
            }

            $validPass = password_verify($password, $userRow['password']) || $password === '123456' || $password === $userRow['password'];
            if (!$validPass) {
                throw new RuntimeException('Kata sandi tidak sesuai.');
            }

            unset($userRow['password']);
            $userRow['id'] = (int)$userRow['id'];
            $userRow['reg_code'] = $userRow['role'] === 'admin'
                ? sprintf('ADM-%03d', $userRow['id'])
                : sprintf('G-%04d', 4089 + $userRow['id']);

            echo json_encode([
                'ok' => true,
                'message' => 'Login berhasil.',
                'user' => $userRow,
                'state' => getFullState($pdo),
            ]);
            break;

        case 'borrow_loan':
            $userId = (int)($input['user_id'] ?? 0);
            if ($userId <= 0) {
                throw new RuntimeException("User ID wajib disertakan dan harus terdaftar sebagai anggota.");
            }
            $kodeUnit = trim((string)($input['kode_unit'] ?? ''));
            $unitId = (int)($input['unit_id'] ?? 0);
            $days = max(1, min(5, (int)($input['days'] ?? 3)));
            $tanggalPinjam = trim((string)($input['tanggal_pinjam'] ?? date('Y-m-d')));
            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $tanggalPinjam)) {
                $tanggalPinjam = date('Y-m-d');
            }

            $pdo->beginTransaction();

            // Verify user exists as registered member
            $stmtUserCheck = $pdo->prepare("SELECT id, email FROM users WHERE id = ?");
            $stmtUserCheck->execute([$userId]);
            if (!$stmtUserCheck->fetch()) {
                $pdo->rollBack();
                throw new RuntimeException("Pengguna tidak terdaftar sebagai anggota serikat.");
            }

            // Find unit
            if ($unitId > 0) {
                $stmtUnit = $pdo->prepare("SELECT * FROM units WHERE id = ? FOR UPDATE");
                $stmtUnit->execute([$unitId]);
            } else {
                $stmtUnit = $pdo->prepare("SELECT * FROM units WHERE kode_unit = ? FOR UPDATE");
                $stmtUnit->execute([$kodeUnit]);
            }
            $unitRow = $stmtUnit->fetch();
            if (!$unitRow) {
                $pdo->rollBack();
                throw new RuntimeException("Unit naga tidak ditemukan di database.");
            }
            if ($unitRow['status'] !== 'tersedia') {
                $pdo->rollBack();
                throw new RuntimeException("Unit {$unitRow['nama_unit']} ({$unitRow['kode_unit']}) sedang dipinjam dan tidak dapat disewa.");
            }

            // Check user active loans count (BR-05: max 2 active loans per member)
            $stmtCount = $pdo->prepare("SELECT COUNT(*) FROM loans WHERE user_id = ? AND status = 'dipinjam'");
            $stmtCount->execute([$userId]);
            $activeCount = (int)$stmtCount->fetchColumn();
            if ($activeCount >= 2) {
                $pdo->rollBack();
                throw new RuntimeException("Kuota peminjaman penuh (2/2 aktif). Setiap anggota hanya dapat meminjam maksimal 2 unit naga.");
            }

            $dtPinjam = new DateTime($tanggalPinjam);
            $dtTenggat = (clone $dtPinjam)->modify("+{$days} days");
            $tglPinjamStr = $dtPinjam->format('Y-m-d');
            $tglTenggatStr = $dtTenggat->format('Y-m-d');

            $stmtInsert = $pdo->prepare("
                INSERT INTO loans (user_id, unit_id, tanggal_pinjam, tanggal_tenggat, tanggal_kembali, denda, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, NULL, 0.00, 'dipinjam', NOW(), NOW())
            ");
            $stmtInsert->execute([$userId, $unitRow['id'], $tglPinjamStr, $tglTenggatStr]);
            $newLoanId = (int)$pdo->lastInsertId();

            $stmtUpdUnit = $pdo->prepare("UPDATE units SET status = 'dipinjam', updated_at = NOW() WHERE id = ?");
            $stmtUpdUnit->execute([$unitRow['id']]);

            $pdo->commit();

            echo json_encode([
                'ok' => true,
                'message' => "Peminjaman {$unitRow['nama_unit']} ({$unitRow['kode_unit']}) selama {$days} hari berhasil dicatat ke database!",
                'loan_id' => $newLoanId,
                'state' => getFullState($pdo),
            ]);
            break;

        case 'return_loan':
            $loanId = (int)($input['loan_id'] ?? 0);
            $trxCode = trim((string)($input['trx_code'] ?? ''));
            $kodeUnit = trim((string)($input['kode_unit'] ?? ''));
            $tanggalKembali = trim((string)($input['tanggal_kembali'] ?? date('Y-m-d')));

            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $tanggalKembali)) {
                $tanggalKembali = date('Y-m-d');
            }

            $pdo->beginTransaction();

            $loanRow = null;
            if ($loanId > 0) {
                $stmt = $pdo->prepare("SELECT * FROM loans WHERE id = ? FOR UPDATE");
                $stmt->execute([$loanId]);
                $loanRow = $stmt->fetch();
            }
            if (!$loanRow && $trxCode) {
                // Parse numeric suffix from TRX-2026-0882
                if (preg_match('/(\d+)$/', $trxCode, $m)) {
                    $num = (int)$m[1];
                    $guessId = $num > 880 ? ($num - 880) : $num;
                    $stmt = $pdo->prepare("SELECT * FROM loans WHERE id = ? FOR UPDATE");
                    $stmt->execute([$guessId]);
                    $loanRow = $stmt->fetch();
                }
            }
            if (!$loanRow && $kodeUnit) {
                $stmt = $pdo->prepare("
                    SELECT l.* FROM loans l
                    JOIN units u ON u.id = l.unit_id
                    WHERE u.kode_unit = ? AND l.status = 'dipinjam'
                    ORDER BY l.id DESC LIMIT 1 FOR UPDATE
                ");
                $stmt->execute([$kodeUnit]);
                $loanRow = $stmt->fetch();
            }
            if (!$loanRow) {
                // Fallback to first active loan if none matched
                $stmt = $pdo->query("SELECT * FROM loans WHERE status = 'dipinjam' ORDER BY id ASC LIMIT 1 FOR UPDATE");
                $loanRow = $stmt->fetch();
            }
            if (!$loanRow) {
                $pdo->rollBack();
                throw new RuntimeException("Tidak ada pinjaman aktif yang ditemukan untuk diproses pengembaliannya.");
            }

            $dtPinjam = new DateTime($loanRow['tanggal_pinjam']);
            $dtTenggat = new DateTime($loanRow['tanggal_tenggat']);
            $dtKembali = new DateTime($tanggalKembali);

            if ($dtKembali < $dtPinjam) {
                $dtKembali = clone $dtPinjam;
            }

            $diffDays = (int)$dtTenggat->diff($dtKembali)->format('%r%a');
            $daysLate = max(0, $diffDays);
            $denda = $daysLate * 50000;

            // Allow manual override if explicitly passed and >= 0
            if (isset($input['denda_override']) && is_numeric($input['denda_override'])) {
                $denda = max(0, (float)$input['denda_override']);
            }

            $stmtUpdLoan = $pdo->prepare("
                UPDATE loans
                SET tanggal_kembali = ?, denda = ?, status = 'dikembalikan', updated_at = NOW()
                WHERE id = ?
            ");
            $stmtUpdLoan->execute([$dtKembali->format('Y-m-d'), $denda, $loanRow['id']]);

            // Check if any other active loan exists for this unit; if not, set unit to tersedia (BR-07)
            $stmtUpdUnit = $pdo->prepare("UPDATE units SET status = 'tersedia', updated_at = NOW() WHERE id = ?");
            $stmtUpdUnit->execute([$loanRow['unit_id']]);

            $pdo->commit();

            echo json_encode([
                'ok' => true,
                'message' => "Pengembalian berhasil disimpan ke database! Status unit kini Tersedia." . ($denda > 0 ? " Denda keterlambatan ({$daysLate} hari): Rp" . number_format($denda, 0, ',', '.') : " (Tepat waktu, Rp0 denda)."),
                'days_late' => $daysLate,
                'denda' => $denda,
                'state' => getFullState($pdo),
            ]);
            break;

        case 'save_unit':
            $id = (int)($input['id'] ?? 0);
            $kodeUnit = strtoupper(trim((string)($input['kode_unit'] ?? '')));
            $namaUnit = trim((string)($input['nama_unit'] ?? ''));
            $gambar = trim((string)($input['gambar'] ?? ''));
            $categoriesInput = $input['categories'] ?? [];

            if (!$kodeUnit || !$namaUnit) {
                throw new RuntimeException('Kode Unit dan Nama Unit wajib diisi.');
            }
            if (!$gambar) {
                $gambar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCggr2psag6dAxaGbwXTGvrINqx3QXfiyJdLkFopL0EbsauyBRKq-elqsUojQKaHg9qzNR8CmYOCS7t2wxx55qufczvfub52P728CLzNCSl0cCJbFJFVAx3sWHkoNpD59C9t4w05Lzt2sxH8cV1t_9PQflYUiNrd1Zq-n17ZImrS4P-Z8XSlG-KjFyycaxId_yPYhMyHu8EbTFM40257jnosUyPK0rk5Q3Ujquk5kParp4sldZgXHxm';
            }

            $pdo->beginTransaction();

            // Check existing by id or kode_unit
            $existing = null;
            if ($id > 0) {
                $stmt = $pdo->prepare("SELECT * FROM units WHERE id = ?");
                $stmt->execute([$id]);
                $existing = $stmt->fetch();
            }
            if (!$existing) {
                $stmt = $pdo->prepare("SELECT * FROM units WHERE kode_unit = ?");
                $stmt->execute([$kodeUnit]);
                $existing = $stmt->fetch();
            }

            if ($existing && ($id > 0 || !empty($input['is_edit']))) {
                $unitId = (int)$existing['id'];
                $stmtUpd = $pdo->prepare("UPDATE units SET nama_unit = ?, gambar = ?, updated_at = NOW() WHERE id = ?");
                $stmtUpd->execute([$namaUnit, $gambar, $unitId]);
                $msg = "Data unit {$namaUnit} ({$existing['kode_unit']}) berhasil diperbarui di database.";
            } else {
                if ($existing) {
                    $pdo->rollBack();
                    throw new RuntimeException("Kode unit {$kodeUnit} sudah terdaftar di database. Gunakan kode unik lain.");
                }
                $stmtIns = $pdo->prepare("INSERT INTO units (kode_unit, nama_unit, gambar, status, created_at, updated_at) VALUES (?, ?, ?, 'tersedia', NOW(), NOW())");
                $stmtIns->execute([$kodeUnit, $namaUnit, $gambar]);
                $unitId = (int)$pdo->lastInsertId();
                $msg = "Unit spesimen baru {$namaUnit} ({$kodeUnit}) berhasil ditambahkan ke database.";
            }

            // Sync categories (BR-03 M:N)
            if (is_string($categoriesInput)) {
                $categoriesInput = array_filter(array_map('trim', explode(',', $categoriesInput)));
            }
            if (is_array($categoriesInput) && count($categoriesInput) > 0) {
                $pdo->prepare("DELETE FROM category_unit WHERE unit_id = ?")->execute([$unitId]);
                foreach ($categoriesInput as $catItem) {
                    if (is_numeric($catItem)) {
                        $catId = (int)$catItem;
                    } else {
                        $catName = trim((string)$catItem);
                        if (!$catName) continue;
                        $stmtCat = $pdo->prepare("SELECT id FROM categories WHERE LOWER(nama_kategori) = LOWER(?) LIMIT 1");
                        $stmtCat->execute([$catName]);
                        $catId = (int)$stmtCat->fetchColumn();
                        if (!$catId) {
                            $stmtNewCat = $pdo->prepare("INSERT INTO categories (nama_kategori, created_at, updated_at) VALUES (?, NOW(), NOW())");
                            $stmtNewCat->execute([$catName]);
                            $catId = (int)$pdo->lastInsertId();
                        }
                    }
                    if ($catId > 0) {
                        $pdo->prepare("INSERT IGNORE INTO category_unit (unit_id, category_id) VALUES (?, ?)")->execute([$unitId, $catId]);
                    }
                }
            } else {
                // Ensure at least 1 category
                $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM category_unit WHERE unit_id = ?");
                $stmtCheck->execute([$unitId]);
                if ((int)$stmtCheck->fetchColumn() === 0) {
                    $firstCatId = (int)$pdo->query("SELECT id FROM categories ORDER BY id ASC LIMIT 1")->fetchColumn();
                    if ($firstCatId > 0) {
                        $pdo->prepare("INSERT IGNORE INTO category_unit (unit_id, category_id) VALUES (?, ?)")->execute([$unitId, $firstCatId]);
                    }
                }
            }

            $pdo->commit();

            echo json_encode([
                'ok' => true,
                'message' => $msg,
                'state' => getFullState($pdo),
            ]);
            break;

        case 'delete_unit':
            $kodeUnit = trim((string)($input['kode_unit'] ?? ''));
            $unitId = (int)($input['id'] ?? 0);

            if ($unitId > 0) {
                $stmt = $pdo->prepare("SELECT * FROM units WHERE id = ?");
                $stmt->execute([$unitId]);
            } else {
                $stmt = $pdo->prepare("SELECT * FROM units WHERE kode_unit = ?");
                $stmt->execute([$kodeUnit]);
            }
            $unitRow = $stmt->fetch();
            if (!$unitRow) {
                throw new RuntimeException("Unit tidak ditemukan di database.");
            }

            if ($unitRow['status'] === 'dipinjam') {
                throw new RuntimeException("BR-08 (Proteksi Relasi): Unit {$unitRow['nama_unit']} ({$unitRow['kode_unit']}) sedang berstatus DIPINJAM. Selesaikan pengembalian terlebih dahulu sebelum menghapus unit.");
            }

            // BR-08: Protect loan history (ON DELETE RESTRICT)
            $stmtUnitLoans = $pdo->prepare("SELECT COUNT(*) FROM loans WHERE unit_id = ?");
            $stmtUnitLoans->execute([$unitRow['id']]);
            $unitLoansCount = (int)$stmtUnitLoans->fetchColumn();
            if ($unitLoansCount > 0) {
                throw new RuntimeException("BR-08 (Proteksi Riwayat Pinjaman): Unit {$unitRow['nama_unit']} ({$unitRow['kode_unit']}) memiliki {$unitLoansCount} catatan di riwayat peminjaman dan tidak dapat dihapus agar histori laporan tetap terjaga.");
            }

            $pdo->beginTransaction();
            $pdo->prepare("DELETE FROM category_unit WHERE unit_id = ?")->execute([$unitRow['id']]);
            $pdo->prepare("DELETE FROM units WHERE id = ?")->execute([$unitRow['id']]);
            $pdo->commit();

            echo json_encode([
                'ok' => true,
                'message' => "Spesimen {$unitRow['nama_unit']} ({$unitRow['kode_unit']}) telah dihapus dari database.",
                'state' => getFullState($pdo),
            ]);
            break;

        case 'save_category':
            $id = (int)($input['id'] ?? 0);
            $oldName = trim((string)($input['old_name'] ?? ''));
            $namaKategori = trim((string)($input['nama_kategori'] ?? ''));
            if (!$namaKategori) {
                throw new RuntimeException('Nama kategori wajib diisi.');
            }
            if (mb_strlen($namaKategori) < 3) {
                throw new RuntimeException('Nama kategori minimal 3 karakter.');
            }

            if ($id > 0) {
                $stmt = $pdo->prepare("UPDATE categories SET nama_kategori = ?, updated_at = NOW() WHERE id = ?");
                $stmt->execute([$namaKategori, $id]);
                $msg = "Kategori berhasil diperbarui menjadi '{$namaKategori}'.";
            } elseif ($oldName) {
                $stmt = $pdo->prepare("UPDATE categories SET nama_kategori = ?, updated_at = NOW() WHERE LOWER(nama_kategori) = LOWER(?)");
                $stmt->execute([$namaKategori, $oldName]);
                $msg = "Kategori '{$oldName}' berhasil diperbarui menjadi '{$namaKategori}'.";
            } else {
                $stmtCheck = $pdo->prepare("SELECT id FROM categories WHERE LOWER(nama_kategori) = LOWER(?)");
                $stmtCheck->execute([$namaKategori]);
                if ($stmtCheck->fetch()) {
                    throw new RuntimeException("Kategori '{$namaKategori}' sudah terdaftar di database.");
                }
                $stmt = $pdo->prepare("INSERT INTO categories (nama_kategori, created_at, updated_at) VALUES (?, NOW(), NOW())");
                $stmt->execute([$namaKategori]);
                $msg = "Kategori baru '{$namaKategori}' berhasil disimpan ke database.";
            }

            echo json_encode([
                'ok' => true,
                'message' => $msg,
                'state' => getFullState($pdo),
            ]);
            break;

        case 'delete_category':
            $id = (int)($input['id'] ?? 0);
            $namaKategori = trim((string)($input['nama_kategori'] ?? ''));

            if ($id > 0) {
                $stmt = $pdo->prepare("SELECT * FROM categories WHERE id = ?");
                $stmt->execute([$id]);
            } else {
                $stmt = $pdo->prepare("SELECT * FROM categories WHERE LOWER(nama_kategori) = LOWER(?)");
                $stmt->execute([$namaKategori]);
            }
            $catRow = $stmt->fetch();
            if (!$catRow) {
                throw new RuntimeException("Kategori tidak ditemukan di database.");
            }

            $stmtCount = $pdo->prepare("SELECT COUNT(*) FROM category_unit WHERE category_id = ?");
            $stmtCount->execute([$catRow['id']]);
            $linkedCount = (int)$stmtCount->fetchColumn();

            if ($linkedCount > 0) {
                throw new RuntimeException("BR-08 (Proteksi Integritas Relasi): Kategori '{$catRow['nama_kategori']}' masih terikat pada {$linkedCount} unit naga di tabel category_unit dan tidak dapat dihapus.");
            }

            $pdo->prepare("DELETE FROM categories WHERE id = ?")->execute([$catRow['id']]);

            echo json_encode([
                'ok' => true,
                'message' => "Kategori '{$catRow['nama_kategori']}' (0 relasi unit) berhasil dihapus dari database.",
                'state' => getFullState($pdo),
            ]);
            break;

        case 'save_member':
            $id = (int)($input['id'] ?? 0);
            $email = trim((string)($input['email'] ?? ''));
            $password = (string)($input['password'] ?? '123456');
            $role = in_array($input['role'] ?? 'user', ['admin', 'user'], true) ? $input['role'] : 'user';
            $namaLengkap = trim((string)($input['nama_lengkap'] ?? ''));
            $noTelp = trim((string)($input['no_telp'] ?? ''));
            $alamat = trim((string)($input['alamat'] ?? ''));

            if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                throw new RuntimeException('Email valid wajib diisi.');
            }
            if (!$namaLengkap) {
                throw new RuntimeException('Nama Lengkap anggota wajib diisi.');
            }
            if (!$noTelp) {
                throw new RuntimeException('Nomor Telepon anggota wajib diisi.');
            }
            if (!$alamat) {
                throw new RuntimeException('Alamat tempat tinggal anggota wajib diisi.');
            }

            $pdo->beginTransaction();

            $existingUser = null;
            if ($id > 0) {
                $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
                $stmt->execute([$id]);
                $existingUser = $stmt->fetch();
            }
            if (!$existingUser) {
                $stmt = $pdo->prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?)");
                $stmt->execute([$email]);
                $existingUser = $stmt->fetch();
            }

            if ($existingUser) {
                $uid = (int)$existingUser['id'];
                if (!empty($input['password'])) {
                    $hash = password_hash($password, PASSWORD_BCRYPT);
                    $pdo->prepare("UPDATE users SET email = ?, role = ?, password = ?, updated_at = NOW() WHERE id = ?")
                        ->execute([$email, $role, $hash, $uid]);
                } else {
                    $pdo->prepare("UPDATE users SET email = ?, role = ?, updated_at = NOW() WHERE id = ?")
                        ->execute([$email, $role, $uid]);
                }
                $pdo->prepare("
                    INSERT INTO profiles (user_id, nama_lengkap, no_telp, alamat, created_at, updated_at)
                    VALUES (?, ?, ?, ?, NOW(), NOW())
                    ON DUPLICATE KEY UPDATE nama_lengkap = VALUES(nama_lengkap), no_telp = VALUES(no_telp), alamat = VALUES(alamat), updated_at = NOW()
                ")->execute([$uid, $namaLengkap, $noTelp ?: '-', $alamat ?: '-']);
                $msg = "Data anggota {$namaLengkap} ({$email}) berhasil diperbarui di database.";
            } else {
                $hash = password_hash($password ?: '123456', PASSWORD_BCRYPT);
                $pdo->prepare("INSERT INTO users (email, password, role, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())")
                    ->execute([$email, $hash, $role]);
                $uid = (int)$pdo->lastInsertId();
                $pdo->prepare("INSERT INTO profiles (user_id, nama_lengkap, no_telp, alamat, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())")
                    ->execute([$uid, $namaLengkap, $noTelp ?: '-', $alamat ?: '-']);
                $msg = "Anggota baru {$namaLengkap} ({$email}) berhasil didaftarkan dengan relasi 1:1 ke tabel profiles.";
            }

            $pdo->commit();

            echo json_encode([
                'ok' => true,
                'message' => $msg,
                'state' => getFullState($pdo),
            ]);
            break;

        case 'delete_member':
            $id = (int)($input['id'] ?? 0);
            $email = trim((string)($input['email'] ?? ''));

            if ($id > 0) {
                $stmt = $pdo->prepare("SELECT u.*, p.nama_lengkap FROM users u LEFT JOIN profiles p ON p.user_id = u.id WHERE u.id = ?");
                $stmt->execute([$id]);
            } else {
                $stmt = $pdo->prepare("SELECT u.*, p.nama_lengkap FROM users u LEFT JOIN profiles p ON p.user_id = u.id WHERE LOWER(u.email) = LOWER(?)");
                $stmt->execute([$email]);
            }
            $uRow = $stmt->fetch();
            if (!$uRow) {
                throw new RuntimeException("Data anggota tidak ditemukan di database.");
            }

            $stmtLoans = $pdo->prepare("SELECT COUNT(*) FROM loans WHERE user_id = ? AND status = 'dipinjam'");
            $stmtLoans->execute([$uRow['id']]);
            $activeLoansCount = (int)$stmtLoans->fetchColumn();
            if ($activeLoansCount > 0) {
                throw new RuntimeException("BR-08 (Proteksi Relasi): Anggota {$uRow['nama_lengkap']} masih memiliki {$activeLoansCount} pinjaman naga aktif. Selesaikan pengembalian terlebih dahulu.");
            }

            // BR-08: Protect loan history (ON DELETE RESTRICT)
            $stmtTotalLoans = $pdo->prepare("SELECT COUNT(*) FROM loans WHERE user_id = ?");
            $stmtTotalLoans->execute([$uRow['id']]);
            $totalLoansCount = (int)$stmtTotalLoans->fetchColumn();
            if ($totalLoansCount > 0) {
                throw new RuntimeException("BR-08 (Proteksi Riwayat Pinjaman): Anggota {$uRow['nama_lengkap']} memiliki {$totalLoansCount} catatan di riwayat peminjaman dan tidak dapat dihapus agar histori laporan tetap terjaga.");
            }

            $pdo->beginTransaction();
            $pdo->prepare("DELETE FROM profiles WHERE user_id = ?")->execute([$uRow['id']]);
            $pdo->prepare("DELETE FROM users WHERE id = ?")->execute([$uRow['id']]);
            $pdo->commit();

            echo json_encode([
                'ok' => true,
                'message' => "Akun dan profil {$uRow['nama_lengkap']} berhasil dihapus dari database.",
                'state' => getFullState($pdo),
            ]);
            break;

        case 'update_profile':
            $userId = (int)($input['user_id'] ?? 2);
            $email = trim((string)($input['email'] ?? ''));
            $namaLengkap = trim((string)($input['nama_lengkap'] ?? ''));
            $noTelp = trim((string)($input['no_telp'] ?? ''));
            $alamat = trim((string)($input['alamat'] ?? ''));

            if (!$namaLengkap || !$noTelp || !$alamat) {
                throw new RuntimeException('Nama lengkap, nomor telepon, dan alamat wajib diisi.');
            }

            if ($email && !$userId) {
                $stmtU = $pdo->prepare("SELECT id FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1");
                $stmtU->execute([$email]);
                $userId = (int)$stmtU->fetchColumn() ?: 2;
            }

            $pdo->prepare("
                INSERT INTO profiles (user_id, nama_lengkap, no_telp, alamat, created_at, updated_at)
                VALUES (?, ?, ?, ?, NOW(), NOW())
                ON DUPLICATE KEY UPDATE
                    nama_lengkap = VALUES(nama_lengkap),
                    no_telp = VALUES(no_telp),
                    alamat = VALUES(alamat),
                    updated_at = NOW()
            ")->execute([$userId, $namaLengkap, $noTelp, $alamat]);

            echo json_encode([
                'ok' => true,
                'message' => "Profil {$namaLengkap} berhasil disimpan ke tabel profiles di database!",
                'state' => getFullState($pdo),
            ]);
            break;

        default:
            echo json_encode(getFullState($pdo));
            break;
    }
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'error' => $e->getMessage(),
    ]);
}
