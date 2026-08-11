"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { AnimeBackground } from "@/components/anime-background";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center bg-slate-950 px-6 text-white text-center">
      <AnimeBackground />

      <div className="relative z-10 flex max-w-md flex-col items-center gap-6 rounded-3xl border border-slate-800/80 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
          <AlertTriangle size={44} />
        </div>

        <div>
          <span className="text-sm font-black uppercase tracking-widest text-rose-400">System Error</span>
          <h1 className="mt-1 text-2xl font-black text-white">Terjadi Kesalahan</h1>
          <p className="mt-2 text-xs text-slate-400">
            {error.message || "Aplikasi mengalami kendala teknis sementara."}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <button
            onClick={() => reset()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30"
          >
            <RefreshCw size={18} />
            <span>Coba Lagi</span>
          </button>
          <Link
            href="/dashboard"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 py-3 text-sm font-bold text-slate-300 hover:text-white transition-all"
          >
            <Home size={18} />
            <span>Ke Dashboard</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
