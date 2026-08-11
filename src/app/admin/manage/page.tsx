import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FolderCog, Pencil, Plus, BookOpen, Layers3, CalendarClock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DeleteMaterialButton } from "@/components/delete-material-button";
import { AnimeBackground } from "@/components/anime-background";
import { StaggerContainer } from "@/components/stagger-container";
import { getStudyContextLabel } from "@/lib/study-contexts";

export default async function ManagePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) redirect("/dashboard");

  const { data: materials } = await supabase
    .from("materials")
    .select("*")
    .order("created_at", { ascending: false });

  const list = materials ?? [];
  const documentCount = list.filter((item) => item.file_type === "document").length;
  const videoCount = list.filter((item) => item.file_type === "video").length;
  const linkCount = list.filter((item) => item.file_type === "link").length;
  const latestMaterial = list[0] ?? null;

  return (
    <main className="relative min-h-screen w-full bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Background Anime.js Canvas */}
      <AnimeBackground />

      <section className="relative z-10 mx-auto w-full max-w-[1920px] px-6 py-8 lg:px-12 space-y-8">
        <StaggerContainer className="space-y-8">
          <div className="stagger-item flex flex-col gap-3 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-slate-700 hover:text-white"
            >
              <ArrowLeft size={16} />
              Kembali ke Dashboard
            </Link>

            <Link
              href="/admin/upload"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
            >
              <Plus size={16} />
              Tambah Materi Baru
            </Link>
          </div>

          <div className="stagger-item overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl lg:p-8">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/70 to-transparent" />
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-600/20 text-indigo-400">
                    <FolderCog size={26} />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      <Layers3 size={12} />
                      Admin workspace
                    </div>
                    <h1 className="mt-2 text-2xl font-black text-white">Kelola Materi Kuliah</h1>
                    <p className="text-sm leading-6 text-slate-400">
                      Total {list.length} materi terdaftar di database S1-TI. Ubah, hapus, atau revisi konteks belajar dari panel ini.
                    </p>
                  </div>
                </div>

                {latestMaterial && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Terbaru</div>
                    <div className="mt-1 text-sm font-semibold text-white">{latestMaterial.title}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                      <CalendarClock size={12} />
                      {new Date(latestMaterial.created_at).toLocaleDateString("id-ID")}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Total Materi</div>
                  <div className="mt-1 text-xl font-black text-white">{list.length}</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">File</div>
                  <div className="mt-1 text-xl font-black text-cyan-400">{documentCount}</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Link / Video</div>
                  <div className="mt-1 text-xl font-black text-amber-400">{linkCount + videoCount}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="stagger-item space-y-3">
            {list.map((m) => (
              <div
                key={m.id}
                className="flex flex-col gap-4 rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5 shadow-lg backdrop-blur transition-all hover:-translate-y-0.5 hover:border-indigo-500/30 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0 flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-800 text-indigo-400">
                    <BookOpen size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-white text-base">{m.title}</p>
                    <p className="text-xs font-medium text-slate-400">
                      <span className="text-indigo-400">{m.subject}</span> • Semester {m.semester}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {getStudyContextLabel(m.study_context) && (
                        <span className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                          {getStudyContextLabel(m.study_context)}
                        </span>
                      )}
                      <span className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        {m.file_type === "document" ? "File" : m.file_type === "video" ? "Video" : "Link"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/edit/${m.id}`}
                    title="Edit Materi"
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-700 hover:text-white"
                  >
                    <Pencil size={14} />
                    <span>Edit</span>
                  </Link>
                  <DeleteMaterialButton materialId={m.id} fileUrl={m.file_url} />
                </div>
              </div>
            ))}

            {list.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center text-slate-500">
                Belum ada materi terdaftar. Klik tombol Tambah Materi Baru di atas.
              </div>
            )}
          </div>
        </StaggerContainer>
      </section>
    </main>
  );
}