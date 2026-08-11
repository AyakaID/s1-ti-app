export interface Tier {
  name: string;
  min: number;
  className: string;
}

export const ROLE_TIERS: Tier[] = [
  {
    name: "Master Materi",
    min: 10,
    className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  {
    name: "Rajin Belajar",
    min: 5,
    className: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  },
  {
    name: "Pejuang Belajar",
    min: 1,
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  {
    name: "Mahasiswa Baru",
    min: 0,
    className: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  },
];

export function getTier(completed: number): Tier {
  return (
    ROLE_TIERS.find((t) => completed >= t.min) ??
    ROLE_TIERS[ROLE_TIERS.length - 1]
  );
}

export function getNextTier(completed: number): Tier | null {
  const ascending = [...ROLE_TIERS].sort((a, b) => a.min - b.min);
  return ascending.find((t) => t.min > completed) ?? null;
}