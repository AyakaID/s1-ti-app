"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  FileUp,
  Link2,
  Loader2,
  Save,
  ShieldAlert,
  Layers3,
  Upload,
  UploadCloud,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { notifyNewMaterial } from "./actions";
import { optimizePdf, formatSize } from "@/lib/compress";
import { STUDY_CONTEXTS, type StudyContextKey } from "@/lib/study-contexts";
import { AnimeBackground } from "@/components/anime-background";
import { StaggerContainer } from "@/components/stagger-container";

export default function UploadPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [mode, setMode] = useState<"file" | "link">("file");

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [studyContext, setStudyContext] = useState<StudyContextKey>("algoritma");
  const [semester, setSemester] = useState(1);
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sizes, setSizes] = useState<{ original: number; newSize: number } | null>(null);
  const [compressing, setCompressing] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
      setIsAdmin(profile?.is_admin ?? false);
    }
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleFileChange(f: File | null) {
    setFile(f);
    setSizes(null);
    if (!f) return;
    if (f.name.toLowerCase().endsWith(".pdf")) {
      setCompressing(true);
      const result = await optimizePdf(f);
      setFile(result.file);
      setSizes({ original: result.originalSize, newSize: result.newSize });
      setCompressing(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Belum login.");

      let fileUrl = "";
      let fileType = "";

      if (mode === "file") {
        if (!file) throw new Error("Pilih file terlebih dahulu.");

        const MAX_SIZE = 20 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
          throw new Error(
            `Ukuran file ${(file.size / 1024 / 1024).toFixed(1)}MB melebihi batas 20MB. Untuk file besar (video), gunakan mode Link.`
          );
        }

        fileType = "document";
        setStage("Mengupload file ke storage...");
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("materials")
          .upload(path, file);
        if (uploadError) throw new Error(uploadError.message);

        const { data: publicUrl } = supabase.storage
          .from("materials")
          .getPublicUrl(path);
        fileUrl = publicUrl.publicUrl;
      } else {
        if (!link.trim()) throw new Error("Isi link materi terlebih dahulu.");
        fileUrl = link.trim();
        fileType =
          link.includes("youtube") || link.includes("youtu.be")
            ? "video"
            : "link";
      }

      setStage("Menyimpan data materi...");
      const { error: insertError } = await supabase.from("materials").insert({
        title: title.trim(),
        description: description.trim() || null,
        subject: subject.trim(),
        study_context: studyContext,
        semester,
        file_url: fileUrl,
        file_type: fileType,
        created_by: user.id,
      });
      if (insertError) throw new Error(insertError.message);

      setStage("Mengirim notifikasi ke Discord...");
      await notifyNewMaterial(title.trim(), subject.trim(), semester);

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setUploading(false);
      setStage("");
    }
  }

  if (isAdmin === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-white">
        <ShieldAlert className="text-red-500" size={48} />
        <p className="text-slate-400">Halaman ini khusus admin.</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Background Anime.js Canvas */}
      <AnimeBackground />

      <section className="relative z-10 mx-auto w-full max-w-[1920px] px-6 py-8 lg:px-12 space-y-8">
        <StaggerContainer className="space-y-8 max-w-6xl mx-auto">
          <div className="stagger-item flex flex-col gap-3 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/admin/manage"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-slate-700 hover:text-white"
            >
              <ArrowLeft size={16} />
              Kembali ke Kelola Materi
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
              <Upload size={12} />
              Admin publish panel
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] xl:items-start">
            <form
              onSubmit={handleSubmit}
              className="stagger-item space-y-6 rounded-[2rem] border border-slate-800/80 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl lg:p-8"
            >
              <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-600/20 text-indigo-400">
                  <Upload size={26} />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white">Upload Materi Kuliah Baru</h1>
                  <p className="text-sm leading-6 text-slate-400">
                    Materi akan muncul di Dashboard, dan konteks belajar yang kamu pilih menentukan tips di halaman detail.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-1.5">
                <button
                  type="button"
                  onClick={() => setMode("file")}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition-all ${
                    mode === "file"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileUp size={16} />
                  <span>File (PDF / PPT / ZIP)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("link")}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition-all ${
                    mode === "link"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Link2 size={16} />
                  <span>Link Eksternal (YouTube / Drive)</span>
                </button>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Judul Materi</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={uploading}
                  placeholder="Contoh: Pertemuan 1 - Pengenalan Algoritma"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm outline-none transition-all focus:border-indigo-500 disabled:opacity-50"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Mata Kuliah</label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    disabled={uploading}
                    placeholder="Contoh: Algoritma & Pemrograman"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm outline-none transition-all focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Konteks Tips Belajar</label>
                  <select
                    value={studyContext}
                    onChange={(e) => setStudyContext(e.target.value as StudyContextKey)}
                    disabled={uploading}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm outline-none transition-all focus:border-indigo-500 disabled:opacity-50"
                  >
                    {STUDY_CONTEXTS.map((context) => (
                      <option key={context.key} value={context.key}>
                        {context.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-slate-500">
                    Ini menentukan guide tips di halaman detail materi.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    disabled={uploading}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm outline-none transition-all focus:border-indigo-500 disabled:opacity-50"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>Semester {n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Deskripsi (opsional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  disabled={uploading}
                  placeholder="Ringkasan singkat tentang materi ini..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm outline-none transition-all focus:border-indigo-500 disabled:opacity-50"
                />
              </div>
            {mode === "file" ? (
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">File Materi</label>
                <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/50 p-8 text-center transition-all hover:border-indigo-500">
                  <UploadCloud size={40} className="text-indigo-400" />
                  {file ? (
                    <>
                      <span className="flex items-center gap-2 text-sm font-bold text-white">
                        <FileText size={18} className="text-indigo-400" />
                        {file.name}
                      </span>
                      {compressing ? (
                        <span className="flex items-center gap-2 text-xs text-slate-400">
                          <Loader2 size={14} className="animate-spin text-indigo-400" />
                          Mengompres file PDF...
                        </span>
                      ) : sizes ? (
                        <span className="text-xs text-indigo-300 font-semibold">
                          {formatSize(sizes.original)} → {formatSize(sizes.newSize)}{" "}
                          {sizes.newSize < sizes.original
                            ? `(hemat ${Math.round((1 - sizes.newSize / sizes.original) * 100)}%)`
                            : "(sudah optimal)"}
                        </span>
                      ) : null}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setFile(null);
                          setSizes(null);
                        }}
                        className="mt-2 flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300"
                      >
                        <X size={14} />
                        Hapus file
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-bold text-white">Klik atau drag & drop file ke sini</span>
                      <span className="text-xs text-slate-400">
                        PDF (otomatis kompres), PPT, DOC, ZIP (maks 20MB)
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx,.zip,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            ) : (
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Link Eksternal (YouTube / Google Drive)</label>
                <input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  disabled={uploading}
                  placeholder="https://youtube.com/watch?v=... atau https://drive.google.com/..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm outline-none focus:border-indigo-500 disabled:opacity-50 transition-all"
                />
              </div>
            )}

            {error && (
              <p className="rounded-xl border border-rose-900/50 bg-rose-950/40 p-4 text-xs font-bold text-rose-300">
                {error}
              </p>
            )}

            {uploading && (
              <div className="space-y-2">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-950 p-0.5 border border-slate-800">
                  <div className="h-full w-full animate-pulse rounded-full bg-indigo-500" />
                </div>
                <p className="text-center text-xs font-semibold text-indigo-400">{stage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold transition-all shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              <span>{uploading ? "Memproses Upload..." : "Simpan & Publis Materi"}</span>
            </button>
            </form>

            <aside className="stagger-item space-y-4 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                  <Layers3 size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Checklist sebelum publish</h2>
                  <p className="text-sm leading-6 text-slate-400">
                    Pastikan konteks belajar sudah cocok supaya tips di halaman materi langsung relevan.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  "Pilih konteks belajar yang paling dekat dengan isi materi.",
                  "Gunakan file untuk dokumen ringan, link untuk video atau file besar.",
                  "Cek judul, semester, dan deskripsi sebelum menekan publish.",
                ].map((item, index) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-slate-300">{item}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">Status konteks</div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {STUDY_CONTEXTS.find((context) => context.key === studyContext)?.label}
                </p>
              </div>
            </aside>
          </div>
        </StaggerContainer>
      </section>
    </main>
  );
}