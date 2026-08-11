"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  materialId: string;
  userId: string;
  completed: boolean;
}

export function MarkCompleteButton({ materialId, userId, completed }: Props) {
  const router = useRouter();
  const supabase = createClient();

  async function toggle() {
    if (completed) {
      await supabase
        .from("user_progress")
        .delete()
        .eq("user_id", userId)
        .eq("material_id", materialId);
    } else {
      await supabase
        .from("user_progress")
        .insert({ user_id: userId, material_id: materialId });
    }
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
        completed
          ? "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
      }`}
    >
      {completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
      {completed ? "Selesai" : "Tandai Selesai"}
    </button>
  );
}