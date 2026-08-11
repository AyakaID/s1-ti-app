"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Loader2, Save, Layers3, CalendarClock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { optimizePdf, formatSize } from "@/lib/compress";
import { STUDY_CONTEXTS, type StudyContextKey, isStudyContextKey } from "@/lib/study-contexts";

export default function EditMaterialPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [studyContext, setStudyContext] = useState<StudyContextKey>("algoritma");
  const [semester, setSemester] = useState(1);
  const [description, setDescription] = useState("");
  const [oldFileUrl, setOldFileUrl] = useState("");
  const [currentFileType, setCurrentFileType] = useState<string | null>(null);

  const [newFile, setNewFile] = useState<File | null>(null);
  const [newLink, setNewLink] = useState("");
  const [compressing, setCompressing] = useState(false);
  const [sizes, setSizes] = useState<{ original: number; newSize: number } | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }
      const { data: prof } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
      if (!prof?.is_admin) {
        router.push("/dashboard");
        return;
      }

      const { data } = await supabase
        .from("materials")
        .select("*")
        .eq("id", params.id)
        .single();
      if (data) {
        setTitle(data.title);
        setSubject(data.subject);
        setStudyContext(isStudyContextKey(data.study_context ?? "") ? data.study_context : "algoritma");
        setSemester(data.semester);
        setDescription(data.description ?? "");
        setOldFileUrl(data.file_url);
        setCurrentFileType(data.file_type);
      }
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function handleFileChange(f: File | null) {
    setNewFile(f);
    setSizes(null);
    if (!f) return;
    if (f.name.toLowerCase().endsWith(".pdf")) {
      setCompressing(true);
      const result = await optimizePdf(f);
      setNewFile(result.file);
      setSizes({ original: result.originalSize, newSize: result.newSize });
      setCompressing(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      let fileUrl = oldFileUrl;
      let fileType: string | null = null;

      if (newFile) {
        const ext = newFile.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("materials")
          .upload(path, newFile);
        if (upErr) throw new Error(upErr.message);

        if (oldFileUrl.includes("/materials/")) {
          const oldPath = decodeURIComponent(oldFileUrl.split("/materials/")[1] ?? "");
          if (oldPath) await supabase.storage.from("materials").remove([oldPath]);
        }

        const { data: pub } = supabase.storage.from("materials").getPublicUrl(path);
        fileUrl = pub.publicUrl;
        fileType = "document";
      } else if (newLink.trim()) {
        fileUrl = newLink.trim();
        fileType =
          fileUrl.includes("youtube") || fileUrl.includes("youtu.be")
            ? "video"
            : "link";
      }

      const { error: updErr } = await supabase
        .from("materials")
        .update({
          title: title.trim(),
          subject: subject.trim(),
          study_context: studyContext,
          semester,
          description: description.trim() || null,
          file_url: fileUrl,
          ...(fileType ? { file_type: fileType } : {}),
        })
        .eq("id", params.id);
      if (updErr) throw new Error(updErr.message);

      router.push("/admin/manage");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-5xl px-4 py-10">
        <Link
          href="/admin/manage"
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm text-slate-300 transition-all hover:border-slate-700 hover:text-white"
        >
          <ArrowLeft size={16} />
          Kembali ke Kelola Materi
        </Link>

        <div className="mb-6 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300">
              <Layers3 size={20} />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                <CalendarClock size={12} />
                Admin edit panel
              </div>
              <h1 className="mt-2 text-2xl font-black">Edit Materi</h1>
              <p className="text-sm leading-6 text-slate-400">
                Perbarui metadata, file, dan konteks belajar agar tips di halaman materi tetap relevan.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] xl:items-start">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-[2rem] border border-slate-800 bg-slate-900 p-6 shadow-xl"
        >
          <div>
            <label className="mb-1 block text-sm text-slate-400">Judul Materi</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-slate-400">Mata Kuliah</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-400">Konteks Tips Belajar</label>
              <select
                value={studyContext}
                onChange={(e) => setStudyContext(e.target.value as StudyContextKey)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 outline-none focus:border-indigo-500"
              >
                {STUDY_CONTEXTS.map((context) => (
                  <option key={context.key} value={context.key}>
                    {context.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-slate-400">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 outline-none focus:border-indigo-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>Semester {n}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-400">Deskripsi (opsional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-400">
              Ganti File (kosongkan jika tidak diubah)
            </label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/40 p-5 text-center hover:border-indigo-500">
              {newFile ? (
                <>
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <FileText size={16} className="text-indigo-400" />
                    {newFile.name}
                  </span>
                  {compressing ? (
                    <span className="flex items-center gap-2 text-xs text-slate-400">
                      <Loader2 size={14} className="animate-spin" />
                      Mengompres PDF...
                    </span>
                  ) : sizes ? (
                    <span className="text-xs text-slate-500">
                      {formatSize(sizes.original)} → {formatSize(sizes.newSize)}
                    </span>
                  ) : null}
                </>
              ) : (
                <span className="text-sm text-slate-400">Klik untuk pilih file pengganti</span>
              )}
              <input
                type="file"
                accept=".pdf,.ppt,.pptx,.zip,.doc,.docx"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-400">
              Atau Ganti Link (kosongkan jika tidak diubah)
            </label>
            <input
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-900 bg-red-950 px-4 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold transition-all hover:bg-indigo-500 disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>

        <aside className="space-y-4 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <Layers3 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Checklist edit</h2>
              <p className="text-sm leading-6 text-slate-400">
                Update konteks belajar kalau materi berpindah topik agar tips tetap akurat.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              "Ubah konteks belajar jika isi materi lebih cocok ke mata kuliah lain.",
              "Ganti file hanya jika versi baru memang menggantikan yang lama.",
              "Kosongkan link atau file pengganti jika metadata saja yang diubah.",
            ].map((item, index) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-slate-300">{item}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Status saat ini</div>
            <div className="mt-2 text-sm font-semibold text-white">
              {STUDY_CONTEXTS.find((context) => context.key === studyContext)?.label}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {currentFileType ? `File type: ${currentFileType}` : "Belum ada tipe file terdeteksi"}
            </div>
          </div>
        </aside>
        </div>
      </section>
    </main>
  );
}