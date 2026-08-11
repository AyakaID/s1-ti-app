"use client";

import { Lightbulb, BookOpen, CheckCircle2, Bookmark, ExternalLink, ArrowRight } from "lucide-react";
import {
  DEFAULT_STUDY_CONTEXT,
  type StudyContextKey,
  isStudyContextKey,
} from "@/lib/study-contexts";

interface SubjectGuide {
  id: string;
  subjectName: string;
  source: string;
  sourceUrl: string;
  overview: string;
  keywords: string[];
  focusTopics: string[];
  studyFlow: string[];
  practiceDrills: string[];
  commonMistakes: string[];
}

const STUDY_GUIDES: SubjectGuide[] = [
  {
    id: "algoritma",
    subjectName: "Algoritma & Pemrograman / Struktur Data",
    source: "MIT OpenCourseWare (6.006) & Cormen CLRS Algorithms",
    sourceUrl: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
    overview:
      "Algoritma dan struktur data adalah fondasi problem solving: kamu perlu cepat mengenali pola soal, memilih struktur data yang tepat, lalu membuktikan kompleksitasnya.",
    keywords: ["algoritma", "struktur data", "sorting", "search", "graph", "tree", "hash", "recursion", "big o"],
    focusTopics: [
      "Big-O, time complexity, dan space trade-off",
      "Array, linked list, stack, queue, dan hash table",
      "Sorting dan searching: merge sort, quick sort, binary search",
      "Tree dan graph traversal: BFS, DFS, shortest path",
      "Recursion dan dynamic programming",
    ],
    studyFlow: [
      "Pahami konteks soal dulu, lalu tulis input-output dan batasan ukuran data.",
      "Tentukan struktur data utama sebelum menulis kode.",
      "Simulasikan 1 contoh kecil secara manual sebelum implementasi.",
    ],
    practiceDrills: [
      "Implementasikan binary search, merge sort, dan BFS tanpa lihat referensi.",
      "Bandingkan 2 solusi berbeda dan hitung kompleksitasnya.",
      "Buat tabel kecil untuk melihat perubahan state saat data bertambah.",
    ],
    commonMistakes: [
      "Langsung coding tanpa memahami constraint soal.",
      "Memakai struktur data yang terlalu berat untuk kebutuhan sederhana.",
      "Lupa menghitung kompleksitas worst-case.",
    ],
  },
  {
    id: "pengantar-ti",
    subjectName: "Pengantar Teknologi Informasi",
    source: "Introduction to Information Systems by Laudon & Laudon",
    sourceUrl: "https://www.geeksforgeeks.org/information-system/",
    overview:
      "Pengantar TI membantu kamu memahami ekosistem komputer, sistem informasi, dan alur kerja digital sebelum masuk ke mata kuliah teknis yang lebih dalam.",
    keywords: ["pengantar teknologi informasi", "pengantar ti", "it", "information system", "komputer", "literasi digital"],
    focusTopics: [
      "Komponen utama sistem informasi",
      "Hardware, software, dan data",
      "Peran TI di organisasi dan proses bisnis",
      "Etika digital dan literasi informasi",
      "Representasi data dan keamanan dasar",
    ],
    studyFlow: [
      "Mulai dari gambaran besar: input, proses, output, dan feedback.",
      "Hubungkan teori dengan contoh aplikasi sehari-hari.",
      "Catat istilah inti yang akan sering muncul di mata kuliah lain.",
    ],
    practiceDrills: [
      "Jelaskan satu sistem informasi dari sudut pandang pengguna dan pengelola.",
      "Buat peta komponen hardware-software-data untuk satu studi kasus.",
      "Tuliskan 5 istilah TI yang wajib kamu hafal beserta contoh singkatnya.",
    ],
    commonMistakes: [
      "Menghafal definisi tanpa melihat hubungan antar komponen.",
      "Menganggap semua materi TI harus langsung teknis.",
      "Lupa bahwa literasi digital juga bagian dari kompetensi dasar.",
    ],
  },
  {
    id: "pemrograman-dasar",
    subjectName: "Dasar-Dasar Pemrograman",
    source: "Python Crash Course & Programming Principles",
    sourceUrl: "https://www.geeksforgeeks.org/fundamentals-of-programming/",
    overview:
      "Dasar-dasar pemrograman membangun kebiasaan berpikir langkah demi langkah: input, proses, output, lalu debugging ketika hasil tidak sesuai.",
    keywords: ["pemrograman dasar", "programming", "variable", "function", "loop", "condition", "debug"],
    focusTopics: [
      "Variabel, tipe data, dan operator",
      "Percabangan dan perulangan",
      "Fungsi dan parameter",
      "Array/list dan pengolahan data sederhana",
      "Debugging dan tracing program",
    ],
    studyFlow: [
      "Baca soal, lalu pecah menjadi langkah kecil yang bisa dijalankan komputer.",
      "Tulis versi sederhana dulu sebelum menambah fitur.",
      "Cek setiap perubahan variabel saat program berjalan.",
    ],
    practiceDrills: [
      "Buat program kalkulator sederhana dan uji semua kasus input.",
      "Latih tracing manual pada 1 program loop dan 1 program fungsi.",
      "Ubah pseudocode menjadi kode untuk melatih konsistensi logika.",
    ],
    commonMistakes: [
      "Langsung menulis kode tanpa alur algoritma yang jelas.",
      "Salah membedakan assignment dan comparison.",
      "Tidak mengecek kasus input kosong atau tidak valid.",
    ],
  },
  {
    id: "jaringan",
    subjectName: "Jaringan Komputer",
    source: "Computer Networks by Andrew S. Tanenbaum & RFC Standards",
    sourceUrl: "https://www.geeksforgeeks.org/computer-network-tutorials/",
    overview:
      "Jaringan komputer bukan hanya hafalan layer, tetapi kemampuan menelusuri jalur data dari aplikasi sampai media transmisi dan menjelaskan kenapa sebuah paket gagal sampai tujuan.",
    keywords: ["jaringan", "network", "tcp", "udp", "dns", "routing", "subnet", "osi", "http", "firewall", "nat"],
    focusTopics: [
      "OSI 7 layer dan TCP/IP 4 layer",
      "IP addressing, subnetting, dan CIDR",
      "TCP handshake, UDP, dan kontrol reliabilitas",
      "DNS, HTTP/HTTPS, DHCP, dan TLS",
      "Routing, NAT, dan firewall dasar",
    ],
    studyFlow: [
      "Baca alur paket dari layer aplikasi ke physical secara berurutan.",
      "Latih subnetting dengan menulis network address, host range, dan broadcast address.",
      "Untuk protokol, fokus ke tujuan, port, dan sifat connection-oriented atau connectionless.",
    ],
    practiceDrills: [
      "Analisis satu permintaan web: DNS lookup, TCP handshake, lalu HTTP request.",
      "Kerjakan subnetting manual sampai hasilnya bisa dicek cepat tanpa kalkulator.",
      "Gunakan Wireshark atau simulasi untuk melihat paket nyata.",
    ],
    commonMistakes: [
      "Menghafal layer tanpa tahu fungsi tiap layer.",
      "Salah membedakan host address dan network address.",
      "Mencampur DNS dengan routing dan firewall.",
    ],
  },
  {
    id: "basisdata",
    subjectName: "Sistem Basis Data",
    source: "Database System Concepts by Silberschatz & Elmasri Navathe",
    sourceUrl: "https://www.geeksforgeeks.org/dbms/",
    overview:
      "Basis data harus dibaca sebagai tiga lapis sekaligus: desain relasi, perilaku transaksi, dan cara query dieksekusi supaya performanya tetap masuk akal.",
    keywords: ["basis data", "database", "sql", "query", "join", "index", "normalisasi", "acid", "transaction", "erd", "relasi"],
    focusTopics: [
      "ERD, entitas, relasi, dan kardinalitas",
      "Normalisasi: 1NF sampai BCNF",
      "SQL join, grouping, subquery, dan agregasi",
      "Indexing, execution plan, dan optimasi query",
      "ACID, isolation level, dan transaksi",
    ],
    studyFlow: [
      "Gambar skema data dulu sebelum menulis query.",
      "Baca query dari dalam ke luar untuk memahami join dan filter.",
      "Cek apakah hasil query konsisten saat data bertambah atau diubah.",
    ],
    practiceDrills: [
      "Buat database kecil dari nol lalu tulis 5 query CRUD dan analitik.",
      "Bandingkan query sebelum dan sesudah index dengan EXPLAIN ANALYZE.",
      "Ubah ERD sederhana menjadi tabel dan tentukan primary key/foreign key.",
    ],
    commonMistakes: [
      "Menormalisasi berlebihan sampai query jadi rumit.",
      "Memakai SELECT * pada data besar tanpa alasan.",
      "Menganggap join hanya soal sintaks, bukan cardinality dan cost.",
    ],
  },
  {
    id: "sistem-operasi",
    subjectName: "Sistem Operasi",
    source: "Operating System Concepts by Silberschatz, Galvin & Gagne",
    sourceUrl: "https://os.ghosh.pro/",
    overview:
      "Sistem operasi fokus pada resource management: CPU, memori, storage, dan sinkronisasi proses. Intinya adalah memahami siapa memakai resource, kapan, dan dengan aturan apa.",
    keywords: ["sistem operasi", "operasi", "process", "thread", "deadlock", "paging", "memory", "scheduler", "mutex", "semaphore"],
    focusTopics: [
      "Process, thread, dan context switching",
      "CPU scheduling: FCFS, SJF, Round Robin",
      "Deadlock, starvation, mutex, dan semaphore",
      "Paging, virtual memory, dan page replacement",
      "File system dan alokasi storage",
    ],
    studyFlow: [
      "Petakan dulu resource apa yang sedang dikelola OS.",
      "Untuk soal scheduling, tulis timeline sebelum menghitung hasil.",
      "Untuk memory, bedakan address logical, physical, dan page/frame.",
    ],
    practiceDrills: [
      "Kerjakan satu soal scheduling manual sampai kamu bisa menggambar Gantt chart.",
      "Simulasikan deadlock dan cari syarat mana yang membuatnya terjadi.",
      "Bandingkan FIFO dan LRU pada beberapa urutan akses halaman.",
    ],
    commonMistakes: [
      "Mencampur konsep process dan thread.",
      "Menghitung scheduling tanpa urutan waktu yang jelas.",
      "Menghafal deadlock tanpa memahami empat syaratnya.",
    ],
  },
  {
    id: "rpl",
    subjectName: "Rekayasa Perangkat Lunak (RPL)",
    source: "Software Engineering by Ian Sommerville & SOLID Principles",
    sourceUrl: "https://refactoring.guru/design-patterns",
    overview:
      "RPL lebih dekat ke cara membangun software yang bisa dirawat: memahami kebutuhan, membagi modul, menulis test, lalu merapikan desain saat sistem tumbuh.",
    keywords: ["rpl", "rekayasa perangkat lunak", "software engineering", "agile", "scrum", "testing", "refactoring", "solid", "uml", "design pattern"],
    focusTopics: [
      "Requirements dan user story",
      "UML, class diagram, dan arsitektur dasar",
      "SOLID, cohesion, dan coupling",
      "Design pattern yang sering dipakai",
      "Testing, debugging, dan refactoring",
    ],
    studyFlow: [
      "Mulai dari kebutuhan, bukan dari kelas atau fungsi.",
      "Bagi masalah ke modul kecil yang jelas tanggung jawabnya.",
      "Selalu cek apakah desain masih mudah diuji dan diubah.",
    ],
    practiceDrills: [
      "Ubah satu kasus nyata menjadi user story, use case, dan class diagram.",
      "Cari code smell pada potongan kode pendek dan usulkan refactor.",
      "Tulis test sederhana sebelum memperbaiki implementasi.",
    ],
    commonMistakes: [
      "Langsung mengutak-atik kode tanpa memahami kebutuhan.",
      "Membuat class terlalu besar dan bercampur tanggung jawab.",
      "Menganggap testing hanya formalitas.",
    ],
  },
  {
    id: "oop",
    subjectName: "Pemrograman Berorientasi Objek (OOP)",
    source: "Head First Design Patterns & Object-Oriented Analysis Principles",
    sourceUrl: "https://refactoring.guru/design-patterns",
    overview:
      "OOP membantu mengelola kompleksitas lewat object, responsibility, dan interaksi antar class. Fokusnya bukan cuma hafal istilah, tetapi paham kapan encapsulation dan polymorphism benar-benar berguna.",
    keywords: ["oop", "pemrograman berorientasi objek", "class", "object", "inheritance", "polymorphism", "encapsulation", "abstraction"],
    focusTopics: [
      "Class, object, dan constructor",
      "Encapsulation dan access modifier",
      "Inheritance, polymorphism, dan overriding",
      "Abstraction dan interface",
      "Composition versus inheritance",
    ],
    studyFlow: [
      "Mulai dari object di dunia nyata lalu turunkan ke class.",
      "Tanya dulu: data mana yang harus disembunyikan dan perilaku mana yang harus dibuka.",
      "Bandingkan hubungan is-a dan has-a sebelum memilih inheritance.",
    ],
    practiceDrills: [
      "Buat model sederhana seperti mahasiswa, dosen, dan mata kuliah.",
      "Refactor class yang terlalu besar menjadi beberapa class kecil.",
      "Coba implementasi interface yang sama pada dua class berbeda.",
    ],
    commonMistakes: [
      "Memakai inheritance hanya karena terlihat rapi.",
      "Mengekspos semua property public tanpa alasan.",
      "Mencampur data dan logic tanpa boundary yang jelas.",
    ],
  },
  {
    id: "arsitektur-komputer",
    subjectName: "Arsitektur dan Organisasi Komputer",
    source: "Computer Organization and Design by Patterson & Hennessy",
    sourceUrl: "https://www.geeksforgeeks.org/computer-organization-and-architecture-tutorial/",
    overview:
      "Arsitektur komputer menjelaskan bagaimana CPU, memori, dan instruksi bekerja bersama. Kalau dipahami runtut, materi ini jadi jembatan dari logika tingkat rendah ke performa sistem.",
    keywords: ["arsitektur komputer", "organisasi komputer", "cpu", "memori", "instruction", "binary", "register"],
    focusTopics: [
      "Siklus instruksi dan komponen CPU",
      "Representasi data biner dan heksadesimal",
      "Register, cache, dan memori utama",
      "ISA dan mode pengalamatan dasar",
      "Performa dan bottleneck sistem",
    ],
    studyFlow: [
      "Pelajari alur instruksi dari fetch sampai execute.",
      "Hubungkan konsep data representation dengan operasi aritmetika dasar.",
      "Pahami peran cache dan memori dari sudut kecepatan akses.",
    ],
    practiceDrills: [
      "Konversi beberapa bilangan antar basis lalu cek hasilnya.",
      "Gambar blok diagram CPU dan jelaskan fungsi tiap bagian.",
      "Bandingkan pengaruh cache miss terhadap waktu akses.",
    ],
    commonMistakes: [
      "Menghafal istilah tanpa memahami alur kerja CPU.",
      "Mencampur register, cache, dan RAM.",
      "Tidak membedakan arsitektur instruksi dan organisasi hardware.",
    ],
  },
  {
    id: "kriptografi",
    subjectName: "Kriptografi",
    source: "Cryptography and Network Security by William Stallings",
    sourceUrl: "https://www.geeksforgeeks.org/cryptography-and-network-security/",
    overview:
      "Kriptografi membahas cara menjaga kerahasiaan, integritas, dan autentikasi data. Bedanya dengan sekadar encoding adalah tujuan keamanannya, bukan cuma perubahan bentuk data.",
    keywords: ["kriptografi", "enkripsi", "hash", "aes", "rsa", "ecc", "signature", "public key", "private key", "cipher"],
    focusTopics: [
      "Enkripsi simetris dan asimetris",
      "Hash function dan password storage",
      "Digital signature dan public key infrastructure",
      "Mode operasi cipher dan key exchange",
      "Risiko keamanan implementasi",
    ],
    studyFlow: [
      "Bedakan dulu tujuan keamanan: confidentiality, integrity, atau authentication.",
      "Pahami alur kunci, bukan hanya algoritmanya.",
      "Selalu cek apa yang dilindungi dan apa yang tetap terlihat publik.",
    ],
    practiceDrills: [
      "Bandingkan kapan pakai hashing, encryption, dan signing.",
      "Gambarkan alur Public Key dan Private Key dalam satu skenario kecil.",
      "Cari contoh serangan jika kunci atau IV dipakai salah.",
    ],
    commonMistakes: [
      "Menyamakan hash dengan enkripsi.",
      "Mengira public key boleh dipakai untuk decrypt data sembarang.",
      "Lupa bahwa implementasi bisa gagal walau algoritmanya benar.",
    ],
  },
  {
    id: "aljabar-linier",
    subjectName: "Aljabar Linier dan Matriks",
    source: "Linear Algebra and Its Applications by David C. Lay",
    sourceUrl: "https://www.geeksforgeeks.org/linear-algebra-tutorial/",
    overview:
      "Aljabar linier adalah bahasa untuk vektor, transformasi, dan matriks. Banyak algoritma modern, grafika, dan machine learning bergantung pada fondasi ini.",
    keywords: ["aljabar linier", "matriks", "vektor", "linear algebra", "gauss", "determinant"],
    focusTopics: [
      "Vektor dan operasi dasar",
      "Matriks, determinan, dan invers",
      "Eliminasi Gauss dan sistem persamaan linear",
      "Ruang vektor dan basis",
      "Transformasi linear",
    ],
    studyFlow: [
      "Mulai dari operasi kecil, lalu naik ke bentuk matriks.",
      "Latih eliminasi baris sampai urutannya otomatis.",
      "Hubungkan hasil hitung dengan makna geometrisnya.",
    ],
    practiceDrills: [
      "Selesaikan satu SPL dengan eliminasi Gauss manual.",
      "Cari invers matriks 2x2 dan 3x3 sederhana.",
      "Gambarkan transformasi vektor sederhana pada bidang.",
    ],
    commonMistakes: [
      "Hanya menghafal rumus tanpa latihan manipulasi baris.",
      "Salah tanda saat operasi matriks.",
      "Lupa makna geometris dari hasil perhitungan.",
    ],
  },
  {
    id: "statistika-probabilitas",
    subjectName: "Statistika dan Probabilitas",
    source: "Introduction to Probability by Bertsekas & Tsitsiklis",
    sourceUrl: "https://www.geeksforgeeks.org/probability-and-statistics-tutorial/",
    overview:
      "Statistika dan probabilitas membantu kamu membaca data dengan benar dan menilai ketidakpastian. Materi ini penting untuk analisis eksperimen dan machine learning.",
    keywords: ["statistika", "probabilitas", "probability", "statistics", "distribusi", "mean", "variance"],
    focusTopics: [
      "Peluang dasar dan aturan kombinasi",
      "Rata-rata, median, varians, dan standar deviasi",
      "Distribusi peluang dasar",
      "Sampling dan interpretasi data",
      "Inferensi dan hipotesis dasar",
    ],
    studyFlow: [
      "Bedakan dulu konsep peluang, statistik deskriptif, dan inferensial.",
      "Kerjakan contoh angka kecil sebelum masuk soal cerita.",
      "Selalu baca arti hasil, bukan hanya hasil hitungnya.",
    ],
    practiceDrills: [
      "Hitung mean, median, dan varians dari satu set data kecil.",
      "Latih soal peluang dengan tabel kasus sederhana.",
      "Bandingkan dua sampel dan simpulkan perbedaannya.",
    ],
    commonMistakes: [
      "Mencampur probabilitas dengan statistik deskriptif.",
      "Salah membaca varians dan standar deviasi.",
      "Lupa menafsirkan hasil dalam konteks data.",
    ],
  },
  {
    id: "automata",
    subjectName: "Teori Bahasa dan Automata",
    source: "Introduction to Automata Theory, Languages, and Computation by Hopcroft, Motwani, Ullman",
    sourceUrl: "https://www.geeksforgeeks.org/automata-theory/",
    overview:
      "Teori bahasa dan automata membahas cara mesin mengenali pola bahasa formal. Materi ini menuntut kebiasaan berpikir simbolik dan pembuktian yang rapi.",
    keywords: ["automata", "teori bahasa", "formal language", "dfa", "nfa", "grammar", "regex"],
    focusTopics: [
      "Regular expression, DFA, dan NFA",
      "Grammar dan bahasa formal",
      "Pump lemma dasar",
      "Konversi antar model automata",
      "Closure properties",
    ],
    studyFlow: [
      "Pahami dulu bahasa yang dikenali sebelum menggambar automata.",
      "Latih membaca state transition sebagai aturan pola.",
      "Bandingkan model yang lebih sederhana dan yang lebih ekspresif.",
    ],
    practiceDrills: [
      "Gambar DFA untuk pola string sederhana.",
      "Ubah regex ke automata kecil dan sebaliknya.",
      "Tentukan apakah satu bahasa memenuhi regular atau tidak.",
    ],
    commonMistakes: [
      "Membuat transisi tanpa aturan pola yang jelas.",
      "Salah membedakan DFA dan NFA.",
      "Melupakan syarat pada pembuktian pump lemma.",
    ],
  },
  {
    id: "web",
    subjectName: "Pemrograman Web & API",
    source: "MDN Web Docs & REST API Design Guidelines",
    sourceUrl: "https://developer.mozilla.org/",
    overview:
      "Materi web harus dibaca sebagai alur end-to-end: request, response, state, rendering, dan komunikasi antar layanan lewat API.",
    keywords: ["web", "html", "css", "javascript", "frontend", "backend", "api", "rest", "http", "responsive"],
    focusTopics: [
      "HTML semantik, struktur halaman, dan accessibility dasar",
      "CSS layout, responsive design, dan box model",
      "JavaScript state, async, promise, dan fetch",
      "REST API, HTTP method, status code, dan auth dasar",
      "Client-side versus server-side rendering",
    ],
    studyFlow: [
      "Tentukan dulu data apa yang tampil di layar dan dari mana asalnya.",
      "Untuk setiap fitur, petakan request, state perubahan, dan feedback UI.",
      "Uji alur gagal: loading, error, dan empty state.",
    ],
    practiceDrills: [
      "Buat form kecil yang submit ke API lalu tampilkan response-nya.",
      "Rancang satu halaman responsif dengan breakpoint yang jelas.",
      "Latih debugging request/response di browser devtools.",
    ],
    commonMistakes: [
      "Menghafal tag atau method tanpa memahami alur data.",
      "Membuat UI tanpa menangani loading dan error.",
      "Menulis CSS terlalu cepat tanpa struktur layout yang jelas.",
    ],
  },
  {
    id: "keamanan-data",
    subjectName: "Keamanan Data",
    source: "Computer Security: Principles and Practice by Stallings & Brown",
    sourceUrl: "https://www.geeksforgeeks.org/computer-security/",
    overview:
      "Keamanan data berfokus pada menjaga informasi tetap aman dari akses, perubahan, dan kebocoran yang tidak sah. Biasanya materi ini menggabungkan prinsip, kontrol akses, dan praktik aman.",
    keywords: ["keamanan data", "security", "access control", "encryption", "risk", "integrity"],
    focusTopics: [
      "Confidentiality, integrity, dan availability",
      "Kontrol akses dan otorisasi",
      "Ancaman, risiko, dan mitigasi",
      "Enkripsi dan keamanan penyimpanan",
      "Kebijakan keamanan dasar",
    ],
    studyFlow: [
      "Peta dulu aset apa yang ingin dilindungi.",
      "Tentukan ancaman, dampak, dan kontrolnya.",
      "Cari contoh kebocoran data lalu telusuri akar masalahnya.",
    ],
    practiceDrills: [
      "Buat tabel ancaman-risiko-kontrol untuk satu sistem.",
      "Bandingkan dua contoh kontrol akses pada skenario berbeda.",
      "Tuliskan langkah keamanan dasar sebelum menyimpan data sensitif.",
    ],
    commonMistakes: [
      "Mengira keamanan hanya soal enkripsi.",
      "Lupa membedakan ancaman dan risiko.",
      "Tidak mengaitkan kontrol dengan aset yang dilindungi.",
    ],
  },
  {
    id: "machine-learning",
    subjectName: "Machine Learning",
    source: "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow",
    sourceUrl: "https://www.geeksforgeeks.org/machine-learning/",
    overview:
      "Machine learning mengajarkan cara membangun model dari data. Fokusnya bukan hanya model yang akurat, tetapi pipeline yang benar dari data sampai evaluasi.",
    keywords: ["machine learning", "ml", "model", "training", "overfitting", "evaluation", "data"],
    focusTopics: [
      "Data preparation dan fitur",
      "Supervised learning dasar",
      "Train-test split dan evaluasi model",
      "Overfitting, underfitting, dan regularization",
      "Metrik evaluasi",
    ],
    studyFlow: [
      "Mulai dari data, bukan dari algoritma.",
      "Pahami target prediksi dan metrik suksesnya.",
      "Selalu cek apakah model benar-benar generalize.",
    ],
    practiceDrills: [
      "Coba satu dataset kecil lalu bandingkan dua model sederhana.",
      "Amati perubahan performa saat ukuran data bertambah.",
      "Catat penyebab overfitting yang muncul pada eksperimenmu.",
    ],
    commonMistakes: [
      "Langsung melatih model tanpa pembersihan data.",
      "Membaca akurasi tanpa memeriksa bias atau imbalance.",
      "Menganggap model bagus hanya karena skor training tinggi.",
    ],
  },
  {
    id: "deep-learning",
    subjectName: "Deep Learning",
    source: "Deep Learning by Goodfellow, Bengio, and Courville",
    sourceUrl: "https://www.geeksforgeeks.org/deep-learning-tutorial/",
    overview:
      "Deep learning membahas neural network bertingkat dan cara model belajar representasi yang lebih kompleks. Biasanya materi ini butuh pemahaman matematika, data, dan eksperimen yang rapi.",
    keywords: ["deep learning", "neural network", "backpropagation", "activation", "gradient", "epoch"],
    focusTopics: [
      "Neural network dasar",
      "Activation function dan loss function",
      "Backpropagation dan gradient descent",
      "Regularization dan dropout",
      "Evaluasi model dan tuning hyperparameter",
    ],
    studyFlow: [
      "Pahami alur forward pass sebelum mempelajari training.",
      "Lacak bagaimana error mengalir saat backpropagation.",
      "Bandingkan hasil eksperimen dengan baseline sederhana.",
    ],
    practiceDrills: [
      "Gambar arsitektur network kecil dan jelaskan per layer.",
      "Uji pengaruh activation function pada contoh kecil.",
      "Catat gejala overfitting pada percobaan singkat.",
    ],
    commonMistakes: [
      "Melompat ke model kompleks tanpa baseline.",
      "Tidak membedakan training loss dan validation loss.",
      "Mengabaikan preprocessing data.",
    ],
  },
  {
    id: "kecerdasan-buatan",
    subjectName: "Kecerdasan Buatan",
    source: "Artificial Intelligence: A Modern Approach by Russell & Norvig",
    sourceUrl: "https://www.geeksforgeeks.org/artificial-intelligence-tutorial/",
    overview:
      "Kecerdasan buatan menekankan cara sistem mengambil keputusan atau mencari solusi secara cerdas. Banyak topik AI berawal dari representasi keadaan, pencarian, dan strategi pemecahan masalah.",
    keywords: ["kecerdasan buatan", "artificial intelligence", "ai", "search", "heuristic", "agent"],
    focusTopics: [
      "State space dan search",
      "Heuristic dan informed search",
      "Knowledge representation",
      "Agent, goal, dan environment",
      "Logika dasar AI",
    ],
    studyFlow: [
      "Definisikan masalah sebagai state, aksi, dan tujuan.",
      "Bandingkan pencarian buta dan pencarian heuristik.",
      "Tuliskan apa yang diketahui sistem dan apa yang harus disimpulkan.",
    ],
    practiceDrills: [
      "Buat pohon pencarian kecil dan cari jalur solusi.",
      "Bandingkan BFS, DFS, dan A* pada contoh sederhana.",
      "Tulis representasi state untuk satu masalah nyata.",
    ],
    commonMistakes: [
      "Menganggap AI hanya soal machine learning.",
      "Tidak mendefinisikan state dan goal secara tepat.",
      "Melupakan peran heuristic dalam efisiensi pencarian.",
    ],
  },
  {
    id: "etika-profesi",
    subjectName: "Etik Profesi",
    source: "ACM Code of Ethics & Professional Conduct",
    sourceUrl: "https://www.acm.org/code-of-ethics",
    overview:
      "Etik profesi melatih cara mengambil keputusan yang bertanggung jawab sebagai praktisi TI. Materi ini kuat di studi kasus, diskusi, dan pertimbangan dampak sosial.",
    keywords: ["etik profesi", "etika profesi", "ethics", "professional conduct", "moral", "case study"],
    focusTopics: [
      "Prinsip etika profesi",
      "Tanggung jawab terhadap pengguna dan masyarakat",
      "Studi kasus pelanggaran etika",
      "Privasi dan penggunaan data",
      "Konflik kepentingan dan keputusan profesional",
    ],
    studyFlow: [
      "Baca kasus, lalu identifikasi pihak yang terdampak.",
      "Bandingkan pilihan tindakan dari sisi manfaat dan risiko.",
      "Tulis alasan keputusanmu secara singkat dan logis.",
    ],
    practiceDrills: [
      "Analisis satu kasus pelanggaran etika TI.",
      "Tulis pro dan kontra untuk satu keputusan profesional.",
      "Bandingkan tanggung jawab individu, tim, dan institusi.",
    ],
    commonMistakes: [
      "Menjawab dengan opini tanpa alasan yang jelas.",
      "Melupakan dampak pada pengguna akhir.",
      "Menganggap etika hanya teori tanpa konteks nyata.",
    ],
  },
  {
    id: "kewirausahaan",
    subjectName: "Kewirausahaan",
    source: "The Lean Startup by Eric Ries",
    sourceUrl: "https://www.geeksforgeeks.org/entrepreneurship/",
    overview:
      "Kewirausahaan di konteks TI biasanya menuntut kemampuan membaca masalah, menguji ide, dan menjelaskan nilai solusi. Fokusnya ada pada validasi, bukan sekadar ide besar.",
    keywords: ["kewirausahaan", "entrepreneurship", "startup", "business", "value proposition", "validasi"],
    focusTopics: [
      "Identifikasi masalah dan target pengguna",
      "Value proposition dan solusi",
      "Validasi ide dan riset pasar dasar",
      "Model bisnis sederhana",
      "Pitching dan presentasi ide",
    ],
    studyFlow: [
      "Mulai dari masalah nyata, bukan dari fitur.",
      "Tuliskan siapa target pengguna dan kenapa mereka butuh solusi.",
      "Buktikan ide lewat validasi kecil terlebih dahulu.",
    ],
    practiceDrills: [
      "Susun satu problem statement dan solusi yang ditawarkan.",
      "Buat daftar 3 asumsi yang harus diuji.",
      "Latih pitch 1 menit untuk ide produk sederhana.",
    ],
    commonMistakes: [
      "Langsung membahas fitur tanpa masalah yang jelas.",
      "Tidak menentukan pengguna sasaran.",
      "Menganggap ide sama dengan validasi pasar.",
    ],
  },
  {
    id: "penulisan-ilmiah",
    subjectName: "Penulisan Karya Ilmiah",
    source: "Publication Manual of the APA & Scientific Writing Guides",
    sourceUrl: "https://www.geeksforgeeks.org/research-paper-writing/",
    overview:
      "Penulisan ilmiah menuntut struktur argumen, literatur yang rapi, dan bahasa yang objektif. Materi ini sangat bergantung pada kebiasaan membaca dan merangkum sumber.",
    keywords: ["penulisan karya ilmiah", "ilmiah", "research writing", "citation", "literatur review"],
    focusTopics: [
      "Struktur karya ilmiah",
      "Literature review dan sitasi",
      "Rumusan masalah dan tujuan penelitian",
      "Metodologi dan hasil",
      "Bahasa akademik dan plagiarisme",
    ],
    studyFlow: [
      "Mulai dari kerangka tulisan sebelum isi detail.",
      "Kumpulkan referensi lalu kelompokkan berdasarkan tema.",
      "Periksa konsistensi istilah dan sitasi.",
    ],
    practiceDrills: [
      "Buat outline 1 halaman untuk topik tertentu.",
      "Ringkas 3 sumber dalam 1 paragraf komparatif.",
      "Latih menulis abstrak singkat dari hasil penelitian mini.",
    ],
    commonMistakes: [
      "Menulis tanpa kerangka.",
      "Mengutip sumber tanpa memahami isinya.",
      "Bahasa terlalu santai untuk konteks akademik.",
    ],
  },
  {
    id: "kerja-praktek",
    subjectName: "Kerja Praktek",
    source: "Industrial Internship and Technical Report Guidelines",
    sourceUrl: "https://www.geeksforgeeks.org/industrial-training/",
    overview:
      "Kerja praktek menuntut kemampuan observasi, dokumentasi, dan penyelesaian masalah di lingkungan nyata. Yang dinilai biasanya bukan cuma hasil akhir, tapi juga proses dan laporan.",
    keywords: ["kerja praktek", "internship", "industrial practice", "report", "laporan"],
    focusTopics: [
      "Observasi proses kerja",
      "Dokumentasi dan pelaporan",
      "Problem solving di lapangan",
      "Komunikasi dengan pembimbing",
      "Refleksi hasil kerja",
    ],
    studyFlow: [
      "Catat aktivitas harian sejak awal.",
      "Pisahkan temuan, solusi, dan rekomendasi.",
      "Pastikan laporan mengikuti format kampus atau instansi.",
    ],
    practiceDrills: [
      "Tulis logbook 3 hari kerja dengan bahasa ringkas.",
      "Rangkum satu temuan lapangan menjadi masalah dan solusi.",
      "Buat draft laporan berdasarkan aktivitas nyata.",
    ],
    commonMistakes: [
      "Menunda dokumentasi sampai akhir.",
      "Tidak membedakan observasi dengan analisis.",
      "Laporan tidak sinkron dengan aktivitas yang dilakukan.",
    ],
  },
  {
    id: "mbkm",
    subjectName: "MBKM / Kampus Merdeka",
    source: "Kemdikbud MBKM Guide",
    sourceUrl: "https://kampusmerdeka.kemdikbud.go.id/",
    overview:
      "MBKM menekankan pengalaman belajar di luar kelas yang terukur. Fokusnya adalah portofolio, kompetensi, dan kemampuan menjelaskan kontribusi nyata.",
    keywords: ["mbkm", "kampus merdeka", "portfolio", "kompetensi", "intership"],
    focusTopics: [
      "Tujuan dan bentuk kegiatan MBKM",
      "Portofolio dan bukti capaian",
      "Refleksi pembelajaran",
      "Kolaborasi dengan mitra",
      "Dokumentasi hasil kegiatan",
    ],
    studyFlow: [
      "Tentukan target kompetensi sebelum kegiatan dimulai.",
      "Simpan bukti kerja dan pembelajaran sejak awal.",
      "Rangkum progres dalam format yang mudah diverifikasi.",
    ],
    practiceDrills: [
      "Buat daftar capaian yang ingin ditunjukkan di portofolio.",
      "Tulis refleksi singkat atas satu pengalaman belajar.",
      "Hubungkan aktivitas harian dengan kompetensi yang dituju.",
    ],
    commonMistakes: [
      "Tidak punya target kompetensi yang jelas.",
      "Dokumentasi berantakan dan sulit dibuktikan.",
      "Menjalani kegiatan tanpa refleksi pembelajaran.",
    ],
  },
  {
    id: "diskrit",
    subjectName: "Matematika Diskrit",
    source: "Discrete Mathematics and Its Applications by Kenneth H. Rosen",
    sourceUrl: "https://www.geeksforgeeks.org/discrete-mathematics-tutorial/",
    overview:
      "Matematika diskrit melatih pola pikir logis: proposisi, himpunan, relasi, graf, dan kombinatorika yang sering muncul di analisis algoritma dan sistem komputer.",
    keywords: ["matematika diskrit", "diskrit", "logika", "set", "relasi", "graph", "kombinasi", "permutasi", "predicate"],
    focusTopics: [
      "Logika proposisional dan predicate",
      "Himpunan, relasi, dan fungsi",
      "Induksi matematika",
      "Kombinasi, permutasi, dan prinsip pencacahan",
      "Graf dan pohon",
    ],
    studyFlow: [
      "Terjemahkan soal cerita ke notasi formal dulu.",
      "Pecahkan menjadi kasus kecil dan cari pola.",
      "Selalu cek apakah pembuktianmu sudah mencakup semua kasus.",
    ],
    practiceDrills: [
      "Ubah kalimat biasa menjadi proposisi logika.",
      "Kerjakan satu soal pembuktian induksi dari awal sampai akhir.",
      "Gambar graf kecil lalu cari lintasan dan sifatnya.",
    ],
    commonMistakes: [
      "Langsung menghitung tanpa memformalkan soal.",
      "Melupakan base case pada induksi.",
      "Menyamakan kombinasi dengan permutasi.",
    ],
  },
];

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function getGuideKey(
  subject: string,
  title?: string,
  description?: string,
  explicitContext?: string | null
) {
  if (explicitContext && isStudyContextKey(explicitContext)) {
    return explicitContext;
  }

  const combined = normalizeText([subject, title, description].filter(Boolean).join(" "));

  const scored = STUDY_GUIDES.map((guide) => {
    const score = guide.keywords.reduce((total, keyword) => {
      if (!combined.includes(keyword)) {
        return total;
      }

      return total + Math.max(2, Math.min(keyword.length / 4, 5));
    }, 0);

    return { guide, score };
  }).sort((left, right) => right.score - left.score);

  if (scored[0]?.score && scored[0].score > 0) {
    return scored[0].guide.id;
  }

  const seed = [...combined].reduce((accumulator, char) => accumulator + char.charCodeAt(0), 0);
  return STUDY_GUIDES[seed % STUDY_GUIDES.length]?.id ?? DEFAULT_STUDY_CONTEXT;
}

