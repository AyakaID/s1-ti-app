-- ============================================================
-- S1-TI Learning Platform - Phase 8 Migration
-- Tambahkan konteks belajar eksplisit untuk materi agar tips lebih akurat
-- ============================================================

ALTER TABLE public.materials
ADD COLUMN IF NOT EXISTS study_context TEXT;

UPDATE public.materials
SET study_context = CASE
	WHEN study_context IS NOT NULL THEN study_context
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(pengantar[[:space:]]+ti|sistem[[:space:]]+informasi|literasi[[:space:]]+digital|dasar[[:space:]]+ti)' THEN 'pengantar-ti'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(pemrograman[[:space:]]+dasar|dasar[[:space:]]+dasar[[:space:]]+pemrograman|algorithm[[:space:]]+basics|variabel|percabangan|perulangan|debug)' THEN 'pemrograman-dasar'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(algoritma|struktur[[:space:]]+data|sorting|search|graph|tree|big[[:space:]]*o|recursion)' THEN 'algoritma'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(jaringan|network|tcp|udp|dns|routing|subnet|osi|http|firewall|nat)' THEN 'jaringan'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(basis[[:space:]]+data|database|sql|join|index|normalisasi|erd|transaksi)' THEN 'basisdata'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(sistem[[:space:]]+operasi|operating[[:space:]]+system|process|thread|deadlock|paging|memory|scheduler|mutex|semaphore)' THEN 'sistem-operasi'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(rekayasa[[:space:]]+perangkat[[:space:]]+lunak|software[[:space:]]+engineering|rpl|uml|solid|testing|refactoring|scrum|agile)' THEN 'rpl'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(oop|orientasi[[:space:]]+objek|class|object|inheritance|polymorphism|encapsulation|abstraction)' THEN 'oop'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(arsitektur[[:space:]]+komputer|organisasi[[:space:]]+komputer|computer[[:space:]]+organization|cpu|register|cache|binary|heksadesimal)' THEN 'arsitektur-komputer'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(keamanan[[:space:]]+data|information[[:space:]]+security|security|access[[:space:]]+control|risk|integrity)' THEN 'keamanan-data'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(kriptografi|enkripsi|hash|aes|rsa|ecc|signature|cipher)' THEN 'kriptografi'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(aljabar[[:space:]]+linier|linear[[:space:]]+algebra|matriks|vektor|gauss|determinant)' THEN 'aljabar-linier'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(statistika|probabilitas|probability|statistics|distribusi|mean|variance)' THEN 'statistika-probabilitas'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(teori[[:space:]]+bahasa|automata|dfa|nfa|regular[[:space:]]+expression|grammar|regex)' THEN 'automata'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(pemrograman[[:space:]]+web|web[[:space:]]+api|frontend|backend|rest|http|html|css|javascript|responsive)' THEN 'web'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '((^|[^a-z0-9])(machine[[:space:]]+learning|ml)([^a-z0-9]|$)|supervised|overfitting|model[[:space:]]+training)' THEN 'machine-learning'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(deep[[:space:]]+learning|neural[[:space:]]+network|backpropagation|activation|gradient)' THEN 'deep-learning'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '((^|[^a-z0-9])(kecerdasan[[:space:]]+buatan|artificial[[:space:]]+intelligence|ai)([^a-z0-9]|$)|heuristic|search|agent)' THEN 'kecerdasan-buatan'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(etik[[:space:]]+profesi|etika[[:space:]]+profesi|professional[[:space:]]+ethics|code[[:space:]]+of[[:space:]]+ethics)' THEN 'etika-profesi'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(kewirausahaan|entrepreneurship|startup|value[[:space:]]+proposition|business)' THEN 'kewirausahaan'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(penulisan[[:space:]]+karya[[:space:]]+ilmiah|karya[[:space:]]+ilmiah|research[[:space:]]+paper|citation|literature[[:space:]]+review)' THEN 'penulisan-ilmiah'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(kerja[[:space:]]+praktek|internship|industrial[[:space:]]+practice|laporan|report)' THEN 'kerja-praktek'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(mbkm|kampus[[:space:]]+merdeka|merdeka[[:space:]]+belajar|portofolio|kompetensi)' THEN 'mbkm'
	WHEN lower(concat_ws(' ', subject, title, coalesce(description, ''))) ~ '(matematika[[:space:]]+diskrit|diskrit|logika|relasi|kombinatorika|graf|pohon|predicate)' THEN 'diskrit'
	ELSE 'algoritma'
END
WHERE study_context IS NULL;

ALTER TABLE public.materials
ALTER COLUMN study_context SET DEFAULT 'algoritma';
