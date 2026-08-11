"use client";

import { useMemo, useState } from "react";
import { Search, Filter, BookOpen, RotateCcw, Layers3 } from "lucide-react";
import { MaterialCard } from "@/components/material-card";
import { StaggerContainer } from "@/components/stagger-container";
import type { Material } from "@/lib/types";

interface Props {
  materials: Material[];
  userId: string;
  completedIds: string[];
}

function chip(active: boolean) {
  return `rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all ${
    active
      ? "border-indigo-500 bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
      : "border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-white"
  }`;
}

export function MaterialsBrowser({ materials, userId, completedIds }: Props) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<string | null>(null);
  const [semester, setSemester] = useState<number | null>(null);

  const subjects = useMemo(
    () => Array.from(new Set(materials.map((m) => m.subject))),
    [materials]
  );

  const semesters = useMemo(
    () => Array.from(new Set(materials.map((m) => m.semester))).sort((a, b) => a - b),
    [materials]
  );

  const completedSet = new Set(completedIds);

  const filtered = materials.filter((m) => {
    const q = query.toLowerCase();
    const matchQ =
      !q || m.title.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q);
    const matchS = !subject || m.subject === subject;
    const matchSem = !semester || m.semester === semester;
    return matchQ && matchS && matchSem;
  });

  const activeFiltersCount = [query, subject, semester].filter(Boolean).length;
  const activeSubjectLabel = subject ?? "Semua mata kuliah";
  const activeSemesterLabel = semester ? `Semester ${semester}` : "Semua semester";

  return (
    <div className="w-full space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
              <Layers3 size={12} />
              Browser Materi
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Cari, saring, dan lanjutkan materi</h3>
              <p className="text-sm leading-6 text-slate-400">
                Gunakan pencarian cepat dan filter semester atau mata kuliah untuk menemukan materi yang ingin kamu lanjutkan.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300">
            <span className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1">
              {filtered.length} materi tampil
            </span>
            <span className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1">
              {materials.length} total materi
            </span>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSubject(null);
                  setSemester(null);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-indigo-300 transition-all hover:border-indigo-400/50 hover:bg-indigo-500/20"
              >
                <RotateCcw size={12} />
                Reset filter
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] xl:items-start">
          <div className="relative w-full">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari judul materi atau mata kuliah..."
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Kata kunci</div>
              <div className="mt-1 text-sm font-semibold text-white">{query || "Semua"}</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Mata kuliah</div>
              <div className="mt-1 text-sm font-semibold text-white">{activeSubjectLabel}</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Semester</div>
              <div className="mt-1 text-sm font-semibold text-white">{activeSemesterLabel}</div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Filter size={14} className="text-indigo-400" /> Filter cepat:
          </div>

          <button
            type="button"
            onClick={() => {
              setSubject(null);
              setSemester(null);
            }}
            className={chip(!subject && !semester)}
          >
            Semua
          </button>

          {semesters.map((sem) => (
            <button
              type="button"
              key={`sem-${sem}`}
              onClick={() => setSemester(semester === sem ? null : sem)}
              className={chip(semester === sem)}
            >
              Smt {sem}
            </button>
          ))}

          {subjects.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setSubject(subject === s ? null : s)}
              className={chip(subject === s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Container */}
      {filtered.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center text-slate-500">
          <BookOpen size={40} className="mx-auto mb-3 text-slate-600" />
          <p className="text-base font-semibold text-slate-300">Tidak ada materi yang sesuai filter.</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Coba hapus satu filter, ganti semester, atau reset pencarian untuk menemukan materi lain.
          </p>
        </div>
      ) : (
        <StaggerContainer
          key={`${query}-${subject}-${semester}`}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
        >
          {filtered.map((m) => (
            <div key={m.id} className="stagger-item">
              <MaterialCard
                material={m}
                userId={userId}
                completed={completedSet.has(m.id)}
              />
            </div>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}