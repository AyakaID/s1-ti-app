export interface LevelInfo {
  level: number;
  title: string;
  minPercentage: number;
  maxPercentage: number;
  iconName: "Shield" | "Zap" | "GraduationCap" | "Crown";
  colorClass: string;
  badgeStyle: string;
  description: string;
}

export const LEVELS: LevelInfo[] = [
  {
    level: 1,
    title: "Pemula S1-TI",
    minPercentage: 0,
    maxPercentage: 24,
    iconName: "Shield",
    colorClass: "text-slate-400",
    badgeStyle: "bg-slate-800/80 text-slate-300 border-slate-700",
    description: "Awal perjalanan menembus rintangan dunia S1-TI",
  },
  {
    level: 2,
    title: "Mahasiswa Rajin",
    minPercentage: 25,
    maxPercentage: 49,
    iconName: "Zap",
    colorClass: "text-cyan-400",
    badgeStyle: "bg-cyan-950/60 text-cyan-300 border-cyan-800/80",
    description: "Konsisten menyelesaikan materi dan tugas perkuliahan",
  },
  {
    level: 3,
    title: "Kandidat Cumlaude",
    minPercentage: 50,
    maxPercentage: 74,
    iconName: "GraduationCap",
    colorClass: "text-purple-400",
    badgeStyle: "bg-purple-950/60 text-purple-300 border-purple-800/80",
    description: "Menguasai lebih dari separuh kurikulum S1-TI",
  },
  {
    level: 4,
    title: "Master S1-TI",
    minPercentage: 75,
    maxPercentage: 100,
    iconName: "Crown",
    colorClass: "text-amber-400",
    badgeStyle: "bg-amber-950/60 text-amber-300 border-amber-800/80",
    description: "Puncak prestasi pencapaian pembelajaran S1-TI",
  },
];

export function calculateLevel(completedCount: number, totalCount: number): {
  percentage: number;
  currentLevel: LevelInfo;
  nextLevel: LevelInfo | null;
  materialsNeededForNext: number;
} {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  let currentLevel = LEVELS[0];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (percentage >= LEVELS[i].minPercentage) {
      currentLevel = LEVELS[i];
      break;
    }
  }

  const nextLevelIndex = LEVELS.findIndex((l) => l.level === currentLevel.level) + 1;
  const nextLevel = nextLevelIndex < LEVELS.length ? LEVELS[nextLevelIndex] : null;

  let materialsNeededForNext = 0;
  if (nextLevel && totalCount > 0) {
    const requiredCompleted = Math.ceil((nextLevel.minPercentage / 100) * totalCount);
    materialsNeededForNext = Math.max(0, requiredCompleted - completedCount);
  }

  return {
    percentage,
    currentLevel,
    nextLevel,
    materialsNeededForNext,
  };
}
