import { EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { getUserProgressByDiscordId, getTopLeaderboard } from "./role-sync";

export const progressCommand = new SlashCommandBuilder()
  .setName("progress")
  .setDescription("Cek level rank dan progres belajar S1-TI kamu di website");

export const rankCommand = new SlashCommandBuilder()
  .setName("rank")
  .setDescription("Tampilkan kartu rank dan pencapaian platform S1-TI");

export const leaderboardCommand = new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("Lihat daftar peringkat terbanyak materi yang diselesaikan di S1-TI");

export async function handleProgressInteraction(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const userId = interaction.user.id;

  try {
    const data = await getUserProgressByDiscordId(userId);

    if (!data) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("Akun Belum Terhubung")
        .setDescription(
          "Akun Discord kamu belum terdaftar di platform S1-TI.\nSilakan login terlebih dahulu di website S1-TI untuk mencatat progres."
        )
        .setColor(0xef4444);

      await interaction.editReply({ embeds: [errorEmbed] });
      return;
    }

    const filledBlocks = Math.round((data.percentage / 100) * 10);
    const emptyBlocks = 10 - filledBlocks;
    const progressBar = "[" + "=".repeat(filledBlocks) + " ".repeat(emptyBlocks) + "]";

    const embed = new EmbedBuilder()
      .setTitle(`Kartu Progres S1-TI: ${data.username}`)
      .setColor(
        data.levelInfo.level === 4
          ? 0xf59e0b
          : data.levelInfo.level === 3
          ? 0xa855f7
          : data.levelInfo.level === 2
          ? 0x06b6d4
          : 0x6366f1
      )
      .addFields(
        { name: "Level Rank Website", value: `**${data.levelInfo.title}** (Level ${data.levelInfo.level})`, inline: true },
        { name: "Total Poin", value: `${data.points} PTS`, inline: true },
        { name: "Materi Selesai", value: `${data.completedCount} / ${data.totalCount} materi`, inline: true },
        { name: "Persentase Progres", value: `\`\`\`${progressBar} ${data.percentage}%\`\`\``, inline: false },
        { name: "Keterangan Level", value: data.levelInfo.description, inline: false }
      )
      .setFooter({ text: "S1-TI Platform Belajar Interaktif" })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan";
    await interaction.editReply({
      content: `Gagal mengambil data progres: ${errorMessage}`,
    });
  }
}

export async function handleLeaderboardInteraction(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const list = await getTopLeaderboard(5);

    const embed = new EmbedBuilder()
      .setTitle("Papan Peringkat S1-TI")
      .setDescription("Pengguna dengan capaian pembelajaran terbanyak di platform S1-TI:")
      .setColor(0x6366f1)
      .setTimestamp();

    if (list.length === 0) {
      embed.addFields({ name: "Info", value: "Belum ada data progres pengguna." });
    } else {
      list.forEach((item, index) => {
        const rankNum = index + 1;
        embed.addFields({
          name: `#${rankNum} - ${item.username}`,
          value: `Level: **${item.levelInfo.title}** | Selesai: ${item.completedCount}/${item.totalCount} (${item.percentage}%) | Poin: ${item.points} PTS`,
          inline: false,
        });
      });
    }

    await interaction.editReply({ embeds: [embed] });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan";
    await interaction.editReply({
      content: `Gagal mengambil papan peringkat: ${errorMessage}`,
    });
  }
}
