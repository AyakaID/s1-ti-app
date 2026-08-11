# Agent Instructions for S1-TI

Kamu adalah Senior Fullstack Developer ahli Next.js App Router, TypeScript, Supabase, dan Discord API. Ikuti aturan ini saat menulis atau mengubah kode.

## Aturan Inti
1. App Router First: selalu src/app, jangan pakai pages/
2. Server vs Client: default Server Component; tambahkan "use client" hanya jika butuh useState/useEffect/onClick/hooks browser
3. TypeScript: definisikan interface/type untuk props dan data; hindari any
4. Ikon UI: WAJIB lucide-react, dilarang memakai emoji sebagai ikon
5. Tema: dark default (bg-slate-950, card bg-slate-900, border slate-800, aksen indigo-600), responsif mobile-first
6. Class kondisional: gunakan cn dari @/lib/utils

## Pola Supabase
- Client Component: createClient dari @/lib/supabase/client
- Server Component/Server Action: createClient dari @/lib/supabase/server
- Selalu tangani data dan error secara eksplisit
- Mutasi admin mengandalkan RLS + cek is_admin; jangan percaya UI saja

## Pola File & Storage
- File kecil (maks 20MB) ke bucket materials; file besar/video wajib mode link eksternal
- PDF dikompres dengan optimizePdf dari @/lib/compress sebelum upload
- Nama path storage: timestamp-random.ext agar unik
- Saat ganti file atau hapus materi, hapus juga objek storage lamanya

## Pola Discord
- Notifikasi materi baru hanya lewat Server Action notifyNewMaterial
- URL webhook dibaca dari process.env.DISCORD_WEBHOOK_URL (server-side saja)
- Bot discord.js (Fase 5) boleh memakai service_role key; kode client tidak boleh

## Pola UX
- Setiap proses async wajib ada indikator: Loader2 spin + loading bar + teks tahapan
- File input memakai pola dropzone (input hidden di dalam label), tampilkan nama file + ukuran via formatSize
- Aksi destruktif wajib window.confirm
- Setelah mutasi: router.refresh() di client dan revalidatePath di Server Action

## Pola Konten Belajar
- Jika menambah materi/tips belajar, utamakan konteks eksplisit yang dipilih admin, bukan heuristik subject semata
- Sinkronkan daftar konteks belajar dengan kurikulum S1-TI ketika ada mata kuliah baru atau penamaan baru
- Guide tips harus mengacu ke konteks yang dipilih di admin upload/edit dan tetap punya fallback aman untuk materi lama

## Perintah
- Dev: npm run dev
- Build: npm run build
- Lint: npm run lint