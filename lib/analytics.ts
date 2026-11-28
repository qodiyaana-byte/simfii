import { questions, questionsOf, type MateriKey, type Question } from "./questions";

export type AnswerRow = { question_id: string; category: string; answer: string; correct: boolean };
export type AttemptRow = { id: string; score: number; total: number; created_at: string; answers: AnswerRow[] };
export type Tally = { correct: number; total: number; percent: number | null };
type Category = Question["category"];

export const POS_IDS = [1, 2, 3, 4, 5] as const;
export const MATERI_KEYS: MateriKey[] = ["mubtada", "isimfiil"];
export const MATERI_LABEL: Record<MateriKey, string> = { mubtada: "Mubtada' dan Khabar", isimfiil: "Isim dan Fi'il" };

const NAMES_ISIMFIIL: Record<number, string> = { 1: "Rumah Isim", 2: "Rumah Fi'il", 3: "Balai Peta Konsep", 4: "Kantor Detektif", 5: "Taman Tantangan" };
const NAMES_MUBTADA: Record<number, string> = { 1: "Rumah Ismiyah", 2: "Rumah Definisi", 3: "Balai Syarat", 4: "Kantor Implikasi", 5: "Taman Tantangan" };
export const POS_NAMES_OF: Record<MateriKey, Record<number, string>> = { isimfiil: NAMES_ISIMFIIL, mubtada: NAMES_MUBTADA };
// Dipertahankan agar kode lama tetap bekerja (materi Isim dan Fi'il).
export const POS_NAMES = NAMES_ISIMFIIL;
export const POS_COLORS: Record<number, string> = { 1: "#f5a623", 2: "#1e88e5", 3: "#8e44ad", 4: "#e03a5a", 5: "#00a38c" };

export const CATEGORY_LABELS: Record<Category, string> = {
  isim: "Mengenali isim", fiil: "Mengenali fi'il", beda: "Membedakan isim dan fi'il", campuran: "Analisis kalimat",
  ismiyah: "Memahami jumlah ismiyah", definisi: "Mengenali mubtada' dan khabar", syarat: "Memahami syarat", implikasi: "Memahami marfu' dan kesesuaian",
};
// Kategori tiap materi, berurutan sesuai pos.
export const CATEGORIES_OF: Record<MateriKey, Category[]> = {
  isimfiil: ["isim", "fiil", "beda", "campuran"],
  mubtada: ["ismiyah", "definisi", "syarat", "implikasi", "campuran"],
};
// pos yang paling cocok untuk mengulang tiap kategori
export const CATEGORY_POS: Record<Category, number> = {
  isim: 1, fiil: 2, beda: 3, campuran: 4, ismiyah: 1, definisi: 2, syarat: 3, implikasi: 4,
};
// "campuran" pada materi Mubtada' ada di Pos 5, pada Isim dan Fi'il di Pos 4.
export const categoryPos = (materi: MateriKey, c: Category): number => (materi === "mubtada" && c === "campuran" ? 5 : CATEGORY_POS[c]);
export const DEFAULT_KKM = 75;

export const questionById = new Map(questions.map((q) => [q.id, q]));
export const posOfQuestion = (id: string): number => Number(id.slice(1, id.indexOf("-")));
export const materiOfQuestion = (id: string): MateriKey => questionById.get(id)?.materi ?? (id.startsWith("m") ? "mubtada" : "isimfiil");
export const questionsInPos = (pos: number, materi: MateriKey = "isimfiil") => questionsOf(materi).filter((q) => q.position === pos).length;
// Satu percobaan selalu berisi soal dari satu materi.
export const materiOfAttempt = (a: { answers: AnswerRow[] }): MateriKey => (a.answers[0] ? materiOfQuestion(a.answers[0].question_id) : "isimfiil");
export const onlyMateri = (answers: AnswerRow[], materi: MateriKey) => answers.filter((a) => materiOfQuestion(a.question_id) === materi);

const pct = (correct: number, total: number): number | null => (total > 0 ? Math.round((correct / total) * 100) : null);
export const score100 = (a: { score: number; total: number }): number => Math.round((a.score / Math.max(1, a.total)) * 100);
export const starsOf = (score: number): number => Math.round((Math.max(0, Math.min(100, score)) / 20) * 10) / 10;

// Nilai per pos. "answered" menandakan berapa soal pos itu yang sudah dijawab.
export function posTallies(answers: AnswerRow[], materi: MateriKey = "isimfiil"): Record<number, Tally & { answered: number }> {
  const out: Record<number, Tally & { answered: number }> = {};
  const mine = onlyMateri(answers, materi);
  for (const pos of POS_IDS) {
    const list = mine.filter((a) => posOfQuestion(a.question_id) === pos);
    const correct = list.filter((a) => a.correct).length;
    const total = questionsInPos(pos, materi);
    out[pos] = { correct, total, answered: list.length, percent: list.length ? pct(correct, total) : null };
  }
  return out;
}

export function categoryTallies(answers: AnswerRow[], materi: MateriKey = "isimfiil"): Record<Category, Tally> {
  const out = {} as Record<Category, Tally>;
  const mine = onlyMateri(answers, materi);
  for (const key of CATEGORIES_OF[materi]) {
    const total = questionsOf(materi).filter((q) => q.category === key).length;
    const list = mine.filter((a) => a.category === key);
    const correct = list.filter((a) => a.correct).length;
    out[key] = { correct, total, percent: list.length ? pct(correct, total) : null };
  }
  return out;
}

export function weakestCategory(answers: AnswerRow[], materi: MateriKey = "isimfiil", kkm = DEFAULT_KKM): Category | null {
  const tallies = categoryTallies(answers, materi);
  const ranked = (Object.keys(tallies) as Category[])
    .filter((k) => tallies[k].percent !== null)
    .sort((a, b) => (tallies[a].percent ?? 0) - (tallies[b].percent ?? 0));
  const worst = ranked[0];
  return worst && (tallies[worst].percent ?? 100) < kkm ? worst : null;
}

export const average = (values: number[]): number | null => (values.length ? Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 10) / 10 : null);

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
