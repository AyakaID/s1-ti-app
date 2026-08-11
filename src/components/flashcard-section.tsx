"use client";

import { useState, useRef } from "react";
import {
  RotateCw,
  Shuffle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Layers3,
  BadgeInfo,
  BarChart3,
} from "lucide-react";
import { animate } from "animejs";

interface Flashcard {
  id: string;
  category: string;
  question: string;
  answer: string;
  source: string;
}

const FLASHCARDS: Flashcard[] = [
  {
    id: "fc-1",
    category: "Algoritma",
    question: "Apa perbedaan Time Complexity dan Space Complexity?",
    answer:
      "Time Complexity mengukur seberapa lama waktu eksekusi algoritma berkembang seiring bertambahnya jumlah input (n). Space Complexity mengukur jumlah memori RAM tambahan yang dibutuhkan algoritma.",
    source: "Introduction to Algorithms (CLRS 4th Ed.)",
  },
  {
    id: "fc-2",
    category: "Algoritma",
    question: "Kapan sebaiknya memakai QuickSort dibanding MergeSort?",
    answer:
      "QuickSort bekerja in-place dengan memori tambahan O(1) dan secara rata-rata lebih cepat pada cache memori fisik. MergeSort lebih stabil dan menjamin O(n log n) di worst-case namun butuh memori ekstra O(n).",
    source: "MIT OpenCourseWare (6.006 Algorithms)",
  },
  {
    id: "fc-3",
    category: "Jaringan Komputer",
    question: "Apa bedanya TCP dan UDP?",
    answer:
      "TCP bersifat connection-oriented, menjamin data terkirim berurutan tanpa error (reliable) via 3-Way Handshake (contoh: HTTP, SSH). UDP bersifat connectionless, cepat tanpa garansi urutan (contoh: Video Streaming, Gaming Online).",
    source: "Computer Networks by Andrew S. Tanenbaum",
  },
  {
    id: "fc-4",
    category: "Basis Data",
    question: "Apa itu Sifat ACID pada Transaksi Database?",
    answer:
      "Atomicity (semua sukses atau batal semua), Consistency (data tetap valid sesuai aturan), Isolation (transaksi tidak saling mengganggu), Durability (data tersimpan permanen walau mati listrik).",
    source: "Database System Concepts (Silberschatz)",
  },
  {
    id: "fc-5",
    category: "Sistem Operasi",
    question: "Apa 4 Syarat Utama Terjadinya Deadlock?",
    answer:
      "1. Mutual Exclusion (sumber daya tidak bisa dibagi)\n2. Hold and Wait (memegang resource sambil minta baru)\n3. No Preemption (resource tidak bisa direbut paksa)\n4. Circular Wait (rantai saling menunggu).",
    source: "Operating System Concepts (Silberschatz)",
  },
  {
    id: "fc-6",
    category: "Kriptografi",
    question: "Apa perbedaan Enkripsi Simetris dan Asimetris?",
    answer:
      "Simetris (AES) menggunakan 1 kunci rahasia yang sama untuk enkripsi dan dekripsi (cepat). Asimetris (RSA/ECC) menggunakan pasangan Public Key (untuk enkripsi) dan Private Key (untuk dekripsi).",
    source: "Cryptography and Network Security by Stallings",
  },
  {
    id: "fc-7",
    category: "Rekayasa Perangkat Lunak",
    question: "Apa itu Prinsip Single Responsibility (bagian dari SOLID)?",
    answer:
      "Setiap kelas atau modul dalam software hanya boleh memiliki 1 alasan untuk berubah. Kelas hanya boleh bertanggung jawab atas 1 fungsi spesifik agar mudah dipelihara dan diuji.",
    source: "Clean Architecture by Robert C. Martin",
  },
  {
    id: "fc-8",
    category: "Algoritma",
    question: "Apa itu Big O notation?",
    answer:
      "Big O notation menggambarkan batas atas pertumbuhan kompleksitas algoritma saat ukuran input membesar. Fokusnya ada pada perilaku asimtotik, bukan waktu pasti eksekusi.",
    source: "Algorithms, 4th Edition by Sedgewick & Wayne",
  },
  {
    id: "fc-9",
    category: "Algoritma",
    question: "Kenapa binary search lebih cepat dari linear search?",
    answer:
      "Binary search membagi ruang pencarian menjadi dua setiap langkah, sehingga kompleksitas waktunya O(log n). Linear search memeriksa elemen satu per satu dengan kompleksitas O(n).",
    source: "Introduction to Algorithms (CLRS 4th Ed.)",
  },
  {
    id: "fc-10",
    category: "Jaringan Komputer",
    question: "Apa fungsi DNS di jaringan?",
    answer:
      "DNS menerjemahkan nama domain yang mudah dibaca manusia, seperti example.com, menjadi alamat IP yang digunakan komputer untuk berkomunikasi di jaringan.",
    source: "Computer Networking: A Top-Down Approach",
  },
  {
    id: "fc-11",
    category: "Jaringan Komputer",
    question: "Apa itu subnet mask?",
    answer:
      "Subnet mask membagi alamat IP menjadi bagian network dan host. Dengan subnet mask, perangkat bisa menentukan apakah tujuan berada di jaringan lokal atau harus dikirim ke router.",
    source: "Computer Networks by Andrew S. Tanenbaum",
  },
  {
    id: "fc-12",
    category: "Basis Data",
    question: "Apa tujuan indexing pada database?",
    answer:
      "Index mempercepat pencarian data dengan membuat struktur tambahan yang mengurangi jumlah baris yang harus dibaca. Trade-off-nya adalah penyimpanan ekstra dan biaya saat insert/update/delete.",
    source: "Database System Concepts (Silberschatz)",
  },
  {
    id: "fc-13",
    category: "Basis Data",
    question: "Apa bedanya primary key dan foreign key?",
    answer:
      "Primary key mengidentifikasi setiap baris secara unik dalam tabel. Foreign key menghubungkan satu tabel dengan tabel lain melalui referensi ke primary key atau unique key.",
    source: "Fundamentals of Database Systems",
  },
  {
    id: "fc-14",
    category: "Sistem Operasi",
    question: "Apa perbedaan process dan thread?",
    answer:
      "Process memiliki ruang alamat dan resource sendiri. Thread adalah jalur eksekusi ringan di dalam process yang berbagi memori dan resource yang sama dengan thread lain di process tersebut.",
    source: "Operating System Concepts (Silberschatz)",
  },
  {
    id: "fc-15",
    category: "Kriptografi",
    question: "Apa itu hash function dalam keamanan data?",
    answer:
      "Hash function mengubah input menjadi output berukuran tetap yang sulit dibalik. Fungsinya umum dipakai untuk integritas data, password hashing, dan verifikasi file.",
    source: "Cryptography and Network Security by Stallings",
  },
  {
    id: "fc-16",
    category: "Rekayasa Perangkat Lunak",
    question: "Kenapa testing penting dalam pengembangan software?",
    answer:
      "Testing membantu menemukan bug lebih awal, menjaga perilaku sistem tetap stabil saat ada perubahan, dan meningkatkan kepercayaan terhadap fitur yang dirilis.",
    source: "Software Engineering: A Practitioner's Approach",
  },
];

