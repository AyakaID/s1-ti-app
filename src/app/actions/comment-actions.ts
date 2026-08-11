"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addCommentAction(materialId: string, content: string) {
  if (!content || !content.trim()) {
    return { success: false, error: "Isi komentar tidak boleh kosong!" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Kamu harus login terlebih dahulu." };
  }

  try {
    const { error } = await supabase.from("material_comments").insert({
      material_id: materialId,
      user_id: user.id,
      content: content.trim(),
    });

    if (error) {
      console.error("Comment insert error:", error);
      return { success: false, error: "Gagal menyimpan komentar: " + error.message };
    }

    revalidatePath(`/materi/${materialId}`);
    return { success: true };
  } catch {
    return { success: false, error: "Terjadi kendala server." };
  }
}

export async function deleteCommentAction(commentId: string, materialId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Kamu harus login terlebih dahulu." };
  }

  try {
    const { error } = await supabase
      .from("material_comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      return { success: false, error: "Gagal menghapus komentar." };
    }

    revalidatePath(`/materi/${materialId}`);
    return { success: true };
  } catch {
    return { success: false, error: "Terjadi kesalahan." };
  }
}
