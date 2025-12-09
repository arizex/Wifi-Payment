/*
  # Sistem Checklist Pembayaran WiFi

  ## Deskripsi
  Database untuk mengelola pembayaran pelanggan WiFi dengan fitur tracking bulanan.

  ## 1. Tabel Baru
    
    ### `customers` - Data Pelanggan WiFi
      - `id` (uuid, primary key) - ID unik pelanggan
      - `name` (text) - Nama pelanggan
      - `address` (text) - Alamat lengkap
      - `phone` (text) - Nomor telepon
      - `monthly_fee` (integer) - Biaya bulanan (dalam rupiah)
      - `is_active` (boolean) - Status aktif/non-aktif
      - `created_at` (timestamptz) - Waktu pendaftaran

    ### `payments` - Riwayat Pembayaran
      - `id` (uuid, primary key) - ID unik pembayaran
      - `customer_id` (uuid, foreign key) - Referensi ke pelanggan
      - `payment_date` (date) - Tanggal pembayaran
      - `month` (integer) - Bulan pembayaran (1-12)
      - `year` (integer) - Tahun pembayaran
      - `amount` (integer) - Jumlah pembayaran
      - `notes` (text) - Catatan tambahan
      - `created_at` (timestamptz) - Waktu pencatatan

  ## 2. Security (RLS)
    - Enable RLS pada semua tabel
    - Policy membolehkan semua operasi untuk pengguna terautentikasi
    - Untuk versi produksi, pertimbangkan policy yang lebih ketat

  ## 3. Indexes
    - Index pada customer_id untuk query cepat
    - Index pada kombinasi month dan year untuk filtering
    - Index pada payment_date untuk sorting riwayat

  ## 4. Catatan Penting
    - monthly_fee dan amount dalam format integer (rupiah)
    - Kombinasi customer_id + month + year harus unik (tidak bisa bayar 2x di bulan yang sama)
*/

-- Buat tabel customers
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text DEFAULT '',
  phone text DEFAULT '',
  monthly_fee integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Buat tabel payments
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  year integer NOT NULL CHECK (year >= 2020 AND year <= 2100),
  amount integer NOT NULL DEFAULT 0,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(customer_id, month, year)
);

-- Buat indexes untuk performa
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_month_year ON payments(month, year);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_customers_active ON customers(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies untuk customers
CREATE POLICY "Allow all operations for authenticated users on customers"
  ON customers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies untuk payments
CREATE POLICY "Allow all operations for authenticated users on payments"
  ON payments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy untuk anonymous (untuk kemudahan development)
CREATE POLICY "Allow read for anonymous on customers"
  ON customers FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow all for anonymous on customers"
  ON customers FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow read for anonymous on payments"
  ON payments FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow all for anonymous on payments"
  ON payments FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);