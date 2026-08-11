import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";
import { AnimeBackground } from "@/components/anime-background";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center bg-slate-950 px-6 text-white text-center">
      <AnimeBackground />

      <div className="relative z-10 flex max-w-md flex-col items-center gap-6 rounded-3xl border border-slate-800/80 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
          <FileQuestion size={44} />
        </div>

        <div>
          <span className="text-sm font-black uppercase tracking-widest text-indigo-400">404 Error</span>
          <h1 className="mt-1 text-3xl font-black text-white">Halaman Tidak Ditemukan</h1>
          <p className="mt-2 text-sm text-slate-400">
            Halaman atau materi yang kamu cari tidak ada atau telah dipindahkan.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30"
        >
          <Home size={18} />
          <span>Kembali ke Dashboard</span>
        </Link>
      </div>
    </main>
  );
}
