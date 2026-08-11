export const STUDY_CONTEXTS = [
  {
    key: "algoritma",
    label: "Algoritma & Struktur Data",
    description: "Problem solving, kompleksitas, sorting, searching, graph, dan recursion.",
  },
  {
    key: "pengantar-ti",
    label: "Pengantar Teknologi Informasi",
    description: "Dasar ekosistem TI, peran komputer, sistem informasi, dan literasi digital.",
  },
  {
    key: "pemrograman-dasar",
    label: "Dasar-Dasar Pemrograman",
    description: "Variabel, tipe data, percabangan, perulangan, fungsi, dan debugging dasar.",
  },
  {
    key: "jaringan",
    label: "Jaringan Komputer",
    description: "OSI, TCP/IP, subnetting, routing, DNS, HTTP, dan firewall.",
  },
  {
    key: "basisdata",
    label: "Basis Data",
    description: "ERD, normalisasi, SQL, join, index, transaksi, dan optimasi query.",
  },
  {
    key: "sistem-operasi",
    label: "Sistem Operasi",
    description: "Process, thread, scheduling, memory management, dan deadlock.",
  },
  {
    key: "rpl",
    label: "Rekayasa Perangkat Lunak",
    description: "Requirements, UML, SOLID, design pattern, testing, dan refactoring.",
  },
  {
    key: "oop",
    label: "Pemrograman Berorientasi Objek",
    description: "Class, object, encapsulation, inheritance, polymorphism, dan abstraction.",
  },
  {
    key: "arsitektur-komputer",
    label: "Arsitektur dan Organisasi Komputer",
    description: "CPU, memori, instruction cycle, representasi data, dan sistem bilangan.",
  },
  {
    key: "kriptografi",
    label: "Kriptografi",
    description: "Encryption, hashing, signature, key exchange, dan keamanan implementasi.",
  },
  {
    key: "aljabar-linier",
    label: "Aljabar Linier dan Matriks",
    description: "Vektor, matriks, determinan, eliminasi Gauss, dan ruang vektor.",
  },
  {
    key: "statistika-probabilitas",
    label: "Statistika dan Probabilitas",
    description: "Peluang, distribusi, inferensi dasar, dan interpretasi data.",
  },
  {
    key: "automata",
    label: "Teori Bahasa dan Automata",
    description: "Finite automata, regular expression, grammar, dan language recognition.",
  },
  {
    key: "web",
    label: "Pemrograman Web & API",
    description: "HTML, CSS, JavaScript, REST API, rendering, state, dan HTTP.",
  },
  {
    key: "keamanan-data",
    label: "Keamanan Data",
    description: "Kontrol akses, enkripsi dasar, keamanan informasi, dan mitigasi risiko.",
  },
  {
    key: "machine-learning",
    label: "Machine Learning",
    description: "Data preparation, supervised learning, evaluasi model, dan overfitting.",
  },
  {
    key: "deep-learning",
    label: "Deep Learning",
    description: "Neural network, backpropagation, optimization, dan regularization.",
  },
  {
    key: "kecerdasan-buatan",
    label: "Kecerdasan Buatan",
    description: "Search, heuristic, knowledge representation, dan dasar agent system.",
  },
  {
    key: "etika-profesi",
    label: "Etik Profesi",
    description: "Etika profesional, tanggung jawab, studi kasus, dan pengambilan keputusan.",
  },
  {
    key: "kewirausahaan",
    label: "Kewirausahaan",
    description: "Ide bisnis, validasi masalah, value proposition, dan presentasi solusi.",
  },
  {
    key: "penulisan-ilmiah",
    label: "Penulisan Karya Ilmiah",
    description: "Struktur tulisan, sitasi, literatur review, dan penyusunan argumen.",
  },
  {
    key: "kerja-praktek",
    label: "Kerja Praktek",
    description: "Dokumentasi, pelaporan, observasi lapangan, dan penyelesaian proyek nyata.",
  },
  {
    key: "mbkm",
    label: "MBKM / Kampus Merdeka",
    description: "Pembelajaran di luar kampus, portofolio, dan pencapaian kompetensi praktis.",
  },
  {
    key: "diskrit",
    label: "Matematika Diskrit",
    description: "Logika, himpunan, relasi, induksi, kombinatorika, graf, dan pohon.",
  },
] as const;

export type StudyContextKey = (typeof STUDY_CONTEXTS)[number]["key"];

export const DEFAULT_STUDY_CONTEXT: StudyContextKey = "algoritma";

export function isStudyContextKey(value: string): value is StudyContextKey {
  return STUDY_CONTEXTS.some((context) => context.key === value);
}

export function getStudyContextLabel(value?: string | null) {
  return STUDY_CONTEXTS.find((context) => context.key === value)?.label ?? null;
}
