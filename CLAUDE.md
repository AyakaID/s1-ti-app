# S1-TI Learning Platform (Project Context)

## Deskripsi Project
S1-TI adalah platform repository, manajemen materi kuliah, dan sistem belajar interaktif untuk mahasiswa S1 TI, terintegrasi erat dengan Discord sebagai pusat notifikasi, sinkronisasi role, dan komunitas.

Status terkini: Fase 1-5 SELESAI (login Discord, CRUD materi, progress tracking, preview dokumen, kompresi PDF, webhook Discord, Level Rank Website dengan Lucide icons, & Bot Discord slash commands).

## Tech Stack
- Framework: Next.js 16 (App Router, Turbopack)
- Language: TypeScript strict
- Styling: Tailwind CSS, dark theme default (bg-slate-950, card bg-slate-900, aksen indigo-600), Full-Screen Fluid Layout (max-w-[1920px])
- Animations: Anime.js (staggered entry grid, animated counters, particle mesh background)
- Icons: Lucide React (EMOJI DILARANG di UI)
- Backend/DB: Supabase (PostgreSQL + RLS, Auth, Storage)
- Auth: Discord OAuth2 via Supabase Auth (tanpa email/password)
- Kompresi PDF: pdf-lib (optimasi client-side sebelum upload)
- Tanggal: date-fns dengan locale Indonesia
- Utilitas: clsx + tailwind-merge (fungsi cn di src/lib/utils.ts), zod tersedia untuk validasi
- Discord: Webhook untuk notifikasi; discord.js untuk bot Fase 5 (slash commands /progress, /rank, /leaderboard)

## Struktur Folder
- src/app/page.tsx : halaman login Discord
- src/app/dashboard/page.tsx : daftar materi + progres belajar + Level Rank Badge
- src/app/materi/[id]/page.tsx : detail materi dengan smart preview
- src/app/admin/upload/page.tsx + actions.ts : upload materi + Server Action webhook
- src/app/admin/manage/page.tsx : daftar CRUD materi (edit/hapus)
- src/app/admin/edit/[id]/page.tsx : form edit materi
- src/proxy.ts : proteksi route privat (Next.js 16 Proxy convention)
- src/components/ : level-badge, logout-button, material-card, mark-complete-button, delete-material-button
- src/lib/ : level-system.ts, supabase/client.ts, supabase/server.ts, compress.ts, types.ts, utils.ts
- bot/ : index.ts, commands.ts, role-sync.ts (Bot Discord server-side)
- scripts/ : supabase_phase5_migration.sql

## Skema Database (Supabase)
- profiles: id (auth.users), username, avatar_url, discord_id, is_admin, points, created_at
- materials: id, title, description, subject, semester, file_url, file_type (document|video|link), created_by, created_at
- user_progress: id, user_id, material_id, completed_at, unique(user_id, material_id)
- Storage bucket "materials" (public): select untuk authenticated, insert/delete untuk admin
- RLS: materials bisa dibaca semua user login; tulis hanya admin; user_progress hanya milik user sendiri

## Aturan Bisnis
- Login hanya via Discord OAuth2
- Hanya is_admin = true yang boleh upload/edit/hapus materi
- Strategi storage hybrid: file kecil (maks 20MB) di Supabase Storage; video besar via link YouTube/Drive
- PDF dikompres otomatis di client (optimizePdf) sebelum upload, statistik ukuran ditampilkan di UI
- Smart preview: YouTube embed, Google Drive embed, iframe PDF, fallback unduh
- Upload materi baru memicu notifikasi embed ke Discord via Server Action notifyNewMaterial
- Progres "Tandai Selesai" tersimpan di user_progress; Level Rank Website bertingkat: Pejuang Smt 1 (Shield), Mahasiswa Rajin (Zap), Kandidat Cumlaude (GraduationCap), Master S1-TI (Crown)
- Bot Discord (`npx tsx bot/index.ts`) menyediakan command slash `/progress`, `/rank`, `/leaderboard`
- Tips belajar materi memakai `study_context` eksplisit yang dipilih admin di form upload/edit; fallback heuristik hanya untuk materi lama yang belum diisi
- Daftar konteks belajar perlu mengikuti kurikulum S1-TI dan bisa diperluas saat ada mata kuliah baru

## Keamanan
- Proteksi 3 lapis: middleware (auth), cek is_admin di halaman admin, RLS di database
- DISCORD_WEBHOOK_URL hanya dipakai di Server Action (server-side)
- SUPABASE_SERVICE_ROLE_KEY tidak boleh masuk kode client; hanya untuk bot/server
- Aksi destruktif wajib window.confirm
- Saat mengubah konten belajar, pastikan konteks eksplisit, migration database, dan fallback UI tetap sinkron

## Environment Variables (.env.local)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- DISCORD_WEBHOOK_URL
- DISCORD_BOT_TOKEN (opsional untuk bot)
- DISCORD_CLIENT_ID (opsional untuk bot)
- DISCORD_GUILD_ID (opsional untuk bot)
- SUPABASE_SERVICE_ROLE_KEY (opsional untuk bot)