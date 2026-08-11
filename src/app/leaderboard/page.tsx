import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Crown, Medal, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getTier } from "@/lib/tiers";
import { AnimeBackground } from "@/components/anime-background";
import { AnimeCounter } from "@/components/anime-counter";
import { StaggerContainer } from "@/components/stagger-container";

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("points", { ascending: false });

  const { data: progress } = await supabase
    .from("user_progress")
    .select("user_id");

  const countByUser = new Map<string, number>();
  for (const p of progress ?? []) {
    countByUser.set(p.user_id, (countByUser.get(p.user_id) ?? 0) + 1);
  }

  const rows = (profiles ?? []).map((pr, i) => ({
    ...pr,
    rank: i + 1,
    completed: countByUser.get(pr.id) ?? 0,
  }));

  const top3 = rows.slice(0, 3);

  // Reorder top3 for podium visual display (2nd, 1st, 3rd) if at least 3 exist
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

  return (
    <main className="relative min-h-screen w-full bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Anime.js Background Canvas */}
      <AnimeBackground />

      <section className="relative z-10 mx-auto w-full max-w-[1920px] px-6 py-8 lg:px-12 space-y-8">
        <StaggerContainer className="space-y-8">
          {/* Header Navigation */}
          <div className="stagger-item flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-300 hover:border-slate-700 hover:text-white transition-all"
            >
              <ArrowLeft size={16} />
              Kembali ke Dashboard
            </Link>

            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 rounded-full">
              <Trophy size={14} />
              Papan Peringkat S1-TI
            </div>
          </div>

          {/* Title Banner (Solid Colors) */}
          <div className="stagger-item rounded-3xl border border-slate-800 bg-slate-900 p-6 lg:p-8 shadow-xl text-center space-y-2">
            <Trophy className="mx-auto text-amber-400" size={44} />
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Papan Peringkat Mahasiswa S1-TI 🏆
            </h1>
            <p className="text-sm font-medium text-slate-300 max-w-xl mx-auto">
              Kumpulkan poin dari materi kuliah dan Riddle Harian untuk menjadi Juara Puncak!
            </p>
          </div>

          {/* Top 3 Podium Showcase (Solid Colors) */}
          {podiumOrder.length > 0 && (
            <div className="stagger-item grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto items-end">
              {podiumOrder.map((r) => {
                const isFirst = r.rank === 1;
                const isSecond = r.rank === 2;

                return (
                  <div
                    key={r.id}
                    className={`rounded-3xl border p-6 text-center transition-all relative overflow-hidden ${
                      isFirst
                        ? "border-amber-500 bg-slate-900 shadow-2xl lg:-translate-y-4"
                        : isSecond
                        ? "border-slate-700 bg-slate-900 shadow-xl"
                        : "border-slate-800 bg-slate-900 shadow-xl"
                    }`}
                  >
                    {isFirst && (
                      <div className="absolute top-0 right-0 left-0 bg-amber-500 py-1 text-[10px] font-black uppercase text-slate-950 tracking-widest">
                        Juara Puncak
                      </div>
                    )}

                    <div className="mt-2 flex justify-center">
                      {isFirst ? (
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 shadow-lg">
                          <Crown size={36} />
                        </div>
                      ) : (
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                            isSecond
                              ? "bg-slate-800 text-slate-200 border-slate-700"
                              : "bg-slate-800 text-amber-600 border-slate-700"
                          }`}
                        >
                          <Medal size={28} />
                        </div>
                      )}
                    </div>

                    <p className="mt-4 font-black text-lg text-white truncate">
                      {r.username || "Mahasiswa S1-TI"}
                    </p>

                    <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-0.5 text-xs font-bold text-slate-300">
                      {getTier(r.completed).name}
                    </div>

                    <div className="mt-4 text-3xl font-black text-amber-400">
                      <AnimeCounter value={r.points} suffix=" PTS" />
                    </div>

                    <p className="mt-1 text-xs text-slate-400 font-semibold">
                      {r.completed} materi diselesaikan
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full List Rankings */}
          <div className="stagger-item space-y-3 max-w-5xl mx-auto">
            <h3 className="text-lg font-black text-white mb-2">Semua Peringkat Active</h3>

            {rows.map((r) => (
              <div
                key={r.id}
                className={`flex items-center justify-between rounded-2xl border px-6 py-4 transition-all ${
                  r.id === user.id
                    ? "border-indigo-500 bg-indigo-600/20 shadow-md"
                    : "border-slate-800 bg-slate-900 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-black text-sm ${
                      r.rank === 1
                        ? "bg-amber-500 text-slate-950"
                        : r.rank === 2
                        ? "bg-slate-300 text-slate-950"
                        : r.rank === 3
                        ? "bg-amber-700 text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    #{r.rank}
                  </span>

                  <div className="min-w-0">
                    <p className="font-extrabold text-white text-sm sm:text-base truncate flex items-center gap-2">
                      <span>{r.username || "Mahasiswa S1-TI"}</span>
                      {r.id === user.id && (
                        <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          Kamu
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">{getTier(r.completed).name}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-black text-amber-400 text-base">
                    {r.points} PTS
                  </p>
                  <p className="text-xs text-slate-400 font-medium">{r.completed} materi</p>
                </div>
              </div>
            ))}
          </div>
        </StaggerContainer>
      </section>
    </main>
  );
}