"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitDailyRiddleAction(riddleId: string, selectedIndex: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Kamu harus login terlebih dahulu." };
  }

  const todayStr = new Date().toISOString().split("T")[0];

  // 1. Cek apakah user sudah pernah menjawab hari ini
  const { data: existingAttempt } = await supabase
    .from("user_riddle_attempts")
    .select("*")
    .eq("user_id", user.id)
    .eq("attempted_date", todayStr)
    .maybeSingle();

  if (existingAttempt) {
    return {
      success: false,
      error: "Kamu sudah menjawab Riddle Harian untuk hari ini!",
      attempt: existingAttempt,
    };
  }

  // 2. Ambil soal riddle dari DB
  const { data: riddle, error: riddleError } = await supabase
    .from("riddles")
    .select("*")
    .eq("id", riddleId)
    .single();

  if (riddleError || !riddle) {
    return { success: false, error: "Soal riddle tidak ditemukan." };
  }

  const isCorrect = selectedIndex === riddle.correct_answer_index;
  const pointsAwarded = isCorrect ? 10 : 0;

  // 3. Simpan attempt ke user_riddle_attempts
  const { error: insertError } = await supabase
    .from("user_riddle_attempts")
    .insert({
      user_id: user.id,
      riddle_id: riddleId,
      attempted_date: todayStr,
      selected_index: selectedIndex,
      is_correct: isCorrect,
      points_awarded: pointsAwarded,
    });

  if (insertError) {
    return { success: false, error: "Gagal menyimpan jawaban: " + insertError.message };
  }

  // 4. Jika benar, tambahkan +10 poin ke profiles
  if (isCorrect) {
    const { error: rpcError } = await supabase.rpc("increment_user_points", {
      user_id_param: user.id,
      amount_param: 10,
    });

    if (rpcError) {
      // Fallback jika stored procedure belum di-apply
      const { data: prof } = await supabase
        .from("profiles")
        .select("points")
        .eq("id", user.id)
        .single();
      
      await supabase
        .from("profiles")
        .update({ points: (prof?.points ?? 0) + 10 })
        .eq("id", user.id);
    }
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    isCorrect,
    correctIndex: riddle.correct_answer_index,
    explanation: riddle.explanation,
    pointsAwarded,
  };
}