export function FlashcardSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement | null>(null);

  const categories = Array.from(new Set(FLASHCARDS.map((f) => f.category)));

  const filteredCards = selectedCategory
    ? FLASHCARDS.filter((f) => f.category === selectedCategory)
    : FLASHCARDS;

  const cardCount = filteredCards.length;
  const currentCard = cardCount > 0 ? filteredCards[currentIndex % cardCount] : null;
  const activeLabel = selectedCategory ?? "Semua materi";

  function toggleFlip() {
    if (!cardRef.current || !currentCard) {
      return;
    }

    if (cardRef.current) {
      animate(cardRef.current, {
        rotateY: isFlipped ? [180, 0] : [0, 180],
        duration: 500,
        ease: "easeInOutQuad",
      });
    }
    setIsFlipped(!isFlipped);
  }

  function handleNext() {
    if (!currentCard || cardCount === 0) {
      return;
    }

    setIsFlipped(false);
    if (cardRef.current) {
      animate(cardRef.current, { rotateY: 0, duration: 0 });
    }
    setCurrentIndex((prev) => (prev + 1) % cardCount);
  }

  function handlePrev() {
    if (!currentCard || cardCount === 0) {
      return;
    }

    setIsFlipped(false);
    if (cardRef.current) {
      animate(cardRef.current, { rotateY: 0, duration: 0 });
    }
    setCurrentIndex((prev) => (prev - 1 + cardCount) % cardCount);
  }

  function handleShuffle() {
    if (!currentCard || cardCount === 0) {
      return;
    }

    setIsFlipped(false);
    if (cardRef.current) {
      animate(cardRef.current, { rotateY: 0, duration: 0 });
    }
    const rand = Math.floor(Math.random() * cardCount);
    setCurrentIndex(rand);
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/95 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.55)] sm:p-6 lg:p-8">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/70 to-transparent" />
      <div className="absolute -right-24 top-8 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative space-y-6">
        <div className="flex flex-col gap-5 border-b border-slate-800 pb-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 shadow-lg shadow-indigo-500/10">
                <Sparkles size={22} />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                  <Layers3 size={11} />
                  Deck interaktif
                </div>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                  Flashcard S1-TI Kilat
                </h3>
              </div>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Uji konsep dasar informatika dari referensi akademis, lalu pindah cepat
              antar kartu untuk mengulang poin penting dengan ritme yang lebih tajam.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 xl:min-w-[28rem] xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Materi aktif</div>
              <div className="mt-1 text-lg font-black text-white">{cardCount}</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Filter</div>
              <div className="mt-1 text-lg font-black text-indigo-300">{activeLabel}</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Kategori</div>
              <div className="mt-1 text-lg font-black text-cyan-300">{categories.length}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory(null);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition-all ${
              !selectedCategory
                ? "border-indigo-500/60 bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                : "border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700 hover:text-white"
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "border-indigo-500/60 bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  : "border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)] xl:items-stretch">
          <div className="perspective-1000 flex min-h-[380px] justify-center rounded-[2rem] border border-slate-800 bg-slate-950/70 p-4 sm:p-6">
            <div
              ref={cardRef}
              onClick={toggleFlip}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleFlip();
                }
              }}
              aria-pressed={isFlipped}
              className="relative w-full max-w-3xl cursor-pointer rounded-[1.75rem] border border-slate-800 bg-slate-950 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.7)] transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_30px_100px_rgba(79,70,229,0.18)] sm:p-8"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateY(${isFlipped ? 180 : 0}deg)`,
              }}
            >
                <div className="absolute inset-x-0 top-0 h-1 rounded-t-[1.75rem] bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400" />
                <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-indigo-500/5 to-transparent" />

                {currentCard ? (
                  <>
                    <div
                      className="absolute inset-0 rounded-[1.75rem] p-6 sm:p-8"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div className="relative z-10 flex h-full flex-col gap-6">
                        <div className="flex items-start justify-between gap-4">
                          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3 py-1 text-xs font-bold text-indigo-300">
                            <BookOpen size={14} />
                            {currentCard.category}
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-400">
                            <BarChart3 size={13} />
                            Kartu {currentIndex + 1} dari {cardCount}
                          </span>
                        </div>

                        <div className="space-y-4">
                          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500">
                            Pertanyaan
                          </p>
                          <h4 className="max-w-2xl text-2xl font-black leading-tight text-white sm:text-[2.05rem]">
                            {currentCard.question}
                          </h4>
                        </div>

                        <div className="mt-auto flex flex-col gap-3 border-t border-slate-800 pt-5 text-xs font-semibold text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                          <span className="inline-flex items-center gap-2 text-indigo-300">
                            <RotateCw size={14} />
                            Klik kartu untuk melihat jawaban
                          </span>
                          <span className="inline-flex items-center gap-2 text-slate-500">
                            <BadgeInfo size={14} />
                            Referensi akademik terkurasi
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="absolute inset-0 rounded-[1.75rem] p-6 sm:p-8"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div className="relative z-10 flex h-full flex-col gap-6">
                        <div className="flex items-start justify-between gap-4">
                          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                            <CheckCircle2 size={14} />
                            Jawaban & Konsep
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-400">
                            <BookOpen size={13} />
                            Sumber terpercaya
                          </span>
                        </div>

                        <div className="space-y-4">
                          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500">
                            Ringkasan
                          </p>
                          <p className="max-w-3xl whitespace-pre-line text-base leading-7 text-slate-200 sm:text-lg">
                            {currentCard.answer}
                          </p>
                        </div>

                        <div className="mt-auto flex flex-col gap-3 border-t border-slate-800 pt-5 text-xs font-semibold text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                          <span className="inline-flex items-center gap-2 text-slate-300">
                            <BookOpen size={14} className="text-cyan-300" />
                            Referensi: {currentCard.source}
                          </span>
                          <span className="inline-flex items-center gap-2 text-indigo-300">
                            <RotateCw size={12} />
                            Klik lagi untuk balik ke soal
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="relative z-10 flex h-full min-h-[280px] items-center justify-center text-slate-400">
                    Tidak ada kartu pada filter ini.
                  </div>
                )}
            </div>

          </div>

          <aside className="grid gap-4 self-stretch rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 sm:p-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Sparkles size={16} className="text-amber-400" />
                Mode belajar cepat
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Putar kartu, acak urutan, lalu fokus pada kategori yang paling perlu kamu ulang.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Kartu saat ini</div>
                <div className="mt-2 text-2xl font-black text-white">
                  {currentCard ? `${currentIndex + 1}` : "0"}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Rasio deck</div>
                <div className="mt-2 text-2xl font-black text-cyan-300">
                  {cardCount > 0 ? `${Math.round(((currentIndex + 1) / cardCount) * 100)}%` : "0%"}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">Tips</div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Ulangi kartu yang salah dua kali, lalu pindah ke kategori berikutnya supaya memorinya lebih melekat.
              </p>
            </div>
          </aside>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Klik kartu untuk flip, atau pakai navigasi di bawah
          </div>
          <div className="text-xs font-semibold text-slate-400">
            {currentCard ? `${currentIndex + 1} / ${cardCount}` : "0 / 0"}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!currentCard}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-bold text-slate-300 transition-all hover:border-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
            <span>Sebelumnya</span>
          </button>

          <button
            type="button"
            onClick={handleShuffle}
            disabled={!currentCard}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-bold text-amber-300 transition-all hover:border-amber-500/40 hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Shuffle size={16} />
            <span>Acak Kartu</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!currentCard}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span>Selanjutnya</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
