"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  LogIn,
  LogOut,
  Award,
  Sparkles,
  ShieldCheck,
  Bot,
  FileCheck2,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { AnimeBackground } from "@/components/anime-background";
import { StaggerContainer } from "@/components/stagger-container";
import { AnimeCounter } from "@/components/anime-counter";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  async function loginWithDiscord() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: { redirectTo: window.location.origin },
    });
    if (error) alert("Login gagal: " + error.message);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.refresh();
  }

  const meta = session?.user.user_metadata;
  const displayName =
    meta?.full_name || meta?.name || meta?.user_name || "Mahasiswa";
  const avatarUrl = meta?.avatar_url || meta?.picture;

  return (
    <main className="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Background Interactive Particles using Anime.js */}
      <AnimeBackground />

      {/* Header Navigation */}
      <header className="relative z-10 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between px-6 py-4 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
              <BookOpen size={22} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">
                S1-TI Hub
              </span>
              <span className="ml-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400">
                Platform Belajar
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>
                <button
                  onClick={logout}
                  className="rounded-2xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-400 hover:border-slate-700 hover:text-white transition-all"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithDiscord}
                className="flex items-center gap-2 rounded-2xl bg-[#5865F2] px-5 py-2.5 text-xs font-bold hover:bg-[#4752c4] transition-all shadow-md shadow-[#5865F2]/20"
              >
                <LogIn size={18} />
                <span>Login via Discord</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Hero & Full-Screen Section */}
      <section className="relative z-10 mx-auto flex w-full max-w-[1920px] flex-1 flex-col justify-center px-6 py-12 lg:px-12">
        <StaggerContainer className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Hero Content */}
          <div className="stagger-item flex flex-col items-start gap-6 lg:col-span-7 xl:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold text-indigo-300">
              <Sparkles size={14} className="text-indigo-400" />
              <span>Platform Belajar & Diskusi Mahasiswa S1 Teknik Informatika</span>
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1]">
              Pusat Materi, <br className="hidden sm:block" />
              <span className="text-indigo-400">
                Flashcard & Leaderboard
              </span>
            </h1>

            <p className="max-w-2xl text-base text-slate-300 sm:text-lg leading-relaxed font-medium">
              Yuk kembangkan pemahaman materi kuliah S1-TI kamu, asah konsep lewat Flashcard 3D, kuis Riddle Harian, dan diskusi langsung dengan sesama mahasiswa!
            </p>

            {/* Live Stats Preview powered by Anime.js */}
            <div className="mt-2 grid w-full grid-cols-3 gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-4">
              <div className="flex flex-col items-center justify-center p-2 text-center border-r border-slate-800">
                <div className="text-2xl font-black text-indigo-400 sm:text-3xl">
                  <AnimeCounter value={100} suffix="%" />
                </div>
                <div className="text-xs font-bold text-slate-400 mt-1">Materi Terkurasi</div>
              </div>

              <div className="flex flex-col items-center justify-center p-2 text-center border-r border-slate-800">
                <div className="text-2xl font-black text-amber-400 sm:text-3xl">
                  <AnimeCounter value={10} prefix="+" suffix=" PTS" />
                </div>
                <div className="text-xs font-bold text-slate-400 mt-1">Poin Riddle Harian</div>
              </div>

              <div className="flex flex-col items-center justify-center p-2 text-center">
                <div className="text-2xl font-black text-cyan-400 sm:text-3xl">
                  <AnimeCounter value={4} suffix=" Level" />
                </div>
                <div className="text-xs font-bold text-slate-400 mt-1">Kasta Peringkat</div>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="mt-4 flex flex-wrap items-center gap-4 w-full sm:w-auto">
              {session ? (
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-8 py-4 text-base font-black text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all sm:w-auto"
                >
                  <LayoutDashboard size={20} />
                  <span>Buka Dashboard Kamu</span>
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={loginWithDiscord}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#5865F2] px-8 py-4 text-base font-black text-white shadow-lg shadow-[#5865F2]/25 hover:bg-[#4752c4] transition-all sm:w-auto"
                >
                  <LogIn size={20} />
                  <span>Masuk dengan Akun Discord</span>
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Hero Card / Features Overview */}
          <div className="stagger-item lg:col-span-5 xl:col-span-5">
            {session ? (
              <div className="rounded-3xl border border-indigo-500/30 bg-slate-900 p-8 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="h-16 w-16 rounded-full border-2 border-indigo-500 object-cover shadow-md"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-black text-white">Halo Kembali!</h3>
                    <p className="text-sm font-bold text-indigo-400">{displayName}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-6 font-medium">
                  Sesi kamu aktif. Kamu bisa langsung mengakses materi kuliah, mencoba Flashcard 3D, menjawab Riddle Harian hari ini, dan berdiskusi dengan sesama teman!
                </p>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-xs font-bold text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30"
                >
                  <LayoutDashboard size={18} />
                  <span>Masuk ke Dashboard</span>
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 hover:border-indigo-500/50 transition-all">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 mb-3">
                    <FileCheck2 size={20} />
                  </div>
                  <h4 className="font-extrabold text-white mb-1">Materi & Tips Matkul</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    Daftar materi lengkap dengan tips belajar otomatis dari sumber terpercaya (MIT OCW, CLRS).
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 hover:border-amber-500/50 transition-all">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 mb-3">
                    <Award size={20} />
                  </div>
                  <h4 className="font-extrabold text-white mb-1">Flashcard & Riddle</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    Asah ingatan dengan Flashcard 3D flip dan klaim poin dari Riddle Harian.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 hover:border-cyan-500/50 transition-all">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 mb-3">
                    <GraduationCap size={20} />
                  </div>
                  <h4 className="font-extrabold text-white mb-1">Level Rank System</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    Tingkatkan kasta rank belajar kamu dari Pejuang Smt 1 hingga Master S1-TI.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 hover:border-indigo-500/50 transition-all">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#5865F2]/20 text-[#5865F2] mb-3">
                    <Bot size={20} />
                  </div>
                  <h4 className="font-extrabold text-white mb-1">Bot Discord Sync</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    Cek peringkat & statistik belajar langsung dari Discord via slash command.
                  </p>
                </div>
              </div>
            )}
          </div>
        </StaggerContainer>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto flex w-full max-w-[1920px] flex-col items-center justify-between gap-2 px-6 sm:flex-row lg:px-12">
          <p>© 2026 S1-TI Learning Platform. Dibuat khusus mahasiswa Teknik Informatika.</p>
          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-400" /> Discord Auth Secure
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}