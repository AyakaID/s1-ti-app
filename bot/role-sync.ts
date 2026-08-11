import { createClient } from "@supabase/supabase-js";
import { calculateLevel, type LevelInfo } from "../src/lib/level-system";

export function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined");
  }

  return createClient(url, serviceRoleKey);
}

export interface UserProgressResult {
  username: string;
  discordId: string | null;
  completedCount: number;
  totalCount: number;
  percentage: number;
  points: number;
  levelInfo: LevelInfo;
}

export async function getUserProgressByDiscordId(discordId: string): Promise<UserProgressResult | null> {
  const supabase = getSupabaseAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("discord_id", discordId)
    .maybeSingle();

  if (!profile) {
    return null;
  }

  const { data: materials } = await supabase.from("materials").select("id");
  const totalCount = materials?.length ?? 0;

  const { data: progress } = await supabase
    .from("user_progress")
    .select("material_id")
    .eq("user_id", profile.id);

  const completedCount = progress?.length ?? 0;
  const { percentage, currentLevel } = calculateLevel(completedCount, totalCount);

  return {
    username: profile.username || "Mahasiswa",
    discordId: profile.discord_id,
    completedCount,
    totalCount,
    percentage,
    points: profile.points ?? (completedCount * 10),
    levelInfo: currentLevel,
  };
}

export async function getTopLeaderboard(limit = 5): Promise<UserProgressResult[]> {
  const supabase = getSupabaseAdminClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .limit(limit);

  if (!profiles || profiles.length === 0) return [];

  const { data: materials } = await supabase.from("materials").select("id");
  const totalCount = materials?.length ?? 0;

  const results: UserProgressResult[] = [];

  for (const profile of profiles) {
    const { data: progress } = await supabase
      .from("user_progress")
      .select("material_id")
      .eq("user_id", profile.id);

    const completedCount = progress?.length ?? 0;
    const { percentage, currentLevel } = calculateLevel(completedCount, totalCount);

    results.push({
      username: profile.username || "Mahasiswa",
      discordId: profile.discord_id,
      completedCount,
      totalCount,
      percentage,
      points: profile.points ?? (completedCount * 10),
      levelInfo: currentLevel,
    });
  }

  return results.sort((a, b) => b.completedCount - a.completedCount || b.points - a.points);
}
