"use client";

import { useState } from "react";
import { Bell, BookOpen, HelpCircle, Check } from "lucide-react";
import Link from "next/link";
import type { AppNotification } from "@/lib/types";

// Default fallback notifications if database table is empty or loading
const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "Materi Baru Rilis!",
    message: "Algoritma & Pemrograman dasar telah diperbarui. Cek materi sekarang!",
    type: "material",
    link: "/dashboard",
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "notif-2",
    title: "Riddle Harian Siap!",
    message: "Kuis kilat hari ini sudah bisa kamu jawab untuk dapat +10 PTS.",
    type: "riddle",
    link: "/dashboard",
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

export function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white transition-all"
        title="Notifikasi"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-md">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 z-50 w-80 sm:w-96 rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-indigo-400" />
                <span className="font-extrabold text-white text-sm">Notifikasi Platform</span>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300"
                >
                  <Check size={12} />
                  Tandai Dibaca
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link || "/dashboard"}
                  onClick={() => {
                    setNotifications((prev) =>
                      prev.map((item) =>
                        item.id === n.id ? { ...item, is_read: true } : item
                      )
                    );
                    setOpen(false);
                  }}
                  className={`flex items-start gap-3 rounded-2xl border p-3 transition-all ${
                    n.is_read
                      ? "border-slate-800/40 bg-slate-950/40 text-slate-400"
                      : "border-indigo-500/30 bg-indigo-600/10 text-white font-medium"
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-indigo-400 mt-0.5">
                    {n.type === "riddle" ? (
                      <HelpCircle size={16} className="text-amber-400" />
                    ) : (
                      <BookOpen size={16} className="text-indigo-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white leading-snug">{n.title}</p>
                    <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                      {n.message}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
