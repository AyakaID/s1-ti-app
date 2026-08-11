import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Download, FileText, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { MarkCompleteButton } from "@/components/mark-complete-button";
import { AnimeBackground } from "@/components/anime-background";
import { StaggerContainer } from "@/components/stagger-container";
import { SubjectStudyTips } from "@/components/subject-study-tips";
import { MaterialComments } from "@/components/material-comments";
import type { MaterialComment } from "@/lib/types";

function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function getDriveEmbed(url: string): string | null {
  const m = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  return m ? `https://drive.google.com/file/d/${m[1]}/preview` : null;
}

export default async function MateriDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  const { data: material } = await supabase
    .from("materials")
    .select("*")
    .eq("id", id)
    .single();

  if (!material) notFound();

  const { data: progress } = await supabase
    .from("user_progress")
    .select("id")
    .eq("user_id", user.id)
    .eq("material_id", id)
    .maybeSingle();

  // Fetch material comments with fallback
  let comments: MaterialComment[] = [];
  try {
    const { data: commentData } = await supabase
      .from("material_comments")
      .select("*, profiles(username, avatar_url)")
      .eq("material_id", id)
      .order("created_at", { ascending: false });

    if (commentData) {
      comments = commentData as unknown as MaterialComment[];
    }
  } catch (err) {
    console.error("Comments fetch fallback:", err);
  }

  const completed = Boolean(progress);
  const ytId = getYouTubeId(material.file_url);
  const driveEmbed = getDriveEmbed(material.file_url);
  const isPdf = material.file_url.toLowerCase().endsWith(".pdf");

  return (
    <main className="relative min-h-screen w-full bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Background Particles using Anime.js */}
      <AnimeBackground />

      <section className="relative z-10 mx-auto w-full max-w-[1920px] px-6 py-6 lg:px-12 space-y-8">
        {/* Navigation & Header */}
        <StaggerContainer className="space-y-8">
          <div className="stagger-item flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-300 hover:border-slate-700 hover:text-white transition-all"
            >
              <ArrowLeft size={16} />
              Kembali ke Dashboard
            </Link>

            <MarkCompleteButton
              materialId={material.id}
              userId={user.id}
              completed={completed}
            />
          </div>

          {/* Title Header Card */}
          <div className="stagger-item rounded-3xl border border-slate-800 bg-slate-900 p-6 lg:p-8 shadow-xl space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600/20 border border-indigo-500/30 px-3 py-1 text-xs font-bold text-indigo-300">
                    <BookOpen size={14} />
                    {material.subject}
                  </span>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                    Semester {material.semester}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  {material.title}
                </h1>
                {material.description && (
                  <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-4xl leading-relaxed font-medium">
                    {material.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={material.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30"
                >
                  <ExternalLink size={16} />
                  Buka di Tab Baru / Download
                </a>
              </div>
            </div>
          </div>

          {/* Full Screen Workspace Frame Container */}
          <div className="stagger-item overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
            {ytId ? (
              <iframe
                className="w-full aspect-video min-h-[600px] lg:min-h-[750px]"
                src={`https://www.youtube.com/embed/${ytId}`}
                title={material.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : driveEmbed ? (
              <iframe
                className="w-full aspect-video min-h-[600px] lg:min-h-[750px]"
                src={driveEmbed}
                title={material.title}
                allowFullScreen
              />
            ) : isPdf ? (
              <iframe
                className="w-full h-[80vh] min-h-[650px]"
                src={material.file_url}
                title={material.title}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 p-16 text-center min-h-[400px]">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                  <FileText size={36} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white mb-1">Preview File</h3>
                  <p className="text-xs text-slate-400 max-w-md">
                    Format file ini tidak mendukung embedded viewer langsung di browser. Silakan klik tombol di bawah untuk mengunduhnya.
                  </p>
                </div>
                <a
                  href={material.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30"
                >
                  <Download size={18} />
                  Unduh File Sekarang
                </a>
              </div>
            )}
          </div>

          {/* Subject Essential Study Guide & Tips */}
          <div className="stagger-item">
            <SubjectStudyTips
              subject={material.subject}
              title={material.title}
              description={material.description}
              studyContext={material.study_context}
            />
          </div>

          {/* Material Discussion Comments Section */}
          <div className="stagger-item">
            <MaterialComments
              materialId={material.id}
              userId={user.id}
              isAdmin={Boolean(profile?.is_admin)}
              comments={comments}
            />
          </div>
        </StaggerContainer>
      </section>
    </main>
  );
}