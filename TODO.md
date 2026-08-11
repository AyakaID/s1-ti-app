# S1-TI Learning Platform - TODO & Roadmap

Dokumentasi progres pengerjaan project. Centang [x] untuk item yang selesai.
Terakhir diperbarui: Fase 4 selesai, bersiap masuk Fase 5.

---

## Fase 1 - Fondasi (SELESAI)

- [x] Inisialisasi Next.js 16 (App Router, TypeScript, Tailwind CSS)
- [x] Setup project Supabase (region Singapore)
- [x] Setup aplikasi Discord Developer Portal (OAuth2 + Redirect URL)
- [x] Konfigurasi .env.local (Supabase URL, anon key)
- [x] Test koneksi Supabase dari Next.js

## Fase 2 - Autentikasi Discord (SELESAI)

- [x] Aktifkan Discord provider di Supabase Auth
- [x] Halaman login dengan tombol "Login dengan Discord" (Lucide icons)
- [x] Session handling + logout
- [x] Kartu profil dengan avatar + username Discord

## Fase 3 - Database & Fitur Inti (SELESAI)

- [x] Tabel profiles, materials, user_progress + RLS policies
- [x] Trigger handle_new_user (profile otomatis saat login pertama)
- [x] Backfill profile + flag is_admin untuk akun pertama
- [x] Storage bucket "materials" (public) + policies select/insert/delete
- [x] Dashboard: navbar, progress bar, daftar materi
- [x] Material card: tandai selesai + tanggal relatif (date-fns)
- [x] Form upload admin: mode File (storage) dan mode Link (YouTube/Drive)
- [x] Halaman detail materi dengan smart preview (YouTube embed, Drive embed, PDF iframe, fallback unduh)
- [x] Proteksi route: middleware + cek admin di halaman + RLS

## Fase 4 - Webhook, CRUD, Kompresi (SELESAI)

- [x] Webhook Discord + env DISCORD_WEBHOOK_URL
- [x] Server Action notifyNewMaterial (embed notifikasi materi baru)
- [x] Halaman Kelola Materi (daftar + edit + hapus)
- [x] Halaman Edit materi (ganti metadata, ganti file/link, hapus file lama)
- [x] Hapus materi + cleanup objek storage
- [x] Kompresi PDF client-side (pdf-lib) + statistik ukuran di UI
- [x] Batas ukuran file 20MB dengan pesan error ramah
- [x] Loading states: loading bar + teks tahapan + disable input saat proses
- [x] Dropzone file UI (nama file + ukuran + tombol hapus file)

## Dokumentasi (SELESAI)

- [x] CLAUDE.md (konteks & arsitektur project)
- [x] AGENTS.md (aturan kerja AI agent)
- [x] TODO.md (file ini)
- [x] Perbarui ketiga file di atas setiap ada fitur besar baru

## Fase 5 - Bot Discord & Level Website (SELESAI)

- [x] Tambah kolom discord_id di tabel profiles (SQL + update trigger di `scripts/supabase_phase5_migration.sql`)
- [x] Setup Bot di Discord Developer Portal (token, intents, invite URL)
- [x] Buat script bot (discord.js) di folder `bot/` (`index.ts`, `commands.ts`, `role-sync.ts`)
- [x] Command /progress dan /rank (cek level rank website & progres belajar dari Discord)
- [x] Command /leaderboard (papan peringkat pengguna dari Discord)
- [x] Definisikan Level Website bertingkat dengan Ikon Lucide React: Pemula (Shield), Mahasiswa Rajin (Zap), Kandidat Cumlaude (GraduationCap), Master S1-TI (Crown)
- [x] Render Level Badge & progress bar di Dashboard Website (`src/components/level-badge.tsx`)
- [ ] Hosting bot 24/7 (Railway / Render / VPS)

## Fase 6 - Gamifikasi (SEDANG BERJALAN)

- [x] Sistem poin (+10 PTS per Riddle Harian benar, simpan di `profiles.points`)
- [x] Riddle Harian (1 soal per hari, rotasi otomatis berbasis tanggal, 12 soal kurasi di `scripts/supabase_riddles_seed.sql`)
- [x] UI Riddle Harian di Dashboard (`src/components/daily-riddle-card.tsx` dengan Lucide React icons)
- [x] Server Action validasi jawaban & proteksi 1x jawab per hari (`src/app/actions/riddle-actions.ts`)
- [x] Badges (first lesson, 10 materi, streak, dll. - Sistem level badge bertingkat)
- [x] Halaman leaderboard di website (`src/app/leaderboard/page.tsx`)
- [x] Command /leaderboard di Discord
- [ ] Sertifikat sederhana saat kelas tuntas (opsional)

## Fase 7 - Polish, Full-Screen UI & Deployment (SEDANG BERJALAN)

- [x] Landing page publik full-screen untuk user yang belum login
- [x] Full-Screen Responsive UI Overhaul seluruh halaman (fluid container max-w-1920px)
- [x] Integrasi Anime.js (staggered entry grid, particle mesh background, animated counters)
- [x] Pencarian + filter materi (mata kuliah / semester)
- [ ] Pagination daftar materi
- [ ] Validasi form dengan zod
- [x] Custom 404 + error page (`src/app/not-found.tsx`, `src/app/error.tsx`)
- [ ] Deploy frontend ke Vercel
- [ ] Tambahkan redirect URL production di Discord Developer Portal + Site URL Supabase
- [ ] Deploy bot ke hosting
- [ ] README.md final (cara install, env, arsitektur)

## Fase 8 - Kurikulum & Konteks Belajar (SEDANG BERJALAN)

- [x] Tambah field `study_context` untuk materi agar admin memilih konteks tips secara eksplisit
- [x] Perluas guide tips belajar sesuai konteks kurikulum S1-TI
- [x] Sinkronkan form upload/edit materi dengan daftar konteks belajar
- [x] Tambahkan migration SQL untuk kolom `study_context`
- [ ] Backfill konteks belajar untuk materi lama berdasarkan mapping kurikulum
- [ ] Review ulang daftar konteks agar mencakup semua mata kuliah inti pada grid kurikulum

---

## Catatan Teknis

- Kompresi PDF di browser = optimasi struktur (pdf-lib), bukan downscale gambar.
- Supabase free tier: 1GB storage. Strategi hybrid wajib dipertahankan (video via link).
- Service role key HANYA untuk bot/server, tidak boleh masuk kode client.
- Semua ikon UI pakai lucide-react, dilarang emoji.
- Animasi UI ditenagai oleh Anime.js untuk efek visual modern & performan.