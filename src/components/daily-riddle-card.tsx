"use client";

import { useState } from "react";
import { HelpCircle, CheckCircle2, XCircle, Award, Loader2, Sparkles } from "lucide-react";
import { submitDailyRiddleAction } from "@/app/actions/riddle-actions";
import type { Riddle, UserRiddleAttempt } from "@/lib/types";

interface Props {
  riddle: Riddle;
  attempt: UserRiddleAttempt | null;
}

export function DailyRiddleCard({ riddle, attempt: initialAttempt }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    initialAttempt ? initialAttempt.selected_index : null
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    submitted: boolean;
    isCorrect: boolean;
    explanation: string;
    pointsAwarded: number;
  } | null>(
    initialAttempt
      ? {
          submitted: true,
          isCorrect: initialAttempt.is_correct,
          explanation: riddle.explanation,
          pointsAwarded: initialAttempt.points_awarded,
        }
      : null
  );

  async function handleSubmit() {
    if (selectedIndex === null || loading || result?.submitted) return;

    setLoading(true);
    try {
      const res = await submitDailyRiddleAction(riddle.id, selectedIndex);
      if (res.success) {
        setResult({
          submitted: true,
          isCorrect: !!res.isCorrect,
          explanation: res.explanation || riddle.explanation,
          pointsAwarded: res.pointsAwarded || 0,
        });
      } else {
        alert(res.error || "Gagal mengirim jawaban.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  }

  const isCompleted = result?.submitted || !!initialAttempt;

  return (
    <div className="rounded-3xl border border-indigo-500/30 bg-slate-900 p-6 md:p-8 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600/20 border border-indigo-500/30 px-3.5 py-1 text-xs font-bold text-indigo-300">
            <HelpCircle size={14} />
            Riddle Harian
          </span>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
            {riddle.category}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full">
          <Award size={14} />
          <span>+10 PTS Poin</span>
        </div>
      </div>

      {/* Pertanyaan */}
      <h3 className="text-lg md:text-xl font-black text-white mb-6 leading-relaxed">
        {riddle.question}
      </h3>

      {/* Pilihan Jawaban */}
      <div className="grid gap-3 mb-6">
        {riddle.options.map((option, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isSelected = selectedIndex === idx;
          const isCorrectAnswer = idx === riddle.correct_answer_index;

          let optionStyle = "border-slate-800 bg-slate-950 text-slate-300 hover:border-indigo-500/50 hover:bg-slate-800/50";

          if (isCompleted) {
            if (isCorrectAnswer) {
              optionStyle = "border-emerald-500 bg-emerald-950/60 text-emerald-300 font-bold";
            } else if (isSelected && !result?.isCorrect) {
              optionStyle = "border-rose-500 bg-rose-950/60 text-rose-300 font-bold";
            } else {
              optionStyle = "border-slate-800 bg-slate-950/40 text-slate-500 opacity-60";
            }
          } else if (isSelected) {
            optionStyle = "border-indigo-500 bg-indigo-600/20 text-indigo-200 font-bold shadow-sm";
          }

          return (
            <button
              key={idx}
              disabled={isCompleted || loading}
              onClick={() => setSelectedIndex(idx)}
              className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${optionStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-bold ${
                  isSelected ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                }`}>
                  {letter}
                </span>
                <span className="text-sm md:text-base font-medium">{option}</span>
              </div>

              {isCompleted && isCorrectAnswer && (
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              )}
              {isCompleted && isSelected && !result?.isCorrect && (
                <XCircle size={18} className="text-rose-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tombol Submisi atau Penjelasan Result */}
      {!isCompleted ? (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={selectedIndex === null || loading}
            className={`flex items-center gap-2 rounded-2xl px-6 py-3 font-bold text-xs transition-all ${
              selectedIndex !== null && !loading
                ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Memeriksa Jawaban...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Kirim Jawaban Pilihanmu</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className={`mt-4 rounded-2xl border p-4 md:p-5 ${
          result?.isCorrect
            ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-200"
            : "border-rose-500/40 bg-rose-950/40 text-rose-200"
        }`}>
          <div className="flex items-center gap-2 font-black mb-2 text-base">
            {result?.isCorrect ? (
              <>
                <CheckCircle2 size={20} className="text-emerald-400" />
                <span className="text-emerald-400">Mantap! Jawabanmu Benar (+10 PTS) 🎉</span>
              </>
            ) : (
              <>
                <XCircle size={20} className="text-rose-400" />
                <span className="text-rose-400">Waduh, Jawabannya Belum Tepat Nih 😅</span>
              </>
            )}
          </div>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium pl-7">
            <span className="font-bold text-white">Penjelasan: </span>
            {result?.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
