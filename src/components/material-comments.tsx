"use client";

import { useState } from "react";
import { MessageSquare, Send, Loader2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as localeID } from "date-fns/locale";
import { addCommentAction, deleteCommentAction } from "@/app/actions/comment-actions";
import type { MaterialComment } from "@/lib/types";

interface Props {
  materialId: string;
  userId: string;
  isAdmin: boolean;
  comments: MaterialComment[];
}

export function MaterialComments({ materialId, userId, isAdmin, comments }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    const res = await addCommentAction(materialId, content);
    setLoading(false);

    if (res.success) {
      setContent("");
    } else {
      alert(res.error || "Gagal mengirim komentar.");
    }
  }

  async function handleDelete(commentId: string) {
    if (!window.confirm("Hapus komentar ini?")) return;
    const res = await deleteCommentAction(commentId, materialId);
    if (!res.success) {
      alert(res.error || "Gagal menghapus komentar.");
    }
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 lg:p-8 shadow-xl space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
          <MessageSquare size={20} />
        </div>
        <div>
          <h3 className="text-xl font-black text-white">Diskusi & Tanya Jawab Materi</h3>
          <p className="text-xs text-slate-400">
            Tanyakan bagian yang belum paham atau bagikan catatan ringkasmu di sini!
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tuliskan pertanyaan atau pendapatmu tentang materi ini..."
          disabled={loading}
          className="flex-1 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!content.trim() || loading}
          className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20 disabled:cursor-not-allowed disabled:opacity-50 shrink-0"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          <span className="hidden sm:inline">Kirim</span>
        </button>
      </form>

      {/* List Komentar */}
      <div className="space-y-3 pt-2">
        {comments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-500 text-sm">
            Belum ada diskusi untuk materi ini. Jadi yang pertama berkomentar! 💬
          </div>
        ) : (
          comments.map((c) => {
            const isOwner = c.user_id === userId;
            const canDelete = isOwner || isAdmin;
            const authorName = c.profiles?.username || "Mahasiswa";
            const avatar = c.profiles?.avatar_url;

            let relativeTime = "";
            try {
              relativeTime = formatDistanceToNow(new Date(c.created_at), {
                addSuffix: true,
                locale: localeID,
              });
            } catch {
              relativeTime = "baru saja";
            }

            return (
              <div
                key={c.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 transition-all"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatar}
                      alt={authorName}
                      className="h-9 w-9 rounded-full object-cover border border-indigo-500/40 shrink-0"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                      {authorName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs sm:text-sm">
                        {authorName}
                      </span>
                      {isOwner && (
                        <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-bold text-indigo-300">
                          Kamu
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500">
                        • {relativeTime}
                      </span>
                    </div>

                    <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed break-words">
                      {c.content}
                    </p>
                  </div>
                </div>

                {canDelete && (
                  <button
                    onClick={() => handleDelete(c.id)}
                    title="Hapus Komentar"
                    className="text-slate-500 hover:text-rose-400 transition-colors shrink-0 p-1"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
