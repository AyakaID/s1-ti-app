import Link from "next/link";
import { BookOpen, FolderCog, LayoutDashboard, Trophy } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { OnlinePresence } from "@/components/online-presence";
import { NotificationsPopover } from "@/components/notifications-popover";

interface Props {
  userId: string;
  username: string;
  avatarUrl: string | null;
  isAdmin: boolean;
}

export function DashboardHeader({ userId, username, avatarUrl, isAdmin }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/70 to-transparent" />
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-12 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 transition-all hover:border-indigo-500/50 hover:bg-slate-900"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105">
              <BookOpen size={20} />
            </div>
            <div className="leading-tight">
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                S1-TI Learning
              </div>
              <div className="text-lg font-black tracking-tight text-white">
                Dashboard Utama
              </div>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-bold text-indigo-300 transition-all hover:border-indigo-400/50 hover:bg-indigo-500/20"
            >
              <LayoutDashboard size={14} />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300 transition-all hover:border-amber-400/50 hover:bg-amber-500/20"
            >
              <Trophy size={14} />
              <span>Leaderboard</span>
            </Link>
            {isAdmin && (
              <Link
                href="/admin/manage"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-300 transition-all hover:border-indigo-500/40 hover:text-white"
              >
                <FolderCog size={14} />
                <span>Kelola</span>
              </Link>
            )}
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          <OnlinePresence
            me={{ user_id: userId, username, avatar_url: avatarUrl }}
          />

          <NotificationsPopover />

          <div className="hidden items-center gap-2.5 rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-slate-300 md:flex">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={username}
                className="h-6 w-6 rounded-full object-cover border border-indigo-500/40"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
            <span>{username}</span>
          </div>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}