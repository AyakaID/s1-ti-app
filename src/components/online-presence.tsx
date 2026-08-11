"use client";

import { useEffect, useState } from "react";
import { Users, X, Circle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PresenceUser {
  user_id: string;
  username: string;
  avatar_url: string | null;
}

export function OnlinePresence({ me }: { me: PresenceUser }) {
  const supabase = createClient();
  const [online, setOnline] = useState<PresenceUser[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const channel = supabase.channel("dashboard-presence", {
      config: { presence: { key: me.user_id } },
    });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const users = Object.values(state).flatMap((arr) =>
        (arr as unknown as PresenceUser[]).map((p) => p)
      );
      setOnline(users);
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track(me);
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me.user_id]);

  const displayList = online.length > 0 ? online : [me];

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2.5 rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition-all cursor-pointer"
        title="Lihat Mahasiswa Online"
      >
        <div className="flex -space-x-2">
          {displayList.slice(0, 4).map((u) =>
            u.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={u.user_id}
                src={u.avatar_url}
                alt={u.username}
                title={u.username}
                className="h-6 w-6 rounded-full border border-slate-950 bg-slate-800 object-cover"
              />
            ) : (
              <div
                key={u.user_id}
                title={u.username}
                className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-950 bg-indigo-600 text-[10px] font-bold text-white"
              >
                {(u.username ?? "?").charAt(0).toUpperCase()}
              </div>
            )
          )}
        </div>
        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          {displayList.length} Online
        </span>
      </button>

      {/* Modal Daftar Mahasiswa Online */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-indigo-400" />
                <h3 className="font-extrabold text-white text-sm">
                  Mahasiswa Online ({displayList.length})
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-slate-800 p-1.5 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {displayList.map((u) => (
                <div
                  key={u.user_id}
                  className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3"
                >
                  <div className="flex items-center gap-3">
                    {u.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={u.avatar_url}
                        alt={u.username}
                        className="h-8 w-8 rounded-full border border-indigo-500/40 object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                        {(u.username ?? "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-bold text-white text-xs sm:text-sm">
                      {u.username}
                      {u.user_id === me.user_id && (
                        <span className="ml-1.5 text-[10px] font-bold text-indigo-400">(Kamu)</span>
                      )}
                    </span>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    <Circle size={8} className="fill-emerald-400" />
                    Aktif
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}