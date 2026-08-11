"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  FileText,
  Video,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getStudyContextLabel } from "@/lib/study-contexts";
import type { Material } from "@/lib/types";

interface Props {
  material: Material;
  userId: string;
  completed: boolean;
}

export function MaterialCard({ material, userId, completed }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const isVideo =
    material.file_type === "video" ||
    material.file_url.includes("youtube") ||
    material.file_url.includes("drive.google");

  async function toggleProgress() {
    if (completed) {
      await supabase
        .from("user_progress")
        .delete()
        .eq("user_id", userId)
        .eq("material_id", material.id);
    } else {
      await supabase
        .from("user_progress")
        .insert({ user_id: userId, material_id: material.id });
    }
    router.refresh();
  }

  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-800 bg-slate-900 p-5 transition-all hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-[0_18px_50px_rgba(15,23,42,0.45)]">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-indigo-300">
            {isVideo ? <Video size={18} /> : <FileText size={18} />}
            <span className="text-xs font-semibold uppercase tracking-wide">
              {material.subject} - Smt {material.semester}
            </span>
          </div>
          {getStudyContextLabel(material.study_context) && (
            <span className="inline-flex rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              {getStudyContextLabel(material.study_context)}
            </span>
          )}
        </div>
        <button
          onClick={toggleProgress}
          title={completed ? "Batalkan selesai" : "Tandai selesai"}
          className="shrink-0 rounded-full p-1 transition-transform hover:scale-105"
        >
          {completed ? (
            <CheckCircle2 size={20} className="text-emerald-500" />
          ) : (
            <Circle size={20} className="text-slate-600 hover:text-slate-400" />
          )}
        </button>
      </div>

      <h3 className="mt-3 text-base font-semibold leading-snug text-white">{material.title}</h3>
      {material.description && (
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
          {material.description}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-800 pt-4">
        <Link
          href={`/materi/${material.id}`}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-3.5 py-2 text-sm font-semibold text-indigo-300 transition-all hover:bg-slate-700 hover:text-indigo-200"
        >
          <ExternalLink size={16} />
          Buka Materi
        </Link>
        <span className="text-xs text-slate-500">
          {formatDistanceToNow(new Date(material.created_at), {
            addSuffix: true,
            locale: id,
          })}
        </span>
      </div>
    </div>
  );
}