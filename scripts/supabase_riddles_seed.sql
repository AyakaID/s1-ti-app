-- ============================================================
-- S1-TI Learning Platform - Gamification: Riddles & Seed Data
-- ============================================================

-- 1. Tabel riddles
CREATE TABLE IF NOT EXISTS public.riddles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array string: ["Option A", "Option B", ...]
  correct_answer_index INT NOT NULL, -- 0-based index
  explanation TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.riddles ENABLE ROW LEVEL SECURITY;

-- RLS Policy for riddles: All authenticated users can read
CREATE POLICY "Authenticated users can view riddles"
  ON public.riddles FOR SELECT
  TO authenticated
  USING (true);

-- 2. Tabel user_riddle_attempts
CREATE TABLE IF NOT EXISTS public.user_riddle_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  riddle_id UUID NOT NULL REFERENCES public.riddles(id) ON DELETE CASCADE,
  attempted_date DATE NOT NULL DEFAULT CURRENT_DATE,
  selected_index INT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  points_awarded INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_daily_riddle UNIQUE (user_id, attempted_date)
);

-- Enable RLS
ALTER TABLE public.user_riddle_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_riddle_attempts
CREATE POLICY "Users can view their own riddle attempts"
  ON public.user_riddle_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own riddle attempts"
  ON public.user_riddle_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3. Stored Procedure untuk menambah poin user secara atomic
CREATE OR REPLACE FUNCTION public.increment_user_points(user_id_param UUID, amount_param INT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET points = COALESCE(points, 0) + amount_param
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Seed Data: 12 Soal Kurasi Standar S1-TI
INSERT INTO public.riddles (question, options, correct_answer_index, explanation, category) VALUES
(
  'Struktur data manakah yang bekerja dengan prinsip Last-In, First-Out (LIFO)?',
  '["Queue", "Stack", "Linked List", "Binary Tree"]'::jsonb,
  1,
  'Stack (tumpukan) menerapkan prinsip LIFO di mana elemen yang terakhir dimasukkan akan menjadi yang pertama kali dikeluarkan.',
  'Struktur Data'
),
(
  'Dalam konsep Pemrograman Berorientasi Objek (OOP), kemampuan sebuah objek untuk memiliki banyak bentuk dinamakan...',
  '["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"]'::jsonb,
  2,
  'Polymorphism (banyak bentuk) memungkinkan metode dengan nama yang sama bertindak berbeda sesuai dengan kelas/objek turunan yang memanggilnya.',
  'Pemrograman'
),
(
  'Manakah perintah SQL yang digunakan untuk menghapus baris data dalam tabel tanpa menghapus struktur tabelnya?',
  '["DROP TABLE", "DELETE FROM", "ALTER TABLE", "TRUNCATE SCHEMA"]'::jsonb,
  1,
  'DELETE FROM digunakan untuk menghapus baris spesifik atau seluruh baris data dari tabel tanpa menghapus skema/struktur tabel tersebut.',
  'Basis Data'
),
(
  'Protokol lapisan aplikasi manakah yang digunakan secara standar untuk mentransfer berkas secara aman menggunakan enkripsi SSH?',
  '["FTP", "SFTP", "HTTP", "SMTP"]'::jsonb,
  1,
  'SFTP (SSH File Transfer Protocol) memanfaatkan protokol SSH untuk menyediakan saluran enkripsi aman dalam transfer berkas.',
  'JaringanKomputer'
),
(
  'Pada Sistem Operasi, kondisi di mana dua atau lebih proses saling menunggu sumber daya yang dipegang proses lain sehingga tidak ada yang bisa berjalan disebut...',
  '["Starvation", "Deadlock", "Race Condition", "Paging"]'::jsonb,
  1,
  'Deadlock adalah situasi kebuntuan di mana dua atau lebih proses terhenti permanen karena saling menanti resource yang ditahan satu sama lain.',
  'Sistem Operasi'
),
(
  'Kompleksitas waktu (Time Complexity) terburuk dari algoritma pencarian Binary Search pada array terurut berukuran N adalah...',
  '["O(1)", "O(N)", "O(log N)", "O(N log N)"]'::jsonb,
  2,
  'Binary Search membagi area pencarian menjadi dua bagian pada setiap langkahnya, sehingga memiliki kompleksitas O(log N).',
  'Algoritma'
),
(
  'Kode status HTTP manakah yang mengindikasikan bahwa sumber daya yang diminta tidak ditemukan di server (Not Found)?',
  '["200 OK", "401 Unauthorized", "403 Forbidden", "404 Not Found"]'::jsonb,
  3,
  'Kode status HTTP 404 menunjukkan bahwa server tidak dapat menemukan URI/halaman yang diminta oleh klien.',
  'Web Development'
),
(
  'Perintah Git manakah yang digunakan untuk membuat cabang (branch) baru sekaligus berpindah ke cabang tersebut?',
  '["git branch new-branch", "git checkout -b new-branch", "git commit -m new-branch", "git merge new-branch"]'::jsonb,
  1,
  'Perintah `git checkout -b <nama-branch>` memicu pembuatan cabang baru sekaligus beralih kerja ke cabang tersebut secara langsung.',
  'Software Engineering'
),
(
  'Format pertukaran data berbasis teks yang ringan dan mudah dibaca manusia serta mesin menggunakan pasangan key-value dinamakan...',
  '["XML", "YAML", "JSON", "CSV"]'::jsonb,
  2,
  'JSON (JavaScript Object Notation) adalah format standar populer yang menggunakan struktur pasangan kunci-nilai (key-value).',
  'Format Data'
),
(
  'Port default manakah yang digunakan secara luas oleh protokol HTTPS terenkripsi TLS/SSL?',
  '["Port 80", "Port 21", "Port 443", "Port 8080"]'::jsonb,
  2,
  'Protokol HTTPS aman beroperasi pada port standar 443, sedangkan HTTP biasa beroperasi di port 80.',
  'JaringanKomputer'
),
(
  'Dalam arsitektur basis data relasional, sebuah kolom atau kombinasi kolom yang secara unik mengidentifikasi setiap baris dinamakan...',
  '["Foreign Key", "Primary Key", "Index Key", "Composite Attribute"]'::jsonb,
  1,
  'Primary Key adalah atribut unik pada tabel yang membedakan satu record data dengan record data lainnya.',
  'Basis Data'
),
(
  'Di bawah ini manakah jenis serangan siber di mana penyerang berupaya membanjiri lalu lintas server hingga tidak dapat diakses pengguna sah?',
  '["SQL Injection", "DDoS Attack", "Cross-Site Scripting (XSS)", "Man-in-the-Middle"]'::jsonb,
  1,
  'DDoS (Distributed Denial of Service) membanjiri server target dengan lalu lintas dari banyak komputer sekaligus hingga layanannya melumpuh.',
  'KeamananSiber'
);
