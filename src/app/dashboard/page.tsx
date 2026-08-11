import { redirect } from "next/navigation";
import { BookOpen, Layers3 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard-header";
import { LevelBadge } from "@/components/level-badge";
import { DailyRiddleCard } from "@/components/daily-riddle-card";
import { FlashcardSection } from "@/components/flashcard-section";
import { MaterialsBrowser } from "@/components/materials-browser";
import { calculateLevel } from "@/lib/level-system";
import { AnimeBackground } from "@/components/anime-background";
import { AnimeCounter } from "@/components/anime-counter";
import { StaggerContainer } from "@/components/stagger-container";
import type { Material, Riddle, UserRiddleAttempt } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: materials } = await supabase
    .from("materials")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: progress } = await supabase
    .from("user_progress")
    .select("material_id")
    .eq("user_id", user.id);

  // Daily Riddle Data Fetching
  const todayStr = new Date().toISOString().split("T")[0];

  const { data: riddles } = await supabase
    .from("riddles")
    .select("*")
    .order("created_at", { ascending: true });

  const riddleList = (riddles ?? []) as Riddle[];

  let todayRiddle: Riddle | null = null;
  if (riddleList.length > 0) {
    const dateNum = Math.floor(new Date().getTime() / 86400000);
    todayRiddle = riddleList[dateNum % riddleList.length];
  }

  let todayAttempt: UserRiddleAttempt | null = null;
  if (todayRiddle) {
    const { data: attemptData } = await supabase
      .from("user_riddle_attempts")
      .select("*")
      .eq("user_id", user.id)
      .eq("attempted_date", todayStr)
      .maybeSingle();

    todayAttempt = attemptData as UserRiddleAttempt | null;
  }

  const completedIds = new Set((progress ?? []).map((p) => p.material_id));
  const list = (materials ?? []) as Material[];
  const doneCount = list.filter((m) => completedIds.has(m.id)).length;
  const pendingCount = Math.max(list.length - doneCount, 0);
  const completionRate = list.length > 0 ? Math.round((doneCount / list.length) * 100) : 0;

  const levelState = calculateLevel(doneCount, list.length);
  const totalPoints = profile?.points ?? (doneCount * 10);

  return (
    <main className="relative min-h-screen w-full bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Anime.js Background Canvas */}
      <AnimeBackground />

      <DashboardHeader
        userId={user.id}
        username={profile?.username ?? "Mahasiswa"}
        avatarUrl={profile?.avatar_url ?? null}
        isAdmin={Boolean(profile?.is_admin)}
      />

      <section className="relative z-10 mx-auto w-full max-w-[1920px] px-6 py-8 lg:px-12 space-y-8">
        <StaggerContainer className="space-y-8">
          <div className="stagger-item overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-xl md:p-8">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/70 to-transparent" />
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  <Layers3 size={12} />
                  Dashboard belajar
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">
                    Halo, {profile?.username || "Teman S1-TI"}!
                  </h1>
                  <LevelBadge levelInfo={levelState.currentLevel} size="md" />
                </div>

                <p className="max-w-xl text-sm leading-6 text-slate-300">
                  Dashboard ini dibuat lebih sederhana supaya kamu langsung lihat progres, lanjutkan materi, dan masuk ke belajar tanpa distraksi.
                </p>

                <div className="flex flex-wrap gap-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Total Poin</div>
                    <div className="mt-1 text-xl font-black text-amber-400">
                      <AnimeCounter value={totalPoints} suffix=" PTS" />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Materi Selesai</div>
                    <div className="mt-1 text-xl font-black text-indigo-400">
                      <AnimeCounter value={doneCount} suffix={` / ${list.length}`} />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Progress</div>
                    <div className="mt-1 text-xl font-black text-cyan-400">
                      <AnimeCounter value={completionRate} suffix="%" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-200">Progress Belajar</span>
                  <span className="text-xs font-semibold text-indigo-300">
                    {levelState.nextLevel
                      ? `${levelState.materialsNeededForNext} materi lagi menuju level ${levelState.nextLevel.title}`
                      : "Level Maksimal Berhasil Dituntaskan!"}
                  </span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-900 p-0.5 border border-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-700 shadow-md"
                    style={{ width: `${levelState.percentage}%` }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>{pendingCount} materi tersisa</span>
                  <span>{levelState.percentage}% selesai</span>
                </div>
              </div>
            </div>
          </div>

          {/* Riddle Harian Section */}
          <div className="stagger-item">
            {todayRiddle ? (
              <DailyRiddleCard riddle={todayRiddle} attempt={todayAttempt} />
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-400">
                Belum ada riddle harian tersedia untuk hari ini.
              </div>
            )}
          </div>

          {/* Interactive Flashcard Section */}
          <div className="stagger-item">
            <FlashcardSection />
          </div>

          {/* Daftar Materi Kuliah Section */}
          <div className="stagger-item space-y-4 rounded-[2rem] border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1">
                <h2 className="flex items-center gap-3 text-xl font-black tracking-tight text-white">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
                    <BookOpen size={18} />
                  </div>
                  Daftar Materi Kuliah S1-TI
                </h2>
                <p className="text-sm text-slate-400">
                  Akses materi, tandai selesai, dan lanjutkan progres belajar tanpa pindah konteks.
                </p>
              </div>
            </div>

            <MaterialsBrowser
              materials={list}
              userId={user.id}
              completedIds={Array.from(completedIds)}
            />
          </div>
        </StaggerContainer>
      </section>
    </main>
  );
}