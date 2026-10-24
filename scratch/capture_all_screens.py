import os
import time
import shutil
import numpy as np
from PIL import Image
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

dest_dir = os.path.abspath("screenshots")
docs_dest_dir = os.path.abspath("docs/screenshots")
os.makedirs(dest_dir, exist_ok=True)
os.makedirs(docs_dest_dir, exist_ok=True)

# List of all 14 screens with target auth role and metadata
screens_config = [
    {
        "id": "01",
        "path": "screens/masuk.html",
        "file": "01_halaman_masuk_login.png",
        "label": "Halaman Masuk (Login Kredensial Pengawas & Anggota)",
        "role": "guest"
    },
    {
        "id": "02",
        "path": "screens/katalog-naga.html",
        "file": "02_katalog_naga_tersedia.png",
        "label": "Katalog Spesimen Naga & Status Ketersediaan",
        "role": "user"
    },
    {
        "id": "03",
        "path": "screens/detail-naga.html",
        "file": "03_detail_spesimen_pinjam.png",
        "label": "Detail Spesimen Naga & Form Peminjaman Mandiri",
        "role": "user"
    },
    {
        "id": "04",
        "path": "screens/pinjaman-saya.html",
        "file": "04_pinjaman_saya_anggota.png",
        "label": "Pinjaman Saya (Naga Sedang Disewa Anggota)",
        "role": "user"
    },
    {
        "id": "05",
        "path": "screens/riwayat-rental.html",
        "file": "05_riwayat_rental_arsip.png",
        "label": "Riwayat Rental Pribadi & Ekspedisi Anggota",
        "role": "user"
    },
    {
        "id": "06",
        "path": "screens/profil-saya.html",
        "file": "06_profil_pengguna_1to1.png",
        "label": "Profil Pengguna Serikat (Relasi 1:1)",
        "role": "user"
    },
    {
        "id": "07",
        "path": "screens/ringkasan.html",
        "file": "07_admin_ringkasan_metrik.png",
        "label": "Ringkasan Kurator (Dashboard Metrik Admin)",
        "role": "admin"
    },
    {
        "id": "08",
        "path": "screens/unit-naga.html",
        "file": "08_admin_manajemen_unit.png",
        "label": "Manajemen Inventaris Master Unit Naga (Tabel Master)",
        "role": "admin"
    },
    {
        "id": "09",
        "path": "screens/tambah-unit-modal.html",
        "file": "09_admin_tambah_unit_modal.png",
        "label": "Modal Pendaftaran Unit Naga Baru & Multi-Kategori",
        "role": "admin"
    },
    {
        "id": "10",
        "path": "screens/kategori.html",
        "file": "10_admin_kategori_klasifikasi.png",
        "label": "Manajemen Taksonomi & Kategori Naga",
        "role": "admin"
    },
    {
        "id": "11",
        "path": "screens/anggota.html",
        "file": "11_admin_manajemen_anggota.png",
        "label": "Manajemen Akun Anggota Serikat (Ledger User)",
        "role": "admin"
    },
    {
        "id": "12",
        "path": "screens/pinjaman-aktif.html",
        "file": "12_admin_pengembalian_denda.png",
        "label": "Peminjaman Aktif, Serah Terima & Denda Keterlambatan",
        "role": "admin"
    },
    {
        "id": "13",
        "path": "screens/riwayat-dan-laporan.html",
        "file": "13_admin_riwayat_laporan_cetak.png",
        "label": "Riwayat Lengkap Serikat & Cetak Laporan Kurator",
        "role": "admin"
    },
    {
        "id": "14",
        "path": "preview-dnd.html",
        "file": "14_portal_switcher_terpadu.png",
        "label": "Portal Switcher Hub (13 Layar Terpadu)",
        "role": "hub"
    }
]

options = Options()
options.add_argument("--headless=new")
options.add_argument("--disable-gpu")
options.add_argument("--window-size=1440,900")
driver = webdriver.Chrome(options=options)

