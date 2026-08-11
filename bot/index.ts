import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import {
  progressCommand,
  rankCommand,
  leaderboardCommand,
  handleProgressInteraction,
  handleLeaderboardInteraction,
} from "./commands";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token || !clientId) {
  console.log("=================================================");
  console.log("[S1-TI Bot] Peringatan: DISCORD_BOT_TOKEN dan DISCORD_CLIENT_ID belum diatur.");
  console.log("[S1-TI Bot] Silakan atur di file .env.local untuk menjalankan bot ini.");
  console.log("=================================================");
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.once("ready", async () => {
  console.log(`[S1-TI Bot] Bot terhubung sebagai: ${client.user?.tag}`);

  if (token && clientId) {
    const rest = new REST({ version: "10" }).setToken(token);
    const commands = [
      progressCommand.toJSON(),
      rankCommand.toJSON(),
      leaderboardCommand.toJSON(),
    ];

    try {
      if (guildId) {
        console.log(`[S1-TI Bot] Mengirim command ke Guild ID: ${guildId}`);
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
          body: commands,
        });
      } else {
        console.log("[S1-TI Bot] Mengirim command secara global...");
        await rest.put(Routes.applicationCommands(clientId), {
          body: commands,
        });
      }
      console.log("[S1-TI Bot] Registrasi Slash Command berhasil!");
    } catch (err) {
      console.error("[S1-TI Bot] Gagal mendaftarkan slash command:", err);
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (
    interaction.commandName === "progress" ||
    interaction.commandName === "rank"
  ) {
    await handleProgressInteraction(interaction);
  } else if (interaction.commandName === "leaderboard") {
    await handleLeaderboardInteraction(interaction);
  }
});

if (token) {
  client.login(token).catch((err) => {
    console.error("[S1-TI Bot] Login gagal:", err.message);
  });
}
