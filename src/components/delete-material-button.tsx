"use client";

import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  materialId: string;
  fileUrl: string;
}

export function DeleteMaterialButton({ materialId, fileUrl }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Hapus materi ini? Progres user terkait juga akan terhapus.")) return;
    setBusy(true);

    if (fileUrl.includes("/materials/")) {
      const path = decodeURIComponent(fileUrl.split("/materials/")[1] ?? "");
      if (path) await supabase.storage.from("materials").remove([path]);
    }

    const { error } = await supabase.from("materials").delete().eq("id", materialId);
    if (error) window.alert(error.message);

    setBusy(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      title="Hapus"
      className="rounded-lg bg-slate-800 p-2 text-red-400 hover:bg-red-950 disabled:opacity-50"
    >
      {busy ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}