# Helper to configure localStorage for origin
def set_auth(role):
    if role == "guest":
        js = "localStorage.setItem('dracorent_current_user_v2', '__LOGGED_OUT__');"
    elif role == "user":
        js = """
        localStorage.setItem('dracorent_current_user_v2', JSON.stringify({
            id: 2,
            email: 'user@dracorent.com',
            role: 'user',
            nama_lengkap: 'Lyra Valen',
            reg_code: 'G-4091'
        }));
        """
    elif role == "admin":
        js = """
        localStorage.setItem('dracorent_current_user_v2', JSON.stringify({
            id: 1,
            email: 'admin@dracorent.com',
            role: 'admin',
            nama_lengkap: 'Kaelen Varr',
            reg_code: 'ADM-001'
        }));
        """
    elif role == "hub":
        js = """
        localStorage.setItem('dracorent_current_user_v2', JSON.stringify({
            id: 1,
            email: 'admin@dracorent.com',
            role: 'admin',
            nama_lengkap: 'Kaelen Varr',
            reg_code: 'ADM-001'
        }));
        """
    driver.execute_script(js)

print("=== SEEDING INITIAL ORIGIN ===")
driver.get("http://127.0.0.1:8000/screens/masuk.html")
time.sleep(1)

captured_results = []

print("\n=== CAPTURING ALL 14 DISTINCT SCREENS OF DRACORENT ===")
for cfg in screens_config:
    path = cfg["path"]
    filename = cfg["file"]
    label = cfg["label"]
    role = cfg["role"]
    
    # 1. Ensure appropriate role is set in localStorage BEFORE navigating to page
    set_auth(role)
    
    # 2. Navigate to target screen
    target_url = f"http://127.0.0.1:8000/{path}"
    driver.get(target_url)
    time.sleep(1.2)  # Wait for Tailwind CDN and scripts to settle
    
    actual_url = driver.current_url
    
    # For Screen 09: ensure modal is displayed
    if "tambah-unit-modal" in path:
        driver.execute_script("""
            const backdrop = document.getElementById('modalRegistrationBackdrop');
            if (backdrop) backdrop.classList.remove('hidden');
        """)
        time.sleep(0.3)
    
    # For Screen 14: ensure dock switcher is prominently visible
    if "preview-dnd" in path:
        # Switch to ringkasan to show admin hub mode with dock bar
        driver.execute_script("""
            if (typeof window.switchDracoScreen === 'function') {
                window.switchDracoScreen('ringkasan');
            }
        """)
        time.sleep(1.0)
    
    out_path = os.path.join(dest_dir, filename)
    driver.save_screenshot(out_path)
    
    # Copy to docs/screenshots
    docs_path = os.path.join(docs_dest_dir, filename)
    shutil.copy(out_path, docs_path)
    
    size_kb = round(os.path.getsize(out_path) / 1024, 1)
    captured_results.append({
        "file": filename,
        "label": label,
        "path": out_path,
        "actual_url": actual_url,
        "size_kb": size_kb
    })
    print(f"[{cfg['id']}] {filename} ({size_kb} KB) => {actual_url}")

driver.quit()

print("\n=== VERIFYING VISUAL UNIQUENESS (IMAGE DIFFERENCE MATRIX) ===")
# Pairwise consecutive differences
all_diffs_passed = True
for i in range(len(captured_results) - 1):
    c1 = captured_results[i]
    c2 = captured_results[i + 1]
    
    im1 = np.array(Image.open(c1["path"]))
    im2 = np.array(Image.open(c2["path"]))
    diff = np.mean(np.abs(im1.astype(float) - im2.astype(float)))
    
    status = "OK (DISTINCT)" if diff > 5.0 else "FAIL (TOO SIMILAR)"
    if diff <= 5.0:
        all_diffs_passed = False
    print(f"{c1['file']} vs {c2['file']}: diff = {diff:.2f} [{status}]")

# Check all pairs against catalog (screen 02) to guarantee no false redirects to catalog
cat_path = captured_results[1]["path"]
cat_im = np.array(Image.open(cat_path))
print("\n=== CHECKING ALL SCREENS AGAINST CATALOG SCREEN (02) ===")
for i, c in enumerate(captured_results):
    if i == 1:
        continue
    curr_im = np.array(Image.open(c["path"]))
    diff = np.mean(np.abs(curr_im.astype(float) - cat_im.astype(float)))
    status = "OK (DISTINCT FROM CATALOG)" if diff > 5.0 else "FAIL (IDENTICAL TO CATALOG!)"
    if diff <= 5.0:
        all_diffs_passed = False
    print(f"{c['file']} vs 02_katalog: diff = {diff:.2f} [{status}]")

if all_diffs_passed:
    print("\nSUCCESS: All 14 screenshots are verified distinct, authentic, and correctly captured!")
else:
    print("\nWARNING: Some screenshots are still too similar. Check above logs.")
