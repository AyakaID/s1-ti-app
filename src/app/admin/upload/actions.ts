"use server";

import { revalidatePath } from "next/cache";

export async function notifyNewMaterial(
  title: string,
  subject: string,
  semester: number
) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn("DISCORD_WEBHOOK_URL belum di-set di environment variables.");
    return;
  }

  const embed = {
    title: "📚 Materi Baru Tersedia!",
    description: `**${title}**\n\nAdmin baru saja mengupload materi baru. Yuk cek di dashboard!`,
    color: 0x5865f2, // Warna Indigo (sama dengan warna UI kita)
    fields: [
      { name: "Mata Kuliah", value: subject, inline: true },
      { name: "Semester", value: `Semester ${semester}`, inline: true },
    ],
    footer: { text: "S1 TI - Platform Belajar" },
    timestamp: new Date().toISOString(),
  };

  const payload = {
    username: "S1 TI Bot",
    embeds: [embed],
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Gagal kirim webhook Discord:", error);
  }

  // Revalidate path agar dashboard otomatis update tanpa perlu refresh manual
  revalidatePath("/dashboard");
}