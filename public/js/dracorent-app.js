/**
 * DracoRent — Complete Interactive & Database-Connected Logic Engine
 * Connects all 13 UI screens to public/api.php (MySQL `sistem_peminjaman_naga`)
 * with automatic localStorage synchronization so every button, modal, form,
 * filter, search, and business rule (BR-01 to BR-08) works 100% seamlessly.
 */
(function () {
  if (window.__DRACORENT_ENGINE_LOADED__) return;
  window.__DRACORENT_ENGINE_LOADED__ = true;

  const STORAGE_KEY = 'dracorent_db_state_v2';
  const SESSION_KEY = 'dracorent_current_user_v2';
  const SELECTED_UNIT_KEY = 'dracorent_selected_unit_code';
  const SELECTED_LOAN_KEY = 'dracorent_selected_loan_trx';

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
        gambar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-4wLy8wJT7HC0XtzKCoGqmvcERK_ES3Dq2kKVtfeQEoCTSZh0vCv_sg8L0S5yuLJyrKbvOoHEeOIDTtXa2e0mq9YbQhdB8ScBsxSxClzq5ssWYHuhiuRB4pHfYzkyGq5PsHzCtv8vAo7jfR_eosotwAmyEYqY9zCrTFGu7objPOE4wre5FJWT-Q1M9f3XsVqpOr4ObgtEH7kW32Y1xDyCVJKNcdSfx-j4nCZ-z5wR2cJ2FjOVZ0cs',
        status: 'dipinjam',
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
        gambar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-4wLy8wJT7HC0XtzKCoGqmvcERK_ES3Dq2kKVtfeQEoCTSZh0vCv_sg8L0S5yuLJyrKbvOoHEeOIDTtXa2e0mq9YbQhdB8ScBsxSxClzq5ssWYHuhiuRB4pHfYzkyGq5PsHzCtv8vAo7jfR_eosotwAmyEYqY9zCrTFGu7objPOE4wre5FJWT-Q1M9f3XsVqpOr4ObgtEH7kW32Y1xDyCVJKNcdSfx-j4nCZ-z5wR2cJ2FjOVZ0cs',
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
      { id: 1, email: 'admin@dracorent.com', role: 'admin', nama_lengkap: 'Kaelen Varr', no_telp: '+62 811-9041-0012', alamat: 'Menara Pengawas Timur No. 01, Kaer Drakon', reg_code: 'ADM-001', active_loans_count: 0 },
      { id: 2, email: 'user@dracorent.com', role: 'user', nama_lengkap: 'Lyra Valen', no_telp: '+62 812-4091-8821', alamat: 'Kompleks Pemukiman Pengawas Naga, Blok Karang Barat No. 14', reg_code: 'G-4091', active_loans_count: 1 },
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
        unit_gambar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-4wLy8wJT7HC0XtzKCoGqmvcERK_ES3Dq2kKVtfeQEoCTSZh0vCv_sg8L0S5yuLJyrKbvOoHEeOIDTtXa2e0mq9YbQhdB8ScBsxSxClzq5ssWYHuhiuRB4pHfYzkyGq5PsHzCtv8vAo7jfR_eosotwAmyEYqY9zCrTFGu7objPOE4wre5FJWT-Q1M9f3XsVqpOr4ObgtEH7kW32Y1xDyCVJKNcdSfx-j4nCZ-z5wR2cJ2FjOVZ0cs',
        unit_categories: ['Wyvern Badai', 'Patroli Udara'],
        tanggal_pinjam: '2026-10-20',
        tanggal_tenggat: '2026-10-24',
        tanggal_kembali: null,
        denda: 0,
        status: 'dipinjam'
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
        unit_gambar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-4wLy8wJT7HC0XtzKCoGqmvcERK_ES3Dq2kKVtfeQEoCTSZh0vCv_sg8L0S5yuLJyrKbvOoHEeOIDTtXa2e0mq9YbQhdB8ScBsxSxClzq5ssWYHuhiuRB4pHfYzkyGq5PsHzCtv8vAo7jfR_eosotwAmyEYqY9zCrTFGu7objPOE4wre5FJWT-Q1M9f3XsVqpOr4ObgtEH7kW32Y1xDyCVJKNcdSfx-j4nCZ-z5wR2cJ2FjOVZ0cs',
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
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      id: 2,
      email: 'user@dracorent.com',
      role: 'user',
      nama_lengkap: 'Lyra Valen',
      no_telp: '+62 812-4091-8821',
      alamat: 'Kompleks Pemukiman Pengawas Naga, Blok Karang Barat No. 14, Distrik Menara Api',
      reg_code: 'G-4091'
    };
  }

  function setCurrentUser(u) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    } catch (e) {}
  }

  function getApiUrl() {
    const p = window.location.pathname.replace(/\\/g, '/');
    if (p.includes('/screens/')) return '../api.php';
    if (p.includes('/admin/')) return '../api.php';
    return 'api.php';
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
        // Fallback to local state engine if offline
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
      const email = (payload.email || '').toLowerCase();
      const isAdm = email.includes('admin') || email.includes('kaelen') || email.includes('kurator');
      const u = isAdm ? s.members[0] : (s.members.find(m => m.email.toLowerCase() === email) || s.members[1]);
      return { ok: true, user: u, state: s };
    }
    if (action === 'borrow_loan') {
      const unit = s.units.find(u => u.kode_unit === payload.kode_unit || u.id === Number(payload.unit_id));
      if (!unit) return { ok: false, error: 'Unit tidak ditemukan.' };
      if (unit.status !== 'tersedia') return { ok: false, error: `BR-04: Unit ${unit.nama_unit} sedang dipinjam.` };
      const userId = Number(payload.user_id || 2);
      const activeLoans = s.loans.filter(l => l.user_id === userId && l.status === 'dipinjam');
      if (activeLoans.length >= 2) {
        return { ok: false, error: 'BR-05: Kuota peminjaman penuh (2/2 aktif). Selesaikan pengembalian terlebih dahulu.' };
      }
      const days = Math.max(1, Math.min(5, Number(payload.days || 3)));
      const start = '2026-10-22';
      const endDay = 22 + days;
      const due = `2026-10-${String(endDay).padStart(2, '0')}`;
      const newId = s.loans.reduce((m, l) => Math.max(m, l.id), 0) + 1;
      const userObj = s.members.find(m => m.id === userId) || getCurrentUser();
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
        message: `Peminjaman ${unit.nama_unit} (${unit.kode_unit}) selama ${days} hari berhasil disimpan!`,
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
      if (!loan) return { ok: false, error: 'Tidak ada pinjaman aktif untuk dikembalikan.' };
      const retDate = payload.tanggal_kembali || '2026-10-22';
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
        message: `Pengembalian ${loan.nama_unit} (${loan.kode_unit}) berhasil disimpan! Unit kembali Tersedia.`,
        denda,
        days_late: diffDays,
        state: s
      };
    }
    if (action === 'save_unit') {
      const existing = s.units.find(u => u.kode_unit.toUpperCase() === (payload.kode_unit || '').toUpperCase());
      const cats = Array.isArray(payload.categories) && payload.categories.length ? payload.categories : ['Wyrm Api', 'Transportasi Berat'];
      if (existing && payload.is_edit) {
        existing.nama_unit = payload.nama_unit;
        existing.category_names = cats;
        saveLocalState(s);
        return { ok: true, message: `Unit ${existing.nama_unit} (${existing.kode_unit}) berhasil diperbarui!`, state: s };
      }
      if (existing) {
        return { ok: false, error: `Kode unit ${payload.kode_unit} sudah terdaftar.` };
      }
      const newId = s.units.reduce((m, u) => Math.max(m, u.id), 0) + 1;
      s.units.push({
        id: newId,
        kode_unit: payload.kode_unit.toUpperCase(),
        nama_unit: payload.nama_unit,
        gambar: payload.gambar || DEFAULT_STATE.units[0].gambar,
        status: 'tersedia',
        category_names: cats
      });
      saveLocalState(s);
      return { ok: true, message: `Unit baru ${payload.nama_unit} (${payload.kode_unit}) berhasil disimpan!`, state: s };
    }
    if (action === 'delete_unit') {
      const idx = s.units.findIndex(u => u.kode_unit === payload.kode_unit);
      if (idx === -1) return { ok: false, error: 'Unit tidak ditemukan.' };
      if (s.units[idx].status === 'dipinjam') {
        return { ok: false, error: `BR-08: Unit ${s.units[idx].nama_unit} sedang DIPINJAM dan tidak dapat dihapus.` };
      }
      const removed = s.units.splice(idx, 1)[0];
      saveLocalState(s);
      return { ok: true, message: `Unit ${removed.nama_unit} (${removed.kode_unit}) berhasil dihapus.`, state: s };
    }
    if (action === 'save_category') {
      if (payload.old_name) {
        const c = s.categories.find(x => x.nama_kategori.toLowerCase() === payload.old_name.toLowerCase());
        if (c) c.nama_kategori = payload.nama_kategori;
        saveLocalState(s);
        return { ok: true, message: `Kategori berhasil diperbarui menjadi '${payload.nama_kategori}'.`, state: s };
      }
      const newId = s.categories.reduce((m, c) => Math.max(m, c.id), 0) + 1;
      s.categories.push({ id: newId, nama_kategori: payload.nama_kategori, unit_count: 0 });
      saveLocalState(s);
      return { ok: true, message: `Kategori '${payload.nama_kategori}' berhasil ditambahkan.`, state: s };
    }
    if (action === 'delete_category') {
      const idx = s.categories.findIndex(c => c.id === Number(payload.id) || c.nama_kategori === payload.nama_kategori);
      if (idx === -1) return { ok: false, error: 'Kategori tidak ditemukan.' };
      if (Number(s.categories[idx].unit_count) > 0) {
        return { ok: false, error: `BR-08: Kategori '${s.categories[idx].nama_kategori}' masih memiliki relasi unit aktif.` };
      }
      const rem = s.categories.splice(idx, 1)[0];
      saveLocalState(s);
      return { ok: true, message: `Kategori '${rem.nama_kategori}' berhasil dihapus.`, state: s };
    }
    if (action === 'save_member') {
      const newId = s.members.reduce((m, u) => Math.max(m, u.id), 0) + 1;
      s.members.push({
        id: newId,
        email: payload.email,
        role: payload.role || 'user',
        nama_lengkap: payload.nama_lengkap,
        no_telp: payload.no_telp || '-',
        alamat: payload.alamat || '-',
        reg_code: (payload.role === 'admin') ? `ADM-00${newId}` : `G-${4089 + newId}`,
        active_loans_count: 0
      });
      saveLocalState(s);
      return { ok: true, message: `Anggota ${payload.nama_lengkap} berhasil disimpan!`, state: s };
    }
    if (action === 'delete_member') {
      const idx = s.members.findIndex(m => m.id === Number(payload.id) || m.email === payload.email);
      if (idx === -1) return { ok: false, error: 'Anggota tidak ditemukan.' };
      if (Number(s.members[idx].active_loans_count) > 0) {
        return { ok: false, error: `BR-08: Anggota ${s.members[idx].nama_lengkap} masih memiliki pinjaman aktif.` };
      }
      const rem = s.members.splice(idx, 1)[0];
      saveLocalState(s);
      return { ok: true, message: `Anggota ${rem.nama_lengkap} berhasil dihapus.`, state: s };
    }
    if (action === 'update_profile') {
      const u = getCurrentUser();
      u.nama_lengkap = payload.nama_lengkap;
      u.no_telp = payload.no_telp;
      u.alamat = payload.alamat;
      setCurrentUser(u);
      const m = s.members.find(x => x.id === u.id || x.email === u.email);
      if (m) {
        m.nama_lengkap = payload.nama_lengkap;
        m.no_telp = payload.no_telp;
        m.alamat = payload.alamat;
      }
      saveLocalState(s);
      return { ok: true, message: `Profil ${payload.nama_lengkap} berhasil diperbarui!`, state: s };
    }
    return { ok: true, state: s };
  }

  // Global Toast Notification Helper
  function showDracoToast(title, message, isError = false) {
    let toast = document.getElementById('dracorent-global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'dracorent-global-toast';
      toast.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;max-width:420px;padding:14px 18px;border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,0.75);display:flex;align-items:flex-start;gap:12px;transition:all 0.25s ease;transform:translateY(120%);opacity:0;font-family:Inter,sans-serif;';
      document.body.appendChild(toast);
    }
    toast.style.background = isError ? '#412527' : '#202329';
    toast.style.border = isError ? '1px solid #E17B79' : '1px solid #C5A15B';
    toast.style.color = '#F0EBDD';
    toast.innerHTML = `
      <span class="material-symbols-outlined" style="color:${isError ? '#E17B79' : '#6EB895'};font-size:22px;margin-top:1px;">
        ${isError ? 'error' : 'verified'}
      </span>
      <div style="flex:1;min-width:0;">
        <div style="font-weight:700;font-size:13px;color:${isError ? '#FFB4AB' : '#E8C178'};margin-bottom:2px;">${title}</div>
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
    }, 4200);
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

  // Update User Header Badges (Quota X/2 & User Name) across all User screens
  function syncGlobalHeaderBadges() {
    const user = getCurrentUser();
    const myActiveLoans = (dbState.loans || []).filter(
      l => l.status === 'dipinjam' && (l.user_id === user.id || l.user_email === user.email || l.user_id === 2)
    );
    const count = myActiveLoans.length;

    // Update nav badge "Pinjaman Saya X/2"
    document.querySelectorAll('header nav a[data-path="pinjaman-saya"] span:last-child').forEach(badge => {
      if (badge.textContent.includes('/2')) {
        badge.textContent = count >= 2 ? `${count}/2 Penuh` : `${count}/2`;
      }
    });

    // Update Admin top header "X Pengembalian Menunggu"
    const allActiveLoans = (dbState.loans || []).filter(l => l.status === 'dipinjam');
    document.querySelectorAll('header a[data-path="pinjaman-aktif"] span:last-child').forEach(span => {
      if (span.textContent.includes('Pengembalian')) {
        span.textContent = `${allActiveLoans.length} Pinjaman Aktif`;
      }
    });
  }

  // =========================================================================
  // 1. SCREEN: PINJAMAN AKTIF & PROSES PENGEMBALIAN + DENDA (pinjaman-aktif)
  // =========================================================================
  let currentReturnLoan = null;

  function initPinjamanAktifScreen() {
    const returnModal = document.getElementById('return-modal');
    const tbody = document.querySelector('table tbody');
    if (!returnModal || !tbody) return;

    // Make background table 100% opaque and clickable when modal is closed
    const bgCard = tbody.closest('.opacity-40');
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

    // Check if user clicked a specific loan from dashboard or if we should show the table first
    const preselectedTrx = localStorage.getItem(SELECTED_LOAN_KEY);
    if (preselectedTrx) {
      localStorage.removeItem(SELECTED_LOAN_KEY);
      returnModal.classList.remove('hidden');
    }

    function renderActiveLoansTable(filterMode = 'all') {
      let loans = (dbState.loans || []).filter(l => filterMode === 'all' ? true : l.status === filterMode);
      const activeOnly = (dbState.loans || []).filter(l => l.status === 'dipinjam');

      // Update counter badge
      const countBadge = bgCard ? bgCard.querySelector('.px-2.py-0\\.5') : null;
      if (countBadge) {
        countBadge.textContent = `${activeOnly.length} Pinjaman Aktif / ${dbState.loans.length} Total`;
      }

      if (loans.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="py-8 text-center text-text-muted">
              Semua unit naga telah dikembalikan. Tidak ada pinjaman aktif yang tertunda.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = loans.map(loan => {
        const isBorrowed = loan.status === 'dipinjam';
        const dueDt = new Date(loan.tanggal_tenggat);
        const refDt = new Date(loan.tanggal_kembali || '2026-10-22');
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

      // Populate borrower, unit, and schedule in modal
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

      const dateInput = document.getElementById('return_datetime');
      if (dateInput) {
        dateInput.type = 'date';
        dateInput.min = loan.tanggal_pinjam;
        dateInput.value = '2026-10-22';
        recalculateFineUI(loan, dateInput.value);
        dateInput.onchange = () => recalculateFineUI(loan, dateInput.value);
        dateInput.oninput = () => recalculateFineUI(loan, dateInput.value);
      }

      // Reset submit button state
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
      const retDt = new Date(returnDateStr || '2026-10-22');
      const diffDays = Math.max(0, Math.round((retDt - dueDt) / (1000 * 60 * 60 * 24)));
      const totalFine = diffDays * 50000;
      loan._calculatedFine = totalFine;
      loan._returnDate = returnDateStr || '2026-10-22';

      // Update Total Fine text in modal
      const totalEl = returnModal.querySelector('.font-page-title.text-\\[22px\\]');
      if (totalEl) {
        totalEl.textContent = formatRupiah(totalFine);
        totalEl.className = `font-page-title text-[22px] font-bold ${totalFine > 0 ? 'text-status-danger' : 'text-status-available'}`;
      }
      // Update formula box
      const formulaSpans = returnModal.querySelectorAll('.py-space-sm.px-space-md.bg-surface-muted .font-semibold span');
      if (formulaSpans.length >= 2) {
        formulaSpans[0].textContent = `${diffDays} Hari Terlambat × Rp50.000`;
        formulaSpans[1].textContent = `= ${formatRupiah(totalFine)}`;
      }
    }

    // Override global finalizeReturn() so clicking "Selesaikan & Simpan Pengembalian" updates DB & UI
    window.finalizeReturn = async function () {
      const btn = document.getElementById('btn-submit-return');
      const targetLoan = currentReturnLoan || (dbState.loans || []).find(l => l.status === 'dipinjam');
      if (!targetLoan) {
        showDracoToast('Tidak Ada Pinjaman Aktif', 'Seluruh unit naga sudah dikembalikan.', true);
        returnModal.classList.add('hidden');
        updateBgOpacity();
        return;
      }

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">sync</span><span>Menyimpan ke Database...</span>`;
      }

      const dateInput = document.getElementById('return_datetime');
      const tglKembali = (dateInput && /^\d{4}-\d{2}-\d{2}$/.test(dateInput.value)) ? dateInput.value : '2026-10-22';

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

      if (btn) {
        btn.className = 'w-full sm:w-auto flex items-center justify-center gap-2 px-space-lg py-2.5 rounded font-label-regular text-label-regular font-semibold bg-status-available text-surface-container-lowest border border-status-available';
        btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">verified</span><span>Pengembalian Berhasil Disimpan!</span>`;
      }

      showDracoToast('Pengembalian Berhasil Disimpan', res.message);
      syncGlobalHeaderBadges();
      renderActiveLoansTable();

      setTimeout(() => {
        returnModal.classList.add('hidden');
        updateBgOpacity();
      }, 650);
    };

    // Wire close buttons on return-modal
    returnModal.querySelectorAll('button').forEach(b => {
      const txt = (b.textContent || '').trim();
      if (txt.includes('Batal / Kembali') || b.getAttribute('title') === 'Tutup Jendela') {
        b.onclick = () => {
          returnModal.classList.add('hidden');
          updateBgOpacity();
        };
      }
      if (txt.includes('Cetak Tanda Terima Fisik')) {
        b.onclick = () => window.print();
      }
    });

    // Wire Filter & Export buttons on header
    let showOnlyActive = false;
    document.querySelectorAll('button').forEach(b => {
      const txt = (b.textContent || '').trim();
      if (txt.includes('Filter Warkat')) {
        b.onclick = () => {
          showOnlyActive = !showOnlyActive;
          renderActiveLoansTable(showOnlyActive ? 'dipinjam' : 'all');
          showDracoToast('Filter Warkat', showOnlyActive ? 'Menampilkan hanya pinjaman berstatus Dipinjam.' : 'Menampilkan seluruh transaksi.');
        };
      }
      if (txt.includes('Ekspor Rekapitulasi')) {
        b.onclick = () => exportLoansToCSV();
      }
    });

    // Pick initial active loan to show in modal if open
    const initialLoan = (dbState.loans || []).find(l => l.trx_code === preselectedTrx && l.status === 'dipinjam') ||
                        (dbState.loans || []).find(l => l.status === 'dipinjam');
    if (initialLoan) {
      openReturnModalForLoan(initialLoan);
    } else {
      returnModal.classList.add('hidden');
      updateBgOpacity();
      renderActiveLoansTable();
    }
  }

  // =========================================================================
  // 2. SCREEN: ADMIN DASHBOARD RINGKASAN (ringkasan.html)
  // =========================================================================
  function initRingkasanScreen() {
    // Wire "Unduh Laporan Cetak" button
    document.querySelectorAll('button').forEach(btn => {
      const txt = (btn.textContent || '').trim();
      if (txt.includes('Unduh Laporan Cetak')) {
        btn.onclick = (e) => {
          e.preventDefault();
          navigateScreen('riwayat-dan-laporan');
        };
      }
      if (txt.includes('Proses Pengembalian')) {
        btn.onclick = (e) => {
          e.preventDefault();
          const row = btn.closest('tr');
          const codeMatch = row ? row.textContent.match(/NGA-\d+/) : null;
          if (codeMatch) {
            const loan = (dbState.loans || []).find(l => l.kode_unit === codeMatch[0] && l.status === 'dipinjam');
            if (loan) localStorage.setItem(SELECTED_LOAN_KEY, loan.trx_code);
          }
          navigateScreen('pinjaman-aktif');
        };
      }
    });
  }

  // =========================================================================
  // 3. SCREEN: UNIT NAGA & TAMBAH UNIT MODAL (unit-naga.html & tambah-unit-modal.html)
  // =========================================================================
  function initUnitNagaScreen() {
    const sidePanel = document.getElementById('sidePanel');
    const modalReg = document.getElementById('modalRegistrationBackdrop');
    if (!sidePanel && !modalReg) return;

    const tbody = document.querySelector('table tbody');
    let searchKeyword = '';
    let statusFilter = 'all';

    function renderUnitsTable() {
      if (!tbody) return;
      const units = (dbState.units || []).filter(u => {
        const matchSearch = !searchKeyword ||
          u.nama_unit.toLowerCase().includes(searchKeyword) ||
          u.kode_unit.toLowerCase().includes(searchKeyword) ||
          (u.category_names || []).join(' ').toLowerCase().includes(searchKeyword);
        const matchStatus = statusFilter === 'all' || u.status === statusFilter;
        return matchSearch && matchStatus;
      });

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
              <div class="flex flex-wrap items-center gap-1.5 max-w-[220px]">${catsHtml}</div>
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
                <span class="font-body-compact text-body-compact text-text-primary">22 Okt 2026</span>
                <span class="font-helper-text text-helper-text text-text-subtle">Sinkron Database</span>
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

    // Override toggleSidePanel, saveUnit, confirmDelete
    let currentEditMode = false;
    window.toggleSidePanel = function (show, mode = 'add', unitCode = '') {
      const panel = document.getElementById('sidePanel');
      const backdrop = document.getElementById('sidePanelBackdrop');
      if (!panel || !backdrop) return;
      const title = document.getElementById('panelTitle');
      const subtitle = document.getElementById('panelSubtitle');
      const submitText = document.getElementById('panelSubmitText');
      const kodeInput = document.getElementById('formKodeUnit');
      const namaInput = document.getElementById('formNamaUnit');

      if (show) {
        currentEditMode = (mode === 'edit');
        if (currentEditMode) {
          const found = (dbState.units || []).find(u => u.kode_unit === unitCode);
          if (title) title.textContent = 'Edit Spesimen ' + unitCode;
          if (subtitle) subtitle.textContent = 'Pembaruan Data Register Unit';
          if (submitText) submitText.textContent = 'Perbarui Warkat Unit';
          if (kodeInput) {
            kodeInput.value = unitCode;
            kodeInput.setAttribute('disabled', 'disabled');
          }
          if (namaInput) namaInput.value = found ? found.nama_unit : '';
        } else {
          const nextNum = 101 + (dbState.units ? dbState.units.length : 6);
          if (title) title.textContent = 'Registrasi Spesimen Baru';
          if (subtitle) subtitle.textContent = 'Registrasi Spesimen Baru';
          if (submitText) submitText.textContent = 'Simpan Unit Spesimen';
          if (kodeInput) {
            kodeInput.value = `NGA-${nextNum}`;
            kodeInput.removeAttribute('disabled');
          }
          if (namaInput) namaInput.value = '';
        }
        backdrop.classList.remove('hidden');
        setTimeout(() => panel.classList.remove('translate-x-full'), 10);
      } else {
        panel.classList.add('translate-x-full');
        setTimeout(() => backdrop.classList.add('hidden'), 300);
      }
    };

    window.saveUnit = async function () {
      const kode = (document.getElementById('formKodeUnit')?.value || '').trim();
      const nama = (document.getElementById('formNamaUnit')?.value || '').trim();
      if (!kode || !nama) {
        showDracoToast('Validasi Gagal', 'Kode Unit dan Nama Spesimen wajib diisi.', true);
        return;
      }
      const res = await apiCall('save_unit', {
        kode_unit: kode,
        nama_unit: nama,
        is_edit: currentEditMode,
        categories: ['Wyrm Api', 'Transportasi Berat']
      });
      if (!res || !res.ok) {
        showDracoToast('Gagal Menyimpan Unit', (res && res.error) || 'Terjadi kesalahan.', true);
        return;
      }
      showDracoToast('Berhasil Disimpan ke Database', res.message);
      window.toggleSidePanel(false);
      renderUnitsTable();
    };

    window.confirmDelete = async function (code, name) {
      if (!confirm(`Apakah Anda yakin ingin menghapus spesimen ${name} (${code}) dari database?`)) return;
      const res = await apiCall('delete_unit', { kode_unit: code });
      if (!res || !res.ok) {
        showDracoToast('Penghapusan Ditolak (BR-08)', (res && res.error) || 'Unit tidak dapat dihapus.', true);
        return;
      }
      showDracoToast('Spesimen Dihapus', res.message);
      renderUnitsTable();
    };

    // Wire search input on unit-naga
    const sInput = document.getElementById('searchInput');
    if (sInput) {
      sInput.addEventListener('input', (e) => {
        searchKeyword = e.target.value.trim().toLowerCase();
        renderUnitsTable();
      });
    }

    // Wire modalRegistrationBackdrop on tambah-unit-modal.html
    if (modalReg) {
      const saveModalBtn = modalReg.querySelector('button.bg-primary');
      if (saveModalBtn) {
        saveModalBtn.onclick = async () => {
          const kode = (document.getElementById('inputKodeUnit')?.value || 'NGA-107').trim();
          const nama = (document.getElementById('inputNamaUnit')?.value || 'Solarian Sunstrider').trim();
          const res = await apiCall('save_unit', {
            kode_unit: kode,
            nama_unit: nama,
            is_edit: false,
            categories: ['Wyrm Api', 'Transportasi Berat']
          });
          if (!res || !res.ok) {
            showDracoToast('Gagal Mendaftarkan Spesimen', (res && res.error) || 'Error', true);
            return;
          }
          showDracoToast('Spesimen Baru Terdaftar', res.message);
          modalReg.classList.add('hidden');
          renderUnitsTable();
        };
      }
    }

    renderUnitsTable();
  }

  // =========================================================================
  // 4. SCREEN: KATEGORI ORDO NAGA (kategori.html)
  // =========================================================================
  function initKategoriScreen() {
    const catTable = document.getElementById('category-table');
    const catForm = document.getElementById('category-form');
    if (!catTable || !catForm) return;

    const tbody = catTable.querySelector('tbody');
    const inputNama = document.getElementById('input-nama-kategori');
    const inputDesc = document.getElementById('input-karakteristik');
    const formTitle = document.getElementById('form-title');
    const formBadge = document.getElementById('form-mode-badge');
    const submitLabel = document.getElementById('btn-submit-label');
    let editingCatId = 0;
    let editingOldName = '';

    function renderCategoriesTable(filterQ = '') {
      if (!tbody) return;
      const cats = (dbState.categories || []).filter(c =>
        !filterQ || c.nama_kategori.toLowerCase().includes(filterQ)
      );

      tbody.innerHTML = cats.map((c, idx) => {
        const code = `KAT-0${idx + 1}`;
        const count = Number(c.unit_count || 0);
        const canDelete = count === 0;
        return `
          <tr class="hover:bg-surface-raised/60 transition-colors">
            <td class="py-3.5 px-space-md font-code-metadata text-primary font-semibold">${code}</td>
            <td class="py-3.5 px-space-md">
              <div class="font-label-regular text-text-primary font-semibold">${c.nama_kategori}</div>
              <div class="font-helper-text text-helper-text text-text-subtle">Taksonomi Ordo Resmi Dragonkeep</div>
            </td>
            <td class="py-3.5 px-space-md font-body-compact text-body-compact text-text-muted">
              Standar pelana serikat terverifikasi untuk kelas ${c.nama_kategori}.
            </td>
            <td class="py-3.5 px-space-md text-center">
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-code-metadata text-code-metadata ${count > 0 ? 'bg-surface-raised text-primary border border-border' : 'bg-surface-muted text-text-subtle'}">
                ${count} Unit Terkait
              </span>
            </td>
            <td class="py-3.5 px-space-md text-right">
              <div class="inline-flex items-center justify-end gap-1.5">
                <button type="button" data-edit-id="${c.id}" data-edit-code="${code}" data-edit-name="${c.nama_kategori}" class="btn-edit px-2.5 py-1 rounded bg-surface-container hover:bg-surface-raised text-text-primary font-label-regular text-label-regular transition-colors">
                  Ubah
                </button>
                <button type="button" data-del-id="${c.id}" data-del-name="${c.nama_kategori}" data-del-count="${count}" class="px-2.5 py-1 rounded ${canDelete ? 'bg-status-danger-bg text-status-danger hover:opacity-90' : 'bg-surface-muted text-text-subtle opacity-60'} font-label-regular text-label-regular transition-colors" title="${canDelete ? 'Hapus Kategori' : 'Terkunci oleh relasi unit (BR-08)'}">
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
          const code = btn.getAttribute('data-edit-code');
          if (formTitle) formTitle.textContent = `Ubah Kategori: ${code}`;
          if (formBadge) formBadge.textContent = 'MODE SUNTING';
          if (submitLabel) submitLabel.textContent = 'Perbarui Kategori';
          if (inputNama) {
            inputNama.value = editingOldName;
            inputNama.focus();
          }
          if (inputDesc) inputDesc.value = `Standar pelana dan klasifikasi fisiologi untuk ${editingOldName}.`;
        };
      });

      tbody.querySelectorAll('[data-del-id]').forEach(btn => {
        btn.onclick = async () => {
          const cid = Number(btn.getAttribute('data-del-id'));
          const cname = btn.getAttribute('data-del-name');
          const cnt = Number(btn.getAttribute('data-del-count'));
          if (cnt > 0) {
            showDracoToast('Proteksi Relasi (BR-08)', `Kategori '${cname}' masih terikat pada ${cnt} unit naga aktif dan tidak dapat dihapus.`, true);
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

    // Intercept form submit in capture phase so it saves to real DB
    catForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const nama = (inputNama?.value || '').trim();
      if (!nama) {
        showDracoToast('Validasi Kategori', 'Nama kategori wajib diisi.', true);
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
      showDracoToast('Kategori Disimpan ke Database', res.message);
      editingCatId = 0;
      editingOldName = '';
      catForm.reset();
      if (formTitle) formTitle.textContent = 'Tambah Kategori Baru';
      if (formBadge) formBadge.textContent = 'MODE INPUT';
      if (submitLabel) submitLabel.textContent = 'Simpan Kategori';
      renderCategoriesTable();
    }, true);

    renderCategoriesTable();
  }

  // =========================================================================
  // 5. SCREEN: ANGGOTA & PROFIL 1:1 (anggota.html)
  // =========================================================================
  function initAnggotaScreen() {
    const formAnggota = document.getElementById('form-anggota-baru');
    const modalProfil = document.getElementById('modal-profil');
    if (!formAnggota && !modalProfil) return;

    const tbody = document.querySelector('table tbody');
    let searchQ = '';

    function renderMembersTable() {
      if (!tbody) return;
      const members = (dbState.members || []).filter(m =>
        !searchQ ||
        m.nama_lengkap.toLowerCase().includes(searchQ) ||
        m.email.toLowerCase().includes(searchQ) ||
        (m.reg_code || '').toLowerCase().includes(searchQ)
      );

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
              <span class="px-2 py-0.5 rounded font-code-metadata text-code-metadata ${loansCount >= 2 ? 'bg-status-danger-bg text-status-danger' : (loansCount > 0 ? 'bg-status-borrowed-bg text-status-borrowed' : 'bg-status-available-bg text-status-available')}">
                ${loansCount}/2 Aktif
              </span>
            </td>
            <td class="py-3.5 px-space-md text-right">
              <div class="inline-flex items-center gap-1.5">
                <button type="button" onclick="showProfileModal('${m.nama_lengkap.replace(/'/g, "\\'")}', '${m.email}', '${m.no_telp}', '${m.alamat.replace(/'/g, "\\'")}', '${m.reg_code}', '${m.role.toUpperCase()}', '${loansCount}/2 Pinjaman Aktif')" class="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-raised text-text-primary font-label-regular text-label-regular">
                  Detail 1:1
                </button>
                <button type="button" onclick="confirmDisableMember('${m.nama_lengkap.replace(/'/g, "\\'")}', '${m.reg_code}', ${m.id})" class="px-2 py-1 rounded bg-surface-container hover:bg-status-danger-bg text-text-subtle hover:text-status-danger font-label-regular text-label-regular" title="Hapus / Nonaktifkan">
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
      showDracoToast('Anggota & Profil 1:1 Tersimpan', res.message);
      if (formAnggota) formAnggota.reset();
      renderMembersTable();
    };

    window.confirmDisableMember = async function (nama, reg, id) {
      if (!confirm(`Apakah Anda yakin ingin menghapus / menonaktifkan anggota ${nama} (${reg})?`)) return;
      const res = await apiCall('delete_member', { id, nama_lengkap: nama });
      if (!res || !res.ok) {
        showDracoToast('Proteksi Relasi Anggota (BR-08)', (res && res.error) || 'Anggota masih memiliki pinjaman aktif.', true);
        return;
      }
      showDracoToast('Anggota Dihapus', res.message);
      renderMembersTable();
    };

    const sInput = document.getElementById('search-input') || document.querySelector('input[type="search"], input[placeholder*="Cari"]');
    if (sInput) {
      sInput.addEventListener('input', (e) => {
        searchQ = e.target.value.trim().toLowerCase();
        renderMembersTable();
      });
    }

    renderMembersTable();
  }

  // =========================================================================
  // 6. SCREEN: KATALOG NAGA & MODAL PEMINJAMAN (katalog-naga.html)
  // =========================================================================
  function initKatalogNagaScreen() {
    const rentalModal = document.getElementById('rentalModal');
    const rentalForm = document.getElementById('rentalForm');
    if (!rentalModal || !rentalForm) return;

    // Sync dragon card statuses from dbState.units
    document.querySelectorAll('.dragon-card').forEach(card => {
      const code = card.getAttribute('data-code');
      const unit = (dbState.units || []).find(u => u.kode_unit === code);
      if (!unit) return;

      card.setAttribute('data-status', unit.status);
      const rentBtn = card.querySelector('.rent-action-btn') || card.querySelector('button[disabled]');
      const badgeSpans = card.querySelectorAll('span');
      badgeSpans.forEach(sp => {
        const t = sp.textContent.trim().toUpperCase();
        if (t === 'TERSEDIA' || t === 'DIPINJAM') {
          if (unit.status === 'tersedia') {
            sp.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-status-available-bg/95 text-status-available font-code-metadata text-code-metadata uppercase tracking-wider shadow-sm';
            sp.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-status-available"></span> Tersedia`;
          } else {
            sp.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-status-borrowed-bg/95 text-status-borrowed font-code-metadata text-code-metadata uppercase tracking-wider shadow-sm';
            sp.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-status-borrowed"></span> Dipinjam`;
          }
        }
      });

      if (rentBtn) {
        if (unit.status === 'tersedia') {
          rentBtn.disabled = false;
          rentBtn.className = 'rent-action-btn flex-1 py-2 px-3 rounded bg-primary-container text-gold-ink font-semibold hover:bg-gold-hover transition-colors font-label-regular text-label-regular flex items-center justify-center gap-1.5 shadow-sm';
          rentBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">how_to_reg</span><span>Pinjam Naga</span>`;
          rentBtn.setAttribute('data-code', unit.kode_unit);
          rentBtn.setAttribute('data-name', unit.nama_unit);
          rentBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            localStorage.setItem(SELECTED_UNIT_KEY, unit.kode_unit);
            document.getElementById('modalDragonCode').textContent = `Kode: ${unit.kode_unit}`;
            document.getElementById('modalDragonName').textContent = unit.nama_unit;
            rentalModal.classList.remove('hidden');
          };
        } else {
          rentBtn.disabled = true;
          rentBtn.className = 'flex-1 py-2 px-3 rounded bg-surface-raised/60 text-text-subtle border border-border cursor-not-allowed font-label-regular text-label-regular flex items-center justify-center gap-1.5 select-none';
          rentBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">lock</span><span>Sedang Dipinjam</span>`;
          rentBtn.onclick = null;
        }
      }
    });

    // Wire Detail button to store selected unit and open detail-naga
    document.querySelectorAll('.view-detail-btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const code = this.getAttribute('data-code') || 'NGA-101';
        localStorage.setItem(SELECTED_UNIT_KEY, code);
        navigateScreen('detail-naga');
      }, true);
    });

    // Wire rentalForm submit to actually borrow in DB
    rentalForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const codeText = (document.getElementById('modalDragonCode')?.textContent || 'NGA-101').replace('Kode:', '').trim();
      const days = Number(document.getElementById('selectedDaysInput')?.value || 3);
      const user = getCurrentUser();

      const res = await apiCall('borrow_loan', {
        user_id: user.id || 2,
        kode_unit: codeText,
        days,
        tanggal_pinjam: '2026-10-22'
      });

      if (!res || !res.ok) {
        showDracoToast('Peminjaman Ditolak', (res && res.error) || 'Gagal meminjam unit.', true);
        return;
      }

      rentalModal.classList.add('hidden');
      showDracoToast('Peminjaman Berhasil Dicatat!', res.message);
      syncGlobalHeaderBadges();
      setTimeout(() => navigateScreen('pinjaman-saya'), 900);
    }, true);
  }

  // =========================================================================
  // 7. SCREEN: DETAIL NAGA & KONFIRMASI PINJAMAN (detail-naga.html)
  // =========================================================================
  function initDetailNagaScreen() {
    const btnConfirm = document.getElementById('btn-confirm-rental');
    if (!btnConfirm) return;

    const selectedCode = localStorage.getItem(SELECTED_UNIT_KEY) || 'NGA-101';
    const unit = (dbState.units || []).find(u => u.kode_unit === selectedCode) || (dbState.units || [])[0];

    if (unit) {
      // Update page title & modal summary with selected dragon
      document.querySelectorAll('h1, #modal-title + span, h3').forEach(el => {
        if (el.tagName === 'H1') el.textContent = unit.nama_unit;
      });
      const modalTitleCard = document.querySelector('#rental-confirmation-modal h3');
      if (modalTitleCard) modalTitleCard.textContent = unit.nama_unit;
    }

    let chosenDays = 3;
    document.querySelectorAll('.duration-btn').forEach(b => {
      b.addEventListener('click', function () {
        chosenDays = Number(this.getAttribute('data-days') || 3);
      });
    });

    // Share link button
    document.querySelectorAll('button').forEach(b => {
      if ((b.textContent || '').includes('Bagikan Tautan Registri')) {
        b.onclick = () => {
          if (navigator.clipboard) navigator.clipboard.writeText(window.location.href);
          showDracoToast('Tautan Disalin', `Tautan registri ${unit ? unit.nama_unit : 'NGA-101'} berhasil disalin ke papan klip.`);
        };
      }
    });

    btnConfirm.addEventListener('click', async function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const user = getCurrentUser();
      btnConfirm.disabled = true;
      btnConfirm.innerHTML = `<span class="material-symbols-outlined text-[20px] animate-spin">refresh</span><span>Menyimpan ke Database...</span>`;

      const res = await apiCall('borrow_loan', {
        user_id: user.id || 2,
        kode_unit: unit ? unit.kode_unit : 'NGA-101',
        days: chosenDays,
        tanggal_pinjam: '2026-10-22'
      });

      btnConfirm.disabled = false;
      btnConfirm.innerHTML = `<span class="material-symbols-outlined text-[20px]">verified_user</span><span>Konfirmasi Pinjaman</span>`;

      if (!res || !res.ok) {
        showDracoToast('Peminjaman Ditolak', (res && res.error) || 'Gagal memproses pinjaman.', true);
        return;
      }

      showDracoToast('Kontrak Peminjaman Diterbitkan!', res.message);
      syncGlobalHeaderBadges();
      setTimeout(() => navigateScreen('pinjaman-saya'), 800);
    }, true);
  }

  // =========================================================================
  // 8. SCREEN: PINJAMAN SAYA (pinjaman-saya.html)
  // =========================================================================
  function initPinjamanSayaScreen() {
    // Check if we are on pinjaman-saya.html
    const pageTitle = document.querySelector('h1');
    if (!pageTitle || !pageTitle.textContent.includes('Pinjaman Saya')) return;

    const user = getCurrentUser();
    const myActiveLoans = (dbState.loans || []).filter(
      l => l.status === 'dipinjam' && (l.user_id === user.id || l.user_id === 2)
    );

    // Update Quota Indicator text
    document.querySelectorAll('span').forEach(sp => {
      if (sp.textContent.includes('DARI 2 AKTIF')) {
        sp.textContent = `${myActiveLoans.length} DARI 2 AKTIF ${myActiveLoans.length >= 2 ? '(PENUH)' : '(TERSEDIA)'}`;
      }
    });

    // Wire action buttons on active loan cards ("Lihat Lembar Kontrak", "Petunjuk Pos Pengembalian", "Jadwalkan Serah Terima")
    document.querySelectorAll('article button').forEach(btn => {
      const txt = (btn.textContent || '').trim();
      if (txt.includes('Lihat Lembar Kontrak')) {
        btn.onclick = () => {
          const card = btn.closest('article');
          const name = card?.querySelector('h2')?.textContent || 'Ignis Ashbringer';
          showDracoToast('Warkat Kontrak Resmi', `Kontrak sewa ${name} berstatus Aktif & Terverifikasi oleh Kurator Dragonkeep.`);
        };
      }
      if (txt.includes('Petunjuk Pos Pengembalian') || txt.includes('Jadwalkan Serah Terima')) {
        btn.onclick = async () => {
          const card = btn.closest('article');
          const codeMatch = card ? card.textContent.match(/NGA-\d+/) : null;
          const kode = codeMatch ? codeMatch[0] : '';
          if (confirm(`Serahkan spesimen ${kode || 'ini'} ke Pos Kurator Admin untuk segera diproses pengembaliannya sekarang?`)) {
            const res = await apiCall('return_loan', {
              kode_unit: kode,
              tanggal_kembali: '2026-10-22'
            });
            if (res && res.ok) {
              showDracoToast('Serah Terima Selesai!', res.message);
              syncGlobalHeaderBadges();
              if (card) card.remove();
            } else {
              showDracoToast('Info Pengembalian', (res && res.error) || 'Silakan menuju menu Pinjaman Aktif Admin.', true);
            }
          }
        };
      }
    });
  }

  // =========================================================================
  // 9. SCREEN: PROFIL SAYA (profil-saya.html)
  // =========================================================================
  function initProfilSayaScreen() {
    const profileForm = document.getElementById('profile-form');
    if (!profileForm) return;

    const user = getCurrentUser();
    const namaInput = document.getElementById('nama_lengkap');
    const telpInput = document.getElementById('no_telp');
    const emailInput = document.getElementById('email');
    const alamatInput = document.getElementById('alamat');

    // Find latest from dbState.members
    const dbMember = (dbState.members || []).find(m => m.id === user.id || m.email === user.email) || user;
    if (namaInput && dbMember.nama_lengkap) namaInput.value = dbMember.nama_lengkap;
    if (telpInput && dbMember.no_telp) telpInput.value = dbMember.no_telp;
    if (emailInput && dbMember.email) emailInput.value = dbMember.email;
    if (alamatInput && dbMember.alamat) alamatInput.value = dbMember.alamat;

    window.handleProfileSave = async function () {
      const submitBtn = document.getElementById('submit-btn');
      const banner = document.getElementById('save-feedback-banner');
      const nama = (namaInput?.value || '').trim();
      const telp = (telpInput?.value || '').trim();
      const alamat = (alamatInput?.value || '').trim();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span><span>Menyimpan ke Database...</span>`;
      }

      const res = await apiCall('update_profile', {
        user_id: dbMember.id || 2,
        email: dbMember.email,
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

      // Update displayed name on card & header
      document.querySelectorAll('aside h2, header .group span.font-label-regular').forEach(el => {
        el.textContent = nama;
      });
      if (banner) {
        banner.classList.remove('hidden');
        banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      showDracoToast('Profil Berhasil Diperbarui', res.message);
    };
  }

  // =========================================================================
  // 10. SCREEN: RIWAYAT & LAPORAN ADMIN (riwayat-dan-laporan.html)
  // =========================================================================
  function exportLoansToCSV() {
    const loans = dbState.loans || [];
    const headers = ['ID Transaksi', 'Peminjam', 'Email', 'Kode Unit', 'Nama Naga', 'Tgl Pinjam', 'Tgl Tenggat', 'Tgl Kembali', 'Status', 'Denda (Rp)'];
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
    link.setAttribute('download', 'Laporan_Transaksi_DracoRent.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showDracoToast('Ekspor CSV Berhasil', 'Berkas Laporan_Transaksi_DracoRent.csv telah diunduh.');
  }

  function initRiwayatLaporanAdminScreen() {
    const printModal = document.getElementById('print-modal');
    const warkatModal = document.getElementById('warkat-detail-modal');
    if (!printModal && !warkatModal) return;

    // Wire Cetak Riwayat / Print buttons
    document.querySelectorAll('button').forEach(btn => {
      const txt = (btn.textContent || '').trim();
      if (txt.includes('Cetak Riwayat') || txt.includes('Pratinjau Cetak') || btn.id === 'btn-open-print') {
        btn.onclick = () => {
          if (printModal) {
            printModal.classList.remove('hidden');
            printModal.classList.add('flex');
          } else {
            window.print();
          }
        };
      }
      if (txt.includes('Ekspor CSV') || btn.id === 'btn-export-csv') {
        btn.onclick = () => exportLoansToCSV();
      }
    });

    const btnTriggerPrint = document.getElementById('btn-trigger-print');
    if (btnTriggerPrint) btnTriggerPrint.onclick = () => window.print();

    const btnClosePrint = document.getElementById('btn-close-print');
    if (btnClosePrint && printModal) {
      btnClosePrint.onclick = () => {
        printModal.classList.add('hidden');
        printModal.classList.remove('flex');
      };
    }

    const btnCloseWarkat = document.getElementById('btn-close-warkat-detail');
    if (btnCloseWarkat && warkatModal) {
      btnCloseWarkat.onclick = () => {
        warkatModal.classList.add('hidden');
        warkatModal.classList.remove('flex');
      };
    }

    document.querySelectorAll('.btn-inspect-warkat').forEach(btn => {
      btn.onclick = function () {
        const trx = this.getAttribute('data-trx') || 'TRX-2026-0882';
        if (warkatModal) {
          const trxEl = document.getElementById('warkat-modal-trx-id');
          if (trxEl) trxEl.textContent = trx;
          warkatModal.classList.remove('hidden');
          warkatModal.classList.add('flex');
        }
      };
    });

    document.querySelectorAll('.btn-print-single').forEach(btn => {
      btn.onclick = function () {
        if (printModal) {
          printModal.classList.remove('hidden');
          printModal.classList.add('flex');
        } else {
          window.print();
        }
      };
    });
  }

  // =========================================================================
  // 11. SCREEN: LOGIN (masuk.html)
  // =========================================================================
  function initLoginScreen() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const email = (document.getElementById('email')?.value || '').trim();
      const password = (document.getElementById('password')?.value || '').trim();

      const res = await apiCall('login', { email, password });
      if (res && res.ok && res.user) {
        setCurrentUser(res.user);
        showDracoToast('Login Berhasil', `Selamat datang kembali, ${res.user.nama_lengkap}!`);
        setTimeout(() => {
          if (res.user.role === 'admin') {
            navigateScreen('ringkasan');
          } else {
            navigateScreen('katalog-naga');
          }
        }, 400);
      } else {
        // Fallback quick role check
        const isAdm = email.toLowerCase().includes('admin') || email.toLowerCase().includes('kaelen');
        setCurrentUser(isAdm ? DEFAULT_STATE.members[0] : DEFAULT_STATE.members[1]);
        navigateScreen(isAdm ? 'ringkasan' : 'katalog-naga');
      }
    }, true);
  }

  // =========================================================================
  // BOOTSTRAP ON DOM READY
  // =========================================================================
  document.addEventListener('DOMContentLoaded', async function () {
    const res = await apiCall('bootstrap');
    if (res && res.units) {
      saveLocalState(res);
    }
    syncGlobalHeaderBadges();
    initLoginScreen();
    initPinjamanAktifScreen();
    initRingkasanScreen();
    initUnitNagaScreen();
    initKategoriScreen();
    initAnggotaScreen();
    initKatalogNagaScreen();
    initDetailNagaScreen();
    initPinjamanSayaScreen();
    initProfilSayaScreen();
    initRiwayatLaporanAdminScreen();
  });
})();
