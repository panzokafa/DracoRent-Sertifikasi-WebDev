from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import os
from PIL import Image
import numpy as np

options = Options()
options.add_argument("--headless=new")
options.add_argument("--disable-gpu")
options.add_argument("--window-size=1440,900")
driver = webdriver.Chrome(options=options)

print("Navigating to masuk first to seed localStorage...")
driver.get("http://127.0.0.1:8000/screens/masuk.html")
time.sleep(1)

# Set admin session
admin_js = """
localStorage.setItem('dracorent_current_user_v2', JSON.stringify({
    id: 1,
    email: 'admin@dracorent.com',
    role: 'admin',
    nama_lengkap: 'Kaelen Varr',
    reg_code: 'ADM-001'
}));
"""
driver.execute_script(admin_js)

admin_test_screens = [
    ("screens/ringkasan.html", "test_ringkasan.png"),
    ("screens/unit-naga.html", "test_unit.png"),
    ("screens/tambah-unit-modal.html", "test_modal.png"),
    ("screens/kategori.html", "test_kategori.png"),
    ("screens/anggota.html", "test_anggota.png"),
    ("screens/pinjaman-aktif.html", "test_pinjaman.png"),
    ("screens/riwayat-dan-laporan.html", "test_riwayat.png"),
]

for path, fname in admin_test_screens:
    url = f"http://127.0.0.1:8000/{path}"
    driver.get(url)
    time.sleep(1.2)
    current_url = driver.current_url
    title = driver.title
    out_path = os.path.join("screenshots", fname)
    driver.save_screenshot(out_path)
    size_kb = round(os.path.getsize(out_path) / 1024, 1)
    print(f"Path: {path} => Final URL: {current_url} | Size: {size_kb} KB")

driver.quit()
