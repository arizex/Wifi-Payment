# 📱 Panduan Lengkap - Aplikasi Checklist Pembayaran WiFi

Aplikasi web modern untuk mengelola pembayaran pelanggan WiFi bulanan. Dapat diinstall di HP sebagai aplikasi standalone (PWA).

---

## 🎯 Fitur Utama

✅ **Checklist Pembayaran Bulanan**
- Tandai pembayaran pelanggan dengan sekali klik
- Filter berdasarkan bulan dan tahun
- Status real-time dengan persentase pembayaran

✅ **Manajemen Pelanggan**
- Tambah pelanggan baru dengan data lengkap
- Simpan nama, alamat, nomor telepon, dan biaya bulanan
- Lihat daftar pelanggan yang terorganisir

✅ **Riwayat Pembayaran**
- Lihat semua transaksi pembayaran
- Filter berdasarkan periode
- Total pendapatan per bulan

✅ **Progressive Web App (PWA)**
- Install seperti aplikasi native di HP
- Bekerja offline
- Tampilan full-screen tanpa browser

---

## 🛠️ Teknologi yang Digunakan

- **React 18** - Library UI modern dan cepat
- **TypeScript** - Keamanan tipe data untuk kode yang lebih aman
- **Tailwind CSS** - Styling modern dan responsive
- **Supabase** - Database PostgreSQL cloud dengan Row Level Security
- **Vite** - Build tool super cepat
- **Lucide React** - Icon library yang indah

**Mengapa teknologi ini?**
- React + TypeScript: Industri standard untuk aplikasi web modern
- Tailwind CSS: Membuat desain responsive sangat mudah
- Supabase: Database gratis dengan keamanan enterprise-grade
- PWA: Aplikasi web yang bisa diinstall seperti aplikasi native

---

## 📋 Persiapan Awal

### 1. Install Node.js
Download dan install Node.js dari: https://nodejs.org/
- Pilih versi LTS (Long Term Support)
- Pastikan versi minimal Node.js 18 atau lebih baru

Cek instalasi dengan menjalankan di terminal:
```bash
node --version
npm --version
```

### 2. Setup Supabase (Database)

#### A. Buat Akun Supabase
1. Kunjungi https://supabase.com
2. Klik "Start your project"
3. Sign up dengan email atau GitHub
4. Gratis tanpa kartu kredit!

#### B. Buat Project Baru
1. Setelah login, klik "New Project"
2. Isi data:
   - **Name**: Bayar WiFi
   - **Database Password**: Buat password kuat (simpan dengan aman!)
   - **Region**: Pilih Southeast Asia (Singapore) untuk performa terbaik
3. Klik "Create new project"
4. Tunggu 2-3 menit hingga project siap