export function SubjectStudyTips({
  subject,
  title,
  description,
  studyContext,
}: {
  subject: string;
  title?: string;
  description?: string | null;
  studyContext?: StudyContextKey | string | null;
}) {
  const guideKey = getGuideKey(subject, title, description ?? undefined, studyContext ?? null);
  const guide = STUDY_GUIDES.find((item) => item.id === guideKey) ?? STUDY_GUIDES[0];

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-6 lg:p-8">
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/20 text-amber-400">
              <Lightbulb size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">
                Info & Tips Wajib Pelajari: {guide.subjectName}
              </h3>
              <p className="text-xs font-medium text-slate-400">
                Berdasarkan materi: {subject}
                {studyContext && isStudyContextKey(studyContext) ? ` • Konteks: ${guide.subjectName}` : ""}
              </p>
            </div>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-slate-300">
            {guide.overview}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-[11px] font-semibold text-slate-400">
              {guide.focusTopics.length} topik spesifik
            </span>
            <span className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-[11px] font-semibold text-slate-400">
              {guide.practiceDrills.length} latihan cepat
            </span>
            <span className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-[11px] font-semibold text-slate-400">
              {guide.studyFlow.length} urutan belajar
            </span>
          </div>
        </div>

        <a
          href={guide.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-semibold text-indigo-400 transition-all hover:text-indigo-300"
        >
          <BookOpen size={14} />
          <span>Sumber: {guide.source.split("(")[0]}</span>
          <ExternalLink size={12} />
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3 xl:col-span-2">
          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-400">
            <Bookmark size={14} />
            Topik Spesifik yang Harus Dikuasai
          </h4>
          <ul className="space-y-2 text-sm font-medium text-slate-300">
            {guide.focusTopics.map((topic, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
            <ArrowRight size={14} />
            Urutan Belajar
          </h4>
          <ul className="space-y-2 text-sm font-medium text-slate-300">
            {guide.studyFlow.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-400">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-400">
            <Lightbulb size={14} />
            Latihan 15 Menit
          </h4>
          <ul className="space-y-2 text-sm font-medium text-slate-300">
            {guide.practiceDrills.map((drill, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-[10px] font-bold text-cyan-300">
                  {idx + 1}
                </span>
                <span>{drill}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-400">
            <CheckCircle2 size={14} />
            Kesalahan yang Harus Dihindari
          </h4>
          <ul className="space-y-2 text-sm font-medium text-slate-300">
            {guide.commonMistakes.map((mistake, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-[10px] font-bold text-rose-300">
                  {idx + 1}
                </span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
