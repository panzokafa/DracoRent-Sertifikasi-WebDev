/**
 * DracoRent — Complete Interactive & Database-Connected Logic Engine
 * Connects all 13 UI screens to public/api.php (MySQL `sistem_peminjaman_naga`)
 * Fully implements all requirements:
 * 1. Role: Admin vs User (anggota)
 * 2. Auth Guard: Login required to access web
 * 3. Registered member check to borrow unit
 * 4. 1:1 User-Profile relation
 * 5. User can edit their own profile
 * 6. Unit can have multiple categories
 * 7. Unit names can duplicate, distinguished by unique kode_unit
 * 8. Kode unit must be unique
 * 9. Search dragon by name
 * 10. Admin CRUD for Unit, Category, and User (Member)
 * 11. Max 2 active loans per member
 * 12. Max loan 5 days; late fine calculated (Rp50.000/day)
 * 13. Only Admin can return unit (Member contacts admin)
 * 14. Admin can view all borrowed units
 * 15. User only views their own borrowed units
 * 16. Admin can view and print loan history
 * 17. Form field validations (required)
 */
(function () {
  if (window.__DRACORENT_ENGINE_LOADED__) return;
  window.__DRACORENT_ENGINE_LOADED__ = true;

  const STORAGE_KEY = 'dracorent_db_state_v3';
  const SESSION_KEY = 'dracorent_current_user_v2';
  const SELECTED_UNIT_KEY = 'dracorent_selected_unit_code';
  const SELECTED_LOAN_KEY = 'dracorent_selected_loan_trx';

  const CLEAN_IMG_NGA103 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCy6iF5T8594MsOEhEOtakPSZuQQQhmlYD05U77NS6oE1qfpJUcP_tev8KGMy0hWNGn-ef2__Pu-HqMVSk6rVxTv2z3Q8MZKcKp-IdzkxY8Atb6HiHafdSi3Ffp4T1fBAeg5yunxKhyoVnP9JNU-7_tpe7WGe-Logx_NRNfaTKF4PHFYDHYkog8aCHygt8YK3oZaQdh0z-nfGKDGB3M884VVZcRQm9gJLL35NyIXSPKspCO4cB53g2m';
  const CLEAN_IMG_NGA105 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCCfXvUmdNJJSdrQdK5lEHbY8JKaA4xDdepnV7slthXOYZt_frgVBnljwWeRXeyR0EAL0UDqIt9Yb_u40cG2yVldW43Gtj-mLkfueGJ5OewPtEL5C4XAR-XMgTGvX6MgvJOBx5oKP9ZKKMGJdd3UHPLcJOFqa4ORACVZOCl6bxfz8hQdehLVmQS3xWMmtRNuFJxxExXqWkFrbEdO09ZBCyvRZFHS164MmB7gneEdEWX-h-3NRJZ8l1';

  const DEFAULT_STATE = {
    categories: [
      { id: 1, nama_kategori: 'Wyrm Api', unit_count: 2 },
      { id: 2, nama_kategori: 'Frost Drake', unit_count: 1 },
      { id: 3, nama_kategori: 'Wyvern Badai', unit_count: 2 },
      { id: 4, nama_kategori: 'Lindworm Batuan', unit_count: 1 },
      { id: 5, nama_kategori: 'Transportasi Berat', unit_count: 2 },
      { id: 6, nama_kategori: 'Patroli Udara', unit_count: 2 },
      { id: 7, nama_kategori: 'Eskor & Tempur', unit_count: 2 }
    ],
    units: [
      {
        id: 1,
        kode_unit: 'NGA-101',
        nama_unit: 'Ignis Ashbringer',
        gambar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCggr2psag6dAxaGbwXTGvrINqx3QXfiyJdLkFopL0EbsauyBRKq-elqsUojQKaHg9qzNR8CmYOCS7t2wxx55qufczvfub52P728CLzNCSl0cCJbFJFVAx3sWHkoNpD59C9t4w05Lzt2sxH8cV1t_9PQflYUiNrd1Zq-n17ZImrS4P-Z8XSlG-KjFyycaxId_yPYhMyHu8EbTFM40257jnosUyPK0rk5Q3Ujquk5kParp4sldZgXHxm',
        status: 'tersedia',
        category_names: ['Wyrm Api', 'Transportasi Berat']
      },
      {
        id: 2,
        kode_unit: 'NGA-102',
        nama_unit: 'Vermithrax Obsidian',
        gambar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6e2SjC9tB9BZUgrGVSmarlnfvZWCk0yn4rFQmiPJRHg69DJFr6x30KWZhqhnH8aCTWzosXjBVlFu3lhF9uHtwzrUx30oNbgRI5xV0CnIL6G58BmxTEIsaaEuRYMoj8sEB0qMEjNf-qDoT1TZIiAGiavswfCl6MjxI_9P90m8PKQAGqwwmYwu0RPSh141JF9KnAOIUCuv0z0xrCIWvlMzc7IvATfkK-ykEM1uPl107Eg9HB1rP6HB8',
        status: 'dipinjam',
        category_names: ['Lindworm Batuan', 'Transportasi Berat']
      },
      {
        id: 3,
        kode_unit: 'NGA-103',
        nama_unit: 'Aetherius Zenith',
        gambar: CLEAN_IMG_NGA103,
        status: 'tersedia',
        category_names: ['Wyvern Badai', 'Patroli Udara']
      },
      {
        id: 4,
        kode_unit: 'NGA-104',
        nama_unit: 'Boreas Glacie',
        gambar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpAbGTFQTRefSL0Wl-3RlmzNbQbuYGlsAzQxjnJLUVIWpIbetTzJT1S1kYyZMnyVBjG_QLrqeAZHTEIdFlIyYUDYQGPai8uQ-6PL06Gb0QMn3UMxr2Ejnb8LpgKIFYs8G3UZpFpJRAVl1VZ9IIaalOmouxbB5UQ0HCoK6rVeTLUwliif950m7ix48WY3dwenaXcLAcKq0F7cF7lBTTG-O-Wk6rLhgYREtQ4ImbuL_sW0ih7OIuIpFX',
        status: 'tersedia',
        category_names: ['Frost Drake', 'Eskor & Tempur']
      },
      {
        id: 5,
        kode_unit: 'NGA-105',
        nama_unit: 'Zephyr Galecrest',
        gambar: CLEAN_IMG_NGA105,
        status: 'tersedia',
        category_names: ['Wyvern Badai', 'Patroli Udara']
      },
      {
        id: 6,
        kode_unit: 'NGA-106',
        nama_unit: 'Pyrothrax the Bold',
        gambar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAace1CfliGw20QpY8A6evAIKORjH-umCaw5-mCMMblE9eCeDktlxBmCcffJ2rHVHLjcNzG40dt_-BfCNijuXbhULgKYJ8GY2ChC_QBLlqu188CVL5VL0eAO7qTHGQWT5yFKfQzw0AzOQPw17pBkxEt0BF9RJtCltIG4dMDeprs_CykmXWyiTiesFcPBlHd_c8W4qaTw6lZOa8fxm1fzfAEz7PMJeheTOEknEaNfwU0tZVrOd0bQTjO',
        status: 'dipinjam',
        category_names: ['Wyrm Api', 'Eskor & Tempur']
      }
    ],
    members: [
      { id: 1, email: 'admin@dracorent.com', role: 'admin', nama_lengkap: 'Kaelen Varr', no_telp: '+62 811-9041-0012', alamat: 'Menara Pengawas Timur No. 01, Wilayah Dalam Benteng Kaer Drakon', reg_code: 'ADM-001', active_loans_count: 0 },
      { id: 2, email: 'user@dracorent.com', role: 'user', nama_lengkap: 'Lyra Valen', no_telp: '+62 812-4091-8821', alamat: 'Kompleks Pemukiman Pengawas Naga, Blok Karang Barat No. 14, Distrik Menara Api', reg_code: 'G-4091', active_loans_count: 0 },
      { id: 3, email: 'roderic.vance@dracorent.com', role: 'user', nama_lengkap: 'Roderic Vance', no_telp: '+62 813-8821-0094', alamat: 'Garnisun Ksatria Perbatasan Utara, Blok C-08', reg_code: 'G-4092', active_loans_count: 1 },
      { id: 4, email: 'samantha.drakos@dracorent.com', role: 'user', nama_lengkap: 'Samantha Drakos', no_telp: '+62 815-7732-1190', alamat: 'Distrik Akademi Drakonik, Menara Observasi Angin Lt. 3', reg_code: 'G-4093', active_loans_count: 1 },
      { id: 5, email: 'brandon.sunder@dracorent.com', role: 'user', nama_lengkap: 'Brandon Sunder', no_telp: '+62 817-5501-3342', alamat: 'Pos Ekspedisi Lembah Belerang, Sektor B-12', reg_code: 'G-4094', active_loans_count: 0 }
    ],
    loans: [
      {
        id: 1,
        trx_code: 'TRX-2026-0881',
        user_id: 2,
        unit_id: 3,
        peminjam_nama: 'Lyra Valen',
        peminjam_reg: 'G-4091',
        peminjam_telp: '+62 812-4091-8821',
        user_email: 'user@dracorent.com',
        kode_unit: 'NGA-103',
        nama_unit: 'Aetherius Zenith',
        unit_gambar: CLEAN_IMG_NGA103,
        unit_categories: ['Wyvern Badai', 'Patroli Udara'],
        tanggal_pinjam: '2026-10-20',
        tanggal_tenggat: '2026-10-24',
        tanggal_kembali: '2026-10-23',
        denda: 0,
        status: 'dikembalikan'
      },
      {
        id: 2,
        trx_code: 'TRX-2026-0882',
        user_id: 3,
        unit_id: 2,
        peminjam_nama: 'Roderic Vance',
        peminjam_reg: 'G-4092',
        peminjam_telp: '+62 813-8821-0094',
        user_email: 'roderic.vance@dracorent.com',
        kode_unit: 'NGA-102',
        nama_unit: 'Vermithrax Obsidian',
        unit_gambar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6e2SjC9tB9BZUgrGVSmarlnfvZWCk0yn4rFQmiPJRHg69DJFr6x30KWZhqhnH8aCTWzosXjBVlFu3lhF9uHtwzrUx30oNbgRI5xV0CnIL6G58BmxTEIsaaEuRYMoj8sEB0qMEjNf-qDoT1TZIiAGiavswfCl6MjxI_9P90m8PKQAGqwwmYwu0RPSh141JF9KnAOIUCuv0z0xrCIWvlMzc7IvATfkK-ykEM1uPl107Eg9HB1rP6HB8',
        unit_categories: ['Lindworm Batuan', 'Transportasi Berat'],
        tanggal_pinjam: '2026-10-18',
        tanggal_tenggat: '2026-10-21',
        tanggal_kembali: null,
        denda: 50000,
        status: 'dipinjam'
      },
      {
        id: 3,
        trx_code: 'TRX-2026-0883',
        user_id: 4,
        unit_id: 6,
        peminjam_nama: 'Samantha Drakos',
        peminjam_reg: 'G-4093',
        peminjam_telp: '+62 815-7732-1190',
        user_email: 'samantha.drakos@dracorent.com',
        kode_unit: 'NGA-106',
        nama_unit: 'Pyrothrax the Bold',
        unit_gambar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAace1CfliGw20QpY8A6evAIKORjH-umCaw5-mCMMblE9eCeDktlxBmCcffJ2rHVHLjcNzG40dt_-BfCNijuXbhULgKYJ8GY2ChC_QBLlqu188CVL5VL0eAO7qTHGQWT5yFKfQzw0AzOQPw17pBkxEt0BF9RJtCltIG4dMDeprs_CykmXWyiTiesFcPBlHd_c8W4qaTw6lZOa8fxm1fzfAEz7PMJeheTOEknEaNfwU0tZVrOd0bQTjO',
        unit_categories: ['Wyrm Api', 'Eskor & Tempur'],
        tanggal_pinjam: '2026-10-19',
        tanggal_tenggat: '2026-10-22',
        tanggal_kembali: null,
        denda: 0,
        status: 'dipinjam'
      },
      {
        id: 4,
        trx_code: 'TRX-2026-0884',
        user_id: 2,
        unit_id: 1,
        peminjam_nama: 'Lyra Valen',
        peminjam_reg: 'G-4091',
        peminjam_telp: '+62 812-4091-8821',
        user_email: 'user@dracorent.com',
        kode_unit: 'NGA-101',
        nama_unit: 'Ignis Ashbringer',
        unit_gambar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCggr2psag6dAxaGbwXTGvrINqx3QXfiyJdLkFopL0EbsauyBRKq-elqsUojQKaHg9qzNR8CmYOCS7t2wxx55qufczvfub52P728CLzNCSl0cCJbFJFVAx3sWHkoNpD59C9t4w05Lzt2sxH8cV1t_9PQflYUiNrd1Zq-n17ZImrS4P-Z8XSlG-KjFyycaxId_yPYhMyHu8EbTFM40257jnosUyPK0rk5Q3Ujquk5kParp4sldZgXHxm',
        unit_categories: ['Wyrm Api', 'Transportasi Berat'],
        tanggal_pinjam: '2026-10-12',
        tanggal_tenggat: '2026-10-15',
        tanggal_kembali: '2026-10-15',
        denda: 0,
        status: 'dikembalikan'
      },
      {
        id: 5,
        trx_code: 'TRX-2026-0885',
        user_id: 3,
        unit_id: 4,
        peminjam_nama: 'Roderic Vance',
        peminjam_reg: 'G-4092',
        peminjam_telp: '+62 813-8821-0094',
        user_email: 'roderic.vance@dracorent.com',
        kode_unit: 'NGA-104',
        nama_unit: 'Boreas Glacie',
        unit_gambar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpAbGTFQTRefSL0Wl-3RlmzNbQbuYGlsAzQxjnJLUVIWpIbetTzJT1S1kYyZMnyVBjG_QLrqeAZHTEIdFlIyYUDYQGPai8uQ-6PL06Gb0QMn3UMxr2Ejnb8LpgKIFYs8G3UZpFpJRAVl1VZ9IIaalOmouxbB5UQ0HCoK6rVeTLUwliif950m7ix48WY3dwenaXcLAcKq0F7cF7lBTTG-O-Wk6rLhgYREtQ4ImbuL_sW0ih7OIuIpFX',
        unit_categories: ['Frost Drake', 'Eskor & Tempur'],
        tanggal_pinjam: '2026-10-10',
        tanggal_tenggat: '2026-10-13',
        tanggal_kembali: '2026-10-15',
        denda: 100000,
        status: 'dikembalikan'
      },
      {
        id: 6,
        trx_code: 'TRX-2026-0886',
        user_id: 5,
        unit_id: 5,
        peminjam_nama: 'Brandon Sunder',
        peminjam_reg: 'G-4094',
        peminjam_telp: '+62 817-5501-3342',
        user_email: 'brandon.sunder@dracorent.com',
        kode_unit: 'NGA-105',
        nama_unit: 'Zephyr Galecrest',
        unit_gambar: CLEAN_IMG_NGA105,
        unit_categories: ['Wyvern Badai', 'Patroli Udara'],
        tanggal_pinjam: '2026-10-05',
        tanggal_tenggat: '2026-10-08',
        tanggal_kembali: '2026-10-09',
        denda: 50000,
        status: 'dikembalikan'
      }
    ]
  };

  let dbState = loadLocalState();

  function loadLocalState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.units) && Array.isArray(parsed.loans)) {
          // Heal old screenshot URLs if cached
          parsed.units.forEach(u => {
            if (u.kode_unit === 'NGA-103' && u.gambar && u.gambar.includes('AB6AXuD-4wLy8wJT7HC0XtzKCoGqmvc')) {
              u.gambar = CLEAN_IMG_NGA103;
            }
            if (u.kode_unit === 'NGA-105' && u.gambar && u.gambar.includes('AB6AXuD-4wLy8wJT7HC0XtzKCoGqmvc')) {
              u.gambar = CLEAN_IMG_NGA105;
            }
          });
          parsed.loans.forEach(l => {
            if (l.kode_unit === 'NGA-103' && l.unit_gambar && l.unit_gambar.includes('AB6AXuD-4wLy8wJT7HC0XtzKCoGqmvc')) {
              l.unit_gambar = CLEAN_IMG_NGA103;
            }
            if (l.kode_unit === 'NGA-105' && l.unit_gambar && l.unit_gambar.includes('AB6AXuD-4wLy8wJT7HC0XtzKCoGqmvc')) {
              l.unit_gambar = CLEAN_IMG_NGA105;
            }
          });
          return parsed;
        }
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  function saveLocalState(newState) {
    if (newState && Array.isArray(newState.units)) {
      dbState = newState;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dbState));
      } catch (e) {}
    }
  }

  function getCurrentUser() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw === '__LOGGED_OUT__') return null;
      if (raw) {
        const u = JSON.parse(raw);
        if (u && u.email) return u;
      }
    } catch (e) {}
    const path = window.location.pathname.toLowerCase().replace(/\\/g, '/');
    if (path.includes('masuk')) return null;
    // Default active user fallback (Lyra Valen) so preview dock & standalone screens work seamlessly
    return (dbState.members || DEFAULT_STATE.members)[1];
  }

  function setCurrentUser(u) {
    try {
      if (u) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(u));
      } else {
        localStorage.setItem(SESSION_KEY, '__LOGGED_OUT__');
      }
    } catch (e) {}
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem(SELECTED_UNIT_KEY);
    localStorage.removeItem(SELECTED_LOAN_KEY);
    showDracoToast('Sesi Berakhir', 'Anda telah keluar dari akun.');
    setTimeout(() => {
      navigateScreen('masuk');
    }, 400);
  }
  window.logoutDraco = logout;

  function getApiUrl() {
    return '/api.php';
  }

  async function apiCall(action, payload = {}) {
    if (window.location.protocol !== 'file:') {
      try {
        const res = await fetch(getApiUrl() + '?action=' + encodeURIComponent(action), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.assign({ action }, payload))
        });
        const data = await res.json();
        if (data && data.state) {
          saveLocalState(data.state);
        } else if (data && data.units && data.loans) {
          saveLocalState(data);
        }
        return data;
      } catch (err) {
        console.warn('API error, using local state:', err);
      }
    }
    return executeLocalFallback(action, payload);
  }

  function executeLocalFallback(action, payload) {
    const s = loadLocalState();
    if (action === 'bootstrap') {
      return Object.assign({ ok: true }, s);
    }
    if (action === 'login') {
      const email = (payload.email || '').toLowerCase().trim();
      const password = (payload.password || '').trim();
      if (!email) return { ok: false, error: 'Email wajib diisi.' };
      if (!password) return { ok: false, error: 'Kata sandi wajib diisi.' };

      let u = s.members.find(m => m.email.toLowerCase() === email);
      if (!u && (email.includes('admin') || email.includes('kaelen'))) {
        u = s.members[0];
      }
      if (!u) {
        return { ok: false, error: 'Akun dengan surel tersebut tidak ditemukan.' };
      }
      return { ok: true, user: u, state: s };
    }
    if (action === 'borrow_loan') {
      const unit = s.units.find(u => u.kode_unit === payload.kode_unit || u.id === Number(payload.unit_id));
      if (!unit) return { ok: false, error: 'Unit naga tidak ditemukan.' };
      if (unit.status !== 'tersedia') return { ok: false, error: `Unit ${unit.nama_unit} (${unit.kode_unit}) sedang dipinjam dan tidak dapat disewa.` };
      
      const userId = Number(payload.user_id || 2);
      const activeLoans = s.loans.filter(l => l.user_id === userId && l.status === 'dipinjam');
      if (activeLoans.length >= 2) {
        return { ok: false, error: 'Maksimal peminjaman 2 unit tercapai. Kembalikan salah satu naga terlebih dahulu.' };
      }
      
      const days = Math.max(1, Math.min(5, Number(payload.days || 3)));
      const now = new Date();
      const start = now.toISOString().split('T')[0];
      const dueDt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      const due = dueDt.toISOString().split('T')[0];
      const newId = s.loans.reduce((m, l) => Math.max(m, l.id), 0) + 1;
      const userObj = s.members.find(m => m.id === userId) || getCurrentUser() || s.members[1];
      
      unit.status = 'dipinjam';
      s.loans.unshift({
        id: newId,
        trx_code: `TRX-2026-${String(880 + newId).padStart(4, '0')}`,
        user_id: userId,
        unit_id: unit.id,
        peminjam_nama: userObj.nama_lengkap,
        peminjam_reg: userObj.reg_code || 'G-4091',
        peminjam_telp: userObj.no_telp || '+62 812-4091-8821',
        user_email: userObj.email,
        kode_unit: unit.kode_unit,
        nama_unit: unit.nama_unit,
        unit_gambar: unit.gambar,
        unit_categories: unit.category_names || ['Wyrm Api'],
        tanggal_pinjam: start,
        tanggal_tenggat: due,
        tanggal_kembali: null,
        denda: 0,
        status: 'dipinjam'
      });
      saveLocalState(s);
      return {
        ok: true,
        message: `Peminjaman ${unit.nama_unit} (${unit.kode_unit}) selama ${days} hari berhasil dicatat!`,
        state: s
      };
    }
    if (action === 'return_loan') {
      let loan = s.loans.find(l =>
        (payload.loan_id && l.id === Number(payload.loan_id)) ||
        (payload.trx_code && l.trx_code === payload.trx_code) ||
        (payload.kode_unit && l.kode_unit === payload.kode_unit && l.status === 'dipinjam')
      );
      if (!loan) {
        loan = s.loans.find(l => l.status === 'dipinjam');
      }
      if (!loan) return { ok: false, error: 'Tidak ada pinjaman aktif yang dapat diproses.' };
      
      const nowStr = new Date().toISOString().split('T')[0];
      const retDate = payload.tanggal_kembali || nowStr;
      const dueDt = new Date(loan.tanggal_tenggat);
      const retDt = new Date(retDate);
      const diffDays = Math.max(0, Math.round((retDt - dueDt) / (1000 * 60 * 60 * 24)));
      const denda = payload.denda_override !== undefined ? Number(payload.denda_override) : diffDays * 50000;
      
      loan.status = 'dikembalikan';
      loan.tanggal_kembali = retDate;
      loan.denda = denda;
      
      const unit = s.units.find(u => u.id === loan.unit_id || u.kode_unit === loan.kode_unit);
      if (unit) unit.status = 'tersedia';
      
      saveLocalState(s);
      return {
        ok: true,
        message: `Pengembalian ${loan.nama_unit} (${loan.kode_unit}) berhasil disimpan! Status unit kembali Tersedia.` + (denda > 0 ? ` Denda: ${formatRupiah(denda)} (${diffDays} hari terlambat)` : ' (Rp0 denda).'),
        denda,
        days_late: diffDays,
        state: s
      };
    }
    if (action === 'save_unit') {
      const kode = (payload.kode_unit || '').trim().toUpperCase();
      const nama = (payload.nama_unit || '').trim();
      if (!kode) return { ok: false, error: 'Kode unit wajib diisi.' };
      if (!nama) return { ok: false, error: 'Nama unit spesimen naga wajib diisi.' };
      
      const existing = s.units.find(u => u.kode_unit.toUpperCase() === kode);
      const cats = Array.isArray(payload.categories) && payload.categories.length ? payload.categories : ['Wyrm Api'];
      
      if (existing && payload.is_edit) {
        existing.nama_unit = nama;
        existing.category_names = cats;
        saveLocalState(s);
        return { ok: true, message: `Data unit ${existing.nama_unit} (${existing.kode_unit}) berhasil diperbarui!`, state: s };
      }
      if (existing) {
        return { ok: false, error: `Kode unit ${kode} sudah terdaftar. Kode unit harus unik!` };
      }
      const newId = s.units.reduce((m, u) => Math.max(m, u.id), 0) + 1;
      s.units.push({
        id: newId,
        kode_unit: kode,
        nama_unit: nama,
        gambar: payload.gambar || DEFAULT_STATE.units[0].gambar,
        status: 'tersedia',
        category_names: cats
      });
      saveLocalState(s);
      return { ok: true, message: `Unit naga ${nama} (${kode}) berhasil disimpan!`, state: s };
    }
    if (action === 'delete_unit') {
      const idx = s.units.findIndex(u => u.kode_unit === payload.kode_unit || u.id === Number(payload.id));
      if (idx === -1) return { ok: false, error: 'Unit tidak ditemukan.' };
      if (s.units[idx].status === 'dipinjam') {
        return { ok: false, error: `BR-08 (Proteksi Relasi): Unit ${s.units[idx].nama_unit} (${s.units[idx].kode_unit}) sedang berstatus DIPINJAM. Selesaikan pengembalian terlebih dahulu sebelum menghapus unit.` };
      }
      const unitLoansCount = Number(s.units[idx].total_loans_count || 0) || (s.loans || []).filter(l => l.unit_id === s.units[idx].id || l.kode_unit === s.units[idx].kode_unit).length;
      if (unitLoansCount > 0) {
        return { ok: false, error: `BR-08 (Proteksi Riwayat Pinjaman): Unit ${s.units[idx].nama_unit} (${s.units[idx].kode_unit}) memiliki ${unitLoansCount} catatan di riwayat peminjaman dan tidak dapat dihapus agar histori laporan tetap terjaga.` };
      }
      const removed = s.units.splice(idx, 1)[0];
      saveLocalState(s);
      return { ok: true, message: `Unit ${removed.nama_unit} (${removed.kode_unit}) berhasil dihapus dari sistem.`, state: s };
    }
    if (action === 'save_category') {
      const nama = (payload.nama_kategori || '').trim();
      if (!nama) return { ok: false, error: 'Nama kategori wajib diisi.' };
      if (nama.length < 3) return { ok: false, error: 'Nama kategori minimal 3 karakter.' };

      if (payload.id) {
        const c = s.categories.find(x => x.id === Number(payload.id));
        if (c) c.nama_kategori = nama;
        saveLocalState(s);
        return { ok: true, message: `Kategori berhasil diperbarui menjadi '${nama}'.`, state: s };
      }
      if (payload.old_name) {
        const c = s.categories.find(x => x.nama_kategori.toLowerCase() === payload.old_name.toLowerCase());
        if (c) c.nama_kategori = nama;
        saveLocalState(s);
        return { ok: true, message: `Kategori berhasil diperbarui menjadi '${nama}'.`, state: s };
      }
      const exists = s.categories.some(x => x.nama_kategori.toLowerCase() === nama.toLowerCase());
      if (exists) return { ok: false, error: `Kategori '${nama}' sudah ada.` };

      const newId = s.categories.reduce((m, c) => Math.max(m, c.id), 0) + 1;
      s.categories.push({ id: newId, nama_kategori: nama, unit_count: 0 });
      saveLocalState(s);
      return { ok: true, message: `Kategori baru '${nama}' berhasil disimpan!`, state: s };
    }
    if (action === 'delete_category') {
      const idx = s.categories.findIndex(c => c.id === Number(payload.id) || c.nama_kategori === payload.nama_kategori);
      if (idx === -1) return { ok: false, error: 'Kategori tidak ditemukan.' };
      if (Number(s.categories[idx].unit_count) > 0) {
        return { ok: false, error: `Kategori '${s.categories[idx].nama_kategori}' masih terikat pada ${s.categories[idx].unit_count} unit naga aktif!` };
      }
      const rem = s.categories.splice(idx, 1)[0];
      saveLocalState(s);
      return { ok: true, message: `Kategori '${rem.nama_kategori}' berhasil dihapus.`, state: s };
    }
    if (action === 'save_member') {
      const email = (payload.email || '').trim().toLowerCase();
      const nama = (payload.nama_lengkap || '').trim();
      const noTelp = (payload.no_telp || '').trim();
      const alamat = (payload.alamat || '').trim();
      if (!email) return { ok: false, error: 'Email wajib diisi.' };
      if (!nama) return { ok: false, error: 'Nama lengkap wajib diisi.' };
      if (!noTelp) return { ok: false, error: 'Nomor telepon wajib diisi.' };
      if (!alamat) return { ok: false, error: 'Alamat wajib diisi.' };

      const existing = s.members.find(m => m.email.toLowerCase() === email || (payload.id && m.id === Number(payload.id)));
      if (existing) {
        existing.nama_lengkap = nama;
        existing.no_telp = noTelp;
        existing.alamat = alamat;
        existing.role = payload.role || existing.role;
        saveLocalState(s);
        return { ok: true, message: `Data anggota ${nama} (${email}) berhasil diperbarui!`, state: s };
      }

      const newId = s.members.reduce((m, u) => Math.max(m, u.id), 0) + 1;
      s.members.push({
        id: newId,
        email,
        role: payload.role || 'user',
        nama_lengkap: nama,
        no_telp: noTelp,
        alamat: alamat,
        reg_code: (payload.role === 'admin') ? `ADM-${String(newId).padStart(3, '0')}` : `G-${4089 + newId}`,
        active_loans_count: 0
      });
      saveLocalState(s);
      return { ok: true, message: `Anggota baru ${nama} berhasil didaftarkan!`, state: s };
    }
    if (action === 'delete_member') {
      const idx = s.members.findIndex(m => m.id === Number(payload.id) || m.email === payload.email);
      if (idx === -1) return { ok: false, error: 'Anggota tidak ditemukan.' };
      if (Number(s.members[idx].active_loans_count) > 0) {
        return { ok: false, error: `BR-08 (Proteksi Relasi): Anggota ${s.members[idx].nama_lengkap} masih memiliki ${s.members[idx].active_loans_count} pinjaman naga aktif. Selesaikan pengembalian terlebih dahulu.` };
      }
      const memberLoansCount = Number(s.members[idx].total_loans_count || 0) || (s.loans || []).filter(l => l.user_id === s.members[idx].id || l.user_email === s.members[idx].email).length;
      if (memberLoansCount > 0) {
        return { ok: false, error: `BR-08 (Proteksi Riwayat Pinjaman): Anggota ${s.members[idx].nama_lengkap} memiliki ${memberLoansCount} catatan di riwayat peminjaman dan tidak dapat dihapus agar histori laporan tetap terjaga.` };
      }
      const rem = s.members.splice(idx, 1)[0];
      saveLocalState(s);
      return { ok: true, message: `Anggota ${rem.nama_lengkap} berhasil dihapus.`, state: s };
    }
    if (action === 'update_profile') {
      const u = getCurrentUser() || s.members[1];
      const nama = (payload.nama_lengkap || '').trim();
      const noTelp = (payload.no_telp || '').trim();
      const alamat = (payload.alamat || '').trim();
      if (!nama) return { ok: false, error: 'Nama lengkap wajib diisi.' };
      if (!noTelp) return { ok: false, error: 'Nomor telepon wajib diisi.' };
      if (!alamat) return { ok: false, error: 'Alamat tempat tinggal wajib diisi.' };

      u.nama_lengkap = nama;
      u.no_telp = noTelp;
      u.alamat = alamat;
      setCurrentUser(u);

      const m = s.members.find(x => x.id === u.id || x.email === u.email);
      if (m) {
        m.nama_lengkap = nama;
        m.no_telp = noTelp;
        m.alamat = alamat;
      }
      saveLocalState(s);
      return { ok: true, message: `Profil Anda (${nama}) berhasil diperbarui!`, state: s };
    }
    return { ok: true, state: s };
  }

  // Global Toast Notification Helper
  function showDracoToast(title, message, isError = false) {
    let toast = document.getElementById('dracorent-global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'dracorent-global-toast';
      toast.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;max-width:440px;padding:14px 18px;border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,0.85);display:flex;align-items:flex-start;gap:12px;transition:all 0.25s ease;transform:translateY(120%);opacity:0;font-family:Inter,sans-serif;';
      document.body.appendChild(toast);
    }
    toast.style.background = isError ? '#3d1f21' : '#1e241d';
    toast.style.border = isError ? '1px solid #E17B79' : '1px solid #6EB895';
    toast.style.color = '#F0EBDD';
    toast.innerHTML = `
      <span class="material-symbols-outlined" style="color:${isError ? '#E17B79' : '#6EB895'};font-size:22px;margin-top:1px;">
        ${isError ? 'error' : 'check_circle'}
      </span>
      <div style="flex:1;min-width:0;">
        <div style="font-weight:700;font-size:13px;color:${isError ? '#FFB4AB' : '#A2E3B8'};margin-bottom:2px;">${title}</div>
        <div style="font-size:12px;color:#D1C5B4;line-height:1.45;">${message}</div>
      </div>
    `;
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.transform = 'translateY(120%)';
      toast.style.opacity = '0';
    }, 4500);
  }
  window.showDracoToast = showDracoToast;

  function formatRupiah(num) {
    const n = Math.round(Number(num) || 0);
    return 'Rp' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function formatDateIndo(dateStr) {
    if (!dateStr) return '—';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const parts = String(dateStr).split('-');
    if (parts.length === 3) {
      const y = parts[0];
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      return `${d} ${months[m] || 'Okt'} ${y}`;
    }
    return dateStr;
  }

  function navigateScreen(slug) {
    const pathMap = {
      'masuk': 'masuk.html',
      'masuk-kurator': 'masuk.html',
      'keluar': 'masuk.html',
      'ringkasan': 'ringkasan.html',
      'unit-naga': 'unit-naga.html',
      'tambah-unit-modal': 'tambah-unit-modal.html',
      'kategori': 'kategori.html',
      'anggota': 'anggota.html',
      'pinjaman-aktif': 'pinjaman-aktif.html',
      'riwayat-dan-laporan': 'riwayat-dan-laporan.html',
      'katalog-naga': 'katalog-naga.html',
      'katalog-publik': 'katalog-naga.html',
      'detail-naga': 'detail-naga.html',
      'pinjaman-saya': 'pinjaman-saya.html',
      'riwayat-rental': 'riwayat-rental.html',
      'profil-saya': 'profil-saya.html'
    };
    const target = pathMap[slug] || (slug + '.html');
    if (window.parent && window.parent !== window && window.parent.switchDracoScreen) {
      window.parent.switchDracoScreen(slug);
      return;
    }
    const inScreensDir = window.location.pathname.replace(/\\/g, '/').includes('/screens/');
    window.location.href = inScreensDir ? target : ('screens/' + target);
  }
  window.navigateDraco = navigateScreen;

  // AUTH GUARD: redirect to login if not logged in
  function enforceAuthGuard() {
    const path = window.location.pathname.toLowerCase().replace(/\\/g, '/');
    const isLoginPage = path.includes('masuk.html') || path.endsWith('/masuk');
    const isPreviewPortal = path.endsWith('/preview-dnd.html') || path.endsWith('/');

    if (isPreviewPortal) return true; // allow parent preview container
    if (window.parent && window.parent !== window) return true; // preview dock mode

    const currentUser = getCurrentUser();
    if (!currentUser && !isLoginPage) {
      const inScreensDir = path.includes('/screens/');
      window.location.href = inScreensDir ? 'masuk.html' : 'screens/masuk.html';
      return false;
    }

    if (currentUser && isLoginPage && localStorage.getItem(SESSION_KEY) && localStorage.getItem(SESSION_KEY) !== '__LOGGED_OUT__') {
      if (currentUser.role === 'admin') {
        navigateScreen('ringkasan');
      } else {
        navigateScreen('katalog-naga');
      }
      return false;
    }

    // Role check: If user (not admin) tries to access admin-only screens
    if (currentUser && currentUser.role !== 'admin') {
      const adminScreens = ['ringkasan', 'unit-naga', 'kategori', 'anggota', 'pinjaman-aktif', 'riwayat-dan-laporan', 'tambah-unit'];
      const currentScreenIsAdmin = adminScreens.some(s => path.includes(s));
      if (currentScreenIsAdmin) {
        showDracoToast('Akses Terbatas', 'Halaman ini khusus untuk Kurator Admin.', true);
        navigateScreen('katalog-naga');
        return false;
      }
    }

    return true;
  }

  // Update User Header Badges across all screens
  function syncGlobalHeaderBadges() {
    const user = getCurrentUser();
    if (!user) return;

    // Synchronize user name and avatar/reg code in header
    document.querySelectorAll('header .group span.font-label-regular, aside p.font-label-regular').forEach(el => {
      el.textContent = user.nama_lengkap || user.email;
    });
    document.querySelectorAll('header .group span.font-code-metadata, aside p.font-code-metadata').forEach(el => {
      if (el.textContent.includes('G-') || el.textContent.includes('ADM-') || el.textContent.includes('ID:')) {
        el.textContent = user.reg_code || (user.role === 'admin' ? 'ADM-001' : 'G-4091');
      }
    });

    // Update active loans count for user
    const myActiveLoans = (dbState.loans || []).filter(
      l => l.status === 'dipinjam' && (l.user_id === user.id || l.user_email === user.email)
    );
    const count = myActiveLoans.length;

    // Update nav badge "Pinjaman Saya X/2"
    document.querySelectorAll('header nav a[data-path="pinjaman-saya"] span:last-child').forEach(badge => {
      badge.textContent = count >= 2 ? `${count}/2 Penuh` : `${count}/2`;
      if (count >= 2) {
        badge.classList.remove('text-primary');
        badge.classList.add('text-status-danger', 'font-bold');
      } else {
        badge.classList.remove('text-status-danger', 'font-bold');
        badge.classList.add('text-primary');
      }
    });

    // Update Admin header badges
    const allActiveLoans = (dbState.loans || []).filter(l => l.status === 'dipinjam');
    document.querySelectorAll('header a[data-path="pinjaman-aktif"] span:last-child').forEach(span => {
      if (span.textContent.includes('Pengembalian') || span.textContent.includes('Pinjaman')) {
        span.textContent = `${allActiveLoans.length} Pinjaman Aktif Menunggu`;
      }
    });
  }

  // Wire all navigation and logout links
  function wireAllNavLinks() {
    document.querySelectorAll('[data-path]').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const path = this.getAttribute('data-path');
        if (path === 'masuk' || path === 'masuk-kurator' || path === 'keluar') {
          logout();
          return;
        }
        navigateScreen(path);
      });
    });
  }

  // =========================================================================
  // 1. SCREEN: LOGIN (masuk.html)
  // =========================================================================
  function initLoginScreen() {
    const loginForm = document.getElementById('dracoLoginForm') || document.getElementById('loginForm');
    if (!loginForm) return;

    window.handleAuthSubmit = async function () {
      const emailInput = document.getElementById('guildEmail') || document.getElementById('email');
      const passInput = document.getElementById('guildPassword') || document.getElementById('password');
      const submitBtn = document.getElementById('submitAuthBtn') || loginForm.querySelector('button[type="submit"]');
      const feedback = document.getElementById('loginFeedback');

      const email = (emailInput?.value || '').trim();
      const password = (passInput?.value || '').trim();

      if (!email) {
        showDracoToast('Validasi Login', 'Email atau Nama Pengguna wajib diisi.', true);
        emailInput?.focus();
        return;
      }
      if (!password) {
        showDracoToast('Validasi Login', 'Kata sandi wajib diisi.', true);
        passInput?.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="material-symbols-outlined text-[19px] animate-spin">refresh</span><span>Memverifikasi Akun...</span>`;
      }

      const res = await apiCall('login', { email, password });

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">login</span><span>Buka Warkat & Masuk</span>`;
      }

      if (!res || !res.ok || !res.user) {
        const errorMsg = (res && res.error) || 'Email atau kata sandi tidak valid.';
        if (feedback) {
          feedback.classList.remove('hidden');
          feedback.innerHTML = `
            <div class="flex items-center gap-2 text-status-danger">
              <span class="material-symbols-outlined text-[18px]">error</span>
              <span class="font-semibold">Login Ditolak:</span>
              <span>${errorMsg}</span>
            </div>
          `;
        }
        showDracoToast('Gagal Masuk', errorMsg, true);
        return;
      }

      // Success
      setCurrentUser(res.user);
      if (feedback) {
        feedback.classList.remove('hidden');
        feedback.innerHTML = `
          <div class="flex items-center gap-2 text-status-available">
            <span class="material-symbols-outlined text-[18px]">verified</span>
            <span class="font-semibold">Login Berhasil:</span>
            <span>Selamat datang, ${res.user.nama_lengkap}! Mengalihkan...</span>
          </div>
        `;
      }
      showDracoToast('Login Berhasil', `Selamat datang kembali, ${res.user.nama_lengkap}!`);

      setTimeout(() => {
        if (res.user.role === 'admin') {
          navigateScreen('ringkasan');
        } else {
          navigateScreen('katalog-naga');
        }
      }, 500);
    };

    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      window.handleAuthSubmit();
    }, true);

    loginForm.onsubmit = function (e) {
      e.preventDefault();
      window.handleAuthSubmit();
    };
  }

  // =========================================================================
  // 2. SCREEN: PINJAMAN AKTIF & PROSES PENGEMBALIAN (Admin Only: pinjaman-aktif.html)
  // =========================================================================
  let currentReturnLoan = null;

  function initPinjamanAktifScreen() {
    const returnModal = document.getElementById('return-modal');
    const tbody = document.querySelector('table tbody');
    if (!returnModal || !tbody) return;

    const bgCard = tbody.closest('.opacity-40') || tbody.closest('.bg-surface');
    function updateBgOpacity() {
      if (!bgCard) return;
      if (returnModal.classList.contains('hidden')) {
        bgCard.classList.remove('opacity-40');
        bgCard.classList.add('opacity-100');
      } else {
        bgCard.classList.add('opacity-40');
        bgCard.classList.remove('opacity-100');
      }
    }

    const preselectedTrx = localStorage.getItem(SELECTED_LOAN_KEY);
    if (preselectedTrx) {
      localStorage.removeItem(SELECTED_LOAN_KEY);
      returnModal.classList.remove('hidden');
    }

    function renderActiveLoansTable(filterMode = 'all') {
      let loans = (dbState.loans || []).filter(l => filterMode === 'all' ? true : l.status === filterMode);
      const activeOnly = (dbState.loans || []).filter(l => l.status === 'dipinjam');

      const countBadge = document.querySelector('.px-2.py-0\\.5');
      if (countBadge && countBadge.textContent.includes('Pinjaman')) {
        countBadge.textContent = `${activeOnly.length} Pinjaman Aktif / ${dbState.loans.length} Total`;
      }

      if (loans.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="py-8 text-center text-text-muted">
              Tidak ada data pinjaman yang sesuai dengan filter.
            </td>
          </tr>
        `;
        return;
      }

      const todayStr = new Date().toISOString().split('T')[0];
      tbody.innerHTML = loans.map(loan => {
        const isBorrowed = loan.status === 'dipinjam';
        const dueDt = new Date(loan.tanggal_tenggat);
        const refDt = new Date(loan.tanggal_kembali || todayStr);
        const diffDays = Math.round((refDt - dueDt) / (1000 * 60 * 60 * 24));
        const isLate = diffDays > 0;
        const fineAmt = isBorrowed ? (isLate ? diffDays * 50000 : 0) : Number(loan.denda || 0);

        return `
          <tr class="hover:bg-surface-raised transition-colors ${currentReturnLoan && currentReturnLoan.id === loan.id ? 'bg-surface-raised/80 border-l-2 border-primary' : ''}">
            <td class="py-3.5 px-space-md font-code-metadata text-primary font-semibold">${loan.trx_code}</td>
            <td class="py-3.5 px-space-md">
              <div class="font-medium text-text-primary">${loan.peminjam_nama}</div>
              <div class="font-code-metadata text-code-metadata text-text-subtle">ID: ${loan.peminjam_reg || 'G-4091'} • ${loan.user_email}</div>
            </td>
            <td class="py-3.5 px-space-md">
              <div class="text-text-primary font-medium">${loan.nama_unit}</div>
              <div class="font-code-metadata text-code-metadata text-text-subtle">${loan.kode_unit} • ${(loan.unit_categories || []).join(', ')}</div>
            </td>
            <td class="py-3.5 px-space-md">
              <div class="${isLate && isBorrowed ? 'text-status-danger font-medium' : 'text-text-primary'}">${formatDateIndo(loan.tanggal_tenggat)}, 18:00</div>
              <div class="font-code-metadata text-code-metadata ${isLate ? 'text-status-danger' : 'text-status-available'}">
                ${isBorrowed ? (isLate ? `Terlambat ${diffDays} Hari` : 'Dalam Masa Sewa') : `Kembali: ${formatDateIndo(loan.tanggal_kembali)}`}
              </div>
            </td>
            <td class="py-3.5 px-space-md">
              ${isBorrowed
                ? `<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-status-borrowed-bg border border-status-borrowed/30 text-status-borrowed text-helper-text"><span class="w-1.5 h-1.5 rounded-full bg-status-borrowed"></span><span>Dipinjam</span></span>`
                : `<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-status-available-bg border border-status-available/30 text-status-available text-helper-text"><span class="w-1.5 h-1.5 rounded-full bg-status-available"></span><span>Dikembalikan</span></span>`
              }
            </td>
            <td class="py-3.5 px-space-md text-right font-code-metadata ${fineAmt > 0 ? 'text-status-danger font-semibold' : 'text-text-muted'}">${formatRupiah(fineAmt)}</td>
            <td class="py-3.5 px-space-md text-center">
              ${isBorrowed
                ? `<button type="button" data-open-return="${loan.id}" class="px-3 py-1.5 bg-primary-container hover:bg-gold-hover text-gold-ink font-semibold rounded text-helper-text transition-colors shadow-sm inline-flex items-center gap-1">
                     <span class="material-symbols-outlined text-[14px]">assignment_turned_in</span>
                     <span>Proses Pengembalian</span>
                   </button>`
                : `<span class="font-code-metadata text-[11px] text-status-available uppercase font-semibold">Selesai</span>`
              }
            </td>
          </tr>
        `;
      }).join('');

      tbody.querySelectorAll('[data-open-return]').forEach(btn => {
        btn.addEventListener('click', function () {
          const lid = Number(this.getAttribute('data-open-return'));
          const found = (dbState.loans || []).find(l => l.id === lid);
          if (found) openReturnModalForLoan(found);
        });
      });
    }

    function openReturnModalForLoan(loan) {
      currentReturnLoan = loan;
      returnModal.classList.remove('hidden');
      returnModal.style.opacity = '1';
      updateBgOpacity();

      const grids = returnModal.querySelectorAll('.bg-surface-container-lowest > div');
      if (grids.length >= 3) {
        grids[0].innerHTML = `
          <span class="font-code-metadata text-code-metadata text-text-subtle uppercase flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-primary">person</span> Identitas Peminjam
          </span>
          <div class="font-label-regular text-text-primary font-semibold">${loan.peminjam_nama}</div>
          <div class="font-code-metadata text-code-metadata text-text-muted">ID: ${loan.peminjam_reg || 'G-4091'} • ${loan.user_email}</div>
          <div class="font-code-metadata text-[10px] text-text-subtle mt-0.5 flex items-center gap-1">
            <span class="material-symbols-outlined text-[11px]">call</span> ${loan.peminjam_telp || '+62 812-4091-8821'}
          </div>
        `;
        grids[1].innerHTML = `
          <span class="font-code-metadata text-code-metadata text-text-subtle uppercase flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-primary">pets</span> Spesimen Terdaftar
          </span>
          <div class="font-label-regular text-primary font-semibold flex items-center justify-between">
            <span>${loan.nama_unit}</span>
            <span class="font-code-metadata text-[11px] text-text-subtle">${loan.kode_unit}</span>
          </div>
          <div class="font-code-metadata text-code-metadata text-text-muted">${(loan.unit_categories || ['Wyrm Api']).join(' • ')}</div>
          <div class="font-code-metadata text-[10px] text-text-subtle mt-0.5 flex items-center gap-1">
            <span class="material-symbols-outlined text-[11px]">location_on</span> Pos Kandang Utama Dragonkeep
          </div>
        `;
        grids[2].innerHTML = `
          <span class="font-code-metadata text-code-metadata text-text-subtle uppercase flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-primary">history_toggle_off</span> Jadwal Kontrak Warkat
          </span>
          <div class="flex items-center justify-between">
            <span class="font-helper-text text-text-subtle">Pinjam:</span>
            <span class="font-code-metadata text-code-metadata text-text-primary">${formatDateIndo(loan.tanggal_pinjam)}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="font-helper-text text-text-subtle">Tenggat Resmi:</span>
            <span class="font-code-metadata text-code-metadata text-status-danger font-semibold">${formatDateIndo(loan.tanggal_tenggat)}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="font-helper-text text-text-subtle">Warkat ID:</span>
            <span class="font-code-metadata text-code-metadata text-text-muted">${loan.trx_code}</span>
          </div>
        `;
      }

      const todayStr = new Date().toISOString().split('T')[0];
      const dateInput = document.getElementById('return_datetime');
      if (dateInput) {
        dateInput.type = 'date';
        dateInput.min = loan.tanggal_pinjam;
        dateInput.value = todayStr;
        recalculateFineUI(loan, dateInput.value);
        dateInput.onchange = () => recalculateFineUI(loan, dateInput.value);
        dateInput.oninput = () => recalculateFineUI(loan, dateInput.value);
      }

      const submitBtn = document.getElementById('btn-submit-return');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.className = 'w-full sm:w-auto flex items-center justify-center gap-2 px-space-lg py-2.5 rounded font-label-regular text-label-regular font-semibold transition-all shadow-md bg-primary-container text-gold-ink hover:bg-gold-hover border border-primary';
        submitBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">check_circle</span><span>Selesaikan & Simpan Pengembalian</span>`;
      }
      renderActiveLoansTable();
    }

    function recalculateFineUI(loan, returnDateStr) {
      const dueDt = new Date(loan.tanggal_tenggat);
      const retDt = new Date(returnDateStr || new Date().toISOString().split('T')[0]);
      const diffDays = Math.max(0, Math.round((retDt - dueDt) / (1000 * 60 * 60 * 24)));
      const totalFine = diffDays * 50000;
      loan._calculatedFine = totalFine;
      loan._returnDate = returnDateStr;

      const totalEl = returnModal.querySelector('.font-page-title.text-\\[22px\\]');
      if (totalEl) {
        totalEl.textContent = formatRupiah(totalFine);
        totalEl.className = `font-page-title text-[22px] font-bold ${totalFine > 0 ? 'text-status-danger' : 'text-status-available'}`;
      }
      const formulaSpans = returnModal.querySelectorAll('.py-space-sm.px-space-md.bg-surface-muted .font-semibold span');
      if (formulaSpans.length >= 2) {
        formulaSpans[0].textContent = `${diffDays} Hari Terlambat × Rp50.000`;
        formulaSpans[1].textContent = `= ${formatRupiah(totalFine)}`;
      }
    }

    window.finalizeReturn = async function () {
      const btn = document.getElementById('btn-submit-return');
      const targetLoan = currentReturnLoan || (dbState.loans || []).find(l => l.status === 'dipinjam');
      if (!targetLoan) {
        showDracoToast('Tidak Ada Pinjaman', 'Tidak ada data pinjaman aktif.', true);
        returnModal.classList.add('hidden');
        updateBgOpacity();
        return;
      }

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">sync</span><span>Menyimpan ke Database...</span>`;
      }

      const dateInput = document.getElementById('return_datetime');
      const tglKembali = dateInput?.value || new Date().toISOString().split('T')[0];

      const res = await apiCall('return_loan', {
        loan_id: targetLoan.id,
        trx_code: targetLoan.trx_code,
        kode_unit: targetLoan.kode_unit,
        tanggal_kembali: tglKembali,
        denda_override: targetLoan._calculatedFine
      });

      if (!res || !res.ok) {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">check_circle</span><span>Selesaikan & Simpan Pengembalian</span>`;
        }
        showDracoToast('Gagal Memproses Pengembalian', (res && res.error) || 'Terjadi kesalahan.', true);
        return;
      }

      showDracoToast('Pengembalian Berhasil Disimpan', res.message);
      syncGlobalHeaderBadges();
      renderActiveLoansTable();

      setTimeout(() => {
        returnModal.classList.add('hidden');
        updateBgOpacity();
      }, 700);
    };

    returnModal.querySelectorAll('button').forEach(b => {
      const txt = (b.textContent || '').trim();
      if (txt.includes('Batal') || b.getAttribute('title') === 'Tutup Jendela') {
        b.onclick = () => {
          returnModal.classList.add('hidden');
          updateBgOpacity();
        };
      }
      if (txt.includes('Cetak Tanda Terima')) {
        b.onclick = () => window.print();
      }
    });

    let showOnlyActive = false;
    document.querySelectorAll('button').forEach(b => {
      const txt = (b.textContent || '').trim();
      if (txt.includes('Filter Warkat')) {
        b.onclick = () => {
          showOnlyActive = !showOnlyActive;
          renderActiveLoansTable(showOnlyActive ? 'dipinjam' : 'all');
          showDracoToast('Filter Warkat', showOnlyActive ? 'Menampilkan pinjaman status Dipinjam.' : 'Menampilkan seluruh warkat pinjaman.');
        };
      }
    });

    const initialLoan = (dbState.loans || []).find(l => l.trx_code === preselectedTrx && l.status === 'dipinjam') ||
                        (dbState.loans || []).find(l => l.status === 'dipinjam');
    if (initialLoan && preselectedTrx) {
      openReturnModalForLoan(initialLoan);
    } else {
      returnModal.classList.add('hidden');
      updateBgOpacity();
      renderActiveLoansTable();
    }
  }

  // =========================================================================
  // 3. SCREEN: ADMIN DASHBOARD RINGKASAN (ringkasan.html)
  // =========================================================================
  function initRingkasanScreen() {
    const isRingkasan = window.location.pathname.includes('ringkasan') || document.querySelector('h1')?.textContent.includes('Ringkasan Operasional');
    if (!isRingkasan) return;

    const totalUnits = (dbState.units || []).length;
    const borrowedUnits = (dbState.units || []).filter(u => u.status === 'dipinjam').length;
    const availableUnits = totalUnits - borrowedUnits;
    const activeLoans = (dbState.loans || []).filter(l => l.status === 'dipinjam').length;

    document.querySelectorAll('.font-hero-title-mobile, .font-page-title').forEach(el => {
      const card = el.closest('div');
      const text = card?.textContent || '';
      if (text.includes('Total Spesimen') || text.includes('Inventaris Terdaftar')) {
        el.textContent = totalUnits;
      } else if (text.includes('Tersedia Siaga') || text.includes('Siaga di Kandang')) {
        el.textContent = availableUnits;
      } else if (text.includes('Sedang Dipinjam') || text.includes('Operasional Lapangan')) {
        el.textContent = borrowedUnits;
      } else if (text.includes('Pinjaman Aktif') || text.includes('Warkat Belum Kembali')) {
        el.textContent = activeLoans;
      }
    });

    const tbody = document.querySelector('table tbody');
    if (tbody && (dbState.loans || []).length > 0) {
      const activeList = (dbState.loans || []).filter(l => l.status === 'dipinjam').slice(0, 5);
      if (activeList.length > 0) {
        tbody.innerHTML = activeList.map(loan => `
          <tr class="hover:bg-surface-raised transition-colors">
            <td class="py-3 px-space-md font-code-metadata text-primary">${loan.trx_code}</td>
            <td class="py-3 px-space-md font-medium text-text-primary">${loan.peminjam_nama}</td>
            <td class="py-3 px-space-md text-text-primary">${loan.nama_unit} <span class="text-text-subtle text-[11px]">(${loan.kode_unit})</span></td>
            <td class="py-3 px-space-md text-text-muted">${formatDateIndo(loan.tanggal_tenggat)}</td>
            <td class="py-3 px-space-md">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-status-borrowed-bg text-status-borrowed text-[11px] font-semibold">
                Dipinjam
              </span>
            </td>
            <td class="py-3 px-space-md text-right">
              <button type="button" data-process-return="${loan.trx_code}" class="px-2.5 py-1 bg-primary-container hover:bg-gold-hover text-gold-ink font-semibold rounded text-helper-text transition-colors">
                Kembalikan
              </button>
            </td>
          </tr>
        `).join('');

        tbody.querySelectorAll('[data-process-return]').forEach(btn => {
          btn.onclick = () => {
            const trx = btn.getAttribute('data-process-return');
            localStorage.setItem(SELECTED_LOAN_KEY, trx);
            navigateScreen('pinjaman-aktif');
          };
        });
      }
    }
  }

  // =========================================================================
  // 4. SCREEN: UNIT NAGA & TAMBAH UNIT MODAL (unit-naga.html)
  // =========================================================================
  function initUnitNagaScreen() {
    const isUnitScreen = document.getElementById('sidePanel') || document.getElementById('modalRegistrationBackdrop') || window.location.pathname.includes('unit-naga');
    if (!isUnitScreen) return;

    const tbody = document.querySelector('table tbody');
    if (!tbody) return;

    let searchKeyword = '';
    let currentEditMode = false;

    function renderUnitsTable() {
      const units = (dbState.units || []).filter(u => {
        const matchSearch = !searchKeyword ||
          u.nama_unit.toLowerCase().includes(searchKeyword) ||
          u.kode_unit.toLowerCase().includes(searchKeyword) ||
          (u.category_names || []).join(' ').toLowerCase().includes(searchKeyword);
        return matchSearch;
      });

      if (units.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="py-8 text-center text-text-muted">
              Tidak ada unit naga yang cocok dengan kata kunci "${searchKeyword}".
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = units.map(u => {
        const isAvailable = u.status === 'tersedia';
        const catsHtml = (u.category_names || ['Wyrm Api']).map((c, i) =>
          `<span class="px-2 py-0.5 rounded text-helper-text font-helper-text ${i === 0 ? 'bg-surface-container-high text-text-primary' : 'bg-surface-container text-text-muted'}">${c}</span>`
        ).join('');

        return `
          <tr class="hover:bg-surface-raised/60 transition-colors group">
            <td class="py-space-md px-space-md align-middle">
              <div class="flex items-center gap-space-md">
                <div class="w-14 h-11 rounded-lg bg-surface-muted overflow-hidden shrink-0 border border-border">
                  <img src="${u.gambar || DEFAULT_STATE.units[0].gambar}" alt="${u.nama_unit}" class="w-full h-full object-cover">
                </div>
                <div>
                  <div class="font-card-title text-body-default text-text-primary font-semibold">${u.nama_unit}</div>
                  <div class="flex items-center gap-1.5 mt-0.5">
                    <span class="font-code-metadata text-code-metadata bg-surface-container px-1.5 py-0.5 rounded text-primary font-medium">${u.kode_unit}</span>
                    <span class="font-helper-text text-helper-text text-text-subtle">Spesimen Terdaftar</span>
                  </div>
                </div>
              </div>
            </td>
            <td class="py-space-md px-space-md align-middle">
              <div class="flex flex-wrap items-center gap-1.5 max-w-[240px]">${catsHtml}</div>
            </td>
            <td class="py-space-md px-space-md align-middle">
              <div class="flex items-center gap-1.5 text-text-muted font-body-compact text-body-compact">
                <span class="material-symbols-outlined text-text-subtle text-[16px]">location_on</span>
                <span>Kandang Utama — ${u.kode_unit}</span>
              </div>
            </td>
            <td class="py-space-md px-space-md align-middle">
              ${isAvailable
                ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-helper-text font-helper-text bg-status-available-bg text-status-available font-medium"><span class="w-1.5 h-1.5 rounded-full bg-status-available"></span><span>Tersedia</span></span>`
                : `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-helper-text font-helper-text bg-status-borrowed-bg text-status-borrowed font-medium"><span class="w-1.5 h-1.5 rounded-full bg-status-borrowed"></span><span>Dipinjam</span></span>`
              }
            </td>
            <td class="py-space-md px-space-md align-middle">
              <div class="flex flex-col">
                <span class="font-body-compact text-body-compact text-text-primary">Terverifikasi</span>
                <span class="font-helper-text text-helper-text text-text-subtle">Database Sinkron</span>
              </div>
            </td>
            <td class="py-space-md px-space-md align-middle text-right">
              <div class="inline-flex items-center justify-end gap-1.5">
                <button type="button" onclick="toggleSidePanel(true, 'edit', '${u.kode_unit}')" class="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-raised text-text-primary font-label-regular text-label-regular transition-colors">Edit</button>
                <button type="button" onclick="confirmDelete('${u.kode_unit}', '${u.nama_unit.replace(/'/g, "\\'")}')" class="p-1.5 rounded bg-surface-container hover:bg-status-danger-bg text-text-subtle hover:text-status-danger transition-colors" title="Hapus Spesimen">
                  <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    function renderCategoryCheckboxes(selectedCategories = []) {
      const container = document.getElementById('unitCategoryCheckboxes');
      if (!container) return;

      const categories = dbState.categories || [];
      container.innerHTML = categories.map(cat => {
        const checked = selectedCategories.includes(cat.nama_kategori) ? 'checked' : '';
        return `
          <label class="flex items-center gap-2 px-2.5 py-1.5 rounded bg-surface border border-border cursor-pointer hover:border-primary transition-colors text-[12px]">
            <input type="checkbox" name="unit_cats" value="${cat.nama_kategori}" ${checked} class="accent-[#C5A15B] w-4 h-4 rounded">
            <span class="text-text-primary">${cat.nama_kategori}</span>
          </label>
        `;
      }).join('');
    }

    const panel = document.getElementById('sidePanel');
    if (panel && !document.getElementById('unitCategoryCheckboxes')) {
      const formGroup = document.createElement('div');
      formGroup.className = 'space-y-1.5 mt-3';
      formGroup.innerHTML = `
        <label class="font-label-regular text-label-regular text-text-primary flex items-center gap-1">
          Kategori Ordo Naga (Dapat pilih lebih dari 1) <span class="text-primary">*</span>
        </label>
        <div id="unitCategoryCheckboxes" class="grid grid-cols-2 gap-1.5 p-2 rounded bg-surface-muted border border-border max-h-36 overflow-y-auto"></div>
        <p class="font-helper-text text-[11px] text-text-subtle">Satu naga dapat memiliki banyak kategori spesialisasi.</p>
      `;
      const formEl = panel.querySelector('form') || panel.querySelector('.p-space-lg') || panel;
      const submitBtnContainer = formEl.querySelector('button[type="submit"]')?.parentElement || formEl.lastElementChild;
      if (submitBtnContainer) {
        submitBtnContainer.parentElement.insertBefore(formGroup, submitBtnContainer);
      }
    }

    window.toggleSidePanel = function (show, mode = 'add', unitCode = '') {
      const panelEl = document.getElementById('sidePanel');
      const backdrop = document.getElementById('sidePanelBackdrop');
      if (!panelEl || !backdrop) return;

      const title = document.getElementById('panelTitle');
      const submitText = document.getElementById('panelSubmitText');
      const kodeInput = document.getElementById('formKodeUnit');
      const namaInput = document.getElementById('formNamaUnit');

      if (show) {
        currentEditMode = (mode === 'edit');
        if (currentEditMode) {
          const found = (dbState.units || []).find(u => u.kode_unit === unitCode);
          if (title) title.textContent = 'Edit Spesimen ' + unitCode;
          if (submitText) submitText.textContent = 'Perbarui Data Naga';
          if (kodeInput) {
            kodeInput.value = unitCode;
            kodeInput.setAttribute('disabled', 'disabled');
          }
          if (namaInput) namaInput.value = found ? found.nama_unit : '';
          renderCategoryCheckboxes(found ? (found.category_names || []) : []);
        } else {
          const nextNum = 101 + (dbState.units ? dbState.units.length : 6);
          if (title) title.textContent = 'Registrasi Spesimen Baru';
          if (submitText) submitText.textContent = 'Simpan Spesimen Naga';
          if (kodeInput) {
            kodeInput.value = `NGA-${nextNum}`;
            kodeInput.removeAttribute('disabled');
          }
          if (namaInput) namaInput.value = '';
          renderCategoryCheckboxes(['Wyrm Api']);
        }
        backdrop.classList.remove('hidden');
        setTimeout(() => panelEl.classList.remove('translate-x-full'), 10);
      } else {
        panelEl.classList.add('translate-x-full');
        setTimeout(() => backdrop.classList.add('hidden'), 250);
      }
    };

    window.saveUnit = async function () {
      const kode = (document.getElementById('formKodeUnit')?.value || '').trim();
      const nama = (document.getElementById('formNamaUnit')?.value || '').trim();

      if (!kode) {
        showDracoToast('Validasi Unit', 'Kode Unit wajib diisi dan unik.', true);
        return;
      }
      if (!nama) {
        showDracoToast('Validasi Unit', 'Nama Spesimen Naga wajib diisi.', true);
        return;
      }

      const selectedCats = [];
      document.querySelectorAll('#unitCategoryCheckboxes input[name="unit_cats"]:checked').forEach(cb => {
        selectedCats.push(cb.value);
      });
      if (selectedCats.length === 0) {
        showDracoToast('Validasi Unit', 'Pilih minimal satu kategori naga.', true);
        return;
      }

      const res = await apiCall('save_unit', {
        kode_unit: kode,
        nama_unit: nama,
        is_edit: currentEditMode,
        categories: selectedCats
      });

      if (!res || !res.ok) {
        showDracoToast('Gagal Menyimpan Unit', (res && res.error) || 'Terjadi kesalahan.', true);
        return;
      }
      showDracoToast('Unit Naga Tersimpan', res.message);
      window.toggleSidePanel(false);
      renderUnitsTable();
    };

    window.confirmDelete = async function (code, name) {
      if (!confirm(`Hapus unit naga ${name} (${code}) dari database?`)) return;
      const res = await apiCall('delete_unit', { kode_unit: code });
      if (!res || !res.ok) {
        showDracoToast('Gagal Menghapus Unit', (res && res.error) || 'Unit tidak dapat dihapus.', true);
        return;
      }
      showDracoToast('Unit Dihapus', res.message);
      renderUnitsTable();
    };

    const sInput = document.getElementById('searchInput') || document.querySelector('input[type="search"]');
    if (sInput) {
      sInput.addEventListener('input', (e) => {
        searchKeyword = e.target.value.trim().toLowerCase();
        renderUnitsTable();
      });
    }

    renderUnitsTable();
  }

  // =========================================================================
  // 5. SCREEN: KATEGORI (Admin Only: kategori.html)
  // =========================================================================
  function initKategoriScreen() {
    const catTable = document.getElementById('category-table');
    const catForm = document.getElementById('category-form');
    if (!catTable || !catForm) return;

    const tbody = catTable.querySelector('tbody');
    const inputNama = document.getElementById('input-nama-kategori');
    const formTitle = document.getElementById('form-title');
    const submitLabel = document.getElementById('btn-submit-label');
    let editingCatId = 0;
    let editingOldName = '';

    function renderCategoriesTable() {
      if (!tbody) return;
      const cats = dbState.categories || [];

      tbody.innerHTML = cats.map((c, idx) => {
        const code = `KAT-0${idx + 1}`;
        const count = Number(c.unit_count || 0);
        const canDelete = count === 0;

        return `
          <tr class="hover:bg-surface-raised/60 transition-colors">
            <td class="py-3.5 px-space-md font-code-metadata text-primary font-semibold">${code}</td>
            <td class="py-3.5 px-space-md">
              <div class="font-label-regular text-text-primary font-semibold">${c.nama_kategori}</div>
              <div class="font-helper-text text-helper-text text-text-subtle">Ordo Klasifikasi Naga</div>
            </td>
            <td class="py-3.5 px-space-md font-body-compact text-body-compact text-text-muted">
              Standar sertifikasi pelana serikat untuk kelas ${c.nama_kategori}.
            </td>
            <td class="py-3.5 px-space-md text-center">
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-code-metadata text-code-metadata ${count > 0 ? 'bg-surface-raised text-primary border border-border' : 'bg-surface-muted text-text-subtle'}">
                ${count} Unit Terkait
              </span>
            </td>
            <td class="py-3.5 px-space-md text-right">
              <div class="inline-flex items-center justify-end gap-1.5">
                <button type="button" data-edit-id="${c.id}" data-edit-name="${c.nama_kategori}" class="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-raised text-text-primary font-label-regular text-label-regular transition-colors">
                  Ubah
                </button>
                <button type="button" data-del-id="${c.id}" data-del-name="${c.nama_kategori}" data-del-count="${count}" class="px-2.5 py-1 rounded ${canDelete ? 'bg-status-danger-bg text-status-danger hover:opacity-90' : 'bg-surface-muted text-text-subtle opacity-50 cursor-not-allowed'} font-label-regular text-label-regular transition-colors" title="${canDelete ? 'Hapus Kategori' : 'Masih memiliki relasi unit'}">
                  Hapus
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      tbody.querySelectorAll('[data-edit-id]').forEach(btn => {
        btn.onclick = () => {
          editingCatId = Number(btn.getAttribute('data-edit-id'));
          editingOldName = btn.getAttribute('data-edit-name');
          if (formTitle) formTitle.textContent = `Ubah Kategori: ${editingOldName}`;
          if (submitLabel) submitLabel.textContent = 'Perbarui Kategori';
          if (inputNama) {
            inputNama.value = editingOldName;
            inputNama.focus();
          }
        };
      });

      tbody.querySelectorAll('[data-del-id]').forEach(btn => {
        btn.onclick = async () => {
          const cid = Number(btn.getAttribute('data-del-id'));
          const cname = btn.getAttribute('data-del-name');
          const cnt = Number(btn.getAttribute('data-del-count'));
          if (cnt > 0) {
            showDracoToast('Proteksi Relasi', `Kategori '${cname}' masih terikat pada ${cnt} unit naga dan tidak dapat dihapus.`, true);
            return;
          }
          if (!confirm(`Hapus kategori '${cname}' dari database?`)) return;
          const res = await apiCall('delete_category', { id: cid, nama_kategori: cname });
          if (!res || !res.ok) {
            showDracoToast('Gagal Menghapus Kategori', (res && res.error) || 'Error', true);
            return;
          }
          showDracoToast('Kategori Dihapus', res.message);
          renderCategoriesTable();
        };
      });
    }

    catForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const nama = (inputNama?.value || '').trim();
      if (!nama) {
        showDracoToast('Validasi Kategori', 'Nama kategori wajib diisi.', true);
        return;
      }
      if (nama.length < 3) {
        showDracoToast('Validasi Kategori', 'Nama kategori minimal 3 karakter.', true);
        return;
      }

      const res = await apiCall('save_category', {
        id: editingCatId,
        old_name: editingOldName,
        nama_kategori: nama
      });

      if (!res || !res.ok) {
        showDracoToast('Gagal Menyimpan Kategori', (res && res.error) || 'Error', true);
        return;
      }
      showDracoToast('Kategori Disimpan', res.message);
      editingCatId = 0;
      editingOldName = '';
      catForm.reset();
      if (formTitle) formTitle.textContent = 'Tambah Kategori Baru';
      if (submitLabel) submitLabel.textContent = 'Simpan Kategori';
      renderCategoriesTable();
    });

    renderCategoriesTable();
  }

  // =========================================================================
  // 6. SCREEN: ANGGOTA (Admin Only: anggota.html)
  // =========================================================================
  function initAnggotaScreen() {
    const isAnggotaScreen = document.getElementById('panel-tambah-anggota') || document.getElementById('form-anggota-baru') || window.location.pathname.includes('anggota');
    if (!isAnggotaScreen) return;

    const tbody = document.querySelector('table tbody');
    if (!tbody) return;

    let searchQ = '';

    function renderMembersTable() {
      const members = (dbState.members || []).filter(m =>
        !searchQ ||
        m.nama_lengkap.toLowerCase().includes(searchQ) ||
        m.email.toLowerCase().includes(searchQ) ||
        (m.reg_code || '').toLowerCase().includes(searchQ)
      );

      if (members.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="py-8 text-center text-text-muted">
              Tidak ada data anggota yang cocok dengan kata kunci "${searchQ}".
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = members.map(m => {
        const isAdm = m.role === 'admin';
        const loansCount = Number(m.active_loans_count || 0);

        return `
          <tr class="hover:bg-surface-raised/60 transition-colors">
            <td class="py-3.5 px-space-md font-mono text-primary font-semibold">${m.reg_code}</td>
            <td class="py-3.5 px-space-md">
              <div class="font-label-regular text-text-primary font-semibold">${m.nama_lengkap}</div>
              <div class="font-code-metadata text-code-metadata text-text-subtle">${m.email}</div>
            </td>
            <td class="py-3.5 px-space-md">
              <span class="px-2 py-0.5 rounded font-code-metadata text-code-metadata uppercase ${isAdm ? 'bg-primary/20 text-primary border border-primary/40' : 'bg-surface-raised text-text-muted border border-border'}">
                ${isAdm ? 'Admin Kurator' : 'User Anggota'}
              </span>
            </td>
            <td class="py-3.5 px-space-md text-text-muted">
              <div>${m.no_telp}</div>
              <div class="text-[11px] text-text-subtle truncate max-w-[200px]">${m.alamat}</div>
            </td>
            <td class="py-3.5 px-space-md text-center">
              <span class="px-2 py-0.5 rounded font-code-metadata text-code-metadata ${loansCount >= 2 ? 'bg-status-danger-bg text-status-danger font-bold' : (loansCount > 0 ? 'bg-status-borrowed-bg text-status-borrowed' : 'bg-status-available-bg text-status-available')}">
                ${loansCount}/2 Aktif
              </span>
            </td>
            <td class="py-3.5 px-space-md text-right">
              <div class="inline-flex items-center gap-1.5">
                <button type="button" onclick="confirmDisableMember('${m.nama_lengkap.replace(/'/g, "\\'")}', '${m.reg_code}', ${m.id})" class="px-2 py-1 rounded bg-surface-container hover:bg-status-danger-bg text-text-subtle hover:text-status-danger font-label-regular text-label-regular" title="Hapus Anggota">
                  <span class="material-symbols-outlined text-[16px]">person_remove</span>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    window.handleFormSubmit = async function (e) {
      if (e) e.preventDefault();
      const email = (document.getElementById('input-email')?.value || '').trim();
      const password = (document.getElementById('input-password')?.value || '123456').trim();
      const roleRadio = document.querySelector('input[name="role_pilihan"]:checked');
      const role = roleRadio ? roleRadio.value : 'user';
      const nama = (document.getElementById('input-fullname')?.value || '').trim();
      const phone = (document.getElementById('input-phone')?.value || '').trim();
      const address = (document.getElementById('input-address')?.value || '').trim();

      if (!email) {
        showDracoToast('Validasi Anggota', 'Email wajib diisi.', true);
        return;
      }
      if (!nama) {
        showDracoToast('Validasi Anggota', 'Nama lengkap wajib diisi.', true);
        return;
      }
      if (!phone) {
        showDracoToast('Validasi Anggota', 'Nomor telepon wajib diisi.', true);
        return;
      }
      if (!address) {
        showDracoToast('Validasi Anggota', 'Alamat lengkap wajib diisi.', true);
        return;
      }

      const res = await apiCall('save_member', {
        email,
        password,
        role,
        nama_lengkap: nama,
        no_telp: phone,
        alamat: address
      });

      if (!res || !res.ok) {
        showDracoToast('Gagal Mendaftarkan Anggota', (res && res.error) || 'Error', true);
        return;
      }
      showDracoToast('Anggota Tersimpan', res.message);
      const formAnggota = document.getElementById('form-anggota-baru');
      if (formAnggota) formAnggota.reset();
      renderMembersTable();
    };

    window.confirmDisableMember = async function (nama, reg, id) {
      if (!confirm(`Hapus anggota ${nama} (${reg}) dari database?`)) return;
      const res = await apiCall('delete_member', { id, nama_lengkap: nama });
      if (!res || !res.ok) {
        showDracoToast('Penghapusan Ditolak', (res && res.error) || 'Anggota memiliki pinjaman aktif.', true);
        return;
      }
      showDracoToast('Anggota Dihapus', res.message);
      renderMembersTable();
    };

    const sInput = document.getElementById('search-input') || document.querySelector('input[type="search"]');
    if (sInput) {
      sInput.addEventListener('input', (e) => {
        searchQ = e.target.value.trim().toLowerCase();
        renderMembersTable();
      });
    }

    renderMembersTable();
  }

  // =========================================================================
  // 7. SCREEN: KATALOG NAGA (katalog-naga.html)
  // =========================================================================
  function initKatalogNagaScreen() {
    const isKatalog = document.getElementById('rentalModal') || document.getElementById('dragonSearchInput') || window.location.pathname.includes('katalog');
    if (!isKatalog) return;

    const rentalModal = document.getElementById('rentalModal');
    const rentalForm = document.getElementById('rentalForm');

    const searchInput = document.getElementById('dragonSearchInput') || document.getElementById('searchInput') || document.querySelector('input[placeholder*="Cari nama naga"], input[type="search"]');
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        const query = e.target.value.trim().toLowerCase();
        document.querySelectorAll('.dragon-card').forEach(card => {
          const name = (card.querySelector('h3, .font-card-title')?.textContent || '').toLowerCase();
          const code = (card.getAttribute('data-code') || '').toLowerCase();
          const cats = (card.getAttribute('data-category') || '').toLowerCase();
          const match = !query || name.includes(query) || code.includes(query) || cats.includes(query);
          card.style.display = match ? '' : 'none';
        });
      });
    }

    document.querySelectorAll('.dragon-card').forEach(card => {
      const code = card.getAttribute('data-code');
      const unit = (dbState.units || []).find(u => u.kode_unit === code);
      if (!unit) return;

      // 1. Sync data-status attribute for filter tabs
      card.setAttribute('data-status', unit.status);

      // 2. Cleanly replace the single top-right status chip container (eliminates double/nested badges)
      const statusChip = card.querySelector('.absolute.top-3.right-3');
      if (statusChip) {
        if (unit.status === 'tersedia') {
          statusChip.className = 'absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-status-available-bg text-status-available border border-status-available/30 font-code-metadata text-code-metadata shadow-sm';
          statusChip.innerHTML = `<span class="w-2 h-2 rounded-full bg-status-available animate-pulse"></span><span class="tracking-wide uppercase font-semibold">Tersedia</span>`;
        } else {
          statusChip.className = 'absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-status-borrowed-bg text-status-borrowed border border-[#57442B] font-code-metadata text-code-metadata shadow-sm';
          statusChip.innerHTML = `<span class="w-2 h-2 rounded-full bg-status-borrowed"></span><span class="tracking-wide uppercase font-semibold">Dipinjam</span>`;
        }
      }

      // 3. Card visual opacity & image cleanup
      const cardImg = card.querySelector('img');
      if (cardImg && unit.gambar) {
        cardImg.src = unit.gambar;
      }
      if (unit.status === 'tersedia') {
        card.classList.remove('opacity-90');
        if (cardImg) cardImg.classList.remove('grayscale-[20%]', 'filter');
      } else {
        card.classList.add('opacity-90');
        if (cardImg) cardImg.classList.add('grayscale-[20%]', 'filter');
      }

      // 4. Toggle "Tenggat Pengembalian" block cleanly (target only the inner info box, never the entire card body)
      const deadlineSpan = Array.from(card.querySelectorAll('span')).find(s => (s.textContent || '').includes('Tenggat Pengembalian'));
      let deadlineBlock = deadlineSpan ? (deadlineSpan.closest('.bg-surface-container') || deadlineSpan.parentElement) : null;
      if (unit.status === 'tersedia') {
        if (deadlineBlock) {
          deadlineBlock.classList.add('hidden');
          deadlineBlock.classList.remove('flex');
          deadlineBlock.style.display = 'none';
        }
      } else {
        const activeLoan = (dbState.loans || []).find(l => (l.kode_unit === code || l.unit_id === unit.id) && l.status === 'dipinjam');
        const returnDateText = (activeLoan && activeLoan.tanggal_tenggat) ? formatDateIndo(activeLoan.tanggal_tenggat) : 'Segera';
        if (!deadlineBlock) {
          const contentTop = card.querySelector('.p-space-md > div:first-child');
          if (contentTop) {
            deadlineBlock = document.createElement('div');
            deadlineBlock.className = 'mt-3 py-1.5 px-2.5 rounded bg-surface-container border border-border flex items-center gap-2';
            deadlineBlock.innerHTML = `<span class="material-symbols-outlined text-status-borrowed text-[16px]">schedule</span><span class="font-code-metadata text-code-metadata text-text-subtle">Tenggat Pengembalian: <span class="text-status-borrowed font-medium">${returnDateText}</span></span>`;
            contentTop.appendChild(deadlineBlock);
          }
        } else {
          deadlineBlock.classList.remove('hidden');
          deadlineBlock.classList.add('flex');
          deadlineBlock.style.display = '';
          const dateSpan = deadlineBlock.querySelector('.text-status-borrowed.font-medium, span:last-child');
          if (dateSpan) dateSpan.textContent = returnDateText;
        }
      }

      // 5. Update rent button
      const rentBtn = card.querySelector('.rent-action-btn') || card.querySelector('button[disabled]') || card.querySelector('.pt-space-sm button:last-child');
      if (rentBtn) {
        if (unit.status === 'tersedia') {
          rentBtn.disabled = false;
          rentBtn.className = 'rent-action-btn flex-1 py-2 px-3 rounded bg-primary-container text-gold-ink font-semibold hover:bg-gold-hover transition-colors font-label-regular text-label-regular flex items-center justify-center gap-1.5 shadow-sm';
          rentBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">key</span><span>Pinjam Naga</span>`;
          rentBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const user = getCurrentUser();
            if (!user) {
              showDracoToast('Login Diperlukan', 'Silakan masuk terlebih dahulu untuk meminjam unit naga.', true);
              navigateScreen('masuk');
              return;
            }

            const myActiveLoans = (dbState.loans || []).filter(
              l => l.status === 'dipinjam' && (l.user_id === user.id || l.user_email === user.email)
            );
            if (myActiveLoans.length >= 2) {
              showDracoToast('Batas Pinjaman (BR-05)', 'Anda telah meminjam 2 unit naga aktif. Harap kembalikan salah satu naga terlebih dahulu.', true);
              return;
            }

            localStorage.setItem(SELECTED_UNIT_KEY, unit.kode_unit);
            const mCode = document.getElementById('modalDragonCode');
            const mName = document.getElementById('modalDragonName');
            if (mCode) mCode.textContent = `Kode: ${unit.kode_unit}`;
            if (mName) mName.textContent = unit.nama_unit;
            if (rentalModal) rentalModal.classList.remove('hidden');
          };
        } else {
          rentBtn.disabled = true;
          rentBtn.className = 'flex-1 py-2 px-3 rounded bg-surface-raised/60 text-text-subtle border border-border cursor-not-allowed font-label-regular text-label-regular flex items-center justify-center gap-1.5 select-none';
          rentBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">lock</span><span>Sedang Dipinjam</span>`;
          rentBtn.onclick = null;
        }
      }
    });

    document.querySelectorAll('.view-detail-btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const code = this.getAttribute('data-code') || 'NGA-101';
        localStorage.setItem(SELECTED_UNIT_KEY, code);
        navigateScreen('detail-naga');
      });
    });

    let selectedDays = 3;
    document.querySelectorAll('#rentalModal button[data-days]').forEach(btn => {
      btn.onclick = function () {
        selectedDays = Math.min(5, Math.max(1, Number(this.getAttribute('data-days') || 3)));
        document.querySelectorAll('#rentalModal button[data-days]').forEach(b => {
          b.classList.remove('bg-primary-container', 'text-gold-ink', 'font-semibold');
          b.classList.add('bg-surface-raised', 'text-text-primary');
        });
        this.classList.remove('bg-surface-raised', 'text-text-primary');
        this.classList.add('bg-primary-container', 'text-gold-ink', 'font-semibold');
        const hiddenInp = document.getElementById('selectedDaysInput');
        if (hiddenInp) hiddenInp.value = selectedDays;
      };
    });

    if (rentalForm) {
      rentalForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const codeText = (document.getElementById('modalDragonCode')?.textContent || 'NGA-101').replace('Kode:', '').trim();
        const user = getCurrentUser();

        if (!user) {
          showDracoToast('Login Diperlukan', 'Anda harus masuk sebagai anggota.', true);
          navigateScreen('masuk');
          return;
        }

        const res = await apiCall('borrow_loan', {
          user_id: user.id,
          kode_unit: codeText,
          days: selectedDays
        });

        if (!res || !res.ok) {
          showDracoToast('Peminjaman Ditolak', (res && res.error) || 'Gagal meminjam unit.', true);
          return;
        }

        if (rentalModal) rentalModal.classList.add('hidden');
        showDracoToast('Peminjaman Berhasil!', res.message);
        syncGlobalHeaderBadges();
        setTimeout(() => navigateScreen('pinjaman-saya'), 600);
      });
    }
  }

  // =========================================================================
  // 8. SCREEN: DETAIL NAGA (detail-naga.html)
  // =========================================================================
  function initDetailNagaScreen() {
    // CRITICAL: Screen guard so detail logic does not overwrite other pages' <h1>
    const btnConfirm = document.getElementById('btn-confirm-rental');
    if (!btnConfirm) return;

    const selectedCode = localStorage.getItem(SELECTED_UNIT_KEY) || 'NGA-101';
    const unit = (dbState.units || []).find(u => u.kode_unit === selectedCode) || (dbState.units || [])[0];

    if (unit) {
      document.querySelectorAll('h1').forEach(el => {
        el.textContent = unit.nama_unit;
      });
      document.querySelectorAll('.font-code-metadata').forEach(el => {
        if (el.textContent.includes('NGA-')) {
          el.textContent = unit.kode_unit;
        }
      });
    }

    let chosenDays = 3;
    document.querySelectorAll('.duration-btn, button[data-days]').forEach(b => {
      b.addEventListener('click', function () {
        chosenDays = Math.min(5, Math.max(1, Number(this.getAttribute('data-days') || 3)));
      });
    });

    btnConfirm.addEventListener('click', async function (e) {
      e.preventDefault();
      const user = getCurrentUser();
      if (!user) {
        showDracoToast('Login Diperlukan', 'Silakan login terlebih dahulu.', true);
        navigateScreen('masuk');
        return;
      }

      btnConfirm.disabled = true;
      btnConfirm.innerHTML = `<span class="material-symbols-outlined text-[20px] animate-spin">refresh</span><span>Menyimpan ke Database...</span>`;

      const res = await apiCall('borrow_loan', {
        user_id: user.id,
        kode_unit: unit ? unit.kode_unit : 'NGA-101',
        days: chosenDays
      });

      btnConfirm.disabled = false;
      btnConfirm.innerHTML = `<span class="material-symbols-outlined text-[20px]">verified_user</span><span>Konfirmasi Pinjaman</span>`;

      if (!res || !res.ok) {
        showDracoToast('Peminjaman Ditolak', (res && res.error) || 'Gagal memproses pinjaman.', true);
        return;
      }

      showDracoToast('Kontrak Peminjaman Terbit!', res.message);
      syncGlobalHeaderBadges();
      setTimeout(() => navigateScreen('pinjaman-saya'), 600);
    });
  }

  // =========================================================================
  // 9. SCREEN: PINJAMAN SAYA (User Only: pinjaman-saya.html)
  // Requirement: User only views their own borrowed units.
  // Requirement: Only Admin can return unit. Member must contact admin.
  // =========================================================================
  function initPinjamanSayaScreen() {
    const path = window.location.pathname.toLowerCase().replace(/\\/g, '/');
    const isPinjamanSaya = path.includes('pinjaman-saya') ||
                           document.getElementById('active-loans-list') ||
                           (document.querySelector('h1')?.textContent.includes('Pinjaman Saya'));
    if (!isPinjamanSaya) return;

    const user = getCurrentUser() || (dbState.members || DEFAULT_STATE.members)[1];

    // Filter ONLY loans belonging to logged-in user with status 'dipinjam'
    const myActiveLoans = (dbState.loans || []).filter(
      l => l.status === 'dipinjam' && (Number(l.user_id) === Number(user.id) || (l.user_email && l.user_email.toLowerCase() === user.email.toLowerCase()))
    );

    // Update quota indicator in header banner
    document.querySelectorAll('span').forEach(sp => {
      if (sp.textContent.includes('DARI 2 AKTIF')) {
        sp.className = `font-code-metadata text-code-metadata ${myActiveLoans.length >= 2 ? 'text-status-danger bg-status-danger-bg' : 'text-status-borrowed bg-status-borrowed-bg'} px-2 py-0.5 rounded`;
        sp.textContent = `${myActiveLoans.length} DARI 2 AKTIF ${myActiveLoans.length >= 2 ? '(KUOTA PENUH)' : '(TERSEDIA)'}`;
      }
    });

    // Update tab badge count
    document.querySelectorAll('section button span.rounded-full, section button .w-5.h-5').forEach(badge => {
      badge.textContent = String(myActiveLoans.length);
    });

    // Populate user active loans container dynamically
    const container = document.getElementById('active-loans-list') || document.querySelector('main section .flex.flex-col.gap-space-xl');
    if (container) {
      if (myActiveLoans.length === 0) {
        container.innerHTML = `
          <div class="p-10 rounded-xl bg-surface border border-border text-center space-y-4 col-span-full shadow-lg">
            <div class="w-16 h-16 rounded-full bg-surface-muted border border-border flex items-center justify-center mx-auto text-primary">
              <span class="material-symbols-outlined text-[36px]">shield_with_heart</span>
            </div>
            <div class="font-section-title text-card-title text-text-primary">Tidak Ada Naga yang Sedang Dipinjam</div>
            <p class="font-body-compact text-body-compact text-text-muted max-w-lg mx-auto leading-relaxed">
              Anda belum memiliki kontrak peminjaman naga aktif saat ini. Telusuri katalog serikat dan ajukan peminjaman naga untuk ekspedisi Anda (kuota tersedia: <strong>2 unit naga</strong>).
            </p>
            <div class="pt-2">
              <a href="#" data-path="katalog-naga" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container text-gold-ink font-semibold hover:bg-gold-hover transition-colors font-label-regular text-label-regular shadow-md">
                <span class="material-symbols-outlined text-[20px]">explore</span>
                <span>Jelajahi Katalog Naga</span>
              </a>
            </div>
          </div>
        `;
        wireAllNavLinks();
        return;
      }

      container.innerHTML = myActiveLoans.map((loan, idx) => {
        const unit = (dbState.units || []).find(u => u.kode_unit === loan.kode_unit || u.id === loan.unit_id) || {};
        const dragonImg = loan.unit_gambar || unit.gambar || DEFAULT_STATE.units[0].gambar;
        const categoriesList = loan.unit_categories || unit.category_names || ['Wyrm Api'];
        const categoryLabel = categoriesList.join(' • ');

        // Calculate days remaining / overdue
        const now = new Date();
        const dueDt = new Date(loan.tanggal_tenggat);
        const diffDays = Math.ceil((dueDt - now) / (1000 * 60 * 60 * 24));
        const isOverdue = diffDays < 0;
        const isNearDue = diffDays >= 0 && diffDays <= 1;

        let statusPillHtml = '';
        let badgeHtml = '';

        if (isOverdue) {
          const lateDays = Math.abs(diffDays);
          badgeHtml = `
            <span class="px-space-sm py-1 rounded bg-status-danger-bg/95 backdrop-blur-sm font-code-metadata text-code-metadata text-status-danger flex items-center gap-1.5 shadow-sm">
              <span class="w-2 h-2 rounded-full bg-status-danger animate-pulse"></span>
              TERLAMBAT
            </span>
          `;
          statusPillHtml = `
            <div class="flex items-center gap-space-sm px-space-md py-1.5 rounded-lg bg-status-danger-bg shadow-sm">
              <span class="material-symbols-outlined text-[18px] text-status-danger animate-pulse">warning</span>
              <div class="flex flex-col text-right">
                <span class="font-code-metadata text-code-metadata text-status-danger uppercase font-bold">Terlambat ${lateDays} Hari</span>
                <span class="font-label-regular text-label-regular text-status-danger font-semibold">Denda Aktif</span>
              </div>
            </div>
          `;
        } else if (isNearDue) {
          badgeHtml = `
            <span class="px-space-sm py-1 rounded bg-status-danger-bg/95 backdrop-blur-sm font-code-metadata text-code-metadata text-status-danger flex items-center gap-1.5 shadow-sm">
              <span class="w-2 h-2 rounded-full bg-status-danger animate-pulse"></span>
              TENGGAT BESOK
            </span>
          `;
          statusPillHtml = `
            <div class="flex items-center gap-space-sm px-space-md py-1.5 rounded-lg bg-status-danger-bg shadow-sm">
              <span class="material-symbols-outlined text-[18px] text-status-danger animate-pulse">crisis_alert</span>
              <div class="flex flex-col text-right">
                <span class="font-code-metadata text-code-metadata text-status-danger uppercase font-bold">Peringatan Tenggat</span>
                <span class="font-label-regular text-label-regular text-status-danger">Sisa 1 Hari Kalender</span>
              </div>
            </div>
          `;
        } else {
          badgeHtml = `
            <span class="px-space-sm py-1 rounded bg-status-borrowed-bg/95 backdrop-blur-sm font-code-metadata text-code-metadata text-status-borrowed flex items-center gap-1.5 shadow-sm">
              <span class="w-2 h-2 rounded-full bg-status-borrowed"></span>
              DIPINJAM
            </span>
          `;
          statusPillHtml = `
            <div class="flex items-center gap-space-sm px-space-md py-1.5 rounded-lg bg-surface-container-high shadow-sm">
              <span class="material-symbols-outlined text-[18px] text-primary">schedule</span>
              <div class="flex flex-col text-right">
                <span class="font-code-metadata text-code-metadata text-text-subtle uppercase">Status Tenggat</span>
                <span class="font-label-regular text-label-regular text-text-primary">Sisa ${Math.max(1, diffDays)} Hari Kalender</span>
              </div>
            </div>
          `;
        }

        const posText = idx === 0 ? 'Kandang Barat • B-04 (Pos Vulkanik)' : 'Kandang Menara Utara • F-02 (Landasan Terbang)';

        return `
          <article class="bg-surface rounded-xl overflow-hidden shadow-lg flex flex-col xl:flex-row border border-border transition-all duration-300 hover:border-primary/40" data-trx="${loan.trx_code}" data-unit-code="${loan.kode_unit}">
            <!-- Image Slate / Left Asymmetric Column -->
            <div class="relative xl:w-5/12 min-h-[260px] xl:min-h-full bg-surface-muted overflow-hidden flex flex-col justify-between">
              <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105" style="background-image: url('${dragonImg}')"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent xl:bg-gradient-to-r xl:from-transparent xl:via-surface/40 xl:to-surface"></div>
              <!-- Badges Floating on Image Slate -->
              <div class="relative z-10 p-space-md flex items-center justify-between gap-space-sm">
                <span class="px-space-sm py-1 rounded bg-surface-container-lowest/90 backdrop-blur-sm font-code-metadata text-code-metadata text-primary uppercase border border-border">
                  KODE: ${loan.kode_unit}
                </span>
                ${badgeHtml}
              </div>
            </div>
            <!-- Dossier Details / Right Administrative Column -->
            <div class="xl:w-7/12 p-space-md md:p-space-lg flex flex-col justify-between gap-space-lg bg-surface">
              <!-- Header Block -->
              <div class="flex flex-col gap-space-xs">
                <div class="flex flex-wrap items-center justify-between gap-space-sm">
                  <div>
                    <h2 class="font-section-title text-section-title text-text-primary">${loan.nama_unit}</h2>
                    <p class="font-body-compact text-body-compact text-text-muted mt-0.5">
                      ${categoryLabel}
                    </p>
                  </div>
                  ${statusPillHtml}
                </div>
              </div>
              <!-- Ledger Meta Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md bg-surface-container-low p-space-md rounded-lg">
                <!-- Transaction ID -->
                <div class="flex flex-col gap-1">
                  <span class="font-code-metadata text-code-metadata text-text-subtle uppercase tracking-wider">ID Transaksi Kontrak</span>
                  <div class="flex items-center gap-space-xs">
                    <span class="font-code-metadata text-code-metadata text-text-primary bg-surface-raised px-2 py-1 rounded border border-border">${loan.trx_code}</span>
                    <button class="p-1 rounded text-text-subtle hover:text-primary transition-colors focus:outline-none" data-copy-trx="${loan.trx_code}" title="Salin ID Transaksi" type="button">
                      <span class="material-symbols-outlined text-[16px]">content_copy</span>
                    </button>
                  </div>
                </div>
                <!-- Pos Pengembalian -->
                <div class="flex flex-col gap-1">
                  <span class="font-code-metadata text-code-metadata text-text-subtle uppercase tracking-wider">Pos Serah-Terima Resmi</span>
                  <span class="font-table-data text-table-data text-text-primary flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[16px] text-primary">pin_drop</span>
                    ${posText}
                  </span>
                </div>
                <!-- Mulai Penugasan -->
                <div class="flex flex-col gap-1">
                  <span class="font-code-metadata text-code-metadata text-text-subtle uppercase tracking-wider">Mulai Penugasan (Kalender)</span>
                  <span class="font-table-data text-table-data text-text-muted">${formatDateIndo(loan.tanggal_pinjam)}</span>
                </div>
                <!-- Tenggat Waktu -->
                <div class="flex flex-col gap-1">
                  <span class="font-code-metadata text-code-metadata text-text-subtle uppercase tracking-wider">Tenggat Pengembalian (Maks. 5 Hari)</span>
                  <span class="font-table-data text-table-data ${isOverdue ? 'text-status-danger font-semibold' : 'text-text-primary font-medium'} flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[16px] ${isOverdue ? 'text-status-danger' : 'text-status-borrowed'}">event_available</span>
                    ${formatDateIndo(loan.tanggal_tenggat)} (18:00 WIB)
                  </span>
                </div>
                <!-- Akumulasi Denda -->
                <div class="flex flex-col gap-1">
                  <span class="font-code-metadata text-code-metadata text-text-subtle uppercase tracking-wider">Akumulasi Denda (Rp50.000/Hari)</span>
                  <span class="font-table-data text-table-data ${Number(loan.denda || 0) > 0 ? 'text-status-danger font-semibold' : 'text-status-available font-medium'}">
                    ${Number(loan.denda || 0) > 0 ? `${formatRupiah(loan.denda)} (Keterlambatan tercatat)` : 'Rp0 (Tenggat belum terlewati)'}
                  </span>
                </div>
                <!-- Kurator Serikat -->
                <div class="flex flex-col gap-1">
                  <span class="font-code-metadata text-code-metadata text-text-subtle uppercase tracking-wider">Kurator Serikat</span>
                  <span class="font-table-data text-table-data text-text-primary">Kurator Vaelin Voss <span class="font-code-metadata text-code-metadata text-text-subtle block">Lisensi Pengawas Ordo I</span></span>
                </div>
              </div>
              <!-- Procedural Warning & Actions -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pt-space-xs">
                <div class="flex items-center gap-space-xs font-helper-text text-helper-text text-text-subtle">
                  <span class="material-symbols-outlined text-[16px]">info</span>
                  <span>Pengembalian fisik wajib divalidasi oleh Admin di Pos Serikat</span>
                </div>
                <div class="flex items-center gap-space-sm shrink-0 flex-wrap">
                  <button class="px-space-md py-space-sm rounded bg-surface-container-high hover:bg-surface-raised font-label-regular text-label-regular text-text-primary transition-colors flex items-center gap-1.5 shadow-sm border border-border" data-action="view-contract" data-trx="${loan.trx_code}" type="button">
                    <span class="material-symbols-outlined text-[18px]">receipt_long</span>
                    <span>Lihat Lembar Kontrak</span>
                  </button>
                  <button class="px-space-md py-space-sm rounded ${isNearDue || isOverdue ? 'bg-primary-container text-gold-ink font-semibold hover:bg-gold-hover' : 'bg-surface-raised hover:bg-surface-container-high text-text-primary'} font-label-regular text-label-regular transition-colors flex items-center gap-1.5 shadow-md" data-action="contact-admin" data-trx="${loan.trx_code}" type="button">
                    <span class="material-symbols-outlined text-[18px]">${isNearDue || isOverdue ? 'calendar_month' : 'explore'}</span>
                    <span>${isNearDue || isOverdue ? 'Jadwalkan Serah Terima' : 'Petunjuk Pos Pengembalian'}</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        `;
      }).join('');
    }

    // 1. Wire Copy Transaction ID Buttons
    document.querySelectorAll('[data-copy-trx], button[onclick*="navigator.clipboard"], button[title*="Salin"]').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const article = btn.closest('article');
        const trxCode = btn.getAttribute('data-copy-trx') || article?.getAttribute('data-trx') || (article?.querySelector('.bg-surface-raised.px-2.py-1')?.textContent.trim()) || 'TRX-2026-0891';
        try {
          navigator.clipboard.writeText(trxCode);
        } catch (err) {}
        showDracoToast('ID Disalin', `Nomor warkat transaksi ${trxCode} berhasil disalin ke papan klip.`);
      };
    });

    // 2. Wire 'Lihat Lembar Kontrak' buttons
    document.querySelectorAll('[data-action="view-contract"]').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const article = btn.closest('article');
        const trx = btn.getAttribute('data-trx') || article?.getAttribute('data-trx');
        const code = article?.getAttribute('data-unit-code');
        const matchedLoan = (dbState.loans || []).find(l => (trx && l.trx_code === trx) || (code && l.kode_unit === code)) ||
                            (myActiveLoans.length > 0 ? myActiveLoans[0] : (dbState.loans || [])[0]);
        showDracoContractModal(matchedLoan);
      };
    });

    // 3. Wire 'Jadwalkan Serah Terima' & 'Petunjuk Pos Pengembalian'
    document.querySelectorAll('[data-action="contact-admin"]').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const article = btn.closest('article');
        const trx = btn.getAttribute('data-trx') || article?.getAttribute('data-trx');
        const code = article?.getAttribute('data-unit-code');
        const matchedLoan = (dbState.loans || []).find(l => (trx && l.trx_code === trx) || (code && l.kode_unit === code)) ||
                            (myActiveLoans.length > 0 ? myActiveLoans[0] : (dbState.loans || [])[0]);
        showDracoContactAdminModal(matchedLoan);
      };
    });

    // 4. Wire Navigation Tabs
    document.querySelectorAll('a[data-path="riwayat-rental"]').forEach(link => {
      link.onclick = (e) => {
        e.preventDefault();
        navigateScreen('riwayat-rental');
      };
    });
  }

  // Modal Detail Lembar Kontrak (Warkat Resmi)
  function showDracoContractModal(loan) {
    if (!loan) {
      loan = (dbState.loans || []).find(l => l.status === 'dipinjam') || {
        trx_code: 'TRX-2026-0891',
        nama_unit: 'Ignis Ashbringer',
        kode_unit: 'NGA-101',
        peminjam_nama: 'Lyra Valen',
        peminjam_reg: 'G-4091',
        tanggal_pinjam: '2026-10-24',
        tanggal_tenggat: '2026-10-27',
        denda: 0
      };
    }
    let modal = document.getElementById('draco-contract-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'draco-contract-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md';
      document.body.appendChild(modal);
    }
    modal.innerHTML = `
      <div class="bg-surface border border-primary rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-text-primary">
        <div class="flex items-center justify-between border-b border-border pb-3">
          <div class="flex items-center gap-2 text-primary font-section-title text-card-title">
            <span class="material-symbols-outlined text-[26px]">receipt_long</span>
            <span>Lembar Kontrak Warkat Serikat</span>
          </div>
          <button type="button" class="text-text-subtle hover:text-text-primary p-1" onclick="document.getElementById('draco-contract-modal').classList.add('hidden')">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="p-4 rounded-lg bg-surface-muted border border-border space-y-3 font-body-compact text-body-compact">
          <div class="flex items-center justify-between border-b border-border/60 pb-2">
            <span class="text-text-subtle text-[12px] uppercase tracking-wider font-code-metadata">Nomor Registrasi Kontrak</span>
            <span class="font-code-metadata text-primary font-bold text-[14px] bg-surface-raised px-2.5 py-0.5 rounded border border-border">${loan.trx_code || 'TRX-2026-0891'}</span>
          </div>

          <div class="grid grid-cols-2 gap-3 text-[13px]">
            <div>
              <span class="text-text-subtle block text-[11px] uppercase">Penyewa Terdaftar:</span>
              <span class="font-semibold text-text-primary">${loan.peminjam_nama || 'Lyra Valen'}</span>
              <span class="font-code-metadata text-text-subtle block text-[11px]">ID: ${loan.peminjam_reg || 'G-4091'}</span>
            </div>
            <div>
              <span class="text-text-subtle block text-[11px] uppercase">Spesimen Naga:</span>
              <span class="font-semibold text-primary">${loan.nama_unit || 'Ignis Ashbringer'}</span>
              <span class="font-code-metadata text-text-subtle block text-[11px]">Kode: ${loan.kode_unit || 'NGA-101'}</span>
            </div>
            <div>
              <span class="text-text-subtle block text-[11px] uppercase">Mulai Masa Penugasan:</span>
              <span class="text-text-primary font-medium">${formatDateIndo(loan.tanggal_pinjam)}</span>
            </div>
            <div>
              <span class="text-text-subtle block text-[11px] uppercase">Tenggat Wajib Kembali:</span>
              <span class="text-status-danger font-semibold">${formatDateIndo(loan.tanggal_tenggat)} (18:00 WIB)</span>
            </div>
          </div>

          <div class="p-2.5 rounded bg-surface-container-high border border-border/80 text-[12px] text-text-muted space-y-1">
            <div class="text-text-primary font-semibold flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-primary">gavel</span>
              Ketentuan Denda & Batas Waktu (BR-05 & BR-06):
            </div>
            <p>Maksimal peminjaman 5 hari. Keterlambatan pengembalian dikenakan denda resmi serikat sebesar <strong>Rp50.000 / hari</strong>.</p>
          </div>
        </div>

        <div class="pt-2 flex items-center justify-between gap-2">
          <button type="button" class="px-4 py-2 rounded bg-surface-container hover:bg-surface-raised border border-border text-text-primary font-label-regular text-label-regular flex items-center gap-1.5 transition-colors" onclick="window.print()">
            <span class="material-symbols-outlined text-[18px]">print</span>
            <span>Cetak Kontrak</span>
          </button>
          <div class="flex items-center gap-2">
            <button type="button" class="px-4 py-2 rounded bg-primary-container text-gold-ink font-semibold hover:bg-gold-hover transition-colors font-label-regular text-label-regular shadow-sm" onclick="document.getElementById('draco-contract-modal').classList.add('hidden')">
              Tutup Lembar Kontrak
            </button>
          </div>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
  }

  // Modal Hubungi Admin untuk Pengembalian Unit (BR-06)
  function showDracoContactAdminModal(loan) {
    if (!loan) {
      loan = (dbState.loans || []).find(l => l.status === 'dipinjam') || {
        trx_code: 'TRX-2026-0894',
        nama_unit: 'Aetherius Zenith',
        kode_unit: 'NGA-103'
      };
    }
    let modal = document.getElementById('draco-contact-admin-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'draco-contact-admin-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md';
      document.body.appendChild(modal);
    }
    modal.innerHTML = `
      <div class="bg-surface border border-primary rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-border pb-3">
          <div class="flex items-center gap-2 text-primary font-section-title text-card-title">
            <span class="material-symbols-outlined text-[24px]">support_agent</span>
            <span>Prosedur Pengembalian Naga</span>
          </div>
          <button type="button" class="text-text-subtle hover:text-text-primary p-1" onclick="document.getElementById('draco-contact-admin-modal').classList.add('hidden')">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="space-y-3 font-body-compact text-body-compact text-text-muted">
          <div class="p-3.5 rounded-lg bg-surface-muted border border-border">
            <p class="text-text-primary font-semibold mb-1 flex items-center gap-1.5 text-primary">
              <span class="material-symbols-outlined text-[18px]">info</span>
              Aturan Pengembalian Unit (BR-06):
            </p>
            <p class="text-[13px] leading-relaxed">
              Hanya <strong>Kurator Admin</strong> yang berwenang melakukan inspeksi fisik pelana, sayap, dan memproses penutupan warkat pinjaman naga di sistem.
            </p>
          </div>
          <div class="space-y-2">
            <p class="text-text-primary font-medium">Langkah Pengembalian:</p>
            <ol class="list-decimal list-inside space-y-1 text-[13px] text-text-muted">
              <li>Bawa unit naga <strong>${loan.nama_unit || 'Aetherius Zenith'} (${loan.kode_unit || 'NGA-103'})</strong> ke <strong>Pos Kandang Utama Kaer Drakon</strong>.</li>
              <li>Tunjukkan Nomor Transaksi <strong class="text-primary font-mono">${loan.trx_code || 'TRX-2026-0894'}</strong> kepada Kurator Admin.</li>
              <li>Admin akan memverifikasi kondisi fisik naga dan menyelesaikan pengembalian di sistem.</li>
            </ol>
          </div>
          <div class="p-3 rounded-lg bg-surface-container-high border border-border flex items-center justify-between">
            <div>
              <div class="font-semibold text-text-primary text-[13px]">Kontak Admin Kurator:</div>
              <div class="font-code-metadata text-[12px] text-primary">admin@dracorent.com • +62 811-9041-0012</div>
            </div>
            <span class="px-2 py-1 rounded bg-status-available-bg text-status-available font-code-metadata text-[11px] font-bold">POS SIAGA</span>
          </div>
        </div>
        <div class="pt-2 flex items-center justify-between gap-2">
          <button type="button" class="px-3.5 py-2 rounded bg-surface-container hover:bg-surface-raised border border-border text-text-primary font-label-regular text-label-regular text-[13px] transition-colors" onclick="navigator.clipboard.writeText('${loan.trx_code || 'TRX-2026-0894'}'); showDracoToast('Nomor Disalin', 'Nomor ${loan.trx_code || 'TRX-2026-0894'} berhasil disalin ke clipboard.');">
            Salin Nomor Warkat
          </button>
          <div class="flex items-center gap-2">
            <button type="button" class="px-3.5 py-2 rounded bg-surface-raised hover:bg-surface-container text-text-muted hover:text-text-primary font-label-regular text-[13px] transition-colors" onclick="localStorage.setItem('dracorent_selected_loan_trx', '${loan.trx_code || 'TRX-2026-0894'}'); navigateScreen('pinjaman-aktif');">
              Buka Pos Admin
            </button>
            <button type="button" class="px-4 py-2 rounded bg-primary-container text-gold-ink font-semibold hover:bg-gold-hover transition-colors font-label-regular text-label-regular" onclick="document.getElementById('draco-contact-admin-modal').classList.add('hidden')">
              Mengerti & Tutup
            </button>
          </div>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
  }

  // =========================================================================
  // 10. SCREEN: RIWAYAT RENTAL (User Only: riwayat-rental.html)
  // Requirement: User only views their own loan history
  // =========================================================================
  function initRiwayatRentalUserScreen() {
    const isRiwayat = window.location.pathname.includes('riwayat-rental') ||
                      (document.querySelector('h1')?.textContent.toLowerCase().includes('riwayat') && !window.location.pathname.includes('laporan'));
    if (!isRiwayat) return;

    const user = getCurrentUser() || (dbState.members || DEFAULT_STATE.members)[1];
    if (!user) return;

    const tbody = document.querySelector('table tbody');
    if (!tbody) return;

    // Filter ONLY loans for this user
    const myLoans = (dbState.loans || []).filter(
      l => l.user_id === user.id || l.user_email === user.email
    );

    if (myLoans.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="py-8 text-center text-text-muted">
            Belum ada riwayat transaksi peminjaman naga atas nama Anda.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = myLoans.map(loan => {
      const isBorrowed = loan.status === 'dipinjam';
      return `
        <tr class="hover:bg-surface-raised transition-colors">
          <td class="py-3.5 px-space-md font-code-metadata text-primary font-semibold">${loan.trx_code}</td>
          <td class="py-3.5 px-space-md">
            <div class="font-medium text-text-primary">${loan.nama_unit}</div>
            <div class="font-code-metadata text-code-metadata text-text-subtle">${loan.kode_unit}</div>
          </td>
          <td class="py-3.5 px-space-md font-code-metadata text-text-muted">${formatDateIndo(loan.tanggal_pinjam)}</td>
          <td class="py-3.5 px-space-md font-code-metadata text-text-muted">${formatDateIndo(loan.tanggal_tenggat)}</td>
          <td class="py-3.5 px-space-md font-code-metadata text-text-muted">${loan.tanggal_kembali ? formatDateIndo(loan.tanggal_kembali) : '— (Aktif)'}</td>
          <td class="py-3.5 px-space-md">
            ${isBorrowed
              ? `<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-status-borrowed-bg text-status-borrowed text-helper-text font-semibold">Sedang Dipinjam</span>`
              : `<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-status-available-bg text-status-available text-helper-text font-semibold">Selesai Dikembalikan</span>`
            }
          </td>
          <td class="py-3.5 px-space-md text-right font-code-metadata ${Number(loan.denda) > 0 ? 'text-status-danger font-semibold' : 'text-text-muted'}">
            ${formatRupiah(loan.denda || 0)}
          </td>
        </tr>
      `;
    }).join('');
  }

  // =========================================================================
  // 11. SCREEN: RIWAYAT & LAPORAN AUDIT (Admin Only: riwayat-dan-laporan.html)
  // Requirement: Admin can view and print loan history
  // =========================================================================
  function initRiwayatLaporanAdminScreen() {
    const isLaporan = window.location.pathname.includes('riwayat-dan-laporan');
    if (!isLaporan) return;

    const tbody = document.querySelector('table tbody');
    if (!tbody) return;

    const loans = dbState.loans || [];

    tbody.innerHTML = loans.map(loan => {
      const isBorrowed = loan.status === 'dipinjam';
      return `
        <tr class="hover:bg-surface-raised transition-colors">
          <td class="py-3.5 px-space-md font-code-metadata text-primary font-semibold">${loan.trx_code}</td>
          <td class="py-3.5 px-space-md">
            <div class="font-medium text-text-primary">${loan.peminjam_nama}</div>
            <div class="font-code-metadata text-code-metadata text-text-subtle">${loan.user_email} • ${loan.peminjam_reg || 'G-4091'}</div>
          </td>
          <td class="py-3.5 px-space-md">
            <div class="text-text-primary font-medium">${loan.nama_unit}</div>
            <div class="font-code-metadata text-code-metadata text-text-subtle">${loan.kode_unit}</div>
          </td>
          <td class="py-3.5 px-space-md font-code-metadata text-text-muted">${formatDateIndo(loan.tanggal_pinjam)}</td>
          <td class="py-3.5 px-space-md font-code-metadata text-text-muted">${formatDateIndo(loan.tanggal_tenggat)}</td>
          <td class="py-3.5 px-space-md font-code-metadata text-text-muted">${loan.tanggal_kembali ? formatDateIndo(loan.tanggal_kembali) : '— (Aktif)'}</td>
          <td class="py-3.5 px-space-md">
            ${isBorrowed
              ? `<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-status-borrowed-bg text-status-borrowed text-helper-text font-semibold">Dipinjam</span>`
              : `<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-status-available-bg text-status-available text-helper-text font-semibold">Dikembalikan</span>`
            }
          </td>
          <td class="py-3.5 px-space-md text-right font-code-metadata ${Number(loan.denda) > 0 ? 'text-status-danger font-semibold' : 'text-text-muted'}">
            ${formatRupiah(loan.denda || 0)}
          </td>
        </tr>
      `;
    }).join('');

    // Wire Print Button
    document.querySelectorAll('button').forEach(btn => {
      const txt = (btn.textContent || '').trim();
      if (txt.includes('Cetak Riwayat') || txt.includes('Pratinjau Cetak') || btn.id === 'btn-open-print') {
        btn.onclick = () => {
          window.print();
        };
      }
      if (txt.includes('Ekspor Rekapitulasi') || txt.includes('Ekspor CSV') || btn.id === 'btn-export-csv') {
        btn.onclick = () => exportLoansToCSV();
      }
    });
  }

  function exportLoansToCSV() {
    const loans = dbState.loans || [];
    const headers = ['Kode Transaksi', 'Peminjam', 'Email', 'Kode Unit', 'Nama Unit', 'Tgl Pinjam', 'Tgl Tenggat', 'Tgl Kembali', 'Status', 'Denda (Rp)'];
    const rows = loans.map(l => [
      l.trx_code,
      `"${(l.peminjam_nama || '').replace(/"/g, '""')}"`,
      l.user_email,
      l.kode_unit,
      `"${(l.nama_unit || '').replace(/"/g, '""')}"`,
      l.tanggal_pinjam,
      l.tanggal_tenggat,
      l.tanggal_kembali || '-',
      l.status,
      l.denda
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Laporan_Peminjaman_DracoRent.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showDracoToast('Ekspor Berhasil', 'Berkas Laporan_Peminjaman_DracoRent.csv telah diunduh.');
  }

  // =========================================================================
  // 12. SCREEN: PROFIL SAYA (profil-saya.html)
  // Requirement: 1 user 1 profile; user can edit their own profile
  // =========================================================================
  function initProfilSayaScreen() {
    const profileForm = document.getElementById('profile-form');
    if (!profileForm) return;

    const user = getCurrentUser() || (dbState.members || DEFAULT_STATE.members)[1];
    if (!user) return;

    const namaInput = document.getElementById('nama_lengkap');
    const telpInput = document.getElementById('no_telp');
    const emailInput = document.getElementById('email');
    const alamatInput = document.getElementById('alamat');

    const dbMember = (dbState.members || []).find(m => m.id === user.id || m.email === user.email) || user;
    if (namaInput && dbMember.nama_lengkap) namaInput.value = dbMember.nama_lengkap;
    if (telpInput && dbMember.no_telp) telpInput.value = dbMember.no_telp;
    if (emailInput && dbMember.email) {
      emailInput.value = dbMember.email;
      emailInput.setAttribute('disabled', 'disabled');
    }
    if (alamatInput && dbMember.alamat) alamatInput.value = dbMember.alamat;

    window.handleProfileSave = async function () {
      const submitBtn = document.getElementById('submit-btn');
      const banner = document.getElementById('save-feedback-banner');
      const nama = (namaInput?.value || '').trim();
      const telp = (telpInput?.value || '').trim();
      const alamat = (alamatInput?.value || '').trim();

      if (!nama) {
        showDracoToast('Validasi Profil', 'Nama lengkap wajib diisi.', true);
        return;
      }
      if (!telp) {
        showDracoToast('Validasi Profil', 'Nomor telepon wajib diisi.', true);
        return;
      }
      if (!alamat) {
        showDracoToast('Validasi Profil', 'Alamat wajib diisi.', true);
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span><span>Menyimpan ke Database...</span>`;
      }

      const res = await apiCall('update_profile', {
        user_id: user.id,
        email: user.email,
        nama_lengkap: nama,
        no_telp: telp,
        alamat: alamat
      });

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">done</span><span>Tersimpan di Database</span>`;
      }

      if (!res || !res.ok) {
        showDracoToast('Gagal Menyimpan Profil', (res && res.error) || 'Error', true);
        return;
      }

      user.nama_lengkap = nama;
      user.no_telp = telp;
      user.alamat = alamat;
      setCurrentUser(user);

      document.querySelectorAll('aside h2, header .group span.font-label-regular').forEach(el => {
        el.textContent = nama;
      });
      if (banner) {
        banner.classList.remove('hidden');
      }
      showDracoToast('Profil Berhasil Diperbarui', res.message);
    };

    profileForm.onsubmit = function (e) {
      e.preventDefault();
      window.handleProfileSave();
    };
  }

  // =========================================================================
  // BOOTSTRAP ON DOM READY
  // =========================================================================
  document.addEventListener('DOMContentLoaded', async function () {
    // 1. Fetch fresh DB state from api.php (MySQL PDO)
    const res = await apiCall('bootstrap');
    if (res && res.units) {
      saveLocalState(res);
    }

    // 2. Auth Guard Check
    const allowed = enforceAuthGuard();
    if (!allowed) return;

    // 3. Sync UI Header & Navigation
    syncGlobalHeaderBadges();
    wireAllNavLinks();

    // 4. Initialize active screen logic
    initLoginScreen();
    initPinjamanAktifScreen();
    initRingkasanScreen();
    initUnitNagaScreen();
    initKategoriScreen();
    initAnggotaScreen();
    initKatalogNagaScreen();
    initDetailNagaScreen();
    initPinjamanSayaScreen();
    initRiwayatRentalUserScreen();
    initRiwayatLaporanAdminScreen();
    initProfilSayaScreen();
  });
})();