#### C. Dapatkan API Keys
1. Di dashboard Supabase, klik menu **"Settings"** (ikon gear)
2. Pilih **"API"**
3. Copy 2 nilai ini:
   - **Project URL** (contoh: https://xxxxx.supabase.co)
   - **anon public** key (key yang panjang)

---

## ⚙️ Instalasi & Setup

### 1. Download Project
```bash
# Jika menggunakan git
git clone [URL_PROJECT]
cd [NAMA_FOLDER]
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root folder project:
```bash
# Di Windows (Command Prompt)
copy .env.example .env

# Di Mac/Linux (Terminal)
cp .env.example .env
```

Edit file `.env` dan isi dengan data Supabase Anda:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**PENTING:** Ganti `xxxxx` dengan URL dan key Anda dari Supabase!

### 4. Verifikasi Database

Database schema sudah otomatis dibuat saat Anda menjalankan migration. Untuk memverifikasi:

1. Buka Supabase Dashboard
2. Klik **"Table Editor"** di sidebar
3. Anda akan melihat 2 tabel:
   - **customers** - Data pelanggan
   - **payments** - Riwayat pembayaran

---

## 🚀 Menjalankan Aplikasi

### Mode Development (untuk testing)
```bash
npm run dev
```

Aplikasi akan berjalan di: http://localhost:5173

### Build untuk Production
```bash
npm run build
```

File production akan ada di folder `dist/`

---

## 📱 Cara Install di HP

### Untuk Android (Chrome/Edge):

1. Buka aplikasi di browser Chrome atau Edge
2. Tunggu hingga muncul notifikasi "Install App" atau "Add to Home Screen"
3. Atau klik menu (3 titik) > **"Install app"** atau **"Add to Home Screen"**
4. Klik **"Install"**
5. Icon aplikasi akan muncul di home screen
6. Buka seperti aplikasi biasa!

### Untuk iOS (Safari):

1. Buka aplikasi di Safari
2. Klik tombol **Share** (kotak dengan panah ke atas)
3. Scroll ke bawah dan pilih **"Add to Home Screen"**
4. Beri nama aplikasi (misal: "Bayar WiFi")
5. Klik **"Add"**
6. Icon aplikasi akan muncul di home screen

**Tips:** Untuk iOS, pastikan akses dari domain yang valid (bukan localhost). Deploy terlebih dahulu ke hosting.

---

## 💡 Cara Menggunakan Aplikasi

### 1. Menambah Pelanggan Baru

1. Klik tombol **"Tambah Pelanggan"** (biru) di bawah
2. Isi form:
   - **Nama Pelanggan** (wajib)
   - **Alamat** (opsional, membantu identifikasi)
   - **Nomor Telepon** (opsional)
   - **Biaya Bulanan** (wajib, dalam Rupiah)
3. Klik **"Tambah Pelanggan"**

### 2. Checklist Pembayaran

1. Pilih **Bulan** dan **Tahun** di bagian atas
2. Lihat daftar pelanggan
3. Untuk menandai sudah bayar:
   - Klik tombol **bulat abu-abu** (X) di sebelah kanan nama pelanggan
   - Tombol akan berubah menjadi **hijau** dengan centang (✓)
   - Tanggal pembayaran otomatis tercatat
4. Untuk membatalkan pembayaran:
   - Klik lagi tombol **hijau**
   - Tombol kembali abu-abu

**Status Bar:**
- Lihat berapa pelanggan yang sudah bayar vs total
- Persentase pembayaran bulan ini

### 3. Melihat Riwayat

1. Klik tombol **"Riwayat"** (hijau) di bawah
2. Pilih bulan dan tahun
3. Lihat:
   - Total pembayaran masuk
   - Jumlah transaksi
   - Detail setiap pembayaran (nama, tanggal, jumlah)

---

## 🎨 Fitur UI/UX

### Desain Mobile-First
- Optimized untuk layar HP
- Tombol besar dan mudah diklik
- Scroll smooth dan responsif

### Visual Feedback
- Warna hijau = sudah bayar
- Warna abu-abu = belum bayar
- Loading indicator saat proses
- Animasi transisi smooth

### Bottom Navigation
- Tombol aksi utama selalu terlihat di bawah
- Mudah dijangkau dengan jempol

---

## 🔒 Keamanan Database

Database Anda dilindungi dengan:

1. **Row Level Security (RLS)**
   - Data hanya bisa diakses oleh user yang terautentikasi
   - Proteksi dari SQL injection

2. **Environment Variables**
   - API keys tidak di-commit ke git
   - Terpisah dari kode aplikasi

3. **Unique Constraints**
   - Satu pelanggan tidak bisa bayar 2x di bulan yang sama
   - Data konsisten dan valid

---

## 📊 Struktur Database

### Tabel: `customers`
```sql
- id (UUID, primary key)
- name (text, nama pelanggan)
- address (text, alamat)
- phone (text, nomor telepon)
- monthly_fee (integer, biaya bulanan dalam Rupiah)
- is_active (boolean, status aktif)
- created_at (timestamp, tanggal daftar)
```

### Tabel: `payments`
```sql
- id (UUID, primary key)
- customer_id (UUID, foreign key ke customers)
- payment_date (date, tanggal pembayaran)
- month (integer, bulan 1-12)
- year (integer, tahun)
- amount (integer, jumlah pembayaran)
- notes (text, catatan)
- created_at (timestamp, waktu pencatatan)
```

---

## 🚀 Deploy ke Hosting

### Rekomendasi Hosting Gratis:

#### 1. **Vercel** (Paling Mudah)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Ikuti instruksi, aplikasi akan online dalam 1-2 menit!

#### 2. **Netlify**
1. Drag & drop folder `dist/` ke https://app.netlify.com/drop
2. Atau connect dengan GitHub untuk auto-deploy

#### 3. **GitHub Pages**
```bash
# Install gh-pages
npm install -D gh-pages

# Tambahkan di package.json
"homepage": "https://username.github.io/repo-name",
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}

# Deploy
npm run deploy
```

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Pastikan file `.env` ada di root folder
- Cek isi file `.env` sudah benar
- Restart development server (`npm run dev`)

### Data tidak muncul
- Cek koneksi internet
- Verifikasi URL dan API key Supabase benar
- Buka browser console (F12) untuk lihat error

### Tidak bisa install di HP
- Pastikan menggunakan HTTPS (deploy ke hosting, bukan localhost)
- Untuk iOS, harus di Safari (bukan Chrome)
- Clear cache browser dan coba lagi

### Build error
```bash
# Clear cache dan install ulang
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📈 Tips & Best Practices

### 1. Backup Data
- Export data dari Supabase secara berkala
- Dashboard Supabase > Database > SQL Editor
- Jalankan: `SELECT * FROM customers;` dan save hasil

### 2. Monitoring
- Cek Supabase dashboard untuk melihat penggunaan
- Free tier: 500MB database, 2GB bandwidth/bulan

### 3. Performance
- Aplikasi sudah di-optimize dengan caching
- Data ter-index untuk query cepat
- PWA bekerja offline untuk data yang sudah di-load

### 4. Keamanan
- Jangan share file `.env` ke siapapun
- Ganti password Supabase secara berkala
- Untuk production, pertimbangkan tambahkan autentikasi user

---

## 🔄 Update & Maintenance

### Update Dependencies
```bash
npm update
```

### Cek Outdated Packages
```bash
npm outdated
```

### Clean Install
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Support & Bantuan

### Resource Belajar:
- **React**: https://react.dev/learn
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Supabase**: https://supabase.com/docs

### Community:
- Stack Overflow (untuk error/bug)
- GitHub Issues (untuk bug aplikasi ini)

---

## 📝 Lisensi & Kredit

Aplikasi ini dibuat menggunakan:
- React + TypeScript + Vite
- Tailwind CSS untuk styling
- Supabase untuk database
- Lucide React untuk icons

Free to use and modify!

---

## 🎉 Selamat!

Aplikasi checklist pembayaran WiFi Anda siap digunakan!

**Next Steps:**
1. ✅ Tambahkan pelanggan pertama
2. ✅ Test checklist pembayaran
3. ✅ Deploy ke hosting
4. ✅ Install di HP Anda
5. ✅ Mulai kelola pembayaran dengan mudah!

**Selamat menggunakan aplikasi! 🚀**